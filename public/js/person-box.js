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
}