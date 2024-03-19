let ratingStarInput = [...document.querySelectorAll('.rating-star')];

ratingStarInput.map((star,index) => {
    star.addEventListener('click', () => {
        for(let i = 0; i < 5; i++){
            if (i <= index){
                ratingStarInput[i].src = 'img/fill star.png';
            } else{
                ratingStarInput[i].src = 'img/no fill star.png';
            }
        }
    })
})

// Example
var averageRating = 3.9;
document.querySelector('.rating-count').textContent = '(' + averageRating + ')';



//product page setting

let productName = document.querySelector('.product-title');
let price = document.querySelector('.price');
let detail = document.querySelector('.des');
let productImage = document.querySelector('.product-image');
let title = document.querySelector('.title');
const setData =(data) => {
    productName.innerHTML = title.innerHTML = data.name;
    productImage.src = data.image;
    detail.innerHTML = data.detail;
    price.innerHTML = `$${data.price}`;
}
const fetchProductData =() => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({id: productID})
    }).then(res => res.json())
        .then(data => {
            setData(data)
        }).catch(err => {
            console.log(err);
            alert('no product found');
            location.replace('/404');
    })

}

let productID = null;
if(location.pathname != '/add-product'){
    productID = decodeURI(location.pathname/split('/').pop());
    // below is right!!!
    //productID = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}

//add Q$A
let editables = [...document.querySelectorAll('.question-form [contenteditable="true"]')];

editables.map((element) => {
    let placeholder = element.getAttribute('data-placeholder');
    let container = document.createElement('div');
    container.classList.add('editable-container');
    element.parentNode.replaceChild(container, element);
    container.appendChild(element);

    element.innerHTML = placeholder;

    element.addEventListener('focus', () => {
        if(element.innerHTML == placeholder){
            element.innerHTML = '';
        }
    });
    element.addEventListener('blur', () => {
        if (!element.textContent.trim()) {
            element.innerHTML = placeholder;
        }
    });
});

// Function to check if a question was posted by the current user
function isCurrentUserQuestion(questionUserId) {
    return questionUserId === currentUserId;
}

function deleteQuestion(questionId) {
    fetch(`/api/deleteQuestion/${questionId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                // Remove the question from the DOM after successful deletion
                const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);
                if (questionElement) {
                    questionElement.remove();
                }
            } else {
                console.error('Failed to delete question');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Example usage when creating a question element
function createQuestionElement(questionData) {
    const questionElement = document.createElement('div');
    questionElement.className = 'qna-item';
    questionElement.dataset.questionId = questionData.id;

    const questionText = document.createElement('p');
    questionText.className = 'question';
    questionText.textContent = `Q: ${questionData.text}`;
    questionElement.appendChild(questionText);

    const answerText = document.createElement('p');
    answerText.className = 'answer';
    answerText.textContent = `A: ${questionData.answer}`;
    questionElement.appendChild(answerText);

    if (isCurrentUserQuestion(questionData.userId)) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteQuestion(questionData.id);
        questionElement.appendChild(deleteButton);
    }

    return questionElement;
}


//const questionElement = createQuestionElement(questionData);
// Append the questionElement to your Q&A section or wherever you display questions.
//document.querySelector('.previous-qna').appendChild(questionElement);


//wishlist
// JavaScript
var wishlist = {}; // This object will store the wishlist products

function toggleWishlist() {
    var wishlistButton = document.querySelector('.wishlist-btn');

    if (wishlistButton.textContent === 'Add to wishlist') {
        // Add to wishlist logic
        addToWishlist();
        wishlistButton.textContent = 'Remove from wishlist';
    } else {
        // Remove from wishlist logic
        removeFromWishlist();
        wishlistButton.textContent = 'Add to wishlist';
    }
}

function addToWishlist() {
    // Add your logic to get product information (e.g., product ID, name)
    var productId = 1; // Replace with the actual product ID
    var productName = 'Product A'; // Replace with the actual product name

    // Add the product to the wishlist object
    wishlist[productId] = productName;

    // Update the wishlist display or send a request to the server to update user data
    updateWishlistDisplay();
}

function removeFromWishlist() {
    // Add your logic to get product information (e.g., product ID)
    var productId = 1; // Replace with the actual product ID

    // Remove the product from the wishlist object
    delete wishlist[productId];

    // Update the wishlist display or send a request to the server to update user data
    updateWishlistDisplay();
}

function updateWishlistDisplay() {
    console.log('Updated wishlist:', wishlist);
}

//mark as sold
function markAsSold() {
    var modal = document.getElementById('sold-modal');
    modal.style.display = 'block';
}

function closeSoldModal() {
    var modal = document.getElementById('sold-modal');
    modal.style.display = 'none';
}

function confirmSold() {
    var buyerEmail = document.getElementById('buyer-email').value;
    closeSoldModal();
}



