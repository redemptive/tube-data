$(document).ready(() => {
	$(".routeDiv").hide();

	$(".routeToggler").on("click", () => {
		alert($(this).next().attr("class"));
	});
});