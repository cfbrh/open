const searchKey = decodeURI(location.pathname.split('/').pop());

getProducts(searchKey).then(data => createProductCards(data, searchKey, '.search-list-container'))

const itemsPerPage = 10;
let currentPage = 1;
let items = [];
//items.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

function displayProductList(items, page) {
  var productListContainer = document.querySelector(".search-list-container");
  productListContainer.innerHTML = "";

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);

  itemsToShow.forEach(function (item) {
    var productCard = document.createElement("div");
    productCard.classList.add("product-card");

    var productContent = `
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

