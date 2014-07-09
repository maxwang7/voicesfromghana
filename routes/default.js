/* FILE: routes/default.js
 * --------------------
 * Description: Handlers for error and default pages
 */

exports.home = function(req, res) {
	res.send('Hello Christine :)');
};

exports.index = function(req, res) {
	res.render('error');
};

exports.robots = function(req, res) {
	res.sendfile('robots.txt');
}