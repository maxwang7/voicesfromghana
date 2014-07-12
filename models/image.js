/* FILE: models/image.js
 * --------------------
 * Description: 
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ImageSchema = new mongoose.Schema({
	url: String,

	dimensions: {
		start: {
			x: Number,
			y: Number
		},
		end: {
			x: Number,
			y: Number
		}
	},

	timestamp: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Image', ImageSchema);