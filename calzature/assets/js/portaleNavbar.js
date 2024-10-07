document.getElementById('toggleCloseMenu').addEventListener('click', function() {
    // Rimuovi la classe 'show' dall'elemento menu
    var offcanvasMenu = document.getElementById('offcanvas-menu');
    offcanvasMenu.classList.remove('show');

    // Imposta la larghezza del div con id 'wrapperDiv' a 90%
    var wrapperDiv = document.getElementById('wrapperDiv');
    wrapperDiv.style.width = '93%';
    wrapperDiv.style.marginLeft = '3%';
    wrapperDiv.style.marginTop = '2%';

    // Crea un nuovo bottone che al click ripristina la sidebar
    var button = document.createElement('button');
    button.textContent = 'Apri Menu';
    button.classList.add('btn', 'btn-secondary');
    button.id = 'openMenuButton';
    button.addEventListener('click', function() {
        // Ripristina la classe 'show' alla sidebar
        offcanvasMenu.classList.add('show');
        
        // Ripristina la larghezza del div 'wrapperDiv' a 80%
        wrapperDiv.style.width = '80%';
        wrapperDiv.style.marginLeft = '18%';
        wrapperDiv.style.marginTop = '5%';

        // Rimuovi il bottone di apertura del menu
        button.remove();
    });

    // Inserisci il bottone appena creato nel DOM
    offcanvasMenu.parentElement.appendChild(button);
});
