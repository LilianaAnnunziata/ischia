/**
 * Created by Liliana on 15/06/2017.
 */
function setOptionsCamera(srcType, width, height) {

  var options;
  if(width != undefined && height != undefined) {
    console.log("heigth settato")
    options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL, //formato del valore di ritorno
      sourceType: srcType,//sorgente della foto
      allowEdit: false,//permette la modifica
      encodingType: Camera.EncodingType.JPEG, //formato di codifica della foto
      targetWidth: width,//scalatura img
      targetHeight: height,
      mediaType: Camera.PICTURE, //setta il tipo di media da selezionare
      saveToPhotoAlbum: true, //salva img nell'album
      cameraDiretion: Camera.FRONT,
      correctOrientation: true
    };
  } else {
    console.log("heigth non settato")
    options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL, //formato del valore di ritorno
      sourceType: srcType,//sorgente della foto
      allowEdit: false,//permette la modifica
      encodingType: Camera.EncodingType.JPEG, //formato di codifica della foto
      mediaType: Camera.PICTURE, //setta il tipo di media da selezionare
      saveToPhotoAlbum: true, //salva img nell'album
      cameraDiretion: Camera.FRONT,
      correctOrientation: true
    };
  }

  return options;
}
