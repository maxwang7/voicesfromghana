/* FILE: routes/index.js
 * --------------------
 * Description: 
 */

module.exports = function(app) {
	var defaultHandlers = require('./default.js');

	// Default
	app.get('/', defaultHandlers.home);

	app.get('*', defaultHandlers.index);
};