var EmailComposer = function(){};
/*
cordova.addConstructor(function() {
    cordova.addPlugin("emailcomposer", new EmailComposer());
});
*/
EmailComposer.prototype.send = function (message,attachement,subject){
console.log("Calling the send message");
cordova.exec(
	function(){ 
		$("#chargement").hide();
		alert('Les informations ont bien été envoyées !');
		location.reload();
	}, 
    function(){ 
		$("#chargement").hide();
		alert('Les informations n\'ont pas pu être envoyées...');
	}, 
    'EmailComposer', 
    'sendEmail', 
    [message,attachement,subject]);
}
function sendFeedback(){
    window.EmailComposer.prototype.send("My message body");
}