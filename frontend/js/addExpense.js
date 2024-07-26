document.querySelector('form')
.onsubmit = function(e){
    e.preventDefault();
    const salaryTitle = this.children[0].value;
    const salaryAmount = this.children[1].value;
    fetch('http://localhost:3000/v1/expenses',{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
        },
        mode : "cors",
        credentials : "include",
        method : "POST",
        body : `description=${salaryTitle}&amount=${salaryAmount}`
    })
        .then(response => response.ok? location.reload() : {})
        .catch(reject => console.log(reject));
}