/**
 * 
 * Focus sur les champs
 * 
 */

var inputEnCours = null;
var valeurInFocus = null;
var checkPoids = false;
var checkDLC = false;
var poidsTotal = 0;
var nbProduits = 0;


$("input[type='text']").focus(function() {
	inputEnCours = $(this);
	valeurInFocus = $(this).val();
});

addFocus();

function addFocus() {
	
	// on retire les �v�nements des champs input dans la partie "#listePoids .poids"
	$("#listePoids .poids input").off();
	
	$("#listePoids .poids input").focus(function() {
		inputEnCours = $(this);
		valeurInFocus = $(this).val();
	});
	
	// Poids total
	// au focusout d'un inputPoids dans un div .poids
	$("#listePoids .poids .inputPoids").focusout(function(){
		if($.isNumeric($(this).val()) && ($(this).val() % 1 == 0)) {
			// on ajoute la nouvelle
			poidsTotal += parseInt($(this).val());
		}
		else {
			$(this).val("");
		}
		// on retire l'ancienne valeur
		if($.isNumeric(valeurInFocus))
			poidsTotal -= parseInt(valeurInFocus);
		
		// si la checkbox "m�me poids" �tait coch�e et que le poids rentr� dans le input est diff�rent du poids ref
		if(checkPoids && $(this).val() != $("#poidsRef").val()) {
			actionOptionsProduits("checkPoids");
		}
		
		$("#poidsTotal div").html(poidsTotal+" Kg");
	});
	
	// au focusout d'un inputDLC dans un div .poids
	$("#listePoids .poids .inputDLC").focusout(function(){
		// si la checkbox "m�me DLC" �tait coch�e et que la DLC rentr�e dans le input est diff�rente de la DLC ref
		if(checkDLC && $(this).val() != $("#DLCRef").val()) {
			actionOptionsProduits("checkDLC");
		}
	});
	
	applyDatePicker();
}

//si le clavier virtuel dispara�t, on fait perdre le focus de l'input.
document.addEventListener("hidekeyboard", function() {
	inputEnCours.blur();
	$("#send").show();
}, false);

//si le clavier virtuel appara�t, on fait dispara�tre le bouton "envoyer"
document.addEventListener("showkeyboard", function() {
	$("#send").hide();
}, false);

/**
 * 
 * clique sur "M�me poids pour tous les produits" ou "M�me DLC pour tous les produits"
 * 
 */

function actionOptionsProduits(div) {
	// si on s'int�resse au menu "m�me poids"
	if(div == "checkPoids") {
		// si checkboxPoids n'�tait pas s�lectionn�
		if(!checkPoids) {
			// on le s�lectionne
			$("#infosPoidsRef").slideDown('fast');
			$("#"+div).css("box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("-webkit-box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("background", "rgb(150,150,250)");
			$("#"+div).css("color", "white");
			checkPoids = true;
		}
		// si checkboxPoids �tait s�lectionn�
		else {
			// on le d�s�lectionne
			$("#infosPoidsRef").slideUp('fast');
			$("#poidsRef").val("");
			$("#"+div).attr("style", "");
			checkPoids = false;
		}
	}
	// si on s'int�resse au menu "m�me DLC"
	else if(div == "checkDLC") {
		// si checkboxPoids n'�tait pas s�lectionn�
		if(!checkDLC) {
			// on le s�lectionne
			$("#infosDLCRef").slideDown('fast');
			checkDLC = true;
			$("#"+div).css("box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("-webkit-box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("background", "rgb(150,150,250)");
			$("#"+div).css("color", "white");
		}
		// si checkboxPoids �tait s�lectionn�
		else {
			// on le d�s�lectionne
			$("#infosDLCRef").slideUp('fast');
			$("#DLCRef").val("");
			checkDLC = false;
			$("#"+div).attr("style", "");
		}
	}
}

$("#checkPoids").click(function(){
	actionOptionsProduits("checkPoids");
});

$("#checkDLC").click(function(){
	actionOptionsProduits("checkDLC");
});

//focusout sur le champs #poidsRef 
$("#poidsRef").focusout(function(){
	// si le poids saisi est un nombre et qu'il est entier
	if($.isNumeric($(this).val()) && ($(this).val() % 1 == 0)) {
		poidsTotal = 0;
		var poidsSaisi = parseInt($(this).val());
		$("#product #listePoids .poids .inputPoids").each(function(index) {
			$(this).val(poidsSaisi);
		});
		poidsTotal += poidsSaisi * nbProduits;
		$("#poidsTotal div").html(poidsTotal+" Kg");
	}
	else {
		$(this).val("");
	}
});

//focusout sur le champs #DLCRef 
$("#DLCRef").focusout(function(){
	var dateSaisie = $(this).val();
	$("#product #listePoids .poids .inputDLC").each(function(index) {
		$(this).val(dateSaisie);
	});
});

/**
 * 
 * Focus sur le champ des quantit�s
 * 
 */

$("#productQuantity").focus(function(){
	// Si la valeur du champ n'est pas un nombre (si = "Quantit�...")
	if(!$.isNumeric($(this).val())) {
		$(this).val("");
		$(this).attr("style","");
	}
	inputEnCours = $(this);
	valeurInFocus = $(this).val();
});

$("#productQuantity").focusout(function(){
	
	var quantiteSaisie = parseInt($(this).val());
	
	if(quantiteSaisie == 0)
		$("#poidsContainer").hide();
	else
		$("#poidsContainer").show();
	
	// Si la valeur du champ n'est pas un nombre
	if(!$.isNumeric(quantiteSaisie) || (quantiteSaisie%1 != 0)) {
		// s'il aucun nombre de produit n'avait �t� saisi
		if(nbProduits == 0) {
			$("#poidsContainer").hide();
			$(this).val("Quantit�...");
			$(this).attr("style","color:#999999;font-size:20px;font-style:italic;text-align:left;");
		}
		else {
			$(this).val(nbProduits);
			quantiteSaisie = nbProduits;
		}
	}
	else {
		// s'il aucun nombre de produit n'avait �t� saisi
		if(nbProduits == 0) {
			// on cr�e un <div class='poids'> pour chaque produit
			for(var i=0; i<quantiteSaisie; i++) {
				if(i%3 == 0)
					$("#product #listePoids").append("<div class='poids left'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<div class='inputs'>"+
															"<input class='inputPoids' type='text'/>" +
															"<input class='inputDLC date' type='text'/>" +
														"</div>"+
														"<div><i>Kg</i></div>" +
														"<div><i>DLC</i></div>" +
													"</div>");
				else if(i%3 == 1)
					$("#product #listePoids").append("<div class='poids center'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<div class='inputs'>"+
															"<input class='inputPoids' type='text'/>" +
															"<input class='inputDLC date' type='text'/>" +
														"</div>"+
														"<div><i>Kg</i></div>" +
														"<div><i>DLC</i></div>" +
													"</div>");
				else if(i%3 == 2)
					$("#product #listePoids").append("<div class='poids right'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<div class='inputs'>"+
															"<input class='inputPoids' type='text'/>" +
															"<input class='inputDLC date' type='text'/>" +
														"</div>"+
														"<div><i>Kg</i></div>" +
														"<div><i>DLC</i></div>" +
													"</div>" +
													"<div class='clear'></div>");
			}
		}
		// si l'utilisateur change le nombre de produit
		// s'il y en a moins
		else if(quantiteSaisie < nbProduits) {
			poidsTotal = 0;
			$("#product #listePoids .poids").each(function(index) {
				// si l'on se trouve dans les input � retirer
				if(index >= quantiteSaisie) {
					$(this).remove();
				}
				// sinon, on incr�mente le poids total
				else {
					if($.isNumeric($(this).find("input").val()))
						poidsTotal += parseInt($(this).find("input").val());
				}
			});
			$("#poidsTotal div").html(poidsTotal+" Kg");
		}
		// s'il y en a plus
		else if(quantiteSaisie > nbProduits) {
			for(var i=0; i<quantiteSaisie; i++) {
				if(i >= nbProduits) {
					if(i%3 == 0)
						$("#product #listePoids").append("<div class='poids left'>" +
															"<div><strong>"+(i+1)+".</strong></div>" +
															"<div class='inputs'>"+
																"<input class='inputPoids' type='text'/>" +
																"<input class='inputDLC date' type='text'/>" +
															"</div>"+
															"<div><i>Kg</i></div>" +
															"<div><i>DLC</i></div>" +
														"</div>");
					else if(i%3 == 1)
						$("#product #listePoids").append("<div class='poids center'>" +
															"<div><strong>"+(i+1)+".</strong></div>" +
															"<div class='inputs'>"+
																"<input class='inputPoids' type='text'/>" +
																"<input class='inputDLC date' type='text'/>" +
															"</div>"+
															"<div><i>Kg</i></div>" +
															"<div><i>DLC</i></div>" +
														"</div>");
					else if(i%3 == 2)
						$("#product #listePoids").append("<div class='poids right'>" +
															"<div><strong>"+(i+1)+".</strong></div>" +
															"<div class='inputs'>"+
																"<input class='inputPoids' type='text'/>" +
																"<input class='inputDLC date' type='text'/>" +
															"</div>"+
															"<div><i>Kg</i></div>" +
															"<div><i>DLC</i></div>" +
														"</div>" +
														"<div class='clear'></div>");
				}
			}
		}

		nbProduits = quantiteSaisie;
	}
	
	// on ajoute le listener focus sur tous les nouveaux champs
	addFocus();
});


/**
 * 
 * Envoi du formulaire
 * 
 */

$("#send").click(function(){
	$("#chargement").show("medium");
/*
	// s'il n'y pas de photo
	if(url == "" || url == null) {
		alert("Il faut prendre une photo !")
	}
	else {
		$("#chargement").show("medium");

		var bodyMail = "";

		bodyMail += "<div style='font-family:sans-serif'>";
		bodyMail += "<div style='width:150px;float:left'><strong>Client : </strong></div><div style='float:left'>"+$("#clientName").val()+"</div><br/>";
		bodyMail += "<div style='clear:both'></div>";
		bodyMail += "<div style='width:150px;float:left;'><strong>Produit : </strong></div><div style='float:left'>"+$("#productName").val()+"</div>";
		// si une quantit� a �t� saisie
		if($("#productQuantity").val() != "" && $("#productQuantity").val() != 0) {
			bodyMail += "<div style='width:150px;float:left;margin-left:20px'><strong>x "+$("#productQuantity").val()+" = "+poidsTotal+" Kg</strong></div><br/>";
			bodyMail += "<table style='border-collapse:collapse;margin-top:20px;float:left;border:1px solid black'><tbody>";
			$("#product #listePoids .poids").each(function(index) {
				if(index == 0) {
					bodyMail += "<tr>";
				}
				else if(index % 3 == 0) {
					bodyMail += "</tr>";
					bodyMail += "<tr>";
				}
				bodyMail += "<td style='height:50px;width:120px;text-align:center;border:1px solid black'>"+
								(index+1)+" = <strong>"+$(this).find(".inputPoids").val()+" Kg</strong>" +
								"<br/>" +
								"<strong>"+$(this).find(".inputDLC").val()+"</strong>" +
							"</td>";
			});
			bodyMail += "</tr>";
		}
		bodyMail += "</div>";
		
		window.EmailComposer.prototype.send(bodyMail, url);
	}
	*/
});