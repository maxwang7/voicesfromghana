function assert(condition, message) {
	if(!condition) {
		throw message || "assertion failed";
	}
}

function Cropper(size, ratio) {
	assert(typeof(size) === 'object', "size not object");
	assert(size.height !== undefined, 'size.height is undefined');
	assert(size.width !== undefined, 'size.width is undefined');
	assert(typeof(ratio) === 'object', "ratio not object");
	assert(ratio.height !== undefined, "ratio.height is undefined");
	assert(ratio.width !== undefined, "ratio.width is undefined");

	this.size = size;
	this.ratio = ratio;
}

Cropper.prototype.crop = function(img) {
	assert(typeof(img) == 'object', 'Image not Object');

	// say you have an image called Dog
	// First see whether Dog's height or width is smaller,
	// ratio-wise
	var scaled_height = img.clientHeight * ratio.height;
	var scaled_width = img.clientWidth * ratio.width;
	var height_is_smaller = false;
	if(scaled_height < scaled_width) {
		height_is_smaller = true;
	}

	// Next, scale down the image so that the smaller side,
	// as determined previously, is the same size as the
	// image box size
	var scale = img.height() / size.height;
	if(height_is_smaller) {

		img.height = img.height()
	}

	// Cut off the leftover part of the image from the 
	// larger size, as determined previously, so that the
	// image fits perfectly into the rectangle
}