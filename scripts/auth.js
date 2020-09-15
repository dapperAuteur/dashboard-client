console.log("auth.js");

const baseURL = "http://localhost:8080/v1/users/token"

let email = document.getElementById("user-email")
let name = document.getElementById("user-name")
let password = document.getElementById("user-password")

let cred;

let onChange = (e) => {

    let name = e.target.name;

    switch (name) {
        case "email":
            email.value = e.target.value;
            break;
        case "user-name":
            name.value = e.target.value;
        case "password":
            password.value = e.target.value;
            break
        default:
            console.log('name : ', name, " NOT found")
            break;
    }
}

document.addEventListener("input", e => {
    onChange(e)
})

let signin = () => {
    cred = {
        email: email.value,
        password: password.value
    }

    let encode = btoa(`${email.value}:${password.value}`)

    fetch(baseURL, {
       method: 'GET' ,
       mode: 'cors',
       credentials: 'same-origin',
       headers: new Headers({
           'Content-Type': 'application/json',
           'Authorization': `Basic ${encode}`
       }),
    })
    .then(resp => {
        if (!resp.ok) {
            if (resp.status >= 400 && resp.status < 500) {
                return resp.json().then(data => {
                    let err = {errorMessage: data.error}
                    throw err
                })
            } else {
                let err = {errorMessage: "Please try again later.  Server not responding."}
                throw err
            }
        }
        return resp.json();
    })
    .then(auth => {
        console.log('auth', auth)
        localStorage.setItem('token', JSON.stringify(auth))
        return auth;
    })
}