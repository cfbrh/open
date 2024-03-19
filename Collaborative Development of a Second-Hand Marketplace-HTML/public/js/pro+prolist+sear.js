// product list
const fetchItems = async (page) => {
    try {
        const authToken =  sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/items/${page}`, {
            method: 'GET' ,
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json', // You may need to adjust this based on your API requirements
            },
        });
        const data = await response.json();
        console.log('Response:', response);
        console.log('Data:', data);

        // list
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';

        data.items.forEach(item => {
            // product card
            const itemCard = document.createElement('div');
            itemCard.innerHTML = `
                <a href="#" onclick="navigateToProduct('${item._id}')" class="product-link">
                    <div class="product-card">                      
                       <img src="data:image/png;base64,${item.imageData}" class="product-img" alt="${item.title}">
                       <p class="product-title">${item.title}</p>
                       <p class="price">$ ${item.price}</p>
                    </div>
                </a>
            `;
            //console.log('Image title:', item.title);
            //console.log('Image URL:', item.image);

            // Fetch the image data
            fetch(item.image)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.blob();
                })
                .then(blob => {
            // Log the image data
                    console.log('Image Data:', blob);
                })
                .catch(error => {
                     console.error('Error fetching image data:', error);
                });

            itemList.appendChild(itemCard);
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

// navigate to product details page
const navigateToProduct = (productId) => {
    console.log('Navigating to Product Details. Product ID:', productId);
    //window.location.href = `http://localhost:5000/items/${productId}`;
    window.location.href = `http://localhost:63342/6156-HTML-main/public/product.html?id=${productId}`;
};

// initiate
document.addEventListener('DOMContentLoaded', () => {
    fetchItems(1); // load product list
});

document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');

    // Check if productId is not null or undefined before using it
    if (productId) {
        fetchProductDetails(productId);
    }
});

// product detail
const fetchProductDetails = async (productId) => {
    try {
        console.log(`Fetching product details for ID: ${productId}`);
        const baseURL = 'http://localhost:5000';
        const response = await fetch(`${baseURL}/items/${productId}`, { method: 'GET' });
        console.log('Product Details Response:', response);
        const product = await response.json();
        const userJson = sessionStorage.getItem('user');
        const userObject = JSON.parse(userJson);
        const userEmail = userObject.email;

        // Update HTML elements with product details
        document.getElementById('product-image').src =`data:image/png;base64,${product.imageData}`;
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = `$ ${product.price}`;
        document.getElementById('product-details-description').textContent = product.description;
        //document.getElementById('product-owner').textContent = `Owner: ${(JSON.parse(sessionStorage.getItem('user')) || {}).email || 'Unknown'}`;
        //console.log('User Information:', sessionStorage.getItem('user'));

        //document.getElementById('product-owner').textContent = product.user_email;

        //const ownerEmailElement = document.getElementById('owner-email');
        //ownerEmailElement.textContent = product.email;

        //const productDetails = document.getElementById('product-details');
        //productDetails.innerHTML = '';

        // create product detail
        //const productCard = document.createElement('div');
        //productCard.innerHTML = `
            /*<img src="${product.image}" class="product-image" alt="${product.title}">
            <div class="product-detail">
                <h1 class="product-title">${product.title}</h1>
                <p class="product-owner">Owner: ${product.email}</p>
                <!-- Other info will be added... -->
            </div>*/
        //`;

        // Update Rating Section
        //const ratingStars = document.getElementById('rating-stars');
        //ratingStars.innerHTML = ''; // Clear previous stars

       // for (let i = 1; i <= 5; i++) {
            //const star = document.createElement('img');
            //star.src = i <= product.rate ? 'img/fill star.png' : 'img/no fill star.png';
            //star.classList.add('rating-star');
            //ratingStars.appendChild(star);
        //}

    } catch (error) {
        console.error('Error fetching product details:', error);
    }
};


// next page and previous page
const changePage = (pageOffset) => {
    const currentPageElement = document.getElementById('currentPage');
    let currentPage = parseInt(currentPageElement.textContent, 10);
    currentPage += pageOffset;

    // page cannot smaller than 1
    currentPage = Math.max(currentPage, 1);

    fetchItems(currentPage);
    currentPageElement.textContent = currentPage;
};

// Load product details on page load
document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');
    // Check if productId is not null or undefined before using it
    if (productId) {
        fetchProductDetails(productId);
    }
    //fetchItems(1);
});

