/* FILE: models/image.js
 * --------------------
 * Description: 
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ImageSchema = new mongoose.Schema({
	url: String,

	most_recent: {
		x: Number,
		y: Number,
		height: Number,
		width: Number
	},

	archive: {
		x: Number,
		y: Number,
		height: Number,
		width: Number
	},

	timestamp: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Image', ImageSchema);