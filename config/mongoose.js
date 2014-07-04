/* FILE: config/mongoose.js
 * ------------------------
 * Configures mongoose and sets up models.
 */

module.exports = function(mongoose) {
	var DB_SERVER = 'test'; // server name

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback() {
		// Declare schemas in here
	});
	mongoose.connect('mongodb://localhost/' + DB_SERVER);
}