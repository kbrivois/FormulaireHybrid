var EmailComposer = function(){};
/*
cordova.addConstructor(function() {
    cordova.addPlugin("emailcomposer", new EmailComposer());
});
*/
EmailComposer.prototype.send = function (message,attachement){
console.log("Calling the send message");
cordova.exec(function(){ alert('feedback sent')}, 
    function(){ alert('feedback was not sent')}, 
    'EmailComposer', 
    'sendEmail', 
    [message,attachement]);
}
function sendFeedback(){
    window.EmailComposer.prototype.send("My message body");
}