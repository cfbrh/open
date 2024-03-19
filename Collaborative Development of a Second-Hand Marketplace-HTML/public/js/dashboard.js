let user = JSON.parse(sessionStorage.user || null);
if (user == null){
    location.replace('/login')
}
//else if(!user.seller){
    //location.replace('/seller')
//}
//let greeting = document.querySelector('#seller-greeting');
//greeting.innerHTML += user.name;

// edit account
let editAccountBtn = document.querySelector('.edit-account-btn');
editAccountBtn.addEventListener('click', () => {
    location.href = '/6156-HTML-main/public/edit-account.html';
});

//loader
let loader = document.querySelector('.loader');
let noProductImg = document.querySelector('.no-product');

loader.style.display = 'block';


// my item
const setupProducts = async (page) => {
    try {
        const authToken =  sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/myItem`, {
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
document.addEventListener('DOMContentLoaded', () => {
    alert('setupproducts');
    setupProducts(1); // load my product
});

// page
const itemsPerPage = 10;
let currentPage = 1;
items.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

function displayProductList(items, page) {
  var productListContainer = document.querySelector(".product-list-container");
  productListContainer.innerHTML = "";

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);

  itemsToShow.forEach(function (item) {
    var productCard = document.createElement("div");
    productCard.classList.add("product-card");

    var productContent = `
      <button class="btn edit-btn" onclick="editProduct(${item.id})"><img src="img/edit.png" alt=""></button>
      <button class="btn open-btn" onclick="openProduct(${item.id})"><img src="img/open.png" alt=""></button>
      <button class="btn delete-btn" onclick="deleteProduct(${item.id})"><img src="img/delete.png" alt=""></button>
            
      <img src="${item.image}" alt="${item.title}" class="product-img">
      <h2 class="product-title">${item.title}</h2>
      <p class="price">Price: $${item.price}</p>
      <p>Created on: ${item.date_created}</p>
    `;

    productCard.innerHTML = productContent;
    productListContainer.appendChild(productCard);
  });

  // Update current page number in the pagination controls
  document.getElementById("currentPage").innerText = page;
}


function changePage(change) {
  currentPage += change;

  // Ensure currentPage stays within valid bounds
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > Math.ceil(items.length / itemsPerPage)) {
    currentPage = Math.ceil(items.length / itemsPerPage);
  }

  displayProductList(items, currentPage);
}

// Initial display for the first page
displayProductList(items, currentPage);

