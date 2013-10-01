/**
 * 
 * Focus sur les champs
 * 
 */

var inputEnCours = null;

$("input[type='text']").focus(function() {
	inputEnCours = $(this);
});

// si le clavier virtuel disparaît, on fait perdre le focus de l'input.
document.addEventListener("hidekeyboard", function() {
	inputEnCours.blur();
}, false);


/**
 * 
 * Focus sur le champ des quantités
 * 
 */

var nbProduit = 0;

$("#productQuantity").focus(function(){
	// Si la valeur du champ n'est pas un nombre
	if(!$.isNumeric($(this).val())) {
		$(this).val("");
		$(this).attr("style","");
	}
});

$("#productQuantity").focusout(function(){
	// Si la valeur du champ n'est pas un nombre, si ce n'est pas un entier
	if(!$.isNumeric($(this).val()) || $(this).val()%1 != 0) {
		$(this).val("Quantité...");
		$(this).attr("style","color:#999999;font-size:20px;font-style:italic;text-align:left;");
	}
	else {
		
		var quantiteSaisie = parseInt($(this).val());
		
		if(quantiteSaisie == 0)
			$("#labelPoidsProduits").hide();
		else
			$("#labelPoidsProduits").show();
		
		// s'il aucun nombre de produit n'avait été saisi
		if(nbProduit == 0) {
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
		else if(quantiteSaisie < nbProduit) {
			$("#product #listePoids .poids").each(function(index) {
				if(index >= quantiteSaisie) {
					$(this).remove();
				}
			});
		}
		// s'il y en a plus
		else if(quantiteSaisie > nbProduit) {
			for(var i=0; i<quantiteSaisie; i++) {
				if(i >= nbProduit) {
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

		nbProduit = quantiteSaisie;
	}
});