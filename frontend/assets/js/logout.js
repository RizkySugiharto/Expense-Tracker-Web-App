let logoutButton = document.querySelector('.logout');
logoutButton.onclick = () => {
    if(window.confirm('yakin ingin logout?')){
        localStorage.clear();
        location.reload();
    }
}