var colonneIsVisible = false;

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