$(document).ready(() => {
	$(".routeDiv").hide();

	$(".routeToggler").click(() => {
		$(this).next(".routeDiv").toggle("slow");
	});
});