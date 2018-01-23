$(document).ready(() => {
	$(".routeDiv").hide();

	$(".routeToggler").on("click", function() {
		$(this).nextAll(".routeDiv").toggle();
	});
});