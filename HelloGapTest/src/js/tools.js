/***
 * 
 * Permet d'ouvrir l'interface native des dates et heures
 * 
 */
var myDate = new Date();

var dateDebut = myDate.getFullYear()-2;
var dateFin = myDate.getFullYear()+50;

function applyDatePicker() {
	$('.date').mobiscroll().date({
        theme: 'android-ics light',
        lang: 'fr',
        display: 'modal',
        mode: 'scroller',
        animate: 'pop',
        startYear: dateDebut,
        endYear: dateFin
    });
	
	// si clique sur le bouton "terminée" du datePicker, on quitte le focus du champs en cours
	$('.date').focus(function() {
		$("span[class='dwbw dwb-s']").click(function() {
			inputEnCours.blur();
		});
	});
}

/***
 * 
 * Permet d'afficher une image
 * 
 */
$(".image").fancybox({
	'titleShow'     : false
});

/***
 * 
 * La fonction retourne la valeur que retourne la page appelée
 * 
 */
var valeurUrl = function(url) {
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open('GET', url, false);
	xmlhttp.send(null);
	if(xmlhttp.status == 200)
		return xmlhttp.responseText;
}

/***
 * 
 * Autocomplete
 * 
 */
function autoComplete(elem, src) {
	elem.autocomplete({
		source: function(request, response) {
	        var results = $.ui.autocomplete.filter(src, request.term);
	        // on limit le résultat à 5 éléments
	        response(results.slice(0, 5));
	    },
		minLength: 1
	}); 
}

/***
 * 
 * Permet d'échapper les caractères spéciaux
 * 
 */
function addslashes(str) {
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\"');
	str=str.replace(/\\/g,'\\\\');
	str=str.replace(/\0/g,'\\0');
	return str;
}