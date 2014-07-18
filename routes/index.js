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

	app.get('/about', pageHandlers.about);

	// For Christine
	app.get('/admin/dashboard', adminHandlers.dashboard);

	app.get('/admin/blog/create', adminHandlers.blogCreateGET);

	app.post('/admin/blog/create', adminHandlers.blogCreatePOST);

	app.get('/admin/blog/get/:id', adminHandlers.blogGet);

	app.get('/admin/blog/get/json/:id', adminHandlers.blogGetJSON);

	app.post('/admin/blog/update/:id', adminHandlers.blogUpdate);

	app.post('/admin/blog/delete/:id', adminHandlers.blogDelete);

	// media handlers
	app.get('/admin/blog/addMedia/:id', adminHandlers.blogAddMediaGET);

	app.post('/admin/blog/addMedia/:id', adminHandlers.blogAddMediaPOST);

	app.post('/admin/blog/addImagePreviewPOST/:id', adminHandlers.blogAddImagePreviewPOST);

	app.get('/admin/blog/getMedia/:id', adminHandlers.blogGetMedia);

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