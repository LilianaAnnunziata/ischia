angular.module('app.controllers', [])

.controller('percorsoCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

.controller('cercaPercorsoCtrl', ['$scope', 'shareData','Layer', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    function ($scope, shareData,Layer) {
    //POI
    $scope.poiList = window.infoPois;

    $scope.visualizzaPOI = function (poi,personal,difficolta) {

      var poiArr;
      if(!personal) {
        poiArr = new Array();
        poiArr.push(poi);
      }else
        poiArr = poi;
    //  console.log(poi.percorso)

      var myPathListArray = window.infoPaths;
      myPathListArray.forEach(function (path) {
        if (path.percorso == poi.percorso && path.tipo_perc == difficolta) {
          console.log(poi.percorso)
          $scope.visualizzaPercorso(path, path.tipo_perc)
        }
      })
      var geosec = Layer.posizionaPunto(poiArr,'https://openlayers.org/en/v4.2.0/examples/data/icon.png');
      map.addLayer(geosec);
      //shareData.setData(poi);
      $scope.closeModal()
    }

    //PERCORSI
    $scope.pathList = window.infoPaths;
    /*Visualizza il percorso cercato sulla mappa*/
    $scope.visualizzaPercorso = function (path,difficolta) {
      document.getElementById('range_Map').style.bottom = "7px";
      //console.log("visualizzaPercorso");
      var geosec = Layer.lineLayer(path.coordinates,difficolta);
      map.addLayer(geosec);
      //AGGIUNGERE FUNZIONE PER LA VISUALIZZAZIONE DEL PATH
      //shareData.setData(path);
      $scope.closeModal()
    }


    $scope.visualizzaIMieiPercorsi = function () {
      var myPathLocalStorage = JSON.parse(localStorage.getItem('personalPOI'));
      if(myPathLocalStorage){
        var obj;
        var myPathListArray = new Array();
        myPathLocalStorage.forEach(function (path) {
          console.log(path)
          obj = {
            id:path.id,
            percorso:path.POIs[0].percorso,
            tipo_perc:path.POIs[0].tipo_perc,
            num_poi_add: path.POIs.length,
            POIs:path.POIs
          }
          myPathListArray.push(obj)
        });
        $scope.myPathList = myPathListArray;
      }else{
        $scope.myPathList = new Array();
      }
    }

    /*visualizza sulla mappa il percorso con i propri poi*/
      $scope.goToMyPersonalPath = function (p) {
        var pathPersonal = JSON.parse(p)
        console.log(pathPersonal)

        window.infoPaths.forEach(function (path) {
          if(path.id == pathPersonal.id){
            console.log(path.tipo_perc)
            $scope.visualizzaPercorso(path,path.tipo_perc)

            $scope.visualizzaPOI(pathPersonal.POIs,true)
          }
        })

        $scope.closeModal()
      };

      $scope.deletePath = function () {
        console.log("del")
        //console.log(path)
      };
      $scope.editPath = function () {
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

.controller('homeCtrl', ['$scope','$ionicModal', '$http', '$window',
  '$ionicPopup', 'dati','Layer','datiJson','shareData', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
function ($scope,$ionicModal,$http,$window,
          $ionicPopup,dati,Layer,datiJson,shareData) {

  dati.setInfo($http,$ionicPopup,$window);
  datiJson.load($http);
  map;
  var view,vectorLayer,layer,poispiaggia,poigeosec,poivari,feature,
  geosec,array;

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

    //visualizza i "poi" dal sito geosec
    $scope.poiGeosec=function(){
        if(!poigeosec){
            poigeosec=Layer.posizionaPunto("1",'icon/geosec.png');
            map.addLayer(poigeosec);
        }else{
            Layer.viewLayer(poigeosec);
        }
    }

    //visualizza i "poi spiaggia" locali
    $scope.poiSpiaggia=function(){
        if(!poispiaggia){
            poispiaggia=Layer.posizionaPunto(window.myJson[0],'icon/spiaggia.png');
            map.addLayer(poispiaggia);
        }else{
            Layer.viewLayer(poispiaggia);
        }
    }

    //visualizza i "poi vari" locali
    $scope.poiVari=function(){
        if(!poivari){
            poivari=Layer.posizionaPunto(window.myJson[1],'icon/montagna.png');
            map.addLayer(poivari);
        }else{
            Layer.viewLayer(poivari);
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
        if (feature && feature.get('nom_poi')) {
            var stringa="";
            if(feature.get('nom_itiner'))
                 stringa="<br><b>Nome percorso:<br></b>"+ feature.get('percorso')+"<br><b>Nome itinerario:<br></b>"+ feature.get('nom_itiner');
            var createPOIPopup = $ionicPopup.show({
              title: "<h4>"+feature.get('nom_poi')+"</h2>",
              content: "<b>Coordinate punto:</b><br>"+ feature.get('coordinates')+ stringa,
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
    });

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
    coordinates:[13.874429,40.731345]
  }
console.log($scope.newPoi)
  $scope.exit = function () {
    document.getElementById('range_Map').style.bottom = "6%";
    shareData.setData(null);
    $scope.path = shareData.getData();
  }


  $scope.addPOI = function () {
    //informazioni del percorso selezionato
    var path = shareData.getData();

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
        attr: 'data-ng-disabled="!newPoi.nom_poi"',
        onTap: function (e) {
          if (!$scope.newPoi.nom_poi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
            $scope.submitted=true;

            $scope.showError = true;
          } else {

            //formato del localStorage:
            //localstorage[{id,POIs:[{nom_poi,coordinates:[][],...},{nom_poi,coordinates:[][],...}]}]
            var allPoiPersonalArray;//array che sarà inserito in localStorage
            var idPath = 'personalPOI';//id del local storage
            if(!localStorage.getItem(idPath)) {//se localStorage non è definito
              allPoiPersonalArray = new Array();
              //inserimento di un nuovo percorso e dei POI relativi
              allPoiPersonalArray.push(insertPOIPath(path));
            }else {//se localStorage era già definito
              allPoiPersonalArray = JSON.parse(localStorage.getItem(idPath));
              //flag per verificare se il percorso esisteva gia
              var flag = true;
              //itero su array esterno del localStorage per vedere se il path è già inserito
              allPoiPersonalArray.forEach(function (percorso) {
                if(percorso.id == path.id ){
                  //se il path esiste già allora inserisco solo i POI
                  percorso.POIs.push(insertPOI(path));
                  flag = false;
                  return;
                }
              })
              if(flag){
                //se il path non esiste allora inserisco path + OI
                allPoiPersonalArray.push(insertPOIPath(path));
              }
            }
            console.log(allPoiPersonalArray)
            //iserisco la nuova variabile modificata
            localStorage.setItem(idPath,JSON.stringify(allPoiPersonalArray));
            }
            return $scope.newPoi;
          }
      }]

    });
    createPOIPopup.then(function(res) {
      $scope.showError = false;
    });
  };

  /*funzione di supporto per creare un oggetto POI con le coordinate*/
  function insertPOI(path) {
    var objPOI= {
      nom_poi: $scope.newPoi.nom_poi,
      coordinates: [13.874429, 40.731345],
      percorso: path.percorso,
      tipo_perc: path.tipo_perc,
      description: $scope.newPoi.description
    };
    return objPOI;
  }
  /*funzione di supporto per creare un oggetto con id_Path e con l'array delle coordinate*/
  function insertPOIPath(path) {
    var poiArray = new Array();
    var infoPoi = insertPOI(path);
    poiArray.push(infoPoi);
    var objPath = {
      id: path.id,
      POIs : poiArray
    }
    return objPath;
  }

    //geolocalizzazione utente
    var geolocation = new ol.Geolocation({
        projection: view.getProjection()
      });

      geolocation.setTracking(true);

      geolocation.on('error', function(error) {
        var info = document.getElementById('info');
        info.innerHTML = error.message;
        info.style.display = '';
      });

      var accuracyFeature = new ol.Feature();
      geolocation.on('change:accuracyGeometry', function() {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      });

      var positionFeature = new ol.Feature();
      positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399CC'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      }));

      geolocation.on('change:position', function() {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ?
            new ol.geom.Point(coordinates) : null);
      });

      new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
          features: [accuracyFeature, positionFeature]
        })
      });
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
