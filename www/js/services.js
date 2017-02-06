angular.module('app.services', [])

.factory('server', function() { 
        return function(indirizzo) { 
            return ('http://172.19.60.75:3000' + indirizzo);
        }
})
.factory('capitalize', function()
{
    return function(stringa)
    {
        return stringa = stringa.charAt(0).toUpperCase() + stringa.substring(1);
    }
})

.service('apprendimento', function() { 
        this.setCategoria = function(preferenza){
            this.selezione = preferenza;
        }
        this.setSuoni = function(jukebox){ //jukebox = {id:, nome:, decibel:, frequenza:})
            this.suoni = jukebox;
        }        
})

.service("esercizio", function() {
    this.ascolti;
    this.reset = function(){
        this.exe = null;
        this.elencoRis = new Array();
        this.idSounds = new Array();
        this.idEsercitazione = null;
    }
        
    this.setExe = function(tipo,fascia,em) { 
            var db,fr;
            if(tipo === "decibel"){
                db = fascia;
                fr = null;                
            }else {
                fr = fascia;
                db = null;                
            }
            var data = new Date();     
            this.exe = {decibel: db, frequenza: fr, data: data, email: em};
        };
        
    this.addRis = function(risposta) { //risposta = {id:, nome:, ascolti:, esito:})
            this.elencoRis.push(risposta);
            this.addId(risposta.id);
    };
    this.addId = function(id) { 
            this.idSounds.push(id);
    };
})
.service("registrazione", function ()
{
    this.utente;
    this.genitore;
    this.codice;
    
    this.setUtente = function(nuovoUtente)
    {
        this.utente=nuovoUtente;
    };
    
    this.setGenitore = function(nuovoGenitore)
    {
        this.genitore=nuovoGenitore;
    };
    this.setCodice = function(nuovoCodice)
    {
        this.codice=nuovoCodice;
    }
    
    this.reset = function()
    {
        this.utente={};
        this.genitore={};
        this.codice=null;
    };
    
    this.getUtente = function()
    {
        return this.utente;
    };
    
    this.getGenitore = function()
    {
        return this.genitore;
    };
    this.getCodice = function()
    {
        return this.codice;
    }
})

.factory('checkValue', function()
{
    return function(value1,value2)
    {
        return value1 === value2;
    };
});
