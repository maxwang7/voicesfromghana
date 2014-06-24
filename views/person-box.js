function Person(image_id, bio_id) {
	if(typeof(image_id) !== "string") console.log('Error, id not string');
	if(typeof(bio_id) !== "string") console.log('Error, id not string');
	var image = $('#' + image_id);
	var image_interact = new Interact(image); // should use the container, not the image
	var bio = $('#' + bio_id);

	var mouse_inside = false;

	var hide = function() {
		console.log("hide");
		if(image_interact.is_inside() && image.offset().top < bio.offset().top) {
			bio.animate({
				"marginTop" : "-=8",
				"height" : "+=8"
			}, 7);
		}
	};

	var show = function() {
		console.log("show");
		if(!image_interact.is_inside() && image.offset().top + image.height() - 5 > bio.offset().top) {
			bio.animate({
				"marginTop" : "+=5",
				"height" : "-=5"
			}, 7);
		}
	};

	setInterval(function() {hide(); show();}, 15);
}