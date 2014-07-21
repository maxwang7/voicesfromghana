/* FILE: models/image.js
 * --------------------
 * Description: 
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ImageSchema = new mongoose.Schema({
	names: {
		original: String,
		archive: String,
		most_recent: String,
		people: String,
	},

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