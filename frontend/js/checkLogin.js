document.onreadystatechange = () => {
    if(document.readyState === 'complete'){
        document.querySelectorAll('.user').forEach((value) => {
            let nama = localStorage.getItem('name');
            if(!nama){
                location.href = '../user/login.html'
            }
            nama = localStorage.getItem('name');
            value.textContent = nama;
        })
        
        document.querySelectorAll('a')
            .forEach(value => {
                if(value.textContent === 'Logout'){
                    value.onclick = () => {
                        if(confirm('Are You Sure?')){
                            localStorage.clear();
                            location.reload();
                        }
                    }
                }
        })
    }
}