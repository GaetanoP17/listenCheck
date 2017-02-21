angular.module('app.controllers', [])
  
.controller('menuAdminCtrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {


}])
   
.controller('menuLogopedistaCtrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {


}])
   
.controller('menuUtenteCtrl', ['$scope', '$stateParams', 
function ($scope, $stateParams) {


}])
   
.controller('profiloUtenteCtrl', ['server','checkValue', 'capitalize', '$scope', '$stateParams','$http','$cookies','$ionicPopup','$location', 
function (server, checkvalue, capitalize, $scope, $stateParams, $http, $cookies, $ionicPopup, $location) 
{
    //metodo per recuperare i cookies
    var oggettoAccount=$cookies.getObject('account');
    
    $scope.reCF=/^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$/;
    $scope.rePass=/(?=.*\d)(?=.*[a-zA-Z]).{8,}/;
    $scope.email= oggettoAccount.email;
    $scope.password="";
    $scope.passwordconferma="";
        
    $http.post(server('/profiloUtente'), {email: $scope.email})
            .success(function(data)
            {
                $scope.nome=data.nome;
                $scope.cognome=data.cognome;
                $scope.dataN=new Date(data.data);
                $scope.sesso=data.sesso;
                $scope.cf=data.cf;
                $scope.telefono=data.telefono;
                $scope.citta=data.citta;
                $scope.pass=data.pass;
            })
             .error(function()
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Problemi con il server...Riprovare più tardi'
                    });
                });
    $scope.salva=function()
    {
        if(isValidForm())
        {
            //scorciatoia per garantire simmetrie tra le date lato client e server
            //sul server infatti viene registrata con un giorno in meno
            var data= new Date($scope.dataN);
            data.setDate(data.getDate()+1);
            
            if($scope.password !== "" ) 
            {
                $scope.pass=$scope.password;
            }
          
            $http.post(server('/profiloUtente/update'), {email: $scope.email, nome: capitalize($scope.nome), cognome: capitalize($scope.cognome), data: data, sesso: $scope.sesso, cf: $scope.cf.toUpperCase(), telefono: $scope.telefono, citta: capitalize($scope.citta), pass: $scope.pass})
            .success(function(data)
            {
                if(data === 'Done')
                {
                    $ionicPopup.alert({
                    title: 'Listen Check',
                    template: 'Modifiche avvenute con successo'
                    });
                    $location.path('/Menu/menuUtente');
                }
                                 
             })
             .error(function()
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Problemi con il server...Riprovare più tardi'
                    });
                });
        }
    }
    
    function isValidForm()
    {
        valid=true;
        errore="";
        flag=false;
        
        
        if($scope.profilo.$pristine) 
        {
            $location.path('/Menu/menuUtente');
        }
        else 
        {
            //validazione della form
            if (!checkvalue($scope.password,$scope.passwordconferma))
            {
                errore= errore+"-- Le due password non coincidono <br>";
                flag=true;
            }
            if($scope.profilo.cf.$invalid)
            {
                errore= errore+"-- Il formato del codice fiscale non è corretto <br>";
                flag=true;
            }
            if($scope.profilo.tel.$invalid)
            {
                errore= errore+"-- Il formato del numero del telefono non è corretto <br>";
                flag=true;
            }
            if($scope.profilo.$invalid && $scope.password !== "")
            {
                errore= errore+"-- La password deve contenere almeno 8 caratteri, di cui almeno un numero e una lettera";
                flag=true;
            }
            if (flag)
            {
                valid=false;         
                $ionicPopup.alert({
                 title: 'Errore Compilazione',
                 template: errore
                 });
            }
            return valid;
        }
    }
}])
      
.controller('gestioneCollaborazioniCtrl', ['server','$scope', '$stateParams','$http','$cookies','$ionicPopup', 
function (server, $scope, $stateParams, $http, $cookies, $ionicPopup) 
{
    var terapista=$cookies.getObject('account').email;
    var nome=$cookies.getObject('account').nome;
    var cognome=$cookies.getObject('account').cognome;
    
    $scope.pazienti;
    $scope.accettati= new Array();
    $scope.sospesi= new Array();
    
    $http.post(server('/gestioneCollaborazioni'), {email: terapista})
            .success(function(data)
            {
                $scope.pazienti=data;
                for(var i=0; i<$scope.pazienti.length; i++)
                {
                    if($scope.pazienti[i].stato === 0 )
                        $scope.sospesi.push($scope.pazienti[i]);
                    else $scope.accettati.push($scope.pazienti[i]);
                }    
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    $scope.accetta=function(paziente,indice)
    {
        
        $http.post(server('/gestioneCollaborazioni/accetta'), {paziente: paziente, terapista: terapista, nome: nome, cognome: cognome})
            .success(function(data)
            {
                if( data === "Already")
                {
                    $scope.sospesi.splice(indice,1);
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Ci dispiace, l'utente ha stretto collaborazione con un altro terapista"
                    });
                }
                if( data === "Done")
                {
                  
                    $scope.accettati.push($scope.sospesi[indice]);
                    $scope.sospesi.splice(indice,1);
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Richiesta di collaborazione accettata con successo"
                    });
                }
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    }
    $scope.rifiuta=function(paziente,indice)
    {
        $http.post(server('/gestioneCollaborazioni/rifiuta'), {paziente: paziente, terapista: terapista, nome: nome, cognome: cognome})
            .success(function(data)
            {
                if( data === "Done")
                {
                    $scope.sospesi.splice(indice,1);
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Richiesta di collaborazione rifiutata"
                });
            }   
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    }
    $scope.elimina=function(paziente,indice)
    {
        $http.post(server('/gestioneCollaborazioni/elimina'), {paziente: paziente, terapista: terapista})
            .success(function(data)
            {
                if( data === "Done")
                {
                    $scope.accettati.splice(indice,1);
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Richiesta di collaborazione eliminata"
                });
            }   
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    }

}])
   
.controller('side-menu21Ctrl', ['server','$scope', '$stateParams', '$cookies','$location','$http','$ionicPopup',
function (server,$scope, $stateParams, $cookies, $location, $http, $ionicPopup) 
{
    var tipo= $cookies.getObject('account').type;
    $scope.flag=true;
    $scope.flag1=false;
    $scope.nome = $cookies.getObject('account').nome + " "+$cookies.getObject('account').cognome;
    
    if(tipo === "L" || tipo === "A")
    {
        $scope.flag=false;
        $scope.flag1=true;
    }
    
    $scope.logout=function()
    {
        $cookies.remove('account');
    }
    
    $scope.disattiva=function()
    {
        var popup=$ionicPopup.confirm({
                    title: 'ListenCheck',
                    template: 'Sei sicuro di voler disattivate il tuo account?'
                    });
        popup.then(function(res) 
        {
            if(res)
            {
                $http.post(server('/login/disattiva'), {email: $cookies.getObject('account').email})
                .success(function(data)
                {
                    $cookies.remove('account');
                                       
                    var popup1=$ionicPopup.alert({
                        title: 'ListenCheck',
                        template: 'Account disattivato correttamente'
                        });
                        popup1.then(function(res)
                        {
                             $location.path('/login');
                             //se l'account appartiene ad un utente audioleso allora elimina la collaborazione
                            if(tipo === 'U')
                            $http.post(server('/cercaLogopedista/disassocia'), {email: $cookies.getObject('account').email});
                    
                        })
                })
                .error(function()
                {
                    $ionicPopup.alert({
                        title: 'ListenCheck',
                        template: 'Problemi con il server...Riprovare più tardi'
                        });
                });
            }
        });
    }
}])
   
.controller('loginCtrl', ['server', '$scope', '$stateParams', '$http', '$cookies','$location','$ionicPopup',
  function (server, $scope, $stateParams, $http, $cookies, $location, $ionicPopup)
  {
    $scope.email ="";
    $scope.password="";
    $scope.invia=function()
    {
        
        if($scope.email === "" || $scope.password === "")
        {
            //se non compila i campi non parte la richiesta
        }
        if($scope.accedi.$invalid)
        {
            //viene mostrato il messaggio relativo ad un errore nell'email
        }
        else
        {
             $http.post(server('/login'), {email: $scope.email,password: $scope.password})
            .success(function(data)
            {
             if(data === "Nologin")
            {
              $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Dati di accesso errati'
                    });
            }
            else if( data === "duplicate")
            {
              $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Hai effettuato l\'accesso già da un altro dispositivo'
                    });
            }
            else 
            {
              $cookies.putObject('account', data);
              if(data.type === "A")
              {
                  $location.path('/Menu/menuAdmin');
                  
              }
              else if(data.type === "U")
              {
                 $location.path('/Menu/menuUtente');
              }
              else
              {
                 $location.path('/Menu/menuLogopedista');
              }
            }  
             })
             .error(function()
            {
                $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Problemi con il server...Riprovare più tardi'
                    });
            });
        };
    }
  }])
   
.controller('menuEsercitazioneCtrl', ['server', 'esercizio', '$scope', '$stateParams', '$location', '$cookies', '$http', '$ionicPopup',
function (server, esercizio, $scope, $stateParams, $location, $cookies, $http, $ionicPopup) {
     
    $scope.sospesa=function() {
        $scope.visualizza = 0;
        esercizio.reset();
        var email = $cookies.getObject('account').email;
        var parameter = JSON.stringify({account: email});
        $http.post(server('/esercitazione/sospesa'), parameter)
        .success(function(data, status, headers, config){
            if (data.sospesa){
                esercizio.idEsercitazione = data.id_Es;
                esercizio.setExe(data.tipo,data.fascia,email);
                esercizio.elencoRis = data.esiti;                    
                $location.path('esercitazione');                
            }else $scope.visualizza = 1;      
        })
        .error(function()
        {
            var alert = $ionicPopup.confirm({
                title: 'ListenCheck',
                template: 'Problemi ripristino Esercitazione! Riprovare più tardi'
            });
            alert.then(function() {
                $location.path('/Menu/menuUtente');
            });
        });
    }
    
    $scope.avvia=function(tipo,fascia) {
        esercizio.reset();
        esercizio.setExe(tipo,fascia,$cookies.getObject('account').email);
        $http.post(server('/esercitazione/crea'), esercizio.exe)
            .success(function(data, status, headers, config){
                esercizio.idEsercitazione = data.idEsercitazione;
                $location.path('esercitazione');                           
            })
            .error(function()
            {
                var alert = $ionicPopup.confirm({
                    title: 'ListenCheck',
                    template: 'Problemi avvio Esercitazione! Riprovare più tardi'
                });
                alert.then(function() {
                    $location.path('/Menu/menuUtente');
                });
            }); 
    } 
}])

.controller('esercitazioneCtrl', ['esercizio', 'server', '$scope', '$http', '$stateParams', '$location', '$cookies', '$window', '$sce', '$ionicPopup', '$timeout',
function (esercizio, server, $scope, $http, $stateParams, $location, $cookies, $window, $sce, $ionicPopup, $timeout) {
    $scope.anomalia = 0;
    $scope.maxQuestions = 5;            
    $('#suono').prop("volume", 1.0);   
    $('#si').prop("volume", 0.2);
    $('#no').prop("volume", 0.2);
        
    $scope.fine = 1; 
    $scope.play_Feedback = 'ion-play';
    $scope.showButtonA = 1;
    $scope.disabledButtonA = 1;
    $scope.selettori = 0; 
    $scope.showLoading = 1;
    $scope.showButtonC = 0;
    
    $scope.getQuesito=function(reload){
        $scope.nQuestion = esercizio.elencoRis.length;
        if($scope.nQuestion === $scope.maxQuestions)
        {
            $timeout(function () {
                $ionicPopup.alert({
                    title: 'Esercitazione',
                    template: 'Complimenti hai terminato l\'esercitazione!'
                });
            }, 1000);
        }
        else if($scope.nQuestion > $scope.maxQuestions)
        {
            $scope.anomalia = 1;
            $scope.risolviAnomalia();             
        }
        else{
            mostra(0);        
            $scope.load_A = 0;
            $scope.load_B = 0;
            $scope.load_C = 0;
            $scope.load_D = 0;            
            if(reload){
                manipola(0);                                
            }
            else
            {
                if($scope.nQuestion > 0)
                {
                    for (var i in esercizio.elencoRis) 
                    {
                        esercizio.addId(esercizio.elencoRis[i].id);
                    }  
                }
            }               
            var parameter;
            var flag = 0;
            if(esercizio.exe.decibel != null){
                parameter=JSON.stringify({tipo: "decibel", fascia: esercizio.exe.decibel, idSounds: esercizio.idSounds});
                flag = 1;
            }else {
                parameter=JSON.stringify({tipo: "frequenza", fascia: esercizio.exe.frequenza, idSounds: esercizio.idSounds});          
            }
            $http.post(server('/esercitazione/inizializza'), parameter)
            .success(function(data, status, headers, config){
                if(data === 'NoSounds'){
                    var alert = $ionicPopup.confirm({
                        title: 'ListenCheck',
                        template: 'Elementi non trovati! Riprovare più tardi'
                    });
                    alert.then(function() {
                        $location.path('/Menu/menuUtente');
                    });
                }
                else
                {
                    $scope.id = data[0].id;
                    $scope.nome = data[0].nome;
                    if(flag)
                    {
                        $scope.jukebox = $sce.trustAsResourceUrl(server('/soundsDecibel/'+$scope.id+'.mp3'));
                    }
                    else
                    {
                        $scope.jukebox = $sce.trustAsResourceUrl(server('/sounds/'+$scope.id+'.mp3'));
                    }
                    var x = Math.floor((Math.random() * 4));
                    var n = 0;
                    while(true){                
                        switch (x) {
                           case 0:
                                if(n === 0)$scope.risCorretta = 'a';
                                if($scope.old_a === data[n].id){
                                    $scope.imgLoad('a');                                   
                                }
                                else{
                                    $scope.radio_a = data[n].nome;
                                    $scope.imm_a = server('/images/'+data[n].id+'.png');                                    
                                    $scope.old_a = data[n].id;                                    
                                }                                
                                break;
                            case 1:
                                if(n === 0)$scope.risCorretta = 'b';
                                if($scope.old_b === data[n].id){
                                    $scope.imgLoad('b');                                      
                                }
                                else{
                                    $scope.radio_b = data[n].nome;
                                    $scope.imm_b = server('/images/'+data[n].id+'.png');
                                    $scope.old_b = data[n].id;
                                }
                                break;
                            case 2:
                                if(n === 0)$scope.risCorretta = 'c';
                                if($scope.old_c === data[n].id){
                                    $scope.imgLoad('c');                                  
                                }
                                else{
                                    $scope.radio_c = data[n].nome;
                                    $scope.imm_c = server('/images/'+data[n].id+'.png');
                                    $scope.old_c = data[n].id;
                                }
                                break;
                            case 3:
                                if(n === 0)$scope.risCorretta = 'd';
                                if($scope.old_d === data[n].id){
                                    $scope.imgLoad('d');                                    
                                }
                                else{
                                    $scope.radio_d = data[n].nome;
                                    $scope.imm_d = server('/images/'+data[n].id+'.png');                                    
                                    $scope.old_d = data[n].id;
                                }
                                break;
                        }
                        x++;
                        x %= 4;
                        n++;
                        if(n === 4){
                            if($scope.nQuestion > 0) setBar($scope.nQuestion,$scope.maxQuestions);
                            esercizio.ascolti = 1;
                            break;
                        }         
                    }                 
                }           
            })
            .error(function()
            {
                var alert = $ionicPopup.confirm({
                    title: 'ListenCheck',
                    template: 'Problemi creazione quesito! Riprovare più tardi'
                });
                alert.then(function() {
                    $location.path('/Menu/menuUtente');
                });                
            });
        }
    }
    
    function setBar(n,max){
            $scope.progressB = n+"/"+max;
            $scope.progressA = (100*n)/max+'%';
    }
               
    function avvia(){ 
        var med,max;
        if(innerWidth < 530){
            max = (innerWidth-30) / 2;
        }
        else max = 250;
        med = innerWidth/2;
        var foto = $(".imm_es");
        var radio = $(".radio_es");
        radio.eq(0).css("top", 19+"px");
        radio.eq(0).css("left", med-max+"px");
        foto.eq(0).css("left", med-max-5+"px");
        foto.eq(0).css("top", 52+"px");
        radio.eq(1).css("top", 19+"px");
        radio.eq(1).css("left", med+10+"px");
        foto.eq(1).css("left", med+5+"px");    
        foto.eq(1).css("top", 52+"px");
        radio.eq(2).css("left", med-max+"px");
        radio.eq(2).css("top", max+53+"px");
        foto.eq(2).css("top", max+86+"px");
        foto.eq(2).css("left", med-max-5+"px");
        radio.eq(3).css("left", med+10+"px");
        radio.eq(3).css("top", max+53+"px");
        foto.eq(3).css("top", max+86+"px");
        foto.eq(3).css("left", med+5+"px");

        for (var i = 0; i < foto.length; i++) {
            foto.eq(i).css({ width: max+"px", height: max+"px"});
            radio.eq(i).css("width", max-5+"px");        
        }
        $("#esercitazione-controlla").css("top", max*2+110+"px");
        $("#esercitazione-continua").css("top", max*2+110+"px");
        $("#esercitazione-riepilogo").css("top", max*2+110+"px");
        mostra(1);
        $("#suono").get(0).play(); 
    }
    
    function on(selezione){
        $("#radio_"+selezione).css("color","#0F71DE"); 
        $("#imm_"+selezione).addClass('imm_on').removeClass('imm_off');             
    }    
    function off(){
        $("#radio_"+$scope.scelta).css("color","black"); 
        $("#imm_"+$scope.scelta).addClass('imm_off').removeClass('imm_on');              
    }
    
    $scope.controlla=function(){
        var esito;
        if($scope.scelta != undefined){
            $scope.disabledButtonA = 1;
            if($scope.scelta === $scope.risCorretta)
            {
                $("#si").get(0).play();                
                setBar($scope.nQuestion+1,$scope.maxQuestions);
                esito = 1;
                manipola(1,esito);
            }else 
            {
                $("#no").get(0).play();
                setBar($scope.nQuestion+1,$scope.maxQuestions);
                esito = 0;
                manipola(1,esito);
            }            
            var parameter = JSON.stringify({id_esercitazione: esercizio.idEsercitazione, id_suono: $scope.id, ascolti: esercizio.ascolti, esito: esito});
            $http.post(server('/esercitazione/salvaQuesito'), parameter)
            .success(function(data, status, headers, config){
                var quesito = {id: $scope.id, nome: $scope.nome, ascolti: esercizio.ascolti, esito: esito};
                esercizio.addRis(quesito);
                $scope.showButtonA = 0;
                if(esercizio.elencoRis.length > $scope.maxQuestions)
                {
                    $scope.getQuesito(); 
                }
                else if(esercizio.elencoRis.length === $scope.maxQuestions)
                {
                    $scope.fine = 0;
                    $scope.showButtonC = 1;
                    $scope.getQuesito();
                }                               
            })
            .error(function()
            {
                var alert = $ionicPopup.confirm({
                    title: 'ListenCheck',
                    template: 'Problemi con il Server! Riprovare più tardi'
                });
                alert.then(function() {
                    $location.path('/Menu/menuUtente');
                }); 
            });            
        }        
    }
    
    function manipola(showFeedback,esito){
        if(showFeedback)
        {
            $scope.selettori = 1;
            if(esito)
            {
                $("#radio_"+$scope.scelta).css("color","#0FC912");
                $("#imm_"+$scope.scelta).addClass('imm_true').removeClass('imm_on');
                $scope.play_Feedback = 'feedback_true ion-thumbsup';
            }
            else
            {
                $("#radio_"+$scope.scelta).css("color","#DE1414");
                $("#imm_"+$scope.scelta).addClass('imm_false').removeClass('imm_on');
                $("#radio_"+$scope.risCorretta).css("color","#0FC912");
                $("#imm_"+$scope.risCorretta).addClass('imm_true').removeClass('imm_off');
                $scope.play_Feedback = 'feedback_false ion-thumbsdown';
            }
        }
        else
        {
            $scope.scelta = null;
            $scope.selettori = 0;
            $scope.play_Feedback = 'ion-play';
            $("h4 + img").removeClass('imm_true').removeClass('imm_false').addClass('imm_off');
            $("h4").css("color","black");
            $scope.disabledButtonA = 1;
            $scope.showButtonA = 1;
            $("#play").addClass("play_on").removeClass("play_off");          
            $("#play :first-child").css("font-size","24px");
        }
    }
    
    $scope.seleziona = function(selezione){
        if($scope.scelta === selezione)return;
        on(selezione);
        if(($scope.scelta != undefined)&&($scope.scelta != null)) off();
        $scope.scelta = selezione;
    }

    $scope.riproduci = function() {
        if($scope.play_Feedback === 'ion-play'){
            if($("#suono").prop('ended')){
                $("#suono").get(0).play();
                $scope.disabledButtonA = 1;
                esercizio.ascolti++;
                $("#play").addClass("play_on").removeClass("play_off");
                $("#play :first-child").css("font-size","24px");
            }            
        }        
    }
    
   $scope.fineRiproduzione = function() {
        $scope.disabledButtonA = 0;        
        $("#play").addClass("play_off").removeClass("play_on");
        $("#play :first-child").css("font-size",'33px');
    }
    
    $scope.imgLoad = function(x) {
        switch (x) {
            case 'a':
                $scope.load_A = 1;
                break;
            case 'b':
                $scope.load_B = 1;
                break;
            case 'c':
                $scope.load_C = 1;
                break;
            case 'd':
                $scope.load_D = 1;
                break;
        }
        if($scope.load_A && $scope.load_B && $scope.load_C && $scope.load_D) avvia();           
    }
    
    function mostra(x){
        if(x) {
            $scope.showLoading = 0;
            $scope.showQuesito = 1;
            $scope.showButtons = 1;
        } else
        {
            $scope.showButtons = 0;
            $scope.showQuesito = 0;
            $scope.showLoading = 1;            
        }        
    }
    
    $scope.chiudi = function(getRiepilogo) {
        var fase;
        /* fase
         *      0: Esercitazione non iniziata
         *      1: Esercitazione sospesa
         *      2: Esercitazione terminata 
         */
        
        if(esercizio.elencoRis.length === 0) fase = 0;
        else if (esercizio.elencoRis.length === $scope.maxQuestions) fase = 2;
        else fase = 1;
        if(fase == 1){
            $scope.confirm();             
        }             
        else
        {
            sospendiEsercitazione(fase,getRiepilogo);
        }                 
    }
    
    function sospendiEsercitazione(fase,getRiepilogo){
        var parameter = JSON.stringify({account: $cookies.getObject('account').email, id_esercitazione: esercizio.idEsercitazione, fase: fase});            
            $http.post(server('/esercitazione/chiudi'), parameter)
            .success(function(data, status, headers, config){
                if(getRiepilogo){
                    $location.path('riepilogoEsercitazione');
                }else{
                    $location.path('/Menu/menuUtente');
                }                      
            })
            .error(function()
            {
                var alert = $ionicPopup.confirm({
                    title: 'ListenCheck',
                    template: 'Problemi terminazione Esercitazione! Riprovare più tardi'
                });
                alert.then(function() {
                    $location.path('/Menu/menuUtente');
                }); 
            });          
    }
    
    $scope.confirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Esercitazione',
            template: 'Sei sicuro di voler interrompere l\'esercitazione?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                sospendiEsercitazione(1,0);
            }
        });
    }
    
    $scope.risolviAnomalia = function() {       
        var alertPopup = $ionicPopup.alert({
            title: 'Anomalia Esercitazione',
            template: "Esercitazione condotta in modo anomalo"
        });
        
        alertPopup.then(function(res) {
            var email = $cookies.getObject('account').email;
            var parameter = JSON.stringify({account: email, idEsercitazione: esercizio.idEsercitazione});
            $http.post(server('/esercitazione/anomalia'), parameter)
            .success(function(data, status, headers, config){
                $location.path('/Menu/menuUtente');   
            })
            .error(function()
            {
                var alert = $ionicPopup.confirm({
                    title: 'ListenCheck',
                    template: 'Problemi con il Server! Riprovare più tardi'
                });
                alert.then(function() {
                    $location.path('/Menu/menuUtente');
                }); 
            });
        });       
    }

}])

.controller('riepilogoEsercitazioneCtrl', ['esercizio', 'server', '$scope', '$stateParams', '$sce',
function (esercizio, server, $scope, $stateParams, $sce) {
    $scope.inRiproduzione = null;
    $scope.visualizza = 0;
   
    $scope.riepiloga = function() {
        if(esercizio.exe.decibel == null){
            $scope.tipologia = 'Frequenza: '+esercizio.exe.frequenza.replace("_", " - ");
        }else {
            $scope.tipologia = 'Decibel: '+esercizio.exe.decibel.replace("_", " - ");
        }
        for(var i=0; i < esercizio.elencoRis.length; i++){
            switch (i) {
                case 0:
                    $scope.s1 = $sce.trustAsResourceUrl(server('/sounds/'+esercizio.elencoRis[i].id+'.mp3'));
                    $scope.f1 = server('/images/'+esercizio.elencoRis[i].id+'.png');                                    
                    break;
                case 1:
                    $scope.s2 = $sce.trustAsResourceUrl(server('/sounds/'+esercizio.elencoRis[i].id+'.mp3'));
                    $scope.f2 = server('/images/'+esercizio.elencoRis[i].id+'.png');                    
                    break;
                case 2:
                    $scope.s3 = $sce.trustAsResourceUrl(server('/sounds/'+esercizio.elencoRis[i].id+'.mp3'));
                    $scope.f3 = server('/images/'+esercizio.elencoRis[i].id+'.png');                   
                    break;
                case 3:
                    $scope.s4 = $sce.trustAsResourceUrl(server('/sounds/'+esercizio.elencoRis[i].id+'.mp3'));
                    $scope.f4 = server('/images/'+esercizio.elencoRis[i].id+'.png');                    
                    break;
                case 4:
                    $scope.s5 = $sce.trustAsResourceUrl(server('/sounds/'+esercizio.elencoRis[i].id+'.mp3'));
                    $scope.f5 = server('/images/'+esercizio.elencoRis[i].id+'.png');                    
                    break;
            }
            var n = i + 1;
            $("#riepilogo > a:nth-of-type("+n+") > p").html(n+": "+esercizio.elencoRis[i].nome);
            if(esercizio.elencoRis[i].esito === 1){
                $("#riepilogo > a:nth-of-type("+n+") > span").addClass('true ion-thumbsup');           
            }
            else {
                $("#riepilogo > a:nth-of-type("+n+") > span").addClass('false ion-thumbsdown');
            }       
        }
    }
    
    $scope.play = function(x) {
        if($scope.inRiproduzione === null){
            $("#s"+x).get(0).play(); 
            $scope.inRiproduzione = x;
        }else{
            $("#s"+$scope.inRiproduzione).get(0).pause();
            $("#s"+$scope.inRiproduzione).prop('currentTime',0);
            $("#p"+$scope.inRiproduzione).addClass("playRiepilogo_off").removeClass("playRiepilogo_on");
            $("#s"+x).get(0).play(); 
            $scope.inRiproduzione = x;
        }
        $("#p"+$scope.inRiproduzione).addClass("playRiepilogo_on").removeClass("playRiepilogo_off");
    }
    
    $scope.riproduzioneTerminata = function(){  
        $("#p"+$scope.inRiproduzione).addClass("playRiepilogo_off").removeClass("playRiepilogo_on");        
        $scope.inRiproduzione = null;
    }
    
    $scope.carica = function(x) {
        switch (x) {
            case 'f1':
                $scope.load_1 = 1;
                break;
            case 'f2':
                $scope.load_2 = 1;
                break;
            case 'f3':
                $scope.load_3 = 1;
                break;
            case 'f4':
                $scope.load_4 = 1;
                break;
            case 'f5':
                $scope.load_5 = 1;
                break;
        }
        if($scope.load_1 && $scope.load_2 && $scope.load_3 && $scope.load_4 && $scope.load_5) {
            $scope.visualizza = 1;
        }                
    }
}])
   
.controller('menuApprendimentoCtrl', ['server', 'apprendimento', '$scope', '$stateParams', '$location', '$http', '$ionicPopup',
function (server, apprendimento, $scope, $stateParams, $location, $http, $ionicPopup) {
    $scope.selezione = "";
    
    $scope.riempiSelect = function() {
        $http.post(server('/apprendimento/categorie'))
            .success(function(data, status, headers, config){
                $scope.categorie = data;                             
            })
            .error(function()
            {
                var alert = $ionicPopup.confirm({
                    title: 'ListenCheck',
                    template: 'Problemi con il Server! Riprovare più tardi'
                });
                alert.then(function() {
                    $location.path('/Menu/menuUtente');
                }); 
            });  
    }
    
    $scope.imposta = function(preferenza) {
        var option =  preferenza;
        var splitStr = option.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            if(splitStr[i] === 'e') continue;
            else
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        var scelta =  splitStr.join(' ');
        apprendimento.setCategoria(scelta);
        $location.path('apprendimento');        
    }
}])
   
.controller('apprendimentoCtrl', ['apprendimento', 'server', '$scope', '$stateParams', '$http', '$location', '$ionicPopup', '$sce',
function (apprendimento, server, $scope, $stateParams, $http, $location, $ionicPopup, $sce) {
    var med = innerWidth/2;
    $(".foto").css("left", med-124+"px");
    $("#sx").css("left", med-169+"px");
    $("#dx").css("right", med-169+"px");
    $scope.viewDecibel = 0;
    $scope.index = 0;
    $scope.mostra = 0;
    $scope.imgCarica = 0;
    $scope.prev = 1;
    $scope.next = 0;
    $scope.nomeCategoria = apprendimento.selezione;    
    
    var parameter = JSON.stringify({categoria: apprendimento.selezione.toLowerCase()});            
    $http.post(server('/apprendimento/suoniCategoria'), parameter)
        .success(function(data, status, headers, config){
            if(data === "NoSounds")
            {
                var alertPopup = $ionicPopup.alert({
                title: 'Apprendimento',
                template: "Suoni non trovati"
                });
                alertPopup.then(function(res) {
                    $location.path('/Menu/menuUtente');            
                });
            }
            else
            {   
                $scope.nSounds = data.length;
                apprendimento.setSuoni(data); 
                $scope.carica(data[0]);   
                $scope.mostra = 1;
            }                              
        })
        .error(function()
        {
            var alert = $ionicPopup.confirm({
                title: 'ListenCheck',
                template: 'Problemi con il Server! Riprovare più tardi'
            });
            alert.then(function() {
                $location.path('/Menu/menuUtente');
            });
        });      
    
    $scope.carica = function(app) {
        if($scope.index === 0)$scope.prev = 1;
        else if ($scope.index === apprendimento.suoni.length-1)$scope.next = 1;
        else{
            $scope.prev = 0;
            $scope.next = 0;            
        }
        var suono = app;
        $scope.readyImg = 0;
        $scope.readySounds = 0;
        $scope.jukebox = $sce.trustAsResourceUrl(server('/sounds/'+suono.id+'.mp3'));
        $scope.immagine = server('/images/'+suono.id+'.png');  
        $scope.nome = suono.nome;
        $scope.decibel = suono.decibel.replace("_", " - ");
        $("#view_frequenza").html(suono.frequenza.replace("_", " - "));
    }
    
    $scope.ready = function() {
        var n = $scope.index + 1;
        $scope.imgCarica = 1;
        $scope.progressA = (100*n)/$scope.nSounds+'%';
        $("#suono").get(0).play(); 
        $("#play").addClass("play_on").removeClass("play_off");
        $("#play :first-child").css("font-size","24px");
    }
    
    $scope.insertCoin = function(verso){
        if(verso === '-')
            $scope.index --;
        else
            $scope.index ++;
        $scope.imgCarica = 0;
        $scope.carica(apprendimento.suoni[$scope.index]);
    }
    
    $scope.stopRiproduzione = function(){
        $("#play").addClass("play_off").removeClass("play_on");          
        $("#play :first-child").css("font-size","33px");
    }
    
    $scope.riproduci = function() {
        if($("#suono").prop('ended')){
            $("#suono").get(0).play();
            $("#play").addClass("play_on").removeClass("play_off");
            $("#play :first-child").css("font-size","24px");
        }                    
    }
}])
   
.controller('condividiSuonoCtrl', ['server', '$scope', '$stateParams', '$cordovaCamera','$http', '$cordovaFile', '$cookies','$location','$ionicPopup',
  function (server, $scope, $stateParams, $cordovaCamera, $http, $cordovaFile, $cookies, $location, $ionicPopup)
  {	  
	var path_audio,path_img;	
        var ft = new FileTransfer();
	var audio=true;
	$scope.audioCapture=function(){
	var options = {
			limit: 1,
			duration: 10
	   };
	   
	   navigator.device.capture.captureAudio(onSuccess, onError, options);
	   
	   function onSuccess(mediaFiles) {
		  var i, len;
		  path_audio="";
		  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			 path_audio=path_audio + mediaFiles[i].fullPath;       
		  }
	   }

	   function onError(error) 
           {
               var err='Capture Error \n Error code: ' + error.code;
               
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: err
                    });
	   }
	
}
	$scope.imageCapture=function(){
	     var options = {
		  quality: 75,
		  destinationType: Camera.DestinationType.FILE_URI,
		  sourceType: Camera.PictureSourceType.CAMERA,
		  allowEdit: false,
		  targetWidth: 338,
		  targetHeight: 338,
		  encodingType: Camera.EncodingType.JPEG,
		  mediaType:Camera.PICTURE,
		  saveToPhotoAlbum: false,
                  correctOrientation: true
		};

		$cordovaCamera.getPicture(options).then(function(imageData) {
			path_img=imageData;	
		}, function(err) {
		  // error
		});
	}
	

	$scope.invia=function(){
	if(path_audio && path_img){
		  $http.post(server('/insert_datimedia'), {luogoascolto: $scope.luogoascolto ,descrizione: $scope.descrizione , email : $cookies.getObject('account').email})
                  .success(function(data)
                  {
                    ft.upload(path_audio, server('/upload_sound'), null, null);
                    ft.upload(path_img, server('/upload_image'), null, null);
                    
                    path_img="";
                    path_audio="";
                    $scope.descrizione="";
                    $scope.luogoascolto="";
                    
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Dati inviati correttamente'
                    });   
                   })
	}else
        {
            $ionicPopup.alert({
            title: 'ListenCheck',
            template: 'Seleziona un suono e associa un\'immagine'
                    });    
        }
	};

}])
   
.controller('cercaLogopedistaCtrl', ['server','$scope', '$stateParams','$http','$ionicPopup','$location','$cookies','$q','$window', 
function (server, $scope, $stateParams, $http, $ionicPopup, $location, $cookies, $q, $window) 
{
    var nome=$cookies.getObject('account').nome;
    var cognome=$cookies.getObject('account').cognome;
    var paziente=$cookies.getObject('account').email;
    var stato= $cookies.getObject('account').state;
    var tipo=$cookies.getObject('account').type;
    $scope.disassociaButton;
    $scope.persone;
    $scope.logoPersonale;
    $scope.nomeL="Nessun Terapista";
    $scope.cognomeL="";
    
    $http.post(server('/cercaLogopedista/check'), {email: paziente})
        .success(function(data)
        {
            stato=parseInt(data);
            var values={
                        "email": paziente,
                        "type": tipo,
                        "state": stato,
                        "nome": nome,
                        "cognome": cognome
                        };
            $cookies.remove('account');
            $cookies.putObject('account', values);
            if(stato === 1)
            {
                $scope.disassociaButton=false;
                var promise1=$http.post(server('/cercaLogopedista/mio'), {email:paziente});
                var promise2=$http.post(server('/cercaLogopedista'), {});
                var allpromise=$q.all([promise1,promise2]);
                allpromise.then(function(values) 
                {  
                    $scope.logoPersonale=values[0].data;
                    $scope.persone=values[1].data;
                    
                    for(var i=0; i<$scope.persone.length; i++)
                    {
                        if($scope.persone[i].email === $scope.logoPersonale)
                        {
                            $scope.nomeL=$scope.persone[i].nome;
                            $scope.cognomeL=$scope.persone[i].cognome;
                            $scope.persone.splice(i,1);
                        }
                        if($scope.persone[i].stato === 3)
                        {
                            $scope.persone.splice(i,1);
                        }
                    }
                });
            }
            else
            {
                $scope.disassociaButton=true;
                recuperaLogopedisti();
            }
        })
        .error(function()
        {
            $ionicPopup.alert({
            title: 'ListenCheck',
            template: "Problemi con il server...Riprovare più tardi"
            });
        });
            
               
    $scope.invia=function(email)
    {    
        $http.post(server('/cercaLogopedista/invia'), {email: email, nome: nome, cognome: cognome, paziente: paziente})
            .success(function(data)
            {
                if( data === "Already")
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Richiesta di collaborazione già inviata"
                    });
                }
                if(data === "Inviata")
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Richiesta inviata con successo"
                    });
                    $location.path('/Menu/menuUtente');
                }
               
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    }
    
    $scope.mostraNome=function()
    {
        return $scope.nomeL+" "+$scope.cognomeL;
    }
    function recuperaLogopedisti()
    {
        $http.post(server('/cercaLogopedista'), {})
                .success(function(data)
                {
                    $scope.persone=data;
                    for(var i=0; i<$scope.persone.length; i++)
                    {
                        if($scope.persone[i].stato === 3)
                            $scope.persone.splice(i,1);
                    }
                })
                .error(function()
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Problemi con il server...Riprovare più tardi"
                    });
                });
    }
    $scope.disassociati=function()
    {
        var confirmPopup = $ionicPopup.confirm({
            title: 'ListenCheck',
            template: 'Sei sicuro di interrompere la collaborazione?'
          });

            confirmPopup.then(function(res)
            {
                if(res) 
                {
                    $http.post(server('/cercaLogopedista/disassocia'), {paziente: paziente})
                    .success(function(data)
                    {
                        if(data === "Done")
                        {
                            var values={
                                "email": paziente,
                                "type": tipo,
                                "state": 0,
                                "nome": nome,
                                "cognome": cognome
                                };
                            $cookies.remove('account');
                            $cookies.putObject('account', values);
                            $window.location.reload();
                            $ionicPopup.alert({
                            title: 'ListenCheck',
                            template: "Disassociazione avvenuta con successo"
                            });
                            
                        }

                    })
                    .error(function()
                    {
                        $ionicPopup.alert({
                        title: 'ListenCheck',
                        template: "Problemi con il server...Riprovare più tardi"
                        });
                    });
                } 
                else 
                {
                }
            });
        
    }

}])
   
.controller('menuProgressiPazienteCtrl', ['server', '$scope', '$stateParams', '$cordovaCamera','$http', '$cordovaFile', '$cookies','$location','$ionicPopup',
  function (server, $scope, $stateParams, $cordovaCamera, $http, $cordovaFile, $cookies, $location, $ionicPopup)
  {
	var elenco =[];        
        $scope.sospesi= new Array();
	$http.post(server('/menupaziente'),{email:$cookies.getObject('account').email})
            .success(function(data)
            {
                    for(i=0;i<data.length;i++){
                        var item = {};
                        item.nome = data[i].nome ;
                        item.cognome = data[i].cognome;
                        item.email = data[i].email;
                        $scope.sospesi.push(item);
                     }
                });
	
	$scope.invia=function(sospeso){	
            var selected=[];
            selected[0]=sospeso.nome + " " + sospeso.cognome;
            selected[1]=sospeso.email;
            $cookies.putObject('selected', selected);
            $location.path('/progressiPaziente');
	}
	
}])
   
.controller('progressiPazienteCtrl', ['server', '$scope', '$stateParams', '$cordovaCamera','$http', '$cordovaFile', '$cookies','$location','$ionicPopup',
  function (server, $scope, $stateParams, $cordovaCamera, $http, $cordovaFile, $cookies, $location, $ionicPopup)
  {
	var esercitazione= [];
	var decibel, frequenza;
	var path_img;
	var scelta = $cookies.getObject('selected');
	$scope.item=scelta[0];
	
      
      $scope.init=function()
      {
          $http.post(server('/progressiPaziente'), {account: scelta[1], max: 5, min:5})
         .success(function(ris)   
	 {
             if(ris==="NoEsercitazioni")
             {
                 var alert = $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Non sono state effettuate esercitazioni per il paziente selezionato'
              });
                alert.then(function() {
                    $location.path('/menuProgressiPaziente');
                }); 
             }
             else
             {
                 $scope.names=[];
		 for (i=0; i<ris.length;i++){	
                    var x = {};
                    var data = ris[i].data.substring(0,10);
                    var mese = data.substring(5,7);
                    var giorno = data.substring(8);
                    x.data= giorno+'/'+mese+'/'+data.substring(0,4);
                    if(ris[i].tipo === 'frequenza'){
                        x.tipo = "Fr";
                    }
                    else
                    {
                        x.tipo = "Db";
                    }
                    x.fascia=  ris[i].fascia;
                    x.id= i;
                    esercitazione[i]=ris[i].quesiti;
                    $scope.names.push(x);
		}
             }
	  });
          $scope.visualizza=function(scelta){
		  scelta=parseInt(scelta);
		  $cookies.putObject('esercitazione', esercitazione[scelta]);
		  $location.path('/visualizzaProgressiPaziente');
		}
      }
      	  
	
	
}])

.controller('visualizzaProgressiPazienteCtrl', ['server', '$scope', '$stateParams', '$cordovaCamera','$http', '$cordovaFile', '$cookies','$location',
  function (server, $scope, $stateParams, $cordovaCamera, $http, $cordovaFile, $cookies, $location)
  {

		var scelta = $cookies.getObject('esercitazione');
		$scope.names=[];
		for (i=0; i<scelta.length;i++){	
			var x = {};
			x.nome= scelta[i].nome+" ";
			x.ascolti=  scelta[i].ascolti+" ";
			x.esito=  scelta[i].esito+" ";
			$scope.names.push(x);	
		}
}])

.controller('inserisciSuonoCtrl', ['server', '$scope', '$stateParams', '$cordovaCamera','$http', '$cordovaFile', '$cookies','$location', '$sce', '$ionicPopup',
  function (server, $scope, $stateParams, $cordovaCamera, $http, $cordovaFile, $cookies, $location, $sce, $ionicPopup)
  {
	  
    var decibel, frequenza;
    var path_audio,path_img;	
    var ft = new FileTransfer();
    $scope.sospesi= new Array();
    
    $http.post(server('/categorie'))
        .success(function(data){
            for(i=0;i<data.length;i++)
                {
                    var x1 = {};
                    x1.categoria = data[i].categoria;
                    x1.testo="";
                    $scope.sospesi.push(x1);
                }
    });
		 
    $scope.riproduci=function(){
	var options = {
            limit: 1,
            duration: 10
	};
		   
	navigator.device.capture.captureAudio(onSuccess, onError, options);
        
        function onSuccess(mediaFiles) {
            var i, len;
            path_audio="";
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    path_audio=path_audio + mediaFiles[i].fullPath;       
            }
        }

	function onError(error){
            var err='Capture Error \n Error code: ' + error.code;
            $ionicPopup.alert({
		title: 'ListenCheck',
		template: err
            });
	}
		
    }	
		  
    $scope.imageCapture=function(){
	var options = {
		quality: 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                targetWidth: 338,
                targetHeight: 338,
                encodingType: Camera.EncodingType.JPEG,
                mediaType:Camera.PICTURE,
                saveToPhotoAlbum: false,
                correctOrientation: true
	};

	$cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imm_a =imageData;	
            path_img=imageData;	
	}, function(err) {
		    // error
	});
    }
			
    $scope.decibel=function(sel){
	decibel=sel;
    }
    
    $scope.hasChange=function(sel){
		$scope.categoria=sel;
    }
			
    $scope.frequenza=function(sel){
	frequenza=sel;
    }
		
    $scope.Approva=function(){
      if(path_audio && path_img && $scope.nome && frequenza && decibel && $scope.categoria){
            $http.post(server('/insert_suono'), {nomesuono: $scope.nome ,descrizione: $scope.categoria, decibel: decibel, frequenza: frequenza, email : $cookies.getObject('account').email})
	 	 .success(function(data)
                    {
                        ft.upload(path_audio, server('/upload_sound'), null, null);
			ft.upload(path_img, server('/upload_image'), null, null);
			path_img="";
			path_audio="";
			$ionicPopup.alert({
                            title: 'ListenCheck',
                            template: "Suono inserito correttamente"
			});
			$location.path("/menuGestioneCommunity");
            })				
	}else{
	     $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Compila tutti i campi e associa l'audio e l'immagine"
		 });
	  }
    }			
		
}])
   
.controller('registrazioneUtenteCtrl', ['server', 'checkValue', 'capitalize', 'registrazione', '$scope', '$stateParams', '$http', '$ionicPopup','$location',
function (server, checkvalue, capitalize, registrazione, $scope, $stateParams, $http, $ionicPopup, $location) 
{
    //espressioni regolari per validare la form
    $scope.reCF=/^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$/;
    $scope.rePass=/(?=.*\d)(?=.*[a-zA-Z]).{8,}/;
    
    //permette di realizzare il two binding per usare successivamente i valori della data
    $scope.dataN= { value: new Date()};
    $scope.sesso="m";
    
    //variabile per abilitare/disabilitare il tasto registrati in base al valore dell'email
    $scope.button=true;
    
    $scope.cf="";
    $scope.nomeGenitore="";
    $scope.cognomeGenitore="";
        
    $scope.checkemail= function()
    {
        $http.post(server('/registrazioneUtente/check'), {email: $scope.email})
            .success(function(data)
            {
                if(data === "NoMatch")
                {
                    $scope.button=false;
                }
                else if(data === "Match")
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Email già utilizzata'
                    });
                }
            })
            .error(function()
            {
                $scope.button=true;
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    };

    //funzione per validare i vari campi della form e verificare le corrispondenze tra i campi che devono combaciare
    function isValidForm()
    {
        valid=true;
        errore="Tutti i campi sono obbligatori <br>";
        flag=false;
        
        //validazione della form
        if (!checkvalue($scope.email,$scope.emailConferma))
        {
            errore= errore+"-- Email e Reinserisci Email non coincidono  <br>";
            flag=true;
        }
        if (!checkvalue($scope.password,$scope.passwordconferma))
        {
            errore= errore+"-- Le due password non coincidono <br>";
            flag=true;
        }
        if($scope.registrazione.$pristine || flag || $scope.registrazione.$invalid)
        {
            valid=false; 
            if($scope.registrazione.pw.$invalid)
            {
                errore= errore+"-- La password deve contenere almeno 8 caratteri, di cui almeno un numero e una lettera";
            }
            if($scope.registrazione.cf.$invalid)
            {
                errore= errore+"-- Il formato del codice fiscale non è corretto <br>";
            }
            if($scope.registrazione.tel.$invalid)
            {
                errore= errore+"-- Il formato del numero del telefono non è corretto <br>";
            }
                $ionicPopup.alert({
                title: 'Errore Compilazione',
                template: errore
                });
        }
        return valid;
    };
    
    $scope.ottieniCodice=function()
    {
        if(isValidForm())
        {
            
            //preparazione della richiesta 
            var data=$scope.dataN.value.toISOString().substring(0,10);
            $scope.utente={email: $scope.email.toLowerCase(), password:$scope.password, nome: capitalize($scope.nome), cognome: capitalize($scope.cognome), sesso: $scope.sesso, dataDiNascita: data, tipo: 'U', stato: '0', p_iva: null, telefono: $scope.telefono,cf: $scope.cf.toUpperCase(),id_genitore: null, citta: capitalize($scope.citta), es_sospesa: null};
            //memorizzo localmente tutti i valori relativi all'utente
            registrazione.setUtente($scope.utente);
            
            //controllo se l'utente è minorenne e aggiungo le info relative al genitore
            if($scope.minorenne)
            {
               $scope.genitore={nome: $scope.nomeGenitore, cognome: $scope.cognomeGenitore};
               //memorizzo localmente le informazioni relative al genitore
               registrazione.setGenitore($scope.genitore);
            }
            $http.post(server('/registrazioneUtente/codice'), {email: $scope.email.toLowerCase()})
            .success(function(data)
            {
                //memorizzo localmente il codice di verifica ricevuto dal server
                registrazione.setCodice(data.codice);
                //ridiriggo l'utente alla pagina per l'inserimento del codice di verifica
                $location.path('/codiceVerifica');
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
            
        }
    };
}])
   
.controller('recuperaPasswordCtrl', ['server','$scope', '$stateParams','$http', '$ionicPopup',
function (server,$scope, $stateParams, $http, $ionicPopup) 
{
    $scope.recupera= function()
    {
        $http.post(server('/recuperaPassword'), {email: $scope.email.toLowerCase()})
            .success(function(data)
            {
                if(data === "NoMatch")
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Non esiste un account associato all\'email inserita.'
                    });
                }
                else if(data === "Inviata")
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Password inviata'
                    });
                }
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    };

}])
   
.controller('registrazioneLogopedistaCtrl', ['server','checkValue','$scope', '$stateParams','$http','$ionicPopup','$location', 
function (server, checkvalue, $scope, $stateParams, $http, $ionicPopup, $location) 
{
    //variabile per abilitare/disabilitare il tasto registrati in base al valore dell'email
    $scope.button=true;
    $scope.sesso="m";
    
    $scope.checkemail= function()
    {
        $http.post(server('/registrazioneLogopedista/check'), {email: $scope.email})
            .success(function(data)
            {
                if(data === "NoMatch")
                {
                    $scope.button=false;
                }
                else if(data === "Match")
                {
                    $scope.button=true;
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Email già utilizzata'
                    });
                }
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
    };
    $scope.invia=function()
    {
        //controllo per rendere l'alert bloccante
        if(isValidForm())
        {
            
           //preparazione della richiesta 
            var data=$scope.dataN.value.toISOString().substring(0,10);
            $scope.password=Math.round(Math.random() * 999999 + 1);
            //$scope.utente={nome: $scope.nome, cognome: $scope.cognome, dataN: data, cf: $scope.cf, citta: $scope.citta, telefono: $scope.telefono, sesso: $scope.sesso, email: $scope.email, password:$scope.password};
            $scope.utente={email: $scope.email.toLowerCase(), password:$scope.password, nome: $scope.nome, cognome: $scope.cognome,sesso: $scope.sesso, dataDiNascita: data, tipo: 'L', stato: '0', p_iva: $scope.p_iva, telefono: $scope.telefono, cf: "", id_genitore: null, citta: $scope.citta, es_sospesa: null};
            
            $http.post(server('/registrazioneLogopedista'), {utente: $scope.utente})
            .success(function(data)
            {
                if(data === "Registrazione avvenuta con successo")
                {
                    var alertPopup = $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: data
                });

                alertPopup.then(function(res) 
                {
                    $location.path('/Menu/menuAdmin');
                });
                }
                else 
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: "Problemi con la registrazione. Riprovare più tardi"
                });
                }  
            })
            .error(function()
            {
                $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Problemi con il server...Riprovare più tardi"
                });
            });
        }
    };
    function isValidForm()
    {
        valid=true;
        errore="Tutti i campi sono obbligatori <br>";
        flag=false;
        
        //validazione della form
        if (!checkvalue($scope.email,$scope.emailConferma))
        {
            errore= errore+"-- Email e Reinserisci Email non coincidono  <br>";
            flag=true;
        }
        if (!checkvalue($scope.password,$scope.passwordconferma))
        {
            errore= errore+"-- Le due password non coincidono <br>";
            flag=true;
        }
        if($scope.registrazione.$pristine || $scope.flag || $scope.registrazione.$invalid)
        {
            valid=false;      
            if($scope.registrazione.p_iva.$invalid)
            {
                errore= errore+"-- Il formato della partita iva non è corretto <br>";
            }
            if($scope.registrazione.tel.$invalid)
            {
                errore= errore+"-- Il formato del numero del telefono non è corretto <br>";
            }
                $ionicPopup.alert({
                title: 'Errore Compilazione',
                template: errore
                });
        }
        return valid;
    }

}])
   
.controller('menuGestioneCommunityCtrl', ['server', '$scope', '$stateParams', '$cordovaCamera','$http', '$cordovaFile', '$cookies','$location','$ionicPopup',
  function (server, $scope, $stateParams, $cordovaCamera, $http, $cordovaFile, $cookies, $location, $ionicPopup)
  {
    $scope.sospesi= new Array();
    $http.post(server('/menucommunity/files'))
	  .success(function(data)
	    {
                for(i=0;i<data.length;i++){
                    var item = {};
                    item.id = data[i].id;
                    item.nome = data[i].nome;
                    $scope.sospesi.push(item);
            }
			
    });
				
    $scope.cercasuono=function(data){
        var c=data.id;
	$cookies.putObject('selected', data.id);
	$location.path('/gestioneCommunity');
    }
		
    $scope.inseriscisuono=function(){
        $location.path('/inserisciSuono');
    }	
}])

.controller('gestioneCommunityCtrl', ['server', '$scope', '$stateParams', '$cordovaCamera','$http', '$cordovaFile', '$cookies','$location', '$sce', '$ionicPopup',
  function (server, $scope, $stateParams, $cordovaCamera, $http, $cordovaFile, $cookies, $location, $sce, $ionicPopup)
  {		
    var ft = new FileTransfer();
    var decibel, frequenza;
    var scelta = $cookies.getObject('selected');
    $scope.sospesi= new Array();
  
    $http.post(server('/categorie'))
        .success(function(data){
            for(i=0;i<data.length;i++)
                {
                    var x1 = {};
                    x1.categoria = data[i].categoria;
                    x1.testo="";
                    $scope.sospesi.push(x1);
                }
    });
      
	
    $http.post(server('/menucommunity/esiste'),{file:scelta}).success(function(data){
        if(data === "SI"){
            $http.post(server('/menucommunity/files'))
                .success(function(data)
                    {
                        for(i=0;i<data.length;i++){
                            if(scelta==data[i].id){
                                $scope.nome=data[i].nome;
                                var x1 = {};
                                x1.categoria = data[i].categoria;
                                x1.testo="- Inserito dall'utente";
                                $scope.sospesi.push(x1);
                                $scope.imm_a = $sce.trustAsResourceUrl(server('/images/'+scelta+'.png'));
                                $scope.imm_b = $sce.trustAsResourceUrl(server('/sounds/'+scelta+'.mp3'));
                                break;
                            }
                        }
                    });
            }
        else
        {
            $ionicPopup.alert({
                title: 'ListenCheck',
                template: 'E\' necessario modificare il suono manualmente e collocarlo nella cartella Sound'
            });
            $location.path("/menuGestioneCommunity");
        }                                                        
    });	  

    $scope.riproduci=function(){
		var x = document.getElementById("myAudio"); 
		x.play();               
    }
		
    $scope.decibel=function(sel){
		decibel=sel;
    }
		
    $scope.frequenza=function(sel){
		frequenza=sel;
    }
        
    $scope.hasChange=function(sel){
		$scope.categoria=sel;
    }
	  	
    $scope.Approva=function(){
        $http.post(server('/update_suono'), {nomesuono: $scope.nome ,descrizione: $scope.categoria, decibel: decibel, frequenza: frequenza, scelta: scelta})
            .success(function(data)
                {                
                    var alert = $ionicPopup.alert({
						title: 'ListenCheck',
						template: 'Suono inserito'
                    });
                    alert.then(function() {
                        $location.path('/menuGestioneCommunity');
                    }); 
                        
                });
    }
		   
    $scope.Rifiuta=function(){
        $http.post(server('/delete_all'), {id: scelta})
			
                var alert = $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Suono Eliminato'
                });
                alert.then(function() {
                    $location.path('/menuGestioneCommunity');
                });
            
	}
		
}])

.controller('profiloLogopedistaCtrl', ['server','checkValue', 'capitalize', '$scope', '$stateParams','$http','$cookies','$ionicPopup','$location', 
function (server, checkvalue, capitalize, $scope, $stateParams, $http, $cookies, $ionicPopup, $location) 
{
    //metodo per recuperare i cookies
    var oggettoAccount=$cookies.getObject('account');
     
    $scope.rePass=/(?=.*\d)(?=.*[a-zA-Z]).{8,}/;
    $scope.email= oggettoAccount.email;
    $scope.password="";
    $scope.passwordconferma="";
    $scope.noPiva=true;
    $scope.flag=true;
    
    if(oggettoAccount.type === "A")
    {
        $scope.noPiva=false;
        $scope.flag=false;
    }
        
        
    $http.post(server('/profiloLogopedista'), {email: $scope.email})
            .success(function(data)
            {
                $scope.nome=data.nome;
                $scope.cognome=data.cognome;
                $scope.dataN=new Date(data.data);
                $scope.sesso=data.sesso;
                $scope.piva=data.piva;
                $scope.telefono=data.telefono;
                $scope.citta=data.citta;
                $scope.pass=data.pass;
            })
             .error(function()
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Problemi con il server...Riprovare più tardi'
                    });
                });
    $scope.salva=function()
    {
        if(isValidForm())
        {
            //scorciatoia per garantire simmetrie tra le date lato client e server
            //sul server infatti viene registrata con un giorno in meno
            var data= new Date($scope.dataN);
            data.setDate(data.getDate()+1);
            
            if($scope.password !== "" ) 
            {
                $scope.pass=$scope.password;
            }
            $http.post(server('/profiloLogopedista/update'), {email: $scope.email, nome: capitalize($scope.nome), cognome: capitalize($scope.cognome), data: data, sesso: $scope.sesso, piva: $scope.piva, telefono: $scope.telefono, citta: capitalize($scope.citta), pass: $scope.pass})
            .success(function(data)
            {
                if(data === 'Done')
                {
                    $ionicPopup.alert({
                    title: 'Listen Check',
                    template: 'Modifiche avvenute con successo'
                    });
                    $location.path('/Menu/menuLogopedista');
                }
                                 
             })
             .error(function()
                {
                    $ionicPopup.alert({
                    title: 'ListenCheck',
                    template: 'Problemi con il server...Riprovare più tardi'
                    });
                });
        }
    }
    
    function isValidForm()
    {
        valid=true;
        errore="";
        flag=false;
        
        
        if($scope.profilo.$pristine) 
        {
            $location.path('/Menu/menuLogopedista');
        }
        else 
        {
            //validazione della form
            if (!checkvalue($scope.password,$scope.passwordconferma))
            {
                errore= errore+"-- Le due password non coincidono <br>";
                flag=true;
            }
            if($scope.profilo.piva.$invalid)
            {
                errore= errore+"-- Il formato della partita iva non è corretto <br>";
                flag=true;
            }
            if($scope.profilo.tel.$invalid)
            {
                errore= errore+"-- Il formato del numero del telefono non è corretto <br>";
                flag=true;
            }
            if($scope.profilo.$invalid && $scope.password !== "")
            {
                errore= errore+"-- La password deve contenere almeno 8 caratteri, di cui almeno un numero e una lettera";
                flag=true;
            }
            if (flag)
            {
                valid=false;         
                $ionicPopup.alert({
                 title: 'Errore Compilazione',
                 template: errore
                 });
            }
            return valid;
        }
    }
}])
.controller('codiceVerificaCtrl', ['server', 'registrazione', '$scope', '$stateParams', '$http', '$ionicPopup', '$location',
function (server, registrazione, $scope, $stateParams, $http, $ionicPopup, $location) 
{    
    $scope.flag=false;
        $scope.invia=function()
        {
            if(isValidCodeForm())
            {
                $scope.flag=true;
                //recupero le informazioni memorizzate relative all'utente
                $scope.utente=registrazione.getUtente();
                $scope.genitore=registrazione.getGenitore();
                $scope.codiceB= registrazione.getCodice();
                                
                if($scope.codiceB === $scope.codice)
                {
                     $http.post(server('/registrazioneUtente'), {utente: $scope.utente, genitore: $scope.genitore})          
                    .success(function(data)
                    {
                        if(data === "Registrazione avvenuta con successo")
                        {
                            var alertPopup = $ionicPopup.alert({
                            title: 'ListenCheck',
                            template: data
                        });

                        alertPopup.then(function(res) 
                        {
                            registrazione.reset();
                            $location.path('/login');
                        });
                        }
                    })
                    .error(function()
                    {
                        $ionicPopup.alert({
                        title: 'ListenCheck',
                        template: "Problemi con il server...Riprovare più tardi"
                        });
                    });    
                }
                else 
                {
                    $ionicPopup.alert({
                        title: 'ListenCheck',
                        template: "Il codice inserito non è corretto. Riprovare."
                    });
                }                 
            } 
        }; 
    //verifico che l'utente abbia inserito il codice di verifica
    function isValidCodeForm()
    {
        if($scope.codiceVerifica.$invalid)
        {
            $ionicPopup.alert({
                title: 'ListenCheck',
                template: "Il codice di verifica deve essere di 6 cifre"
                });
            return false;
        }
        else return true;
    };

}]);
