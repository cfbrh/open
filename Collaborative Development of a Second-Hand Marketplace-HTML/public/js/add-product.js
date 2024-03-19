//let user = JSON.parse(sessionStorage.user || null);
let productOwner;

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);
    if(user == null){
        location.replace('/login')
    }
    productOwner = document.querySelector('.product-owner');
    productOwner.textContent = `Owner: ${user.name}`;
}

let editables = [...document.querySelectorAll('*[contenteditable="true"]')];

editables.map((element) => {
    let placeholder = element.getAttribute('data-placeholder');
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

//image upload
let uploadInput = document.querySelector('#upload-image');
let imagePath = 'img/noImage.png';// default image

uploadInput.addEventListener('change',() => {
    const file = uploadInput.files[0];
    let imageUrl;

    if(file.type.includes('image')){
        //means its an image
        fetch('/s3url').then(res => res.json())
            .then(url =>{
                fetch(url, {
                    method: 'PUT',
                    headers: {'Content-Type':'multipart/form-data'},
                    body: file
                }).then(res =>{
                    imagePath = url.split("?")[0];

                    let productImage = document.querySelector('.product-img')
                    productImage.src = imagePath;
                });
            })
    }
})

// form submission
let addProductBtn = document.querySelector('.add-product-btn');
let loader = document.querySelector('.loader');

let productName = document.querySelector('.product-title');
let price = document.querySelector('.price');
let detail = document.querySelector('.des');


addProductBtn.addEventListener('click',()=>{
    //verification
    if(productName.innerHTML == productName.getAttribute('data-placeholder')){
        showFormError('should enter product name');
    } else if(price.innerHTML == price.getAttribute('data-placeholder')|| !Number(price.innerHTML)){
        showFormError('enter valid price');
    } else if(detail.innerHTML == detail.getAttribute('data-placeholder')){
        showFormError('should enter detail');
    } else{
        //submit form
        loader.style.display ='block';
        let data = productData();
        if(productId){
            data.id = productId;
        }
        sendData('/add-product', data, 'post');
    }
})

const productData = () =>{
    const userEmail = JSON.parse(sessionStorage.user).email;
    return {
        title: productName.innerHTML,
        //owner: productOwner.innerHTML,
        //owner: `Owner: ${userEmail}`,
        price: parseFloat(price.innerHTML),
        description: detail.innerHTML,
        image: imagePath,
        user_id: JSON.parse(sessionStorage.user).id
    }
}

// edit page
const postProductData = () =>{

}


const fetchProductData = () => {
    addProductBtn.innerHTML = 'save product';
    fetch(`http://localhost:5000/items/${productId}`, {
        method: 'GET',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({id: productID})
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! `);
        }
        return res.json();
    })
    .then(data => {
        setFormData(data);
    })
    .catch(err => console.error(err));
}

const setFormData = (data) =>{
    productName.innerHTML = data.name;
    //productOwner.innerHTML = data.owner;
    price.innerHTML = data.price;
    detail.innerHTML = data.detail;

    let productImg = document.querySelector('.product-img');
    productImg.src = imagePath = data.image;
}

let productID = null;
if(location.pathname != '/6156-HTML-main/public/add-product'){
    productID = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}

// Your JavaScript code goes here

// Sample data to be sent in the POST request
function postData = {
    image: 'value1',
    key2: 'value2',
};

// URL where you want to send the POST request
const url = 'https://example.com/api';

// Perform the POST request using the fetch API
fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
        // Add any additional headers if needed
    },
    body: JSON.stringify(postData), // Convert data to JSON string
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the response as JSON
})
.then(data => {
    // Handle the response data
    console.log('Response:', data);
})
.catch(error => {
    // Handle errors
    console.error('Error:', error);
});

