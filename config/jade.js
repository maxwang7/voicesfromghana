/* FILE: config/jade.js
 * --------------------
 * Description: Used to set up Jade as the view engine for the Express app.
 */

module.exports = function(app, cur_dir) {
	// requires
	var path = require('path');
	// "constant" definitions
	var view_dir = '/views/partials/';
	// view engine setup
	app.set('views', path.join(cur_dir, view_dir));
	app.set('view engine', 'jade');
};