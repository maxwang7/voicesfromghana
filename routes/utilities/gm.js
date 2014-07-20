// This module contains utilities for graphics magick

var gm = require('gm'),
	imageMagick = gm.subClass({ imageMagick : true }),
	fs = require('fs');

// A higher-level crop function. Provide the image file's
// name, the normalized crop dimensions, and the final
// dimensions. The final_dim object must contain both
// a height and width properties.
// Saves the new image file to the file system,
// and calls a callback with the new image file's name as
// the parameter.
exports.crop = function(image_file, crop_dim, final_dim, callback) {
	// Make sure to get a unique name based on the time
	var new_name = Date.now() + '';
	var get_name = function() {
		fs.exists(new_name, function(exists) {
			if(exists) {
				new_name += '0';
				get_name();
			}
		});
	};

	get_name();

	// the new, adjusted dimensions
	var width, height, x, y;

	// Do actual operations
	gm(image_file)
		.size(function(err, value) {
			if(err) {
				console.log(err);
				throw err;
			}
			width = value.width * crop_dim.width;
			height = value.height * crop_dim.height;
			x = value.width * crop_dim.width;
			y = value.height * crop_dim.height;
			this.crop(width, height, x, y)
				.resize(final_dim.width, final_dim.height)
				.write(new_name, function(err, stdout, stderr, command) {
					if(err) {
						throw err;
					}
					callback(new_name);
				});
		});
};