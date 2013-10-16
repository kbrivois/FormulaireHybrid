/***
 * 
 * Déclaration des variables
 * 
 */
var inputEnCours = null;
var valeurInFocus = null;
var checkPoids = false;
var checkDLC = false;
var poidsTotal = 0;
var nbProduits = 0;

//produits
//get
var sourceProduits = valeurUrl('http://www.aymeric-auberton.fr/getProducts.php');
var arrayProduitsTemp = $.parseJSON(sourceProduits);
var arrayProduits = new Array();
for(var i=0; i<arrayProduitsTemp.length; i++) {
	arrayProduits.push(arrayProduitsTemp[i]); 
}
// add
var sourceProduitsAdd = "http://www.aymeric-auberton.fr/addProduct.php";

//clients
var sourceClient = valeurUrl('http://www.aymeric-auberton.fr/data.php');
var arrayClient = sourceClient.split('%');

// date
var minDate = "";
var maxDate = "";


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
function valeurUrl(url) {
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


function postUrl(array, source) {
	$.ajax({
		type: "POST",
		url: source,
		data: { arrayProduits: array },
		success: function(msg){
		},
		error: function(msg){
		}
	});
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
 * Ajoute des événement sur le keyboard
 * 
 */
//si le clavier virtuel disparaît, on fait perdre le focus de l'input.
document.addEventListener("hidekeyboard", function() {
	inputEnCours.blur();
	$("#send").show();
}, false);

//si le clavier virtuel apparaît, on fait disparaître le bouton "envoyer"
document.addEventListener("showkeyboard", function() {
	$("#send").hide();
}, false);

/***
 * 
 * Ajoute les evénements focus sur les champs voulus
 * 
 */
$("input[type='text']").focus(function() {
	inputEnCours = $(this);
	valeurInFocus = $(this).val();
});

function addFocus() {
	
	// on retire les événements des champs input dans la partie "#listePoids .poids"
	$("#listePoids .poids input").off();
	
	$("#listePoids .poids input").focus(function() {
		inputEnCours = $(this);
		valeurInFocus = $(this).val();
	});
	
	applyDatePicker();
	
	/**** Préparation ****/
	
	// Poids total
	// au focusout d'un inputPoids dans un div .poids
	$("#listePoids .poids .inputPoids").focusout(function(){
		if($.isNumeric($(this).val()) && ($(this).val() % 1 == 0)) {
			// on ajoute la nouvelle
			poidsTotal += parseFloat($(this).val());
		}
		else {
			$(this).val("");
		}
		// on retire l'ancienne valeur
		if($.isNumeric(valeurInFocus))
			poidsTotal -= parseFloat(valeurInFocus);
		
		// si la checkbox "même poids" était cochée et que le poids rentré dans le input est différent du poids ref
		if(checkPoids && $(this).val() != $("#poidsRef").val()) {
			actionOptionsProduits("checkPoids");
		}
		$("#poidsTotal div").html( Math.round((poidsTotal/1000)*100)/100+" Kg");
	});
	
	// au focusout d'un inputDLC dans un div .poids
	$("#listePoids .poids .inputDLC").focusout(function() {
		// si la checkbox "même DLC" était cochée et que la DLC rentrée dans le input est différente de la DLC ref
		if(checkDLC && $(this).val() != $("#DLCRef").val()) {
			actionOptionsProduits("checkDLC");
		}
		calculDLC();
	});
	
	/**** Stock ****/
	// au focus out d'un produit dans les stocks
	// on calcul le nombre de produits
	$("#stock input.product").focusout(function() {
		calculProduits();
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