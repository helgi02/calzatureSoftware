let currentResponsabileId = 0;
var tableArticoli;
let token = sessionStorage.getItem('token');
let gridApi;



setup();

function setup()  {
    //popolaTable();
    //iconHeader = document.getElementById('icon_utente');
    sendRequestGetArticoliList();
    aggiornaSelect();
}

  
  


function createAgTable(ArowData)
{
    let columnDefs = [
      { headerName: "", field: 'image', flex:2},
        { headerName: 'Codice articolo', field: 'id',  flex:2},
        { headerName: 'Nome', field: 'nome', filter: true, flex:2},
        {headerName: 'Descrizione', field: 'descrizione', filter:true, flex:3},
        {headerName: 'Categoria', field: 'categoria', filter:true, flex: 2},
        {headerName: 'Colore', field: 'colore', filter:true, flex:2},
        {headerName: 'Prezzo', field: 'prezzo', filter:true, flex:2},
        {headerName: 'Taglie disponibili', field: 'taglie', flex:2},
        {
            headerName: "",
            field: "",
            flex: 2,
            

            cellRenderer: function(params) {

                var button = document.createElement('button');
                button.innerHTML = 'Modifica';
                button.classList.add("btn-table");

                button.addEventListener('click', function() { 
                  setModifyData(params.data.id);
                });

                return button;
            }          

        },

        {headername: "", field: "", flex: 2,
        cellRenderer: function(params) {

          var button = document.createElement('button');
          button.innerHTML = 'Elimina';
          button.classList.add("btn-table");

          button.addEventListener('click', function() { 
              //sendRequestGetCategorieList(params.data.id);
          });

          return button;
        }
      },
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
    let table = document.querySelector('#articoliTable');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    gridApi = agGrid.createGrid(table, gridOptions);
}




  function sendRequestGetArticoliList()  {
    const apiUrl = 'http://localhost:8081/GetListArticoli//';
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

  

  function aggiornaSelect() {
    // Recupera l'elemento select usando il suo ID
    const selectElement = document.getElementById('inputCategoria');
    
    // Rimuove tutte le opzioni esistenti
    selectElement.innerHTML = '';
  
    // Costruisci l'URL dell'API
    const apiUrlArticoliRequest = 'http://localhost:8081/GetCategoriesOptions' ;
  
    const requestOptionResp = {
      method: 'GET',
    };
  
    // Esegui la richiesta fetch
    fetch(apiUrlArticoliRequest, requestOptionResp)
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore nella risposta dal server');
        }
        return response.json(); // Trasforma la risposta in JSON
      })
      .then(data => {
        console.log('Risposta dal server:', data);
        // Assumi che 'data' sia un array di categorie
        data.forEach(categoria => {
          const option = document.createElement('option');
          option.value = categoria.id; // Imposta l'id come valore
          option.text = `${categoria.nome_sottocategoria} (${categoria.nome_categoria_principale })`; // Nome e nome_padre
    
          // Aggiunge l'opzione alla select
          selectElement.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Errore nella richiesta:', error);
        // Puoi gestire gli errori qui
      });
  }
  



  
  $(document).ready(function() {
    var limitemax  = 200; /* limite max di caratteri del textarea*/
    var txt = $('textarea').val(); /*testo nella textarea */
    var lentxt = txt.length; /* lunghezza del testo nella textarea*/
    $('span.contatore').html(lentxt);
    /* function limited */
    function limited(obj, limite) {
      var $contatore = $('span.contatore');
      var testo = $(obj).val();
      var lunghezza = testo.length;
      if(lunghezza > limite) {
        $(obj).val(testo.substr(0, limite));
        $contatore.html(lunghezza - 1);
        alert('hai superato il limite 200 max di caratteri');
      } else {
        $contatore.html(lunghezza);
      };
    };
    /* the end function limited*/
    $('textarea').keyup(function() {
      limited($(this), limitemax);
    });
    });




  function sendRequestAggiungi()  {
    inputCodice = document.getElementById('inputId').value;
    inputNome = document.getElementById('inputNome').value;
    inputDescrizione = document.getElementById('inputDescrizione').value;
    inputCategoria =  document.getElementById('inputCategoria').value;
    inputColore =  document.getElementById('inputColore').value;
    inputDanaro = document.getElementById('inputDanaro').value;
    inputTaglie =  document.getElementById('inputTaglie').value;
    const apiUrlArticoliRequest = 'http://localhost:8081/AggiungiArticolo/' + inputCategoria + '/'
    + inputNome + '/' + inputDescrizione + '/' + inputColore + '/' + inputCodice + '/' + inputTaglie + '/' + inputDanaro;

  const requestOptionResp = {
    method: 'GET',
  };

    // Esegui la richiesta fetch
    fetch(apiUrlArticoliRequest, requestOptionResp)
    .then(response => response.json()) // Trasforma la risposta in JSON
    .then(data => {
      console.log('Risposta dal server:', data);
      Swal.fire({
        title: "Aggiunta articolo",
        text: "Salvataggio effettuato con successo!",
        icon: "success"
      });

      $('#articoloModal').modal('hide');
      sendRequestGetArticoliList();
    })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
        // Puoi gestire gli errori qui
    });
  }


  //setta i campi per l'aggiunta dell'utente
function setAddDataArticoloModal()  {
  document.getElementById('inputId').value = '';
  document.getElementById('inputNome').value = '';
  document.getElementById('inputDescrizione').value = '';
  document.getElementById('inputCategoria').value = '';
  document.getElementById('inputColore').value = '';
  document.getElementById('inputDanaro').value = '';
  document.getElementById('inputTaglie').value = '';
  
}


function setModifyData(aIdArticolo) {
  const apiUrlArticoliRequest = 'http://localhost:8081/GetListArticoli/' + 'id' + '/' +  aIdArticolo;

  const requestOptionResp = {
    method: 'GET',
  };

    // Esegui la richiesta fetch
    fetch(apiUrlArticoliRequest, requestOptionResp)
    .then(response => response.json()) // Trasforma la risposta in JSON
    .then(data => {
        console.log('Risposta dal server:', data);
        // Puoi gestire la risposta qui
        document.getElementById('inputId').value = data.id;
        document.getElementById('inputNome').value = data.nome;
        document.getElementById('inputDescrizione').value = data.descrizione;
        document.getElementById('inputColore').value = data.colore;
        document.getElementById('inputDanaro').value = data.prezzo;
        document.getElementById('inputTaglie').value = data.taglie;
        
    })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
        // Puoi gestire gli errori qui
    });

    $('#articoloModal').modal('show');
}