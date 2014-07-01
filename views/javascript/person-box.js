function PersonBox(container, image, blurb) {
	this.container = $(container);
	this.blurb = $(blurb);
	this.image = $(image);

	var isHiding = false;
	var obj = this;

	var hide = function(e) {
		obj.blurb.stop(true, false);
		console.log("Mouse entered, hiding");
		var distance =  obj.blurb.offset().top - obj.container.offset().top;
		console.log(distance);
		obj.blurb.animate({
			"marginTop" : "-=" + distance,
			"height" : "+=" + distance
		}, 750);
	};

	var show = function(e) {
		obj.blurb.stop(true, false);
		console.log("Mouse left, showing");
		var distance = obj.image.height() - (obj.blurb.offset().top - obj.container.offset().top);
		obj.blurb.animate({
			"marginTop" : "+=" + distance,
			"height" : "-=" + distance
		}, 1000);
	};

	this.container.hover(hide, show);
	//this.container.mouseenter(hide);
	//this.container.mouseleave(show);
}


// function Person(image, bio) {
// 	console.log(image);
// 	console.log(bio);
// 	if(typeof(image) !== "object") console.log('Error, image not object');
// 	if(typeof(bio) !== "object") console.log('Error, bio not object');




// 	// var image_interact = new Interact(image); // should use the container, not the image

// 	// var mouse_inside = false;

// 	// var hide = function() {
// 	// 	console.log("hide");
// 	// 	if(image_interact.is_inside() && image.offset().top < bio.offset().top) {
// 	// 		bio.animate({
// 	// 			"marginTop" : "-=8",
// 	// 			"height" : "+=8"
// 	// 		}, 7);
// 	// 	}
// 	// };

// 	// var show = function() {
// 	// 	console.log("show");
// 	// 	if(!image_interact.is_inside() && image.offset().top + image.height() - 5 > bio.offset().top) {
// 	// 		bio.animate({
// 	// 			"marginTop" : "+=5",
// 	// 			"height" : "-=5"
// 	// 		}, 7);
// 	// 	}
// 	// };

// 	// setInterval(function() {hide(); show();}, 15);
// }