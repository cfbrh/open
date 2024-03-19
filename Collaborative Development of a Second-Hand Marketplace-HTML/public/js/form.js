window.onload = () => {
    console.log('Window loaded');
    let loader = document.querySelector('.loader');
    if (sessionStorage.user) {
        user = JSON.parse(sessionStorage.user);
        if (user.email) {
            location.replace('/');
        }
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
        //processData(jsonData);
        // Store
        if (jsonData.token && jsonData.user_info) {
            sessionStorage.setItem('token', jsonData.token);
            sessionStorage.setItem('user', JSON.stringify(jsonData.user_info));

            console.log('Stored token:', sessionStorage.getItem('token'));
            console.log('Stored user:', sessionStorage.getItem('user'));
            // Redirect
            //window.location.replace('/');
            window.location.replace('/public/index.html');
            //window.location.replace('http://localhost:63342/6156-HTML-main/public/index.html');
            window.location.reload();
            //if (!reloadExecuted) {
            //reloadExecuted = true;
            //window.location.reload(true);
            // }
            //return;
        } else {
            console.error('Missing token or user_info in JSON data:', jsonData);
        }
    } else {
        console.error('No JSON data found in URL parameters');
    }
}



// form
let formBtn = document.querySelector('.submit-btn');
let loader = document.querySelector('.loader');

formBtn.addEventListener('click', () =>{
    let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    if(fullname != null){ //signup page
            // form validation
        if (fullname.value.length < 3){
            showFormError('Full name must be 3 letters long at least.');
        } else if (!email.value.length){
            showFormError('enter your email.');
        } else if (password.value.length < 6){
            showFormError('password must be 6 letters long at least.');
        } else{
            // submit form
            loader.style.display = 'block';
            sendData('/signup', {
                name: fullname.value,
                email: email.value,
                password: password.value}, 'post')
        }
    } else{ //login page
        if(!email.value.length || !password.value.length){
            showFormError('Please fill all the inputs')
        } else{
            // submit form
            loader.style.display = 'block';
            sendData('https://user-microservice-402518.ue.r.appspot.com/users/sign_in', {
                email: email.value,
                password: password.value}, 'post')
            //console.log('Success:');
        }
    }
})

/*function postData() {
    // Obtain the email and password from the form fields
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Data to be sent in the POST request
    const postData = {
        email: email,
        password: password
    };

    // Perform the POST request using the fetch API
    fetch('https://user-microservice-402518.ue.r.appspot.com/users/sign_in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include any additional headers as needed
        },
        body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle the response data as needed
        re
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
    });
}*/
