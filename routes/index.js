/* FILE: routes/index.js
 * --------------------
 * Description: 
 */

module.exports = function(app) {
	var defaultHandlers = require('./default.js');
	var errorHandlers = require('./error.js');
	var pageHandlers = require('./pages.js');
	var adminHandlers = require('./admin.js');

	// Default
	//app.get('/', pageHandlers.blog);

	// For audience
	app.get('/', pageHandlers.index);

	app.get('/blog', pageHandlers.blog);

	app.get('/blog/:id', pageHandlers.post);

	app.get('/about', pageHandlers.about);

	app.get('/thanks', pageHandlers.thanks);

	// For Christine
	app.get('/admin/dashboard', adminHandlers.dashboard);

	app.all('/admin/blog/:id?', adminHandlers.blog_post);

	app.all('/admin/media/:id?', adminHandlers.media);

	app.get('/admin/crop/:img_id/:post_id/:index', adminHandlers.crop_page);

	app.get('/admin/crop/:id', adminHandlers.crop);

	// robot.txt
	app.get('/robots.txt', defaultHandlers.robots);

	// If url not found
	app.get('*', defaultHandlers.index);

	// Error handlers
	app.use(errorHandlers.err404);

	/// error handlers
	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('audience/error/error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	app.use(errorHandlers.err500);
};