document.onreadystatechange = function (){
    if(this.readyState === 'complete'){
        const themeMode = document.querySelector('.themaMode');

        let thema = localStorage.getItem('thema');

        if(!thema){
            localStorage.setItem('thema','thema-light');
        }

            thema = localStorage.getItem('thema');

            if(thema === 'thema-dark'){
                themeMode.textContent = '🌑';
            }else{
                themeMode.textContent = '☀️';
            }

            document.body.classList.add(thema);

            function modeTheme(themanya){
                document.body.classList.remove(thema);
                localStorage.setItem('thema',themanya);
                thema = localStorage.getItem('thema');
                document.body.classList.add(thema);

            }

        themeMode.onclick = function(){
            thema = localStorage.getItem('thema');
            if(thema === 'thema-dark'){
                themeMode.textContent = '☀️';
                modeTheme('thema-light');
            }else{
                themeMode.textContent = '🌑';
                modeTheme('thema-dark');
            }
        }

    }
}