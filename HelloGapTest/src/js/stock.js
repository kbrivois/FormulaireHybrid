var nbProduitsEnStock = 0;

$("#stockQuantity").focusout(function(){
	
	var quantiteSaisie = parseFloat($(this).val());

	if(!$.isNumeric(quantiteSaisie) || (quantiteSaisie%1 != 0)) {
		$(this).val("");
	}
	else {
		// s'il aucun nombre de produit n'avait été saisi
		if(nbProduitsEnStock == 0) {
			// on crée un <div class='lineProduct'> pour chaque produit dans l'onglet id=stock
			for(var i=0; i<quantiteSaisie; i++) {
				$("#stock").append("<div class='lineProduct'>" +
																"<div class='left large'>" +
																	"<span>Nom du produit :</span>" +
																"</div>" +
																"<div class='right small'>" +
																	"<span style='float: right;'>Quantité :</span>" +
																"</div>" +
																"<div class='left large'>" +
																	"<input type='text' class='product'/>" +
																"</div>" +
																"<div class='right small'>" +
																	"<input type='text' class='quantity' style='text-align:right;' />" +
																"</div>" +
															"</div>");
			}
		}
		// si l'utilisateur change le nombre de produit
		// s'il y en a -
		else if(quantiteSaisie < nbProduitsEnStock) {
			poidsTotal = 0;
			$("#stock .lineProduct").each(function(index) {
				// si l'on se trouve dans les input à retirer
				if(index >= quantiteSaisie) {
					$(this).remove();
				}
			});
		}
		// s'il y en a +
		else if(quantiteSaisie > nbProduitsEnStock) {
			for(var i=0; i<quantiteSaisie; i++) {
				if(i >= nbProduitsEnStock) {
					$("#stock").append("<div class='lineProduct'>" +
											"<div class='left large'>" +
												"<span>Nom du produit :</span>" +
											"</div>" +
											"<div class='right small'>" +
												"<span style='float: right;'>Quantité :</span>" +
											"</div>" +
											"<div class='left large'>" +
												"<input type='text' class='product'/>" +
											"</div>" +
											"<div class='right small'>" +
												"<input type='text' class='quantity' style='text-align:right;' />" +
											"</div>" +
										"</div>");
				}
			}
		}

		nbProduitsEnStock = quantiteSaisie;
	}
	
	// on ajoute le listener focus sur tous les nouveaux champs
	addFocus();
	addAutoComplete();
});


/**
 * 
 * autocomplete
 * 
 */

function addAutoComplete() {
	$( "#stock .product" ).autocomplete({
		source: arrayProduits,
		minLength: 1
	}); 
}

/**
 * 
 * Clique sur le bouton envoyer
 * 
 */
$("#sendStock").click(function() {
	var arrayProduitsTemp = new Array();
	$("#chargement").show("medium");
	
	$("#stock .lineProduct .product").each(function() {
		if($(this).val() != "") {
			arrayProduitsTemp.push($(this).val());
		}
	});
	$.ajax({
		type: "POST",
		url: "http://www.aymeric-auberton.fr/addProduct.php",
		data: { arrayProduits: arrayProduitsTemp },
		success: function(msg){
			$("#chargement").hide("medium");
			alert( "Les données ont bien été enregistrées");
			location.reload();
		},
		error: function(msg){
			$("#chargement").hide("medium");
			alert( "Un problème est survenu pendant l'enregistrement des données...");
		}
	});
});