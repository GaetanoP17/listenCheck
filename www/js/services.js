angular.module('app.services', [])

.factory('server', function() { 
        return function(indirizzo) { 
            return ('http://localhost:3000' + indirizzo);
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
    this.addId = function(id) { //risposta = {id:, nome:, ascolti:, esito:})
            this.idSounds.push(id);
    };
})
