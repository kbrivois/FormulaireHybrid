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
eventRemoveSwipe($(".lineProduct"));

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
							$(this).css("margin-left","0");
							$(this).css("opacity",1);
							distance = 0;
						}
						// jusqu'à ce que l'élément ait disparu
						else if($(this).css("opacity") == 0) {
							removeChamp($(this));
						}
						else {
							$(this).css("margin-left",distance+"px");
							$(this).css("opacity", 1 - distance*0.005);
						}
						ancienneDistance = distance;
					}
					// à la fin du swipe
					else if(phase == "end" || phase == "cancel") {
						// s'il y a un swipe rapide
						if((duration<500 && distance>50)) {
							removeChamp($(this));
						}
						// si on relâche avant la fin
						else {
							$(this).css("margin-left","0");
							$(this).css("opacity",1);
						}
					}
				}
				else {
					$(this).css("margin-left","0");
					$(this).css("opacity",1);
				}
			},
			cancelThreshold: 0,
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
		nbProduitsEnStock--;
		eventRemoveSwipe($(".lineProduct"));
	});
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
						// jusqu'à ce que l'élément ait disparu
						else if($(this).css("opacity") == 0) {
							removeChamp($(this));
						}
						else {
							$(this).css("margin-left",marginLeftDeBase - distance + "px");
						}
						ancienneDistance = distance;
					}
					// à la fin du swipe
					else if(phase == "end" || phase == "cancel") {
						// s'il y a un swipe rapide
						if((duration < 500 && distance > 50)) {
							addChamp($(this));
						}
						// si on relâche avant la fin
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
		eventRemoveSwipe($(".lineProduct"));
		eventAddSwipe($(".lineProductHidden .inputsHidden"));
	});
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
	
	// Mail
	var subject = "Etat des stocks";
	var bodyMail = "";

	bodyMail += "<div style='font-family:sans-serif'>";
	
	$("#stock .lineProduct").each(function() {
		if($(this).find(".product").val() != "") {
			bodyMail += "<div style='width:150px;float:left'>"+$(this).find(".product").val()+"&nbsp;<strong>x"+$(this).find(".quantity").val()+"</strong></div><div style='float:left'>"+$("#clientName").val()+"</div><br/>";
			bodyMail += "<br/>";
			bodyMail += "<br/>";
		}
	});
	bodyMail += "</div>";
	
	window.EmailComposer.prototype.send(bodyMail, "", subject);
});