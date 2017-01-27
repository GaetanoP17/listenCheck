angular.module('app.controllers', [])
  
.controller('menuAdminCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuLogopedistaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuUtenteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('profiloUtenteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('disassociaLogoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('gestioneCollaborazioniCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('side-menu21Ctrl', ['$scope', '$stateParams', '$cookies',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cookies) 
{
    $scope.mostraNome=function()
    {
        
        return $cookies.getObject('account').email;
    };
    

}])
   
.controller('loginCtrl', ['server', '$scope', '$stateParams', '$http', '$cookies','$location',
  function (server, $scope, $stateParams, $http, $cookies, $location)
  {
    $scope.invia=function()
    {
      $http.post(server('/login'), {email: $scope.email,password: $scope.password})
      .success(function(data)
      {
          if(data === "Nologin")
              alert("Dati di accesso errati");
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
              
              //metodo per recuperare i cookies
              //var oggettoAccount=$cookies.getObject('account');
              //alert(oggettoAccount.state);
          }  
      })
        .error(function()
      {
        alert("Problemi con il server...Riprovare più tardi");
      });
    };
  }])
   
.controller('menuEsercitazioneCtrl', ['server', 'esercizio', '$scope', '$stateParams', '$location', '$cookies', '$http', 
function (server, esercizio, $scope, $stateParams, $location, $cookies, $http) {
    
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
        alert("Problemi ripristino Esercitazione...Riprovare più tardi");
        $location.path('/Menu/menuUtente');
    });
    
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
                alert("Problemi avvio Esercitazione...Riprovare più tardi");
                $location.path('/Menu/menuUtente');
            }); 
    } 
}])

.controller('esercitazioneCtrl', ['esercizio', 'server', '$scope', '$http', '$stateParams', '$location', '$cookies', '$window', '$sce', '$ionicPopup', '$timeout',
function (esercizio, server, $scope, $http, $stateParams, $location, $cookies, $window, $sce, $ionicPopup, $timeout) {
    $scope.anomalia = 0;
    $scope.maxQuestions = 5;            
    $('#suono').prop("volume", 1.0);   
    $('#si').prop("volume", 1.0);
    $('#no').prop("volume", 1.0);
        
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
            if(esercizio.exe.decibel != null){
                parameter=JSON.stringify({tipo: "decibel", fascia: esercizio.exe.decibel, idSounds: esercizio.idSounds});
            }else {
                parameter=JSON.stringify({tipo: "frequenza", fascia: esercizio.exe.frequenza, idSounds: esercizio.idSounds});          
            }
            $http.post(server('/esercitazione/inizializza'), parameter)
            .success(function(data, status, headers, config){
                if(data === 'NoSounds'){
                    alert(" Elementi non trovati...Riprovare più tardi");
                    $location.path('/Menu/menuUtente');
                }
                else
                {
                    $scope.id = data[0].id;
                    $scope.nome = data[0].nome;
                    $scope.giubox = $sce.trustAsResourceUrl(server('/sounds/'+$scope.id+'.mp3'));
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
                alert("Problemi creazione quesito...Riprovare più tardi");
                $location.path('/Menu/menuUtente');
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
        $("#esercitazione-controlla").css("top", max*2+106+"px");
        $("#esercitazione-continua").css("top", max*2+106+"px");
        $("#esercitazione-riepilogo").css("top", max*2+106+"px");
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
                alert("Problemi con il server...Riprovare più tardi");
                $location.path('/Menu/menuUtente');
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
                alert("Problemi terminazione Esercitazione...Riprovare più tardi");
                $location.path('/Menu/menuUtente');
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
                alert("Problemi con il Server...Riprovare più tardi");
                $location.path('/Menu/menuUtente');
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
   
.controller('menuApprendimentoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('apprendimentoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('condividiSuonoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('cercaLogopedistaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuProgressiPazienteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('progressiPazienteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('registrazioneUtenteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('recuperaPasswordCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('registrazioneLogopedistaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuGestioneCommunityCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('gestioneCommunityCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 