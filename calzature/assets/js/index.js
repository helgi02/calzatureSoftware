document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('searchButton');
    const input = document.getElementById('inputSearch');

    button.addEventListener('click', function () {
        input.classList.toggle('visible');
        if (input.classList.contains('visible')) {
            input.style.display = 'block'; // Mostra l'input
        } else {
            setTimeout(() => input.style.display = 'none', 100); // Nasconde l'input dopo la transizione
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    creaPrincipalButton();
});



async function getDataFromAPI(id)   {
    const apiUrl = 'http://localhost:8081/GetCategoriesById/' + id;

    // Opzioni della richiesta
    const requestOptions = {
        method: 'GET',
    };

    try{
        const response = await fetch(apiUrl); // Attende la risposta
        const data = await response.json(); 
        console.log(data);
        return data;
    }   catch(error)   {
        console.error('Errore nel caricamento delle sottocategorie:', error); 
    }
}



async function creaPrincipalButton() {
    const dropdownDiv = document.getElementById('dropdownDiv');
    
    try {
        // Ottieni i dati in modo asincrono
        let JSONdata = await getDataFromAPI(0);

        if (Array.isArray(JSONdata) && JSONdata.length >= 1) {
            JSONdata.forEach(record => {
                // Crea un nuovo div per il bottone
                const button = document.createElement('div');
                button.classList.add('btn');
                button.textContent = record.nome;
                button.id = record.id;

                // Crea un nuovo div per la lista e nascondilo inizialmente
                const listContainer = document.createElement('div');
                listContainer.className = 'list-container';
                listContainer.style.display = 'none'; // Inizialmente nascosto

                // Flag per controllare se la lista è già stata caricata
                let listLoaded = false;

                // Aggiungi un event listener per il mouse enter (hover)
                button.addEventListener('mouseenter', async () => {
                    if (!listLoaded) {
                        try {
                            // Effettua una richiesta per ottenere la lista di elementi in modo asincrono
                            let jsondata1 = await getDataFromAPI(`${record.id}`);

                            // Crea una lista ordinata
                            const ul = document.createElement('ul');
                            ul.style.listStyleType = 'none'; // Rimuove i punti dalla lista

                            jsondata1.forEach(item => {
                                const li = document.createElement('li');
                                li.textContent = item.nome + '>'; // Assicurati che item.nome esista
                                li.id = item.id;
                                li.addEventListener('mouseover', async() => {
                                    creaSubMenuOnHover(li);
                                })
                                ul.appendChild(li);
                            });

                            // Aggiunge la lista al nuovo div
                            listContainer.appendChild(ul);
                            // Segna la lista come caricata
                            listLoaded = true;
                        } catch (error) {
                            console.error('Errore nel caricamento della lista:', error);
                        }
                    }
                    listContainer.style.display = 'block'; // Mostra la lista al passaggio del mouse
                });

                // Aggiungi un event listener per il mouse leave
                button.addEventListener('mouseleave', () => {
                    listContainer.style.display = 'none'; // Nasconde la lista quando il mouse esce
                });

                // Aggiungi un event listener per il click (per far rimanere aperta la lista)
                button.addEventListener('click', () => {
                    listContainer.style.display = 'block';
                });

                // Aggiunge il listContainer sotto il div padre
                button.appendChild(listContainer);
                // Aggiunge il div al contenitore
                dropdownDiv.appendChild(button);
            });
        }
    } catch (error) {
        console.error('Errore nel caricamento delle sottocategorie:', error);
    }
}


async function creaSubMenuOnHover(listItem) {
    // Verifica che listItem sia un elemento DOM
    if (!(listItem instanceof HTMLElement)) {
        console.error('listItem non è un elemento DOM valido:', listItem);
        return;
    }

    // Verifica se il sub-menu è già stato caricato o se l'item non ha sottocategorie
    if (listItem.subMenuLoaded || listItem.noSubcategories) {
        // Se il sub-menu è già stato caricato o non ci sono sottocategorie, mostra o nascondi il sub-menu
        if (listItem.subMenuDiv) {
            listItem.subMenuDiv.style.display = 'block';

            listItem.addEventListener('mouseleave', () => {
                listItem.subMenuDiv.style.display = 'none';
            });
        }
        return;
    }

    try {
        // Ottieni le sottocategorie usando l'API
        let subcategories = await getDataFromAPI(listItem.id);

        if (Array.isArray(subcategories) && subcategories.length > 0) {
            // Crea un nuovo div per il sub-menu
            const subMenuDiv = document.createElement('div');
            subMenuDiv.classList.add('list-container');
            subMenuDiv.style.border = '1px solid #ccc'; // Bordo
            subMenuDiv.style.zIndex = 1000; // Metti il div sopra gli altri
            subMenuDiv.style.position = 'absolute'; // Posizionamento assoluto
            subMenuDiv.style.display = 'none'; // Nascondilo inizialmente

            // Posiziona il subMenuDiv vicino al listItem
            const rect = listItem.getBoundingClientRect();
            subMenuDiv.style.left = `${rect.width + 24}px`; // A destra del listItem
            subMenuDiv.style.top = `0px`; // Manteniamo la stessa altezza rispetto al listItem

            // Aggiungi le sottocategorie al sub-menu
            const ul = document.createElement('ul');
            ul.style.listStyleType = 'none'; // Rimuove i punti dalla lista

            subcategories.forEach(subcat => {
                const li = document.createElement('li');
                li.textContent = subcat.nome + '>';
                li.id = subcat.id;

                // Event listener per creare ulteriori sub-menu ricorsivamente
                li.addEventListener('mouseenter', async () => {
                    creaSubMenuOnHover(li);
                });

                ul.appendChild(li);
            });

            subMenuDiv.appendChild(ul);
            listItem.appendChild(subMenuDiv); // Aggiungi il div al listItem corrente

            // Memorizza il sub-menu nel listItem per non ricaricarlo
            listItem.subMenuDiv = subMenuDiv;
            listItem.subMenuLoaded = true; // Flag per evitare ricaricamenti

            // Mostra il sub-menu
            subMenuDiv.style.display = 'block';

            // Aggiungi un event listener per mostrare/nascondere il sub-menu
            listItem.addEventListener('mouseenter', () => {
                subMenuDiv.style.display = 'block';
            });

            listItem.addEventListener('mouseleave', () => {
                subMenuDiv.style.display = 'none';
            });

            // Event listener per mantenere il sub-menu visibile quando si passa sopra di esso
            subMenuDiv.addEventListener('mouseenter', () => {
                subMenuDiv.style.display = 'block';
            });

            subMenuDiv.addEventListener('mouseleave', () => {
                subMenuDiv.style.display = 'none';
            });
        } else {
            // Se non ci sono sottocategorie, imposta il flag noSubcategories
            listItem.noSubcategories = true;
        }
    } catch (error) {
        console.error('Errore nel caricamento delle sottocategorie:', error);
    }
}






