/* FILE: models/image.js
 * --------------------
 * Description: 
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ImageSchema = new mongoose.Schema({
	urls: {
		original: { type : String, default : '' },
		archive: { type : String, default : '' },
		most_recent: { type : String, default : '' },
		people: { type : String, default : '' },
	},

	name : { type : String, default : '' },

	tags : { type : Array, default : [] },

	caption : { type : String, default : '' },

	timestamp: {type: Date, default: Date.now() }
});

module.exports = mongoose.model('Image', ImageSchema);