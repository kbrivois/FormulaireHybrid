var colonneIsVisible = false;
var onglet = "";

/**
 * 
 * Menu du haut
 * 
 */

$("#header h1").click(function() {
	// on met en surbrillance le header choisi
	$("#header h1").each(function() {
		$(this).attr("class","");
	});
	$(this).attr("class","current");
	
	// on fait apparaître le content choisi
	$(".content").hide();
	onglet = $(this).data("onglet");
	$("#"+onglet).show();
	
	// on fait apparaître le menu colonne correspondant
	$(".typeColonne").hide();
	if(onglet == "stock") {
		$("#stockColonne").show();
	}
	else if(onglet == "preparation"){
		$("#preparationColonne").show();
	}
});


/**
 * 
 * Menu de gauche
 * 
 */

$("#scrollerColonne").click(function() {
	if(!colonneIsVisible) {
		$("#colonne").fadeIn("medium");
		$(this).animate({
			left: "144"
		},"medium",function() {
			$(this).find(".barre").css("background-color","white");
		});
		colonneIsVisible = true;
	}
	else {
		$("#colonne").fadeOut("medium");
		$(this).animate({
			left: "20"
		},"medium",function() {
			$(this).find(".barre").css("background-color","rgb(100,100,100)");
		});
		colonneIsVisible = false;
	}
});