/* FILE: routes/default.js
 * --------------------
 * Description: Handlers for error and default pages
 */

exports.home = function(req, res) {
	res.send('Hello Christine :)');
};

exports.index = function(req, res) {
	res.send('404');
};