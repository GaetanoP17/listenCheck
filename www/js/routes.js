angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

    .state('side-menu21.menuAdmin', {
      url: '/menuAdmin',
    views: {
      'side-menu21': {
        templateUrl: 'View/menuAdmin.html',
        controller: 'menuAdminCtrl'
      }
    }
  })

  .state('side-menu21.menuLogopedista', {
    url: '/menuLogopedista',
    views: {
      'side-menu21': {
        templateUrl: 'View/menuLogopedista.html',
        controller: 'menuLogopedistaCtrl'
      }
    }
  })

  .state('side-menu21.menuUtente', {
    url: '/menuUtente',
    views: {
      'side-menu21': {
        templateUrl: 'View/menuUtente.html',
        controller: 'menuUtenteCtrl'
      }
    }
  })

  .state('profiloUtente', {
    url: '/profiloUtente',
    templateUrl: 'View/profiloUtente.html',
    controller: 'profiloUtenteCtrl'
  })

  .state('disassociaLogo', {
    url: '/disassociaLogo',
    templateUrl: 'View/disassociaLogo.html',
    controller: 'disassociaLogoCtrl'
  })

  .state('gestioneCollaborazioni', {
    url: '/gestioneCollaborazioni',
    templateUrl: 'View/gestioneCollaborazioni.html',
    controller: 'gestioneCollaborazioniCtrl'
  })

  .state('side-menu21', {
    url: '/Menu',
    templateUrl: 'View/side-menu21.html',
    controller: 'side-menu21Ctrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'View/login.html',
    controller: 'loginCtrl'
  })

  .state('menuEsercitazione', {
    url: '/menuEsercitazione',
    templateUrl: 'View/menuEsercitazione.html',
    controller: 'menuEsercitazioneCtrl'
  })

  .state('esercitazione', {
    url: '/esercitazione',
    templateUrl: 'View/esercitazione.html',
    controller: 'esercitazioneCtrl'
  })
  
  .state('riepilogoEsercitazione', {
    url: '/riepilogoEsercitazione',
    templateUrl: 'View/riepilogoEsercitazione.html',
    controller: 'riepilogoEsercitazioneCtrl'
  })

  .state('menuApprendimento', {
    url: '/menuApprendimento',
    templateUrl: 'View/menuApprendimento.html',
    controller: 'menuApprendimentoCtrl'
  })

  .state('apprendimento', {
    url: '/apprendimento',
    templateUrl: 'View/apprendimento.html',
    controller: 'apprendimentoCtrl'
  })

  .state('condividiSuono', {
    url: '/condividiSuono',
    templateUrl: 'View/condividiSuono.html',
    controller: 'condividiSuonoCtrl'
  })

  .state('cercaLogopedista', {
    url: '/cercaLogopedista',
    templateUrl: 'View/cercaLogopedista.html',
    controller: 'cercaLogopedistaCtrl'
  })

  .state('menuProgressiPaziente', {
    url: '/menuProgressiPaziente',
    templateUrl: 'View/menuProgressiPaziente.html',
    controller: 'menuProgressiPazienteCtrl'
  })

  .state('progressiPaziente', {
    url: '/progressiPaziente',
    templateUrl: 'View/progressiPaziente.html',
    controller: 'progressiPazienteCtrl'
  })

  .state('registrazioneUtente', {
    url: '/registrazioneUtente',
    templateUrl: 'View/registrazioneUtente.html',
    controller: 'registrazioneUtenteCtrl'
  })

  .state('recuperaPassword', {
    url: '/recuperaPassword',
    templateUrl: 'View/recuperaPassword.html',
    controller: 'recuperaPasswordCtrl'
  })

  .state('registrazioneLogopedista', {
    url: '/registrazioneLogopedista',
    templateUrl: 'View/registrazioneLogopedista.html',
    controller: 'registrazioneLogopedistaCtrl'
  })

  .state('menuGestioneCommunity', {
    url: '/menuGestioneCommunity',
    templateUrl: 'View/menuGestioneCommunity.html',
    controller: 'menuGestioneCommunityCtrl'
  })

  .state('gestioneCommunity', {
    url: '/gestioneCommunity',
    templateUrl: 'View/gestioneCommunity.html',
    controller: 'gestioneCommunityCtrl'
  })

$urlRouterProvider.otherwise('/login');

  

});