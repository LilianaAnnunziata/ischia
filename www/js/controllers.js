angular.module('app.controllers', [])

  .controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('cercaPercorsoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('percorsoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('homeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {

      // creating the view
      var view = new ol.View({
        center: ol.proj.fromLonLat([16.282508,38.644171]),
        zoom: 5
      });
     
    /*funzione che visualizza un marker sulla mappa paramitri di input:
    x,y=coordinate
    name=nome marker
    src=icona del marker
         */
    function posizionaPunto(x,y,name,src){
        var iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([y, x], 'EPSG:4326', 'EPSG:3857')),
          name:name
        });

        var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: src
          }))
        });

        iconFeature.setStyle(iconStyle);

        var vectorSource = new ol.source.Vector({
          features: [iconFeature]
        });

        var vectorLayer = new ol.layer.Vector({
          source: vectorSource
        });
        return vectorLayer;
      }
     
    //Punto di prova
      var a= posizionaPunto(38.644171, 16.282508,"dd",'https://openlayers.org/en/v4.2.0/examples/data/icon.png');
// creating the map
      var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ,a],
        target: 'map',
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }),
        view: view
      });

// Geolocation marker
      var markerEl = document.getElementById('geolocation_marker');
      var marker = new ol.Overlay({
        positioning: 'center-center',
        element: markerEl,
        stopEvent: false
      });
      map.addOverlay(marker);

// LineString to store the different geolocation positions. This LineString
// is time aware.
// The Z dimension is actually used to store the rotation (heading).
      var positions = new ol.geom.LineString([],
        /** @type {ol.geom.GeometryLayout} */ ('XYZM'));

// Geolocation Control
      var geolocation = new ol.Geolocation(/** @type {olx.GeolocationOptions} */ ({
        projection: view.getProjection(),
        trackingOptions: {
          maximumAge: 10000,
          enableHighAccuracy: true,
          timeout: 600000
        }
      }));

      var deltaMean = 500; // the geolocation sampling period mean in ms

// Listen to position changes
      geolocation.on('change', function() {
        var position = geolocation.getPosition();
        var accuracy = geolocation.getAccuracy();
        var heading = geolocation.getHeading() || 0;
        var speed = geolocation.getSpeed() || 0;
        var m = Date.now();

        addPosition(position, heading, m, speed);

        var coords = positions.getCoordinates();
        var len = coords.length;
        if (len >= 2) {
          deltaMean = (coords[len - 1][3] - coords[0][3]) / (len - 1);
        }

        var html = [
          'Position: ' + position[0].toFixed(2) + ', ' + position[1].toFixed(2),
          'Accuracy: ' + accuracy,
          'Heading: ' + Math.round(radToDeg(heading)) + '&deg;',
          'Speed: ' + (speed * 3.6).toFixed(1) + ' km/h',
          'Delta: ' + Math.round(deltaMean) + 'ms'
        ].join('<br />');
        document.getElementById('info').innerHTML = html;
      });

      geolocation.on('error', function() {
        alert('geolocation error');
        // FIXME we should remove the coordinates in positions
      });

// convert radians to degrees
      function radToDeg(rad) {
        return rad * 360 / (Math.PI * 2);
      }
// convert degrees to radians
      function degToRad(deg) {
        return deg * Math.PI * 2 / 360;
      }
// modulo for negative values
      function mod(n) {
        return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
      }

      function addPosition(position, heading, m, speed) {
        var x = position[0];
        var y = position[1];
        var fCoords = positions.getCoordinates();
        var previous = fCoords[fCoords.length - 1];
        var prevHeading = previous && previous[2];
        if (prevHeading) {
          var headingDiff = heading - mod(prevHeading);

          // force the rotation change to be less than 180°
          if (Math.abs(headingDiff) > Math.PI) {
            var sign = (headingDiff >= 0) ? 1 : -1;
            headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
          }
          heading = prevHeading + headingDiff;
        }
        positions.appendCoordinate([x, y, heading, m]);

        // only keep the 20 last coordinates
        positions.setCoordinates(positions.getCoordinates().slice(-20));

        // FIXME use speed instead
        if (heading && speed) {
          markerEl.src = 'img/geolocation_marker_heading.png';
        } else {
          markerEl.src = 'img/geolocation_marker.png';
        }
      }

// recenters the view by putting the given coordinates at 3/4 from the top or
// the screen
      function getCenterWithHeading(position, rotation, resolution) {
        var size = map.getSize();
        var height = size[1];

        return [
          position[0] - Math.sin(rotation) * height * resolution * 1 / 4,
          position[1] + Math.cos(rotation) * height * resolution * 1 / 4
        ];
      }

      var previousM = 0;
      function updateView() {
        // use sampling period to get a smooth transition
        var m = Date.now() - deltaMean * 1.5;
        m = Math.max(m, previousM);
        previousM = m;
        // interpolate position along positions LineString
        var c = positions.getCoordinateAtM(m, true);
        if (c) {
          view.setCenter(getCenterWithHeading(c, -c[2], view.getResolution()));
          view.setRotation(-c[2]);
          marker.setPosition(c);
        }
      }

// geolocate device
      var geolocateBtn = document.getElementById('geolocate');
      geolocateBtn.addEventListener('click', function() {
        geolocation.setTracking(true); // Start position tracking

        map.on('postcompose', updateView);
        map.render();

        disableButtons();
      }, false);


      function disableButtons() {
        geolocateBtn.disabled = 'disabled';
      }
    }])

  .controller('iMieiPercorsiCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('nomePercorsoDinamicoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('addPOICtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])

  .controller('cercaPercorso2Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams) {


    }])
