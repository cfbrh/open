window.onload = () => {
    console.log('Window loaded');
    let loader = document.querySelector('.loader');
    if (sessionStorage.user) {
        user = JSON.parse(sessionStorage.user);
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const jsonDataString = urlParams.get('data');
    console.log('queryString', queryString);
    console.log('urlParams', urlParams);
    console.log('data', jsonDataString);
    if (jsonDataString) {
        const jsonData = JSON.parse(decodeURIComponent(jsonDataString));
        console.log('Parsed JSON data:', jsonData);
        console.log('Decoded URL:', decodeURIComponent(jsonDataString));
        // Store
        if (jsonData.token && jsonData.user_info) {
            sessionStorage.setItem('token', jsonData.token);
            sessionStorage.setItem('user', JSON.stringify(jsonData.user_info));

            console.log('Stored token:', sessionStorage.getItem('token'));
            console.log('Stored user:', sessionStorage.getItem('user'));
            // Redirect
            //window.location.replace('/');
            window.location.replace('/public/index.html');
            setTimeout(function() {
                window.location.reload();
            }, 100);
            //window.location.reload();
            //if (!reloadExecuted) {
            //reloadExecuted = true;
            //window.location.reload(true);
            // }
            //return;
        } else {
            console.error('Missing token or user_info in JSON data:', jsonData);
        }
    }
}





// get product function

const createProductCards = (data, title, ele) => {
    let container = document.querySelector(ele);
    container.innerHTML += createCards(data);
} ;
const createCards = data =>{
    let cards ='';
    data.forEach(item => {
        if(item.id != productId){
            cards += `
            <div class="product-card">
                <img src="${item.image}" onclick="location.href = '/products/${item.id}'" class="p">
                <h2 class="product-title">${item.title}</h2>
                <p class="price">Price: $${item.price}</p>
                <p>Created on: ${item.date_created}</p>
            </div>
        `};
    });
    return cards;
};

let productId = null;
