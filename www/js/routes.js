angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('cercaPercorso', {
    url: '/cercaPercorso',
    templateUrl: 'templates/cercaPercorso.html',
    controller: 'cercaPercorsoCtrl'
  })

  .state('percorso', {
    url: '/percorso',
    templateUrl: 'templates/percorso.html',
    controller: 'percorsoCtrl'
  })

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('iMieiPercorsi', {
    url: '/mieiPercorsi',
    templateUrl: 'templates/iMieiPercorsi.html',
    controller: 'iMieiPercorsiCtrl'
  })

  .state('nomePercorso', {
    url: '/poi',
    templateUrl: 'templates/nomePercorso.html',
    controller: 'nomePercorsoCtrl'
  })

  .state('addPOI', {
    url: '/addPOI',
    templateUrl: 'templates/addPOI.html',
    controller: 'addPOICtrl'
  })

$urlRouterProvider.otherwise('/home')



});
