/* FILE: models/audio.js
 * --------------------
 * Description: 
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AudioSchema = new mongoose.Schema({
	urls: {
		original: { type : String, default : '' }
	},

	name : { type : String, default : '' },

	tags : { type : Array, default : [] },

	caption : { type : String, default : '' },

	timestamp: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Audio', AudioSchema);