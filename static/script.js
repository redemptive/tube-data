$(document).ready(() => {

	$(".route-toggler").on("click", function() {
		$(this).nextAll(".route-div").toggle("slow");
	});
});