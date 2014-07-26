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

// Returns a boolean, indicating whether the instance can be displayed
// NOT YET COMPLETE
PostSchema.methods.isDisplayable = function() {
	return this.media.image.length !== 0 &&
		this.primary_image !== -1;
};

module.exports = mongoose.model('Post', PostSchema);