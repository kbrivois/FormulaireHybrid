var EmailComposer = function(){};
/*
cordova.addConstructor(function() {
    cordova.addPlugin("emailcomposer", new EmailComposer());
});
*/
EmailComposer.prototype.send = function (message,attachement){
console.log("Calling the send message");
cordova.exec(function(){ alert('Les informations ont bien été envoyées !')}, 
    function(){ alert('Les informations n\'ont pas pu être envoyées...')}, 
    'EmailComposer', 
    'sendEmail', 
    [message,attachement]);
}
function sendFeedback(){
    window.EmailComposer.prototype.send("My message body");
}