
/*const sendData = (path, data) =>{
    fetch(path,{
        method: 'post',
        //method: 'patch',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.token}`,
        }),
        //body: JSON.stringify(data)
        body: JSON.stringify({
            full_name: data.name,  // Adjust
            email: data.email,
            password: data.password,
            address: data.address,
            zip_code: data.zipCode, // Adjust
            state: data.state,
            country: data.country,
            description: data.description,
        }),
    })
    .then(res => res.json())
    .then(data => processData(data));
}*/
const sendData = (path, data, method) => {
    const formData = new FormData();

    // Append each field to the FormData object
    for (const key in data) {
        formData.append(key, data[key]);
    }
    //for (const [key, value] of formData.entries()) { alert(`${key}: ${value}`); }
    fetch(path, {
        method: method,
        headers: new Headers({
            'Authorization': `Bearer ${sessionStorage.token}`,
        }),
        body: formData,
    })
    .then(res => {
        alert(method);
        alert('Response:', res);
        return res.json();
    })
    .then(data => processData(data));


}



const processData = (data) => {
    alert('aaa');
    console.log('Response from server:', data);
    loader.style.display = null;
    //alert(data);
    if (data.alert) {
        showFormError(data.alert);
    } else if (data.token && data.user_info) {
        // Store token and user
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user_info));
        console.log('Stored token:', sessionStorage.getItem('token'));
        console.log('Stored user:', sessionStorage.getItem('user'));
        // Redirect
        if (!sessionStorage.getItem('redirected')) {
            sessionStorage.setItem('redirected', 'true');
            //location.replace('/');
            location.replace('/6156-HTML-main/public/index.html');
        }
    } else if (data.name) {
        sessionStorage.user = JSON.stringify(data);
        location.replace('/');
    } else if (data.product) {
        location.replace('/dashboard');
    } else if (data.googleUser) {
        // Google Sign-In
        sessionStorage.user = JSON.stringify(data.googleUser);
        location.replace('/');
    }
}


const showFormError = (err) =>{
    let errorEle = document.querySelector('.error');
    errorEle.innerHTML = err;
    errorEle.classList.add('show')

    setTimeout(()=>{
        errorEle.classList.remove('show')
    }, 2000)
}

