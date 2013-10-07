var pictureSource;   // picture source
var destinationType; // sets the format of returned value 

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	/**/
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);

  // Get image handle
  //
  var lienImage = $('a#image');
  
  // Unhide image elements
  //
  lienImage.show();

  // href
  //
  lienImage.attr("href",imageURI);
  
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  lienImage.find("img").attr("src",imageURI);

  window.resolveLocalFileSystemURI(imageURI, onResolveSuccess, fail);
}

var url = null;

function onResolveSuccess(fileEntry) {
    url = fileEntry.fullPath;
    url = url.replace("file:///","");
}

function fail(error) {
	alert("erreur lors de la prise de photo")
    // alert(error.code);
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI });
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.FILE_URI });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
// 
function onFail(message) {
}