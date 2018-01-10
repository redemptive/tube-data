$(document).ready(() => {
	$(".routeDiv").hide();

	$(".routeToggler").click(() => {
		alert($(this).attr("id"));
	});
});