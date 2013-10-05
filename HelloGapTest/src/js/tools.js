/***
 * 
 * Permet d'ouvrir l'interface native des dates et heures
 * 
 */
function applyDatePicker() {
	$('.date').mobiscroll().date({
        theme: 'android-ics light',
        lang: 'fr',
        display: 'modal',
        mode: 'scroller',
        animate: 'pop',
        invalid: [ 'w0', 'w6', '5/1', '12/24', '12/25' ]
    });
	
	// si clique sur le bouton "terminé" du datePicker, on quitte le focus du champs en cours
	$('.date').focus(function() {
		$("span[class='dwbw dwb-s']").click(function() {
			inputEnCours.blur();
		});
	});
}