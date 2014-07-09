function assert(condition, message) {
	if(!condition) {
		throw message || "assertion failed";
	}
}

/* Function: Cropper
 * -----------------
 * Description: A Cropper object takes a size object, which
 * has two fields: height and width. These represent the
 * size and height of the box into which the image should
 * be cropped.
 */
function Cropper(size) {
	assert(typeof(size) === 'object', "size not object");
	assert(size.height !== undefined, 'size.height is undefined');
	assert(size.width !== undefined, 'size.width is undefined');

	this.size = size;
}

/* Given an image jQuery object, crops it to the size for
 * which this Cropper has been designated.
 */
Cropper.prototype.crop = function(img) {
	assert(typeof(img) == 'object', 'Image not Object');
	img = $(img);

	// Indicates whether the initial ratio of width:height is
	// greater than the "final" ratio of width:height as stored
	// inside this.size. This boolean is used as an indicator
	// for whether the image should be scaled by comparing widths
	// (true) or scaled by comparing heights (false).
	var scale_width = this.size.width / this.size.height > img.width() / img.height();

	// Next, scale down the image so that the smaller side,
	// as determined previously, is the same size as the
	// image box size
	if(!scale_width) {
		//scale = img.height() / this.size.height;
		img.height(this.size.height);
		//img.width(img.width() / scale);
	} else {
		//scale = img.width() / this.size.width;
		//img.height(img.height / scale);
		img.width(this.size.width);
	}

	// Cut off the leftover part of the image from the 
	// larger size, as determined previously, so that the
	// image fits perfectly into the rectangle
	// How to do this?

}