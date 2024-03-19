window.onload = () => {
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        //if(!user.email){
            //location.replace('/');

        // Populate input fields with user information
        document.getElementById('newName').value = user.full_name || '';
        document.getElementById('newAddress').value = user.address || '';
        document.getElementById('newZipCode').value = user.zip_code || '';
        document.getElementById('newState').value = user.state || '';
        document.getElementById('newCity').value = user.city || '';
        document.getElementById('newDescription').value = user.description || '';
        }
    }

// form
let formBtn = document.querySelector('.submit-btn');
let loader = document.querySelector('.loader');

formBtn.addEventListener('click', () =>{
    let fullname = document.querySelector('#newName') || null;
    //let email = document.querySelector('#newEmail');
    let password = document.querySelector('#newPassword') || null;

    let Address = document.querySelector('#newAddress')|| null;
    let ZipCode = document.querySelector('#newZipCode')|| null;
    let State = document.querySelector('#newState')|| null;
    let City = document.querySelector('#newCity')|| null;
    let Description = document.querySelector('#newDescription')|| null;
    if(fullname != null){ //signup page
            // form validation
        if (fullname.value.length < 3){
            showFormError('Full name must be 3 letters long at least.');
        } else if (password.value.length < 6){
            showFormError('Password must be 6 letters long at least.');
        } /*else if (!Address.value.length) {
            showFormError('Please enter your address.');
        } else if (!ZipCode.value.length) {
            showFormError('Please enter your zip code.');
        } else if (!State.value.length) {
            showFormError('Please enter your state.');
        } else if (!Country.value.length) {
            showFormError('Please enter your country.');
        } else if (!Description.value.length) {
            showFormError('Please enter a description.');
        } */else{
            // submit form
            loader.style.display = 'block';
            user = JSON.parse(sessionStorage.user);
            const userId = user.id;
            sendData(`https://user-microservice-402518.ue.r.appspot.com/users/profile/${userId}`, {
                full_name: fullname.value,
                email: user.email,
                password: password.value,
                address: Address.value,
                zip_code: ZipCode.value,
                state: State.value,
                city: City.value,
                description: Description.value},'put')
        }
    }
})

/*function startGoogleSignIn() {
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: 'YOUR_CLIENT_ID',
        }).then(function () {
            const auth2 = gapi.auth2.getAuthInstance();

            auth2.signIn().then(function (googleUser) {
            // Handle the sign-up success, using googleUser
                console.log('Google Sign-Up successful:', googleUser);
            }, function (error) {
            // Handle the sign-up failure
                console.error('Google Sign-Up failed:', error);
            });
        });
    });
}
function onGoogleSignIn(googleUser) {
    // Get user information
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;

    // Send the id_token to your server for verification
    sendData('/google-login', { id_token: id_token });
}

function editAccount() {
    let fullname = document.querySelector('#newName') || null;
    let Address = document.querySelector('#newAddress') || null;
    let ZipCode = document.querySelector('#newZipCode') || null;
    let State = document.querySelector('#newState') || null;
    let Description = document.querySelector('#newDescription') || null;

    if (fullname != null) {
        // Form validation
        if (fullname.value.length < 3) {
            showFormError('Full name must be 3 letters long at least.');
        } else if (password.value.length < 6) {
            showFormError('Password must be 6 letters long at least.');
        } else {
            // Submit form
            loader.style.display = 'block';
            const userId = user.id;
            sendData(`https://user-microservice-402518.ue.r.appspot.com/users/profile/${userId}`, {
                name: fullname.value,
                email: user.email,
                address: Address.value,
                zipCode: ZipCode.value,
                state: State.value,
                description: Description.value
            });
        }
    }
}*/

// Rest of your code...

