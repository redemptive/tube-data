$(document).ready(() => {
	$(".route-div").hide();

	$(".route-toggler").on("click", function() {
		$(this).nextAll(".route-div").toggle("slow");
	});
});