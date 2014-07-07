/* FILE: config/mongoose.js
 * ------------------------
 * Configures mongoose and sets up models.
 */

module.exports = function(mongoose) {
	var DB_SERVER = 'voices'; // server name
	var Post = require('../models/post.js');

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback() {
		// Declare schemas in here
		// var post = new Post({
		// 	info: {
		//  		title: "Test2",
		//  		description: "Test2",
		//  		text: "Test2",
		//  		tags: ["Test2"],
		//  		location: "Test2"
		//  	},

		//  	isProfile: false,

		//  	media: {
		//  		audio: [],
		//  		photo: [],
		//  		video: []
		//  	},
		// });
		// post.save();
	});
	mongoose.connect('mongodb://localhost/' + DB_SERVER);
}