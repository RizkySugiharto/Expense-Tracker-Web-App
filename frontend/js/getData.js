let totalExpense = 0;
fetch('http://localhost:3000/v1/expenses',{
    // headers : {
    //     "Content-Type" : "application/x-www-form-urlencoded"
    // },
    mode : "cors",
    credentials : "include",
    // method : "POST",
    // body : `description=${salaryTitle}&amount=${salaryAmount}`
})
    .then(response => response.json())
    .then(res =>{
        document.querySelector('.history')
        .innerHTML = res.map((value) => {
            const tanggal = value.date.split('T')[0];
            totalExpense += Number(value.amount);
            return`
        <div class="card">
            <img src="https://wldnz.github.io/portofolio/img/profile/kingfrog.png">
            <h4>${value.description}</h4>
            <footer>
                <p>${value.amount}</p>
                <p>${tanggal}</p>
                <p>${value.category}</p>
                <p id-card="${value.id}">&times;</p>
            </footer>
        </div>
            `
        }).join('')
        document.querySelectorAll('p[id-card]').forEach(value => {
            value.onclick = function() {
               const idCard = this.getAttribute('id-card');
               if(confirm('Are You sure?')){
                    fetch(`http://localhost:3000/v1/expenses/${idCard}`,{
                    mode : "cors",
                    credentials : "include",
                    method : "DELETE",
                    })
                    .then(response => {
                        if(response.ok){
                            location.reload();
                        }
                    })
                    .catch(reject => console.log(reject))
               }
            }                
        })
        document.querySelector('.total-expense').textContent = `Total Expense : $ ${totalExpense}`
    })
    .catch(reject => console.log(reject));
        

