/**
 * 
 * Focus sur les champs
 * 
 */
addFocus();

/**
 * 
 * autocomplete
 * 
 */
autoComplete($("#clientName"), arrayClient);
autoComplete($("#productName"), arrayProduits);

/**
 * 
 * clique sur "Même poids pour tous les produits" ou "Même DLC pour tous les produits"
 * 
 */

function actionOptionsProduits(div) {
	// si on s'intéresse au menu "même poids"
	if(div == "checkPoids") {
		// si checkboxPoids n'était pas sélectionné
		if(!checkPoids) {
			// on le sélectionne
			$("#infosPoidsRef").show();
			$("#"+div).css("box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("-webkit-box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("background", "linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/");
			$("#"+div).css("background", "-moz-linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/");
			$("#"+div).css("background", "-webkit-linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/)");
			$("#"+div).css("background", "-ms-linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/");
			$("#"+div).css("color", "white");
			checkPoids = true;
		}
		// si checkboxPoids était sélectionné
		else {
			// on le désélectionne
			$("#infosPoidsRef").hide();
			$("#poidsRef").val("");
			$("#"+div).attr("style", "");
			checkPoids = false;
		}
	}
	// si on s'intéresse au menu "même DLC"
	else if(div == "checkDLC") {
		// si checkDLC n'était pas sélectionné
		if(!checkDLC) {
			// on le sélectionne
			$("#infosDLCRef").show();
			checkDLC = true;
			$("#"+div).css("box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("-webkit-box-shadow", "inset 0px 1px 4px rgba(0,0,0,.3)");
			$("#"+div).css("background", "rgb(150,150,250)");
			$("#"+div).css("background", "linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/");
			$("#"+div).css("background", "-moz-linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/");
			$("#"+div).css("background", "-webkit-linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/)");
			$("#"+div).css("background", "-ms-linear-gradient( #009FE0 /*{c-bup-background-start}*/, #018EC8 /*{c-bup-background-end}*/");
			$("#"+div).css("color", "white");
		}
		// si checkboxDLC était sélectionné
		else {
			// on le désélectionne
			$("#infosDLCRef").hide();
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
		var poidsSaisi = parseFloat($(this).val());
		$("#product #listePoids .poids .inputPoids").each(function(index) {
			$(this).val(poidsSaisi);
		});
		poidsTotal += poidsSaisi * nbProduits;
		$("#poidsTotal div").html( Math.round((poidsTotal/1000)*100)/100+" Kg");
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
	calculDLC();
});

/**
 * 
 * Focus sur le champ des quantités
 * 
 */

$("#productQuantity").focus(function(){
	// Si la valeur du champ n'est pas un nombre (si = "Quantité...")
	if(!$.isNumeric($(this).val())) {
		$(this).val("");
		$(this).attr("style","");
	}
	inputEnCours = $(this);
	valeurInFocus = $(this).val();
});

$("#productQuantity").focusout(function(){
	
	var quantiteSaisie = parseFloat($(this).val());
	
	if(quantiteSaisie == 0)
		$("#poidsContainer").hide();
	else
		$("#poidsContainer").show();
	
	// Si la valeur du champ n'est pas un nombre
	if(!$.isNumeric(quantiteSaisie) || (quantiteSaisie%1 != 0)) {
		// s'il aucun nombre de produit n'avait été saisi
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
		// s'il aucun nombre de produit n'avait été saisi
		if(nbProduits == 0) {
			// on crée un <div class='poids'> pour chaque produit
			for(var i=0; i<quantiteSaisie; i++) {
				if(i%3 == 0)
					$("#product #listePoids").append("<div class='poids left'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<div class='inputs'>"+
															"<input class='inputPoids' type='text'/>" +
															"<input class='inputDLC date' type='text'/>" +
														"</div>"+
														"<div><i>g</i></div>" +
														"<div><i>DLC</i></div>" +
													"</div>");
				else if(i%3 == 1)
					$("#product #listePoids").append("<div class='poids center'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<div class='inputs'>"+
															"<input class='inputPoids' type='text'/>" +
															"<input class='inputDLC date' type='text'/>" +
														"</div>"+
														"<div><i>g</i></div>" +
														"<div><i>DLC</i></div>" +
													"</div>");
				else if(i%3 == 2)
					$("#product #listePoids").append("<div class='poids right'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<div class='inputs'>"+
															"<input class='inputPoids' type='text'/>" +
															"<input class='inputDLC date' type='text'/>" +
														"</div>"+
														"<div><i>g</i></div>" +
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
				// si l'on se trouve dans les input à retirer
				if(index >= quantiteSaisie) {
					$(this).remove();
				}
				// sinon, on incrémente le poids total
				else {
					if($.isNumeric($(this).find("input").val()))
						poidsTotal += parseFloat($(this).find("input").val());
				}
			});
			$("#poidsTotal div").html( Math.round((poidsTotal/1000)*100)/100+" Kg");
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
															"<div><i>g</i></div>" +
															"<div><i>DLC</i></div>" +
														"</div>");
					else if(i%3 == 1)
						$("#product #listePoids").append("<div class='poids center'>" +
															"<div><strong>"+(i+1)+".</strong></div>" +
															"<div class='inputs'>"+
																"<input class='inputPoids' type='text'/>" +
																"<input class='inputDLC date' type='text'/>" +
															"</div>"+
															"<div><i>g</i></div>" +
															"<div><i>DLC</i></div>" +
														"</div>");
					else if(i%3 == 2)
						$("#product #listePoids").append("<div class='poids right'>" +
															"<div><strong>"+(i+1)+".</strong></div>" +
															"<div class='inputs'>"+
																"<input class='inputPoids' type='text'/>" +
																"<input class='inputDLC date' type='text'/>" +
															"</div>"+
															"<div><i>g</i></div>" +
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
 * Calcul du la plus grande et plus petite DLC
 * 
 */
function calculDLC() {
	var arrayDates = new Array();
	$("#preparation .inputDLC").each(function() {
		if($(this).val() != "") {
			var date = $(this).val().split("/");
			date = date[2]+"-"+date[1]+"-"+date[0];
			date = new Date(date);
			arrayDates.push(date);
		}
	});
	
	if(arrayDates.length != 0) {
		var sorted = arrayDates.sort(sortDates);
		
		// min date
		var mois1 = sorted[0].getMonth()+1;
		if(mois1 < 10) { 
			mois1 = "0"+mois1; 
		}
		minDate = sorted[0].getDate()+"/"+mois1+"/"+sorted[0].getFullYear();
		
		// max date
		var mois2 = sorted[sorted.length-1].getMonth()+1;
		if(mois2 < 10) { 
			mois2 = "0"+mois2; 
		}
		maxDate = sorted[sorted.length-1].getDate()+"/"+mois2+"/"+sorted[sorted.length-1].getFullYear();
		
		$("#DLCTotale").html("DLC de<br/><div>"+minDate+"</div><br/>à<br/><div>"+maxDate+"</div>");
	}
}

function sortDates(a, b){
    return a.getTime() - b.getTime();
}

/**
 * 
 * Envoi du formulaire
 * 
 */
$("#send").click(function(){
	$("#chargement").show("medium");
    var subject = "Préparation | " + $("#clientName").val();
	
	// enregistrement des produits en base
	var arrayProduitsTemp = new Array();
	
	if($("#productName").val() != "") {
		arrayProduitsTemp.push($("#productName").val());
	}
	
	postUrl(arrayProduitsTemp, sourceProduitsAdd);

	var bodyMail = "";

	bodyMail += "<h1 style='width: 530px; background: #DDE2E6; font-family: Verdana,sans-serif; font-size: 22px; text-transform: uppercase; padding: 10px;'>"+$("#clientName").val()+"</h1>";
	bodyMail += "<h2 style='font-family: Verdana,sans-serif; font-size: 16px;'>"+$("#productName").val()+"</h2>";
	
	// si une quantité a été saisie
	if($("#productQuantity").val() != "" && $("#productQuantity").val() != 0) {
		bodyMail += "<table style='width: 550px; font-family: Verdana,sans-serif; font-size: 12px; color: #374953;'><tbody>";

		var arrayEntetesCellules = new Array();
		var arrayContenuCellules = new Array();
		var ligneTableau = 0;
		
		$("#product #listePoids .poids").each(function(index) {
			if(index == 0) {
				arrayEntetesCellules[ligneTableau] = "<tr style='background-color: #b9babe; text-transform: uppercase;'>";
				arrayContenuCellules[ligneTableau] = "<tr>";
			}
			else if(index % 3 == 0) {
				arrayEntetesCellules[ligneTableau] += "</tr>";
				arrayContenuCellules[ligneTableau] += "</tr> <tr></tr><tr></tr>";
				ligneTableau++;
				arrayEntetesCellules[ligneTableau] = "<tr style='background-color: #b9babe; text-transform: uppercase;'>";
				arrayContenuCellules[ligneTableau] = "<tr>";
			}
			
			arrayEntetesCellules[ligneTableau] += "<td colspan='2' style='text-align: center; padding: 0.3em 1em; font-weight: bolder;'>COLIS "+(index+1)+"</td>";
			arrayContenuCellules[ligneTableau] += "<td style='padding: 0.5em 0 0.5em 0.5em; background-color: #ebecee;'>" +
													  "<strong>Poids : </strong><br />"+$(this).find(".inputPoids").val() +
												  "</td>" +
												  "<td style='padding: 0.5em 0 0.5em 0.5em; background-color: #ebecee;'>" +
												  	  "<strong>DLC : </strong><br />"+$(this).find(".inputDLC").val() +
												  "</td>";
		});
		
		for(var i=0; i<=ligneTableau; i++) {
			bodyMail += arrayEntetesCellules[i];
			bodyMail += arrayContenuCellules[i];
		}
		
		bodyMail += "</table>";
		bodyMail += "<div style='width: 550px; margin-top: 15px; float: left;'>" +
						"<span style='float: right; font-family: Verdana,sans-serif; font-size: 12px; color: black;'>Poids total : <strong>"+poidsTotal+"g</strong></span>" +
					"</div>";
		bodyMail += "<div style='width: 550px; margin-top: 15px; float: left;'>" +
						"<span style='float: right; font-family: Verdana,sans-serif; font-size: 12px; color: black;'>DLC de <strong>"+minDate+"</strong> à <strong>"+maxDate+"</strong></span>" +
					"</div>";
	}
	
	window.EmailComposer.prototype.send(bodyMail, url, subject);
});