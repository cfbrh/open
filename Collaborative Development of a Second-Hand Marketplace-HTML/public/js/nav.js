// navbar

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () =>{
    if(scrollY >= 55){
        navbar.classList.add('bg');
    } else{
        navbar.classList.remove('bg');
    }
})

const createNavbar = () => {
    let navbar = document.querySelector('.navbar');
    navbar.innerHTML = `   
        <ul class="links-container">
            <li class="link-item"><a href="#" class="link active" id="home-link">Home</a></li>
            <li class="link-item"><a href="#" class="link" id="product-link">Product</a></li>
            <li class="link-item"><a href="#" class="link" id="dashboard">Dashboard</a></li>
        </ul>
        <div class="user-interactions">
            <div class="search-box">
                <input type="text" class="search" placeholder="Search Item">
                <button class="search-btn"><img src="img/search.png" alt=""></button>
            </div>
            <div class="user">
                <img src="img/user.png" class="user-icon" alt="">
                <div class="user-icon-popup">
                    <p>login to your account</p>
                    <a>login</a>
                </div>
            </div>
        </div>
    
    `;
}

createNavbar();

// go to index
let homeLink = document.getElementById("home-link");

homeLink.addEventListener("click", function (event) {
    event.preventDefault();
    let user = JSON.parse(sessionStorage.user || null);
    if (user != null) {
        window.location.href = "index.html";
    } else {
        window.location.href = "index.html";
    }
});

// go to product list
let productLink = document.getElementById("product-link");

productLink.addEventListener("click", function (event) {
    event.preventDefault();
    let user = JSON.parse(sessionStorage.user || null);
    if (user != null) {
        window.location.href = "product-list.html";
    } else {
        window.location.href = "login.html";
    }
});

// go to my dashboard
let dashboardLink = document.getElementById("dashboard");

dashboardLink.addEventListener("click", function (event) {
    event.preventDefault();
    let user = JSON.parse(sessionStorage.user || null);
    if (user != null) {
        window.location.href = "dashboard.html";
    } else {
        window.location.href = "login.html";
    }
});


//user icon popup
let userIcon = document.querySelector('.user-icon');
let userPopupIcon = document.querySelector('.user-icon-popup');

userIcon.addEventListener('click', () => userPopupIcon.classList.toggle('active'));

let text = userPopupIcon.querySelector('p');
let actionBtn = userPopupIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

const logout = () => {
    sessionStorage.clear();
    //location.reload();
    window.location.href = 'index.html';
}

if(user != null){ //user is logged in
    text.innerHTML = `Hello, ${user.full_name}`;
    actionBtn.innerHTML = 'logout';
    actionBtn.addEventListener('click', logout);
} else{
    text.innerHTML = 'login to your account';
    actionBtn.innerHTML = 'login';
    actionBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}


//search box
let searchBtn = document.querySelector('.search-btn');
let searchBox = document.querySelector('.search');

searchBtn.addEventListener('click', () => {
    if(searchBox.value.length){
        performSearch();
    }
})

searchBox.addEventListener('focus', () => {
    searchBox.placeholder = '';
});

searchBox.addEventListener('blur', () => {
    if (!searchBox.value.trim()) {
        searchBox.placeholder = 'Search Item';
    }
});

searchBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && searchBox.value.length) {
        performSearch();
    }
});

function renderSearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear existing content

    results.forEach(result => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Assuming imageData is available in each result
        const imageSrc = `data:image/jpeg;base64,${result.imageData}`;
        const title = result.title;
        const price = `$ ${result.price}`;

        productCard.innerHTML = `
            <img src="${imageSrc}" class="product-img1" alt="">
            <p class="product-title1">${title}</p>
            <p class="price1">${price}</p>
        `;

        searchResultsContainer.appendChild(productCard);
    });
}
function redirect(url) {
    window.location.href = url;
}

function performSearch() {
    const searchTerm = searchBox.value.trim();

    if (searchTerm.length > 0) {
        // Redirect to the search page with the search term as a query parameter
        window.location.href = `http://localhost:63342/6156-HTML-main/public/search.html?searchTerm=${encodeURIComponent(searchTerm)}`;
    }
}
