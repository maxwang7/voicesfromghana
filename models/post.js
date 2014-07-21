/* FILE: models/post.js
 * --------------------
 * Description: Contains schema for the Post model.
 */

var mongoose = require('mongoose'),
 	Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
 	info: {
 		title: String,
 		description: String,
 		text: String,
 		tags: [String],
 		location: String
 	},

 	isProfile: Boolean,

 	media: {
 		audio: [{ type : Schema.Types.ObjectId, ref : 'Audio' }],
 		image: [{ type : Schema.Types.ObjectId, ref : 'Image' }],
 		video: [{ type : Schema.Types.ObjectId, ref : 'Video' }],
 		primary_image: Number // The primary image is the index of the image that will appear in the preview,
 		// set to -1 if there isn't one set yet
	},

	tags: [{ type : String }],

	timestamp: {type: Date, default: Date.now()},

	num_views: {type: Number, default: 0}
});

// Returns a boolean, indicating whether the instance can be displayed
// NOT YET COMPLETE
PostSchema.methods.isDisplayable = function() {
	return this.media.image.length !== 0 &&
		this.primary_image !== -1;
};

module.exports = mongoose.model('Post', PostSchema);