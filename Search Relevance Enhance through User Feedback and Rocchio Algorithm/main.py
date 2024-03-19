# https://docs.python.org/3/library/argparse.html

import argparse

from relevance_feedback import QueryExpansion

parser = argparse.ArgumentParser(description='Process command line')

parser.add_argument('--api_key', type=str, default='AIzaSyBEGzhnRJLxeoW_JowF0_BXrowPsOSf7Yk', help='google api key')
parser.add_argument('--cse', type=str, default='811402363ffc54fc3', help='google engine id')
parser.add_argument('--precision', type=float, default=0.9, help='wanted precision')
parser.add_argument('--query', type=str, help='query terms')

args = parser.parse_args()


relevance = QueryExpansion(api_key = args.api_key,
                               cse = args.cse,
                               precision = args.precision,
                               query = args.query.strip().split())

relevance.RelevanceFeedback()