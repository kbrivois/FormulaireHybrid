var nbProduitsEnStock = 0;
var ancienneDistance = 0;

/**
 * 
 * autocomplete
 * 
 */
autoComplete($("#stock .product"), arrayProduits);

/**
 * 
 * Slide pour supprimer les champs
 * 
 */
eventRemoveSwipe($(".lineProduct .swiper"));

function eventRemoveSwipe(elem) {
	elem.each(function() {
		$(this).swipe( {
			//Generic swipe handler for all directions
			swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
				if(direction != "down" && direction != "up") {
					// au début du swipe
					if(phase == "start") {
						ancienneDistance = 0;
					}
					// s'il y a un mouvement au moment du swipe
					if(phase == "move") {
						// si il y a un swipe left et qu'on a dépassé le point d'origine
						if(direction == "left" && (distance - ancienneDistance) > 0) {
							$(this).parent().css("margin-left","0");
							$(this).parent().css("opacity",1);
							distance = 0;
						}
						// jusqu'Ã  ce que l'élément ait disparu
						else if($(this).parent().css("opacity") == 0) {
							removeChamp($(this).parent());
						}
						else {
							$(this).parent().css("margin-left",distance+"px");
							$(this).parent().css("opacity", 1 - distance*0.005);
						}
						ancienneDistance = distance;
					}
					// Ã  la fin du swipe
					else if(phase == "end" || phase == "cancel") {
						// s'il y a un swipe rapide
						if((duration<500 && distance>50)) {
							removeChamp($(this).parent());
						}
						// si on relÃ¢che avant la fin
						else {
							$(this).parent().css("margin-left","0");
							$(this).parent().css("opacity",1);
						}
					}
				}
				else {
					$(this).parent().css("margin-left","0");
					$(this).parent().css("opacity",1);
				}
			},
			triggerOnTouchLeave: true
		});
	});
}

function removeChamp(champ) {
	var champNext = champ.next();
	champNext.css("margin-top","107px");
	champ.remove();
	
	champNext.animate({
		marginTop: "0px",
	}, 300, function() {
		eventRemoveSwipe($(".lineProduct .swiper"));
	});

	calculProduits();
}

/**
 * 
 * Slide pour ajouter un champ
 * 
 */
var marginLeftDeBase = 0;

eventAddSwipe($(".lineProductHidden .inputsHidden"));

function eventAddSwipe(elem) {
	elem.each(function() {
		$(this).swipe( {
			//Generic swipe handler for all directions
			swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
				if(direction != "down" && direction != "up") {
					// au début du swipe
					if(phase == "start") {
						var offset = $( ".lineProductHidden .inputsHidden" ).offset();
						var offsetBody = $( "body" ).offset();
						marginLeftDeBase = offset.left-offsetBody.left;
						ancienneDistance = 0;
					}
					// s'il y a un mouvement au moment du swipe
					if(phase == "move") {
						// si il y a un swipe right et qu'on a dépassé le point d'origine
						if(direction == "right" && (distance - ancienneDistance) > 0) {
							$(this).css("margin-left",marginLeftDeBase + "px");
							distance = 0;
						}
						else {
							$(this).css("margin-left",marginLeftDeBase - distance + "px");
						}
						ancienneDistance = distance;
					}
					// Ã  la fin du swipe
					else if(phase == "end" || phase == "cancel") {
						// s'il y a un swipe rapide
						if((duration < 500 && distance > 50)) {
							addChamp($(this));
						}
						// si on relÃ¢che avant la fin
						else if ((marginLeftDeBase - distance) <= (marginLeftDeBase * 0.8)){
							addChamp($(this));
						}
						else {
							$(this).css("margin-left",marginLeftDeBase + "px");
						}
					}
				}
				else {
					$(this).css("margin-left",marginLeftDeBase + "px");
				}
			},
			triggerOnTouchLeave: true
		});
	});
}

function addChamp(elem) {
	$(elem).animate({
		marginLeft: "0px",
	}, 200, function() {
		$(this).parent().remove();
		$("#stock").append("<div class='lineProduct'>" +
								"<div class='left large'>" +
								"<span>Nom du produit :</span>" +
							"</div>" +
							"<div class='right small'>" +
								"<span style='float: right;'>Quantité :</span>" +
							"</div>" +
							"<div class='clear'></div>" +
							"<div class='swiper'>" +
								"<div></div>" +
								"<div></div>" +
								"<div></div>" +
							"</div>" +
							"<div class='left large'>" +
								"<input type='text' class='product'/>" +
							"</div>" +
							"<div class='right small'>" +
								"<input type='text' class='quantity' style='text-align:right;' />" +
							"</div>" +
						"</div>");
		
		$("#stock").append("<div class='lineProductHidden'>" +
								"<div class='inputsHidden'>" +
								"<div class='swiper'></div><div class='left large'><input type='text' class='product'></div><div class='right small'><input type='text' class='quantity'></div>" +
							"</div>" +
							"<div class='blocHidden'>" +
								"<div></div>" +
							"</div>" +
							"</div>");

		addFocus();
		autoComplete($("#stock .product"), arrayProduits);
		eventRemoveSwipe($(".lineProduct .swiper"));
		eventAddSwipe($(".lineProductHidden .inputsHidden"));
	});
}

/**
 * 
 * Calcul le nombre de produits
 * 
 */
function calculProduits() {
	nbProduitsEnStock = 0;
	$("#stock input.product").each(function() {
		if($(this).val() != ""){nbProduitsEnStock++;}
	});
	$("#nbProduitsStock").html("Nombre de produits<br/><div>"+nbProduitsEnStock+"</div>");
}


/**
 * 
 * Clique sur le bouton envoyer
 * 
 */
$("#sendStock").click(function() {
	
	// enregistrement des produits en base
	var arrayProduitsTemp = new Array();
	$("#chargement").show("medium");
	
	$("#stock .lineProduct .product").each(function() {
		if($(this).val() != "") {
			arrayProduitsTemp.push($(this).val());
		}
	});
	
	postUrl(arrayProduitsTemp, sourceProduitsAdd);
	
	// Mail
	var subject = "Etat des stocks";
	var bodyMail = "";

	var today = new Date;
	var jour = today.getDate();
	var mois = (today.getMonth())+1;
	var annee = today.getFullYear();
	
	var dateActuelle = jour + "/" + mois + "/" + annee;
	
	bodyMail += "<h1 style='width: 530px; background: #DDE2E6; font-family: Verdana,sans-serif; font-size: 22px; text-transform: uppercase; padding: 10px;'>STOCK AU " + dateActuelle + "</h1>";
	
	if(nbProduitsEnStock != 0) {
		bodyMail += "<table style='width: 550px; font-family: Verdana,sans-serif; font-size: 12px; color: #374953;'>" +
						"<tbody>" +
							"<tr style='background-color: #b9babe; text-transform: uppercase;'>" +
								"<td style='width: 480px; text-align: center; padding: 0.3em 1em; font-weight: bolder;'>PRODUITS</td>" +
								"<td style='width: 70px; text-align: center; padding: 0.3em 1em; font-weight: bolder;'>QTE</td>" +
							"</tr>";
		
		$("#stock .lineProduct").each(function() {
			if($(this).find(".product").val() != "") {
				bodyMail += "<tr>" +
								"<td style='width: 480px; padding: 0.5em 0 0.5em 0.5em; background-color: #ebecee;'>" +
									$(this).find(".product").val() +
								"</td>" +
								"<td style='width: 70px; padding: 0.5em 0 0.5em 0.5em; background-color: #ebecee; text-align: center;'>" +
									$(this).find(".quantity").val() +
								"</td>" +
							"</tr>";
			}
		});

		bodyMail += "</tbody></table>";

		bodyMail += "<div style='width: 550px; margin-top: 15px;'>" +
						"<span style='float: right; font-family: Verdana,sans-serif; font-size: 12px; color: black;'>Nombre de produits : <strong>" + nbProduitsEnStock + "</strong></span>" +
					"</div>";
	}
	window.EmailComposer.prototype.send(bodyMail, "", subject);
});