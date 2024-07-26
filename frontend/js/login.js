document.querySelector('form')
.onsubmit = (e) => {
    e.preventDefault();
    const formWithChildren = Array.from(document.querySelector('form').children);
    const email = document.getElementById('exampleInputEmail1').value;
    // const email = formWithChildren[1].value;
    const password = document.getElementById('exampleInputPassword1').value;

    console.log(email)
    console.log(password)

    fetch('http://localhost:3000/v1/accounts/signin',{
        headers : {
            "Content-Type" : "application/json"
        },
        mode: 'cors',
        credentials: 'include',
        method : "POST",
        body : JSON.stringify({email : email,password : password})
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
                location.href = '../';
            }
        }
    })
    .catch(reject => console.log(reject));

}