angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('searchPath', {
    url: '/page14',
    templateUrl: 'templates/searchPath.html',
    controller: 'searchPathCtrl'
  })

  .state('viewPOI', {
    url: '/page9',
    templateUrl: 'templates/viewPOI.html',
    controller: 'viewPOICtrl'
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('managePOI', {
    url: '/page7',
    templateUrl: 'templates/managePOI.html',
    controller: 'managePOICtrl'
  })

  .state('yourTimeline', {
    url: '/page11',
    templateUrl: 'templates/yourTimeline.html',
    controller: 'yourTimelineCtrl'
  })

  .state('addPOI', {
    url: '/page8',
    templateUrl: 'templates/addPOI.html',
    controller: 'addPOICtrl'
  })

  .state('naviga', {
    url: '/page10',
    templateUrl: 'templates/naviga.html',
    controller: 'navigaCtrl'
  })

$urlRouterProvider.otherwise('')

  

});