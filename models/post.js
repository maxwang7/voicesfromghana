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
 		audio: [Schema.Types.ObjectId],
 		image: [Schema.Types.ObjectId],
 		video: [Schema.Types.ObjectId]
 	},

 	timestamp: {type: Date, default: Date.now()}
 	// num views
 })

module.exports = mongoose.model('Post', PostSchema);