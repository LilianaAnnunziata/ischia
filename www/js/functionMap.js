/**
 * Created by Liliana on 16/05/2017.
 */
function createMap() {

  var timeCache = 1000*60*60*48;

  var topographic = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    { title: 'Topographic',
      maxZoom: 18,
      useCache: true,
      crossOrigin: true,
      maxCache: timeCache
    })
  var satellite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { title: 'Satellite',
      maxZoom: 18,
      useCache: true,
      crossOrigin: true,
      maxCache: timeCache
    })
  var openStreatMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { title: 'Open Street Map',
      maxZoom: 18,
      useCache: true,
      crossOrigin: true,
      maxCache: timeCache
    })

  var map = L.map("map",{
    layers: [satellite]
  }).setView([40.726167,13.892207],13);

 // Add Map Control

  var baseMaps = {
    "Satellite":satellite,
    "Topografica":topographic,
    "Open Streat Map": openStreatMap
  }

var layerControl = L.control.layers(baseMaps);
layerControl.addTo(map);
}
