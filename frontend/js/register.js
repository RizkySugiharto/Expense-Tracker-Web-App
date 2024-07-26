document.querySelector('form')
.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('exampleInputUsername').value
    const email = document.getElementById('exampleInputEmail1').value;
    // const email = formWithChildren[1].value;
    const password = document.getElementById('exampleInputPassword1').value;
    console.log(username)
    console.log(email)
    console.log(password)

    // dummy account
    // username : radit
    // email : radit@gmail.com
    // password : radit123

    fetch('http://localhost:3000/v1/accounts/signup',{
        headers : {
            "Content-Type" : "application/json"
        },
        mode: 'cors',
        credentials: 'include',
        method : "POST",
        body : JSON.stringify({ username : username, email : email, password : password})
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }
    })
    .then(res => {
        console.log(res)
        const name = res.name;
        if(name){
            localStorage.setItem('name',name);
            if(localStorage.getItem('name')){
                location.href = '../user/login.html';
            }
        }
    })
    .catch(reject => console.log(reject));

}