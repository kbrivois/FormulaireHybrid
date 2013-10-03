/**
 * 
 * Focus sur les champs
 * 
 */

var inputEnCours = null;
var valeurInFocus = null;
var poidsTotal = 0;
var nbProduits = 0;


$("input[type='text']").focus(function() {
	inputEnCours = $(this);
	valeurInFocus = $(this).val();
});

addFocus();

function addFocus() {
	
	// on retire les événement des champs input dans la partie "#listePoids .poids"
	$("#listePoids .poids input").off();
	
	$("#listePoids .poids input").focus(function() {
		inputEnCours = $(this);
		valeurInFocus = $(this).val();
	});
	
	// Poids total
	// au focusout d'un input .poids
	
	$("#listePoids .poids input").focusout(function(){
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
		
		// si la checkbox "même poids" était cochée et que le poids rentré dans le input est différent du poids ref
		if($("#checkPoids").is(':checked') && $(this).val() != $("#poidsRef").val()) {
			$("#checkPoids").attr('checked', false);
			$("#poidsRef").val("");
			$("#infosPoidsRef").hide();
		}
		
		$("#poidsTotal div").html(poidsTotal+" Kg");
	});
}

//si le clavier virtuel disparaît, on fait perdre le focus de l'input.
document.addEventListener("hidekeyboard", function() {
	inputEnCours.blur();
}, false);


/**
 * 
 * Checkbox "Même poids pour tous les produits"
 * 
 */

$("#checkPoids").click(function(){
	// si checkbox cochée
	if($(this).is(':checked')) {
		$("#infosPoidsRef").show();
	}
	// si checkbox décochée
	else {
		$("#infosPoidsRef").hide();
		$("#poidsRef").val("");
	}
});

//focusout sur le champs #poidsRef 
$("#poidsRef").focusout(function(){
	// si le poids saisi est un nombre et qu'il est entier
	if($.isNumeric($(this).val()) && ($(this).val() % 1 == 0)) {
		poidsTotal = 0;
		var poidsSaisi = parseInt($(this).val());
		$("#product #listePoids .poids input").each(function(index) {
			$(this).val(poidsSaisi);
		});
		poidsTotal += poidsSaisi * nbProduits;
		$("#poidsTotal div").html(poidsTotal+" Kg");
	}
	else {
		$(this).val("");
	}
});


/**
 * 
 * Focus sur le champ des quantités
 * 
 */

$("#productQuantity").focus(function(){
	// Si la valeur du champ n'est pas un nombre
	if(!$.isNumeric($(this).val())) {
		$(this).val("");
		$(this).attr("style","");
	}
});

$("#productQuantity").focusout(function(){
	
	var quantiteSaisie = parseInt($(this).val());
	
	if(quantiteSaisie == 0)
		$("#poidsContainer").hide();
	else
		$("#poidsContainer").show();
	
	// Si la valeur du champ n'est pas un nombre
	if(!$.isNumeric(quantiteSaisie) || (quantiteSaisie%1 != 0)) {
		// s'il aucun nombre de produit n'avait été saisi
		if(nbProduits == 0) {
			$("#poidsContainer").hide();
			$(this).val("Quantité...");
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
														"<input type='text'/>" +
														"<div><i>Kg</i></div>" +
													"</div>");
				else if(i%3 == 1)
					$("#product #listePoids").append("<div class='poids center'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<input type='text'/>" +
														"<div><i>Kg</i></div>" +
													"</div>");
				else if(i%3 == 2)
					$("#product #listePoids").append("<div class='poids right'>" +
														"<div><strong>"+(i+1)+".</strong></div>" +
														"<input type='text'/>" +
														"<div><i>Kg</i></div>" +
													"</div>");
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
															"<input type='text'/>" +
															"<div><i>Kg</i></div>" +
														"</div>");
					else if(i%3 == 1)
						$("#product #listePoids").append("<div class='poids center'>" +
															"<div><strong>"+(i+1)+".</strong></div>" +
															"<input type='text'/>" +
															"<div><i>Kg</i></div>" +
														"</div>");
					else if(i%3 == 2)
						$("#product #listePoids").append("<div class='poids right'>" +
															"<div><strong>"+(i+1)+".</strong></div>" +
															"<input type='text'/>" +
															"<div><i>Kg</i></div>" +
														"</div>");
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
	$("#chargement").show();
	
	setInterval(function(){}, 10000);
	
	var bodyMail = "";
	
	bodyMail += "<div style='font-family:sans-serif'>";
	bodyMail += "<div style='width:150px;float:left'><strong>Client : </strong></div><div style='float:left'>"+$("#clientName").val()+"</div><br/>";
	bodyMail += "<div style='clear:both'></div>";
	bodyMail += "<div style='width:150px;float:left;'><strong>Produit : </strong></div><div style='float:left'>"+$("#productName").val()+"</div>";
	// si une quantité a été saisie
	if($("#productQuantity").val() != "" && $("#productQuantity").val() != 0) {
		bodyMail += "<div style='width:150px;float:left;margin-left:20px'><strong>x "+$("#productQuantity").val()+" = "+poidsTotal+" Kg</strong></div><br/>";
		bodyMail += "<table style='border-collapse:collapse;margin-top:20px;float:left;border:1px solid black'><tbody>";
		$("#product #listePoids .poids input").each(function(index) {
			if(index == 0) {
				bodyMail += "<tr>";
			}
			else if(index % 3 == 0) {
				bodyMail += "</tr>";
				bodyMail += "<tr>";
			}
			bodyMail += "<td style='height:50px;width:120px;text-align:center;border:1px solid black'>"+(index+1)+" = <strong>"+$(this).val()+" Kg</strong></td>";
		});
		bodyMail += "</tr>";
	}
	bodyMail += "</div>";
	
	$("#chargement").hide();
});