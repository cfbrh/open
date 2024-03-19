import numpy as np
from googleapiclient.discovery import build
from sklearn.feature_extraction.text import TfidfVectorizer


class QueryExpansion(object):
    def __init__(self, api_key, cse, precision, query):
        self.api_key = api_key
        self.cse = cse
        self.precison = precision
        self.query = query
        self.result = []

    def CustomerSearch(self):
        print('Parameters:')
        print(f'Client key  = {self.api_key}')
        print(f'Engine key  = {self.cse}')
        print(f'Wanted precision  = {self.precison}')
        # input a user query, which is simply a list of words, transfer string to list
        query = ' '.join(map(str, self.query))
        print(f'Query  = {query}')
        # https://github.com/googleapis/google-api-python-client/blob/main/samples/customsearch/main.py
        service = build("customsearch", "v1", developerKey=self.api_key)
        res = (service.cse().list(q=query, cx=self.cse,).execute())
        items = res.get('items', [])

        # display its title, URL, description and fileformat returned by Google.
        for item in items:
            # https: // developers.google.com / custom - search / v1 / reference / rest / v1 / Search
            title = item.get('title', '')
            url = item.get('link', '')
            description = item.get('snippet', '')
            # https: // edstem.org / us / courses / 53443 / discussion / 4311405
            # decide which is html and non-html file
            fileformat = item.get('fileFormat', '')

            self.result.append({'title': title, 'url': url, 'description': description, 'fileformat': fileformat})
        return self

    def RelevanceFeedback(self):
        while True:
            self.CustomerSearch()
            # the top-10 results for the query
            if len(self.result) >= 10:
                print("===========================================================")
                print('Google Search Results:')
                valid_result = 0  # the number of html files
                relevant_number = 0.0  # the number of the relevant result page
                Dr = []
                Dnr = []
                for index, item in enumerate(self.result):
                    # check for the "fileFormat" key, which should only be returned in the JSON for non-HTML documents.
                    if not item["fileformat"]:
                        valid_result += 1
                        # print(f'  fileformat: valid_result')
                        print(f'Result {valid_result}')
                        print(f'Title: {item["title"]}')
                        print(f'Url:{item["url"]}')
                        print(f'Description: {item["description"]}')
                        print(f'Fileformat: {item["fileformat"]}')

                        answer = input('Relevant (Y/N)? ')
                        print("===========================================================")

                        if answer.title() == 'Y':
                            item['relevant'] = True
                            relevant_number += 1.0
                            Dr.append(index)
                        elif answer.title() == 'N':
                            item['relevant'] = False
                            Dnr.append(index)
                        else:
                            print(f"You enter wrong letter.")

                print(f"Feedback:")
                print(f"Query: {' '.join(map(str, self.query))}")
                print(f"Number of HTML files in 10 result files: {valid_result}")
                current_precision = relevant_number / valid_result
                print(f"Precision: {current_precision}")

                # a value between 0 and the target precision
                if current_precision < self.precison and current_precision > 0:
                    corpus = [' '.join(self.query)] + \
                             [f"{item.get('description', '')} {item.get('title', '')}" for item in self.result]
                    # https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
                    vectorizer = TfidfVectorizer(stop_words='english')
                    # https://www.geeksforgeeks.org/understanding-tf-idf-term-frequency-inverse-document-frequency/
                    # fit_transform: Learn the vocabulary dictionary and return document-term matrix
                    X = vectorizer.fit_transform(corpus)
                    # get_feature_names_out: Get output feature names for transformation.
                    keyword = vectorizer.get_feature_names_out()

                    # compute tf-idf vector using Rocchio
                    # reasonable values: 1, 0.75, 0.15
                    alpha = 1
                    beta = 0.75
                    gamma = 0.15
                    query_vector = X[0]
                    corpus_vectors = X[1:]
                    update_query_vector = np.zeros_like(query_vector)

                    # Update the query vector based on the relevance feedback
                    update_query_vector += alpha * query_vector
                    update_query_vector += beta * np.sum(corpus_vectors[Dr], axis=0) / len(Dr)
                    update_query_vector -= gamma * np.sum(corpus_vectors[Dnr], axis=0) / (valid_result - len(Dr))

                    # https://www.geeksforgeeks.org/how-to-convert-numpy-matrix-to-array/
                    # use flatten() to convert the matrix to an array before sorting and indexing
                    update_query_array = np.asarray(update_query_vector).flatten()
                    update_query = []

                    # clear origin result
                    self.result = []

                    # https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html
                    # vocabulary_: A mapping of terms to feature indices
                    inverse_word_index = {idx: word for word, idx in zip(keyword, range(len(keyword)))}

                    # from big to small, get 2 best keywords
                    # https: // www.geeksforgeeks.org / how - to - use - numpy - argsort - in -descending - order - in -python /
                    sorted_indices = np.argsort(update_query_array)[::-1]
                    for index in sorted_indices:
                        if inverse_word_index[index] in self.query:
                            continue
                        elif len(update_query) < 2:
                            # introduce at most 2 new words
                            update_query.append(inverse_word_index[index])
                        else:
                            break

                    print(f'Update two words: {" ".join(update_query)}')
                    print("===========================================================")
                    self.query.extend(update_query)

                    # reorder all words—new and old—in the query
                    update_again_query = []
                    update_query_dict = {}

                    for index in sorted_indices:
                        if inverse_word_index[index] in self.query:
                            if len(update_query_dict) < len(self.query):
                                update_query_dict[inverse_word_index[index]] = index
                                # print(f"update : {index}")
                                # print(f"update : {inverse_word_index[index]}")
                            else:
                                break
                        else:
                            continue

                    # print("Update Query Dictionary:")
                    # print(update_query_dict)
                    # if one old query is not in new query, add it to the end of new query
                    update_query_items = list(update_query_dict.items())
                    update_query_items.sort(key=lambda x: x[1], reverse=True)
                    update_query_list = [word for word, index in update_query_items]

                    if len(update_query_list) < len(self.query):
                        for item in self.query:
                            if item not in update_query_list:
                                update_query_list.append(item)

                    # print("update_query_list:")
                    # print(update_query_list)
                    for i in range(len(update_query_list)):
                        update_again_query.append(update_query_list[i])
                        print("Update Again Query:")
                        print(update_again_query)
                    self.query = update_again_query

                else:
                    # current_precision == 0 or > self.precison
                    break

            else:
                # len(self.result) < 10
                break
