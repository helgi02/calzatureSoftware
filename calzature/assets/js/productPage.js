function handleButtonClick(nome) {
    const paragrafo = document.getElementById('paragrafo');

    switch (nome) {
        case 'descrizione':
           // const description = await fetchDescription();
            paragrafo.innerHTML = "Questa è una breve descrizione dell'articolo.";
            break;
        case 'dettagli':
            //const dettagli = await fetchDettagli();
            paragrafo.innerHTML = "Qui ci sono i dettagli dell'articolo.";
            break;
        case 'resi':
            //const resiSped = await fetchResieSped();
            paragrafo.innerHTML = "Spedizione gratuita su tutti gli ordini di almeno 29$" + "\n\n" + "Puoi rendere i tuoi acquisti entro 15 giorni dalla consegna. Consulta la nostra politica di RESI & RIMBOIRSI.";
            break;
        default:
            paragrafo.innerHTML = 'ID non riconosciuto.';
            break;
    }
}