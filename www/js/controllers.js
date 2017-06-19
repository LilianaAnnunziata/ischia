angular.module('app.controllers', [])

.controller('percorsoCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

.controller('cercaPercorsoCtrl', ['$scope', 'shareData', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, shareData) {
    //POI
        $scope.poiList = window.infoPois;
 
        /*Visualizza il percorso cercato sulla mappa*/
        $scope.visualizzaPercorso = function (path) {
          document.getElementById('range_Map').style.bottom = "7px";
          console.log("cercaP");
          //AGGIUNGERE FUNZIONE PER LA VISUALIZZAZIONE DEL PATH
          shareData.setData(path);
          $scope.closeModal()
        }

    //PERCORSI
      $scope.pathList = window.infoPaths;


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

      var difficoltaPercorso = "";

      $scope.slideChange = function (difficolta) {

        if(difficolta == 0)
          difficoltaPercorso = ""
        else if(difficolta == 1)
          difficoltaPercorso = "Turistico"
          else  if(difficolta == 2)
          difficoltaPercorso = "Escursionistico"
          else  if(difficolta == 3)
          difficoltaPercorso = "Escursionistico per esperti"

        return difficoltaPercorso;
      }

    }])

.controller('homeCtrl', ['$scope', '$ionicModal', '$http', '$window',
  '$ionicPopup', 'dati','posizionaPunto','Layer','shareData', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope,$ionicModal,$http,$window,$ionicPopup,dati,posizionaPunto,Layer,shareData) {
    dati.setInfo($http,$ionicPopup,$window);
    var map,view,vectorLayer,layer,geosec, feature;

    view = new ol.View({
      center: ol.proj.fromLonLat([13.905190,40.722581]),
      zoom: 12,
      minZoom: 11,
      maxZoom: 19
    });
    // Creating the map

    var osm = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
    var bing = new ol.layer.Tile({
        source: new ol.source.BingMaps({
          key: '71rqXKbkWBsxf2MExapX~Ox5OhkC_T_uOnwVVdTvycQ~ApfQiyY8xedZ7IsN8T6QxKTCcIhFP-40NSpOGDXtVm-UifKxHWqC3OuF_d72tc46',
          imagerySet: 'AerialWithLabels'
        })
      });

     map = new ol.Map({
      layers: [osm,bing],
      target: 'map',
      controls: ol.control.defaults({
          zoom:false,
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      view: view
    });
    
    
  
    $scope.poiGeosec=function(){
        if(!geosec){
            geosec=posizionaPunto("1",'https://openlayers.org/en/v4.2.0/examples/data/icon.png');
            map.addLayer(geosec);
        }else{
            Layer.viewLayer(geosec);
        }
    }
    //nome della pagina html che viene prodotta nel modal
    $ionicModal.fromTemplateUrl('templates/cercaPercorso.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
   //Trova le feature mentre si naviga sulla mappa
   map.on('pointermove', function(evt) {
         feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                  return feature;
        })});
    
    //Visualizza informazioni poi
    map.getViewport().addEventListener("click", function(e) {
        if (feature) {
            var createPOIPopup = $ionicPopup.show({
              title: "<h4>"+feature.get('nom_poi')+"</h2>", 
              content: "<b>Coordinate punto:</b><br>"+ feature.get('coordinates')+ "<br><b>Nome percorso:<br></b>"+ feature.get('percorso')+"<br><b>Nome itinerario:<br></b>"+ feature.get('nom_itiner'),
              buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                }       
              }]
            });
        };   
    });
    
    //apertura del modal
    $scope.openModal = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.path = shareData.getData();
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

    //Dedicato allo Swipe della mappa tra i due diversi layer 
    var swipe = document.getElementById('swipe');
    bing.on('precompose', function(event) {
       var ctx = event.context;
       var width = ctx.canvas.width * (swipe.value / 100);
       ctx.save();
       ctx.beginPath();
       ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
       ctx.clip();
    });
    bing.on('postcompose', function(event) {
      var ctx = event.context;
      ctx.restore();
    });
    swipe.addEventListener('input', function() {
      map.render();
    }, false);




  //ADD POI

  $scope.newPoi={
    coordinate:"cooo"
  }

  $scope.exit = function () {
    document.getElementById('range_Map').style.bottom = "6%";
    shareData.setData(null);
    $scope.path = shareData.getData();
  }

  $scope.addPOI = function () {
    console.log(shareData.getData())

    $scope.date = {}
    $scope.showError = false;
    var createPOIPopup = $ionicPopup.show({
      scope: $scope,
      title: 'Aggiungi POI',
      subTitle: 'Inserisci le informazioni',
      templateUrl: 'templates/addPOI.html',
      buttons: [{
        text: 'Cancel',
        type: 'button-positive',
        onTap: function(e) {

        }
      }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        attr: 'data-ng-disabled="!newPoi.name"',
        onTap: function (e) {
          if (!$scope.newPoi.name) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
            $scope.submitted=true;
            console.log($scope.showError)
            $scope.showError = true;
          } else {
            //  $localStorage.myPoi = $scope.newPoi;
            // console.log($localStorage.myPoi)
            return $scope.newPoi;
          }
        }
      }]

    });
    createPOIPopup.then(function(res) {
      $scope.showError = false;
    });
  };

}])

.controller('iMieiPercorsiCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

}])

.controller('addPOICtrl', ['$scope', '$stateParams','$cordovaCamera','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, $stateParams,$cordovaCamera,$ionicPopup) {
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
