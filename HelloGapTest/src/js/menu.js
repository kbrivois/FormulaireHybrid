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

$("#header h1").click(function() {
	$("#header h1").each(function() {
		$(this).attr("class","");
	});
	$(this).attr("class","current");
});