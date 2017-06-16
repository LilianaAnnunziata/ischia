angular.module('app.services', [])


//funzione che ritorna il layer contenente il tragitto
.service('Layer', function(){
    
    this.viewLayer=function(object){       
        if(object.getVisible())
            object.setVisible(false);
        else
            object.setVisible(true);    
       };  
      
    this.lineLayer=function(lineString){
        lineString.transform('EPSG:4326', 'EPSG:3857');       
        var lineLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: lineString,
                    name: 'Line'
                })]
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({color: 'red', width: 3}),
            })
        });
        return(lineLayer);
    }
    
})    
         /*funzione che visualizza un marker sulla mappa paramitri di input:
            x,y=coordinate
            name=nome marker
            src=icona del marker
         */
 .factory('posizionaPunto', function() {
    return function(array,src){
        if(array=="1"){
            array=Window.infoPois;
        }
        var iconFeature= new Array();
        
        var iconStyle = new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: src
          }))         
        });
     
        array.forEach(function(record){ 
            var obj = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform(record.coordinates, 'EPSG:4326', 'EPSG:3857')),
                name:record.nom_poi
                
            });
            obj.setStyle(iconStyle);  
            iconFeature.push(obj);            
        });
         
         //Vettore che contiene le features dei marker
        var vectorSource = new ol.source.Vector({
          features: iconFeature
        });

      // Layer per la visualizzazione dei vettori dei marker
         vectorLayer = new ol.layer.Vector({
          source: vectorSource
        });
        
        return vectorLayer;
}})

.service('dati', function() {
    Window.infoPois = new Array();
    Window.infoPaths = new Array();
    
    this.setInfo = function($http,$ionicPopup,$window){
        var urlPoi = "datiTest/POI.json";
        var urlPathInfo = "datiTest/PATH.json";
        var urlPathLine = "datiTest/PATH.xml";
        /*
         * Da decommentare alla fine
        var urlPoi = 'http://www.geosec.cnr.it/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Ischia:CiroRomano_shp_poi&maxFeatures=1000000&outputFormat=json';
        var urlPathInfo = 'http://www.geosec.cnr.it/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=Ischia:CiroRomano_shp_sentieri&maxFeatures=1000000&outputFormat=json';
        var urlPathLine = 'http://www.geosec.cnr.it/geoserver/wms/reflect?&layers=Ischia:CiroRomano_shp_sentieri&format=rss';
        */
       
        dataDownload = new Date(localStorage.getItem('Data'));
        app = new Date();
        var dataUpgrade = new Date(app.getFullYear(),app.getMonth(),app.getDate());
        
        //Da decommentare alla fine
        //if((navigator.connection.type.toLowerCase() != 'none')&&(dataUpgrade > dataDownload)){ 
        if(1){
            $http.get(urlPoi)
            .success(function(data, status, headers, config){
                localStorage.setItem('POI', JSON.stringify(data));
                setPoi();
            })
            .error(function(status)
            {
                var alert = $ionicPopup.alert({
                    title: 'ERRORE',
                    template: 'Riprovare più tardi!'
                });
                alert.then(function() {
                    $window.location.reload();
                }); 
            });
            
            $http.get(urlPathInfo)
            .success(function(data, status, headers, config){
                localStorage.setItem('PATH_INFO', JSON.stringify(data));  
                setPathInfo();
            })
            .error(function(status)
            {
                var alert = $ionicPopup.alert({
                    title: 'ERRORE',
                    template: 'Riprovare più tardi!'
                });
                alert.then(function() {
                    $window.location.reload();
                }); 
            });
            
            $http.get(urlPathLine)
            .success(function(data, status, headers, config){
                localStorage.setItem('PATH_LINE', data);  
                setPathLine();
            })
            .error(function(status)
            {
                var alert = $ionicPopup.alert({
                    title: 'ERRORE',
                    template: 'Riprovare più tardi!'
                });
                alert.then(function() {
                    $window.location.reload();
                }); 
            });
            
            localStorage.setItem('Data', dataUpgrade);            
        }
        else {
            if((localStorage.getItem('POI') == null)||(localStorage.getItem('PATH_INFO') == null)||(localStorage.getItem('PATH_LINE') == null)){
                var alert = $ionicPopup.alert({
                    title: 'CONNESSIONE ASSENTE',
                    template: 'Riprovare più tardi!'
                });
                alert.then(function() {
                    $window.location.reload();
                });                
            }
            else{
                setPoi();
                setPathInfo();
                setPathLine();
            }
        }
    }
    
    setPoi = function(){
        var features = JSON.parse(localStorage.getItem('POI')).features;
        features.forEach(function(record){
            var obj= {
                "nom_poi": record.properties.NOM_POI,
                "coordinates": record.geometry.coordinates,
                "nom_itiner": record.properties.NOM_ITINER,
                "percorso": record.properties.PERCORSO,
                "tipo_perc": record.properties.TIPO_PERC
            };
            Window.infoPois.push(obj);
        });
    }
    
    setPathInfo = function(){
        var features = JSON.parse(localStorage.getItem('PATH_INFO')).features;
        features.forEach(function(record){
            var obj= {
                "percorso": record.properties.PERCORSO,
                "nom_itiner": record.properties.NOM_ITINER,
                "coordinates": null, 
                "tipo_perc": record.properties.TIPO_PERC
            };
            Window.infoPaths.push(obj);
        }); 
    }
           
    setPathLine = function(){   
        var path;
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(localStorage.getItem('PATH_LINE'),"text/xml");
        item = xmlDoc.getElementsByTagName("item");
        for(var j=0;j<item.length;j++)
        {
            line = item[j].childNodes[4].innerHTML;
            var coors = line.split(" ");
            path = new Array();
            for(var i=0;i<(coors.length);i+=2){
                coors[i]=parseFloat(coors[i]);
                coors[i+1]=parseFloat(coors[i+1]);
                app = [coors[i+1],coors[i]];
                path.push(app); 
            }
            Window.infoPaths[j].coordinates = path;        
        }
    }
})
        
   