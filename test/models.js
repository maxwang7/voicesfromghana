var Post = require('../models/post'),
	Image = require('../models/image'),
	assert = require('assert');

describe('gm', function() {

	// Test primary image in Post. If greater than
	// the length of media.image, an array, it should
	// send an error
	describe('media.primary_image', function() {
		it('should produce an error when saving a primary image number that is the length of media.image or larger', function() {
			assert.throws(function() {
				var post = new Post({
					media : {
						image : [],
						primary_image : 1
					}
				});
				// console.log(post.media.primary_image);
				// console.log(post.media.image.length);
				post.save(function(err, product, numAffected) {
					if(err) throw err;
				});
			});
		});
	});
});