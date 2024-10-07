let currentResponsabileId = 0;
let token = sessionStorage.getItem('token');
let gridApi;
let currentIdPadre;
let divLink = document.getElementById('link');
let categories;



setup();

function setup()  {
    //popolaTable();
    //iconHeader = document.getElementById('icon_utente');
    var link1 = createLink(0, 'Categorie Principali');
    currentIdPadre = 0;
    divLink.appendChild(link1);
    sendRequestGetCategorieList(0);
    populateSelect(0);
}

  

function createAgTable(ArowData)
{
    let columnDefs = [
        { headerName: '', field: 'id',  flex:1},
        { headerName: 'Nome', field: 'nome', filter: true, flex:2},
        {
            headerName: "",
            field: "",
            filter: false,

            cellRenderer: function(params) {

                var button = document.createElement('button');
                button.innerHTML = 'Visualizza sottocategorie';
                button.classList.add("btn-table");

                button.addEventListener('click', function() { 
                    btnVisualizzaSottocategorie(params);
                });

                return button;
            }
        },
        {
            headerName: "",
            field: "",
            filter: false,

            cellRenderer: function(params) {

                var button = document.createElement('button');
                button.innerHTML = 'Elimina';
                button.classList.add("btn-table");

                button.addEventListener('click', function() { 
                    sendRequestDelete(params.data.id);
                });

                return button;
            }
        }
    ];

    // Opzioni della griglia
    let gridOptions = {
        //localeText: ItTextsForAgGrid,
        columnDefs: columnDefs,
        rowData: ArowData,
        pagination: true, // Abilita la paginazione
        paginationPageSize: 20, // Numero di righe per pagina
        defaultColDef: {
            filter: true // Abilita i filtri su tutte le colonne per impostazione predefinita
        },
        onGridReady: function(params) {
            // Imposta l'API della griglia per l'uso
            window.gridApi = params.api;
            window.columnApi = params.columnApi;
        }
    };

    //Distruzione tabella
    if (gridApi != undefined && !gridApi.isDestroyed)
      gridApi.destroy();

    //pulizia container tabella
    let table = document.querySelector('#categorieTable');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    gridApi = agGrid.createGrid(table, gridOptions);
}





function createLink(id, nome)   {
    var link = document.createElement('a');


        // Imposta l'URL e il testo del link
    link.href = '#';
    link.textContent = '/'+ nome;  // Apre il link in una nuova finestra/scheda
    link.classList.add('nav-link');
    link.addEventListener('click', function(event) {            
            // Recupera tutti i link (<a>) all'interno del div
            var links = divLink.getElementsByTagName('a');
            
            // Converti HTMLCollection in un array per poterlo iterare facilmente
            var linksArray = Array.from(links);

            var linkSelezionatoIndex = linksArray.indexOf(this);

    // Itera sui link che vengono dopo il link selezionato
            for (var i = linkSelezionatoIndex + 1; i < linksArray.length; i++) {
                divLink.removeChild(linksArray[i]); // Rimuovi il link
            }
            // Itera su tutti i link presenti nel div
            currentIdPadre = id;
            console.log('questo e il current id padre dopo:' + currentIdPadre);   
        
    // Azione personalizzata quando si clicca
    sendRequestGetCategorieList(id);
    });;

    return link;
}

function btnVisualizzaSottocategorie(params) {
    rowId = params.data.id;  // Recuperiamo il valore della field 'id'
    rowNome = params.data.nome; 

    var catLink = createLink(rowId, rowNome);

    divLink.appendChild(catLink);
    sendRequestGetCategorieList(rowId);
    currentIdPadre = rowId;
}




 function sendRequestGetCategorieList(idPadre)  {
    const apiUrl = 'http://localhost:8081/GetCategoriesById/' + idPadre;
  // Opzioni della richiesta, tra cui il metodo (POST), l'intestazione e il corpo dati
  const requestOptions = {
      method: 'GET',  
  };
  
  // Esegui la richiesta fetch
  fetch(apiUrl, requestOptions)
      .then(response => response.json()) // Trasforma la risposta in JSON
      .then(data => {
          console.log('Risposta dal server:', data);
          // Puoi gestire la risposta qui
          createAgTable(data);
          console.log(AdataCategorie);
      })
      .catch(error => {
          console.error('Errore nella richiesta:', error);
          // Puoi gestire gli errori qui
      });
      
  }


  function sendRequestAggiungi()    {
    let nome = document.getElementById('inputNome').value;
    const apiUrl = 'http://localhost:8081/AggiungiCategoria/' + nome + '/' + currentIdPadre;
  // Opzioni della richiesta, tra cui il metodo (POST), l'intestazione e il corpo dati
    const requestOptions = {
      method: 'GET',  
  };
  
  // Esegui la richiesta fetch
  fetch(apiUrl, requestOptions)
      .then(response => response.json()) // Trasforma la risposta in JSON
      .then(data => {
          console.log('Risposta dal server:', data);
          Swal.fire({
            title: "Aggiunta categoria",
            text: "Salvataggio effettuato con successo!",
            icon: "success"
          });

          $('#categoriaModal').modal('hide');
          sendRequestGetCategorieList(currentIdPadre);
      })
      .catch(error => {
          console.error('Errore nella richiesta:', error);
          // Puoi gestire gli errori qui
      });


  }


  function sendRequestDelete(id)  {
    const apiUrl = 'http://localhost:8081/RemoveCategoria/' + id;
  // Opzioni della richiesta, tra cui il metodo (POST), l'intestazione e il corpo dati
  const requestOptions = {
      method: 'GET',  
  };
  
  // Esegui la richiesta fetch
  fetch(apiUrl, requestOptions)
      .then(response => response.json()) // Trasforma la risposta in JSON
      .then(data => {
          console.log('Risposta dal server:', data);
          Swal.fire({
            title: "Eliminazione categoria",
            text: "Eliminazione effettuata con successo!",
            icon: "success"
          });
          sendRequestGetCategorieList(currentIdPadre);
      })
      .catch(error => {
          console.error('Errore nella richiesta:', error);
          // Puoi gestire gli errori qui
      });


  }

  function setAddDataCategoriaModal()   {
    categories = document.getElementById('categoriesList');

    // Recupera tutti i link (<a>) all'interno del div 'link'
    var links = divLink.getElementsByTagName('a');
            
    // Converti HTMLCollection in un array per poterlo iterare facilmente
    var linksArray = Array.from(links);

    // Itera su tutti i link
    for (var i = 0; i < linksArray.length; i++) {
        var linkText = linksArray[i].textContent;  // Recupera il testo del link

        // Crea un nuovo elemento per aggiungere il testo nel div 'categoriesList'
        var newElement = document.createElement('p');  // Può essere <p>, <li>, o qualsiasi altro elemento
        newElement.textContent += linkText;
    }
        // Aggiungi il nuovo elemento con il testo nel div 'categoriesList'
    categories.appendChild(newElement);
        

    document.getElementById('inputNome').value = '';


  }
