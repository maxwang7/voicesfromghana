/* FILE: models/post.js
 * --------------------
 * Description: Contains schema for the Post model.
 */

var mongoose = require('mongoose'),
 	Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
 	info: {
 		title: { type : String, default : '' },
 		description: { type : String, default : '' },
 		text: { type : String, default : '' },
 		tags: { type : Array, default : [] },
 		location: { type : String, default : '' }
 	},

 	isProfile: { type : Boolean, default : false },

 	media: {
 		audio: [{ type : Schema.Types.ObjectId, default : [], ref : 'Audio' }],
 		image: [{ type : Schema.Types.ObjectId, default : [], ref : 'Image' }],
 		video: [{ type : Schema.Types.ObjectId, default : [], ref : 'Video' }],
 		primary_image: { type : Number, default : -1, min : -1} // The primary image is the index of the image that will appear in the preview,
 		// set to -1 if there isn't one set yet
 		// TODO: Set a maximum value for the primary_image that's dependent on the length of the image
	},

    date: {type: Date, default: Date.now()}, // date is a user chosen date

	timestamp: {type: Date, default: Date.now()}, // timestamp is the date of creation

	num_views: {type: Number, default: 0, min : 0}
});

// Validations
var description_max_length = 150;
var description_too_long_message = 'Description can be at most 150 characters';
PostSchema.path('info.description').validate(function(val) {
    return val.length <= description_max_length;
}, description_too_long_message);

var primary_image_not_allowed_message = 'The primary image is an index of the image array, and is either too small or too long.';
PostSchema.path('media.primary_image').validate(function(val) {
    var image_len = this.media.image.length;
    return val >= -1 && val < image_len;
}, primary_image_not_allowed_message);

// TODO: Returns a boolean, indicating whether the instance can be displayed
// NOT YET COMPLETE
PostSchema.methods.isDisplayable = function() {
	return this.media.image.length !== 0 &&
		this.primary_image !== -1;
};

module.exports = mongoose.model('Post', PostSchema);