angular.module('app.controllers', [])

.controller('percorsoCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

.controller('cercaPercorsoCtrl', ['$scope', '$stateParams','$state','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, $stateParams,$state,$ionicPopup) {
        //POI
        //DA SOSTITUIRE CON INFOPOIS

        $scope.poiList = window.infoPois;
console.log($scope.infoPois)
      $scope.cercaPercorso = function () {

      }

      //PERCORSI
      $scope.pathList = window.infoPaths;
      console.log($scope.pathList)
    //DA SOSTITUIRE CON LA LISTA DEI PERCORSI


      $scope.myPathList =[{
        namePath : "dasdas",
        namePOI :"ssadsads",
        description :" RREre"
      }];
      $scope.goToMyPersonalPath = function (path) {
        console.log("search")
      };

      $scope.deletePath = function (path) {
        console.log("del")
        console.log(path)
      };
      $scope.editPath = function (path) {
        console.log("edit")
      };

      $scope.slideChange = function (difficoltaPercorso) {
        ;
        console.log(difficoltaPercorso)
      }



      //ADD POI DA SPOSTARE
      $scope.newPoi={
        coordinate:"cooo"
      }
      $scope.addPoi = function () {
        var alertPopup = $ionicPopup.show({
          scope: $scope,
          title: 'Aggiungi POI',
          subTitle: 'Inserisci le informazioni',
          templateUrl: 'templates/addPOI.html',
          buttons: [{
            text: 'Cancel',
            type: 'button-positive',
            onTap: function(e) {
return true;
            }
          }, {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (e) {
return false;
              var newPoi = $scope.newPoi;
console.log($scope.newPoi)
              if (newPoi.name && $scope.imgURI) {

                var description = newPoi.description;
                if (!description)
                  description = "";

                var objToSave = {
                  name: newPoi.name,
                  description: description,
                  coordinate:newPoi.coordinate
                };

                console.log(objToSave);
              }
             }
          }]
        });
      };


    }])

.controller('homeCtrl', ['$scope', '$ionicModal', '$http', '$window', '$ionicPopup', 'dati', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope,$ionicModal,$http,$window,$ionicPopup,dati) {
    dati.setInfo($http,$ionicPopup,$window);

    //nome della pagina html che viene prodotta nel modal
    $ionicModal.fromTemplateUrl('templates/cercaPercorso.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function(modal) {
        $scope.modal = modal;
    });

    //apertura del modal
    $scope.openModal = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    })
}])

.controller('iMieiPercorsiCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

}])

.controller('addPOICtrl', ['$scope', '$stateParams','$cordovaCamera','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, $stateParams,$cordovaCamera,$ionicPopup) {

        console.log("addPoi")
          var newPoi = $scope.newPoi;
          console.log(newPoi)
        /*  $scope.savePOI = function (newPoi) {
            console.log("B")

            if ($scope.addPoiForm.$valid && $scope.imgURI) {

             var description = newPoi.description;
              if (!description)
                description = "";

              var objToSave = {
                name: newPoi.name,
                description: description,
                coordinate:newPoi.coordinate
              };

              console.log(objToSave);
            }
            else
              $ionicPopup.alert({
                title: 'Error',
                template: 'Input not valid'
              });
          };*/

        $scope.choosePhoto = function () {
            var imgRect = document.getElementById("addPoiId").getBoundingClientRect();
            console.log("rect= " + imgRect.width + " " + imgRect.height + " " + imgRect.bottom + " " + imgRect.left);
            var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
            var options = setOptionsCamera(srcType, imgRect.width, imgRect.height);

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                $scope.imgURI = "data:image/jpeg;base64," + imageURI;
            },function (err) {
                console.log("error createSharedEventCtrl: " + err);
            });
        }

        $scope.takePhoto = function () {
            $cordovaCamera.getPicture(setOptionsCamera(Camera.PictureSourceType.CAMERA)).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                console.log("error eventInfoCtrl " + err)
            });
        };
}])
