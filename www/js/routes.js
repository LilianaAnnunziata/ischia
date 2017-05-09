angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.cercaPercorso', {
    url: '/cercaPercorso',
    views: {
      'tab1': {
        templateUrl: 'templates/cercaPercorso.html',
        controller: 'cercaPercorsoCtrl'
      }
    }
  })

  .state('percorso', {
    url: '/percorso',
    templateUrl: 'templates/percorso.html',
    controller: 'percorsoCtrl'
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.home'
      2) Using $state.go programatically:
        $state.go('tabsController.home');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab3/home
      /page1/tab1/home
  */
  .state('tabsController.home', {
    url: '/home',
    views: {
      'tab3': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      },
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('iMieiPercorsi', {
    url: '/mieiPercorsi',
    templateUrl: 'templates/iMieiPercorsi.html',
    controller: 'iMieiPercorsiCtrl'
  })

  .state('nomePercorsoDinamico', {
    url: '/poi',
    templateUrl: 'templates/nomePercorsoDinamico.html',
    controller: 'nomePercorsoDinamicoCtrl'
  })

  .state('addPOI', {
    url: '/addPOI',
    templateUrl: 'templates/addPOI.html',
    controller: 'addPOICtrl'
  })

  .state('tabsController.cercaPercorso2', {
    url: '/cercaPercorsoText',
    views: {
      'tab2': {
        templateUrl: 'templates/cercaPercorso2.html',
        controller: 'cercaPercorso2Ctrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/tab3/home')

  

});