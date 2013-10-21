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
	$(this).val($(this).val().replace(",","."));
	// si le poids saisi est un nombre
	if($.isNumeric($(this).val())) {
		poidsTotal = 0;
		var poidsSaisi = parseFloat($(this).val());
		$("#product #listePoids .poids .inputPoids").each(function(index) {
			$(this).val(poidsSaisi);
		});
		calculPoidsTotal();
	}
	else {
		$(this).val("");
	}
});

//validation du champs #DLCRef 
function majDLC(element) {
	if(element.attr("id") == "DLCRef") {
		var dateSaisie = element.val();
		$("#product #listePoids .poids .inputDLC").each(function(index) {
			$(this).val(dateSaisie);
		});
	}
	// si la checkbox "même DLC" était cochée et que la DLC rentrée dans le input est différente de la DLC ref
	else if((element.attr("class")).indexOf("inputDLC") != -1){
		if(checkDLC && element.val() != $("#DLCRef").val()) {
			actionOptionsProduits("checkDLC");
		}
	}
}

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
			$(this).val("");
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
			
			var tableau = "<table>" +
								"<thead>" +
									"<tr>" +
										"<th>Colis / Pièce</th>" +
										"<th>Poids (Kg)</th>" +
										"<th>DLC</th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>";
			
			for(var i=0; i<quantiteSaisie; i++) {
				tableau += "<tr class='poids'>" +
								"<th>" + (i+1) + " :</th>" +
								"<td>"+
									"<input class='inputPoids' type='text'/>" +
								"</td>"+
								"<td>"+
									"<input class='inputDLC date' type='text'/>" +
								"</td>"+
						 "</tr>";
			}
			
			tableau += 		"</tbody>" +
						"</table>";
			$("#product #listePoids").append(tableau);
		}
		// si l'utilisateur change le nombre de produit
		// s'il y en a moins
		else if(quantiteSaisie < nbProduits) {
			if(quantiteSaisie == 0) {
				$("#product #listePoids table").remove();
				$("#poidsTotal div").html("0 Kg");
			}
			else {
				poidsTotal = 0;
				$("#product #listePoids .poids").each(function(index) {
					// si l'on se trouve dans les input à retirer
					if(index >= quantiteSaisie) {
						$(this).remove();
					}
				});
				calculPoidsTotal();
			}
		}
		// s'il y en a plus
		else if(quantiteSaisie > nbProduits) {
			var tableau = "";
			
			for(var i=0; i<quantiteSaisie; i++) {
				if(i >= nbProduits) {
					tableau += "<tr class='poids'>" +
									"<th>" + (i+1) + " :</th>" +
									"<td>"+
										"<input class='inputPoids' type='text'/>" +
									"</td>"+
									"<td>"+
										"<input class='inputDLC date' type='text'/>" +
									"</td>"+
								"</tr>";
				}
			}
			tableau += 		"</tbody>" +
						"</table>";
			
			if(nbProduits == 0) {
				tableau = "<table>" +
							"<thead>" +
								"<tr>" +
									"<th>Colis / Pièce</th>" +
									"<th>Poids (Kg)</th>" +
									"<th>DLC</th>" +
								"</tr>" +
							"</thead>" +
							"<tbody>" + tableau;

				$("#product #listePoids").append(tableau);
			}
			else {
				$("#product #listePoids table tbody").append(tableau);
			}
		}

		nbProduits = quantiteSaisie;
	}
	
	// on ajoute le listener focus sur tous les nouveaux champs
	addFocus();
});

/**
 * 
 * Calcul du poids total
 * 
 */
function calculPoidsTotal() {
	poidsTotal = 0;
	$("#product #listePoids .poids .inputPoids").each(function(index) {
		if($(this).val() != "") {
			poidsTotal += parseFloat($(this).val());
		}
	});
	$("#poidsTotal div").html(Math.round((poidsTotal)*1000)/1000+" Kg");
}

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

function sortDates(a, b) {
    return a.getTime() - b.getTime();
}

/**
 * 
 * Envoi du formulaire
 * 
 */
$("#send").click(function() {
	
	if($("#clientName").val() != "" && $("#productName").val()) {
		
		$("#chargement").show("medium");
	    var subject = "Préparation | " + $("#clientName").val();
		
		// enregistrement des produits en base
		var arrayProduitsTemp = new Array();
		
		if($("#productName").val() != "") {
			arrayProduitsTemp.push($("#productName").val());
		}
		
		postUrl(arrayProduitsTemp, sourceProduitsAdd);
	
		var bodyMail = "";
	
		bodyMail += "<div style='width: 530px; background: #DDE2E6; font-family: Verdana,sans-serif;'>";
		bodyMail += 	"<h1 style='padding: 10px 10px 0px 10px; font-size: 22px; text-transform: uppercase;'>" + $("#dateLivraison").val() + "</h1>";
		bodyMail += 	"<h1 style='padding: 10px; font-size: 22px; text-transform: uppercase;'>" + $("#clientName").val() + "</h1>";
		bodyMail += "</div>";
		bodyMail += "<h2 style='font-family: Verdana,sans-serif; font-size: 16px;'>"+$("#productName").val()+"</h2>";
		
		// si une quantité a été saisie
		if($("#productQuantity").val() != "" && $("#productQuantity").val() != 0) {
			bodyMail += "<table style='width: 550px; font-family: Verdana,sans-serif; font-size: 12px; color: #374953;'><tbody>";
	
			var arrayEntetesCellules = new Array();
			var arrayContenuCellules = new Array();
			var ligneTableau = 0;
			var typeQuantite = "";
			
			if($("#typeQuantite option:selected").val() == "P") {typeQuantite = "Pièce";}
			else {typeQuantite = "Colis";}
			
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
				
				arrayEntetesCellules[ligneTableau] += "<td colspan='2' style='text-align: center; padding: 0.3em 1em; font-weight: bolder;'>" + typeQuantite + " " + (index+1) + "</td>";
				arrayContenuCellules[ligneTableau] += "<td style='padding: 0.5em 0 0.5em 0.5em; background-color: #ebecee;'>" +
														  "<strong>Poids : </strong><br />"+$(this).find(".inputPoids").val() + " Kg" +
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
							"<span style='float: right; font-family: Verdana,sans-serif; font-size: 12px; color: black;'>Poids total : <strong>" + Math.round(poidsTotal*1000)/1000 + "Kg</strong></span>" +
						"</div>";
			bodyMail += "<div style='width: 550px; margin-top: 15px; float: left;'>" +
							"<span style='float: right; font-family: Verdana,sans-serif; font-size: 12px; color: black;'>DLC de <strong>"+minDate+"</strong> à <strong>"+maxDate+"</strong></span>" +
						"</div>";
		}

		$("body").append(bodyMail);
		window.EmailComposer.prototype.send(bodyMail, url, subject);
	}
	else {
		alert("Il faut renseigner le champ client et le champ produit !");
	}
});