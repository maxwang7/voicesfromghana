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
	app.get('/blog', pageHandlers.blog);

	//app.get('/about', pageHandlers.about);

	// For Christine
	app.get('/admin/dashboard', adminHandlers.dashboard);

	app.get('/admin/blog/create', adminHandlers.blogCreateGET);

	app.post('/admin/blog/create', adminHandlers.blogCreatePOST);

	app.get('/admin/blog/get/:id', adminHandlers.blogGet);

	app.post('/admin/blog/update/:id', adminHandlers.blogUpdate);

	//app.post('/admin/blog/delete/:id', adminHandlers.blogEdit);

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
	        res.render('error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	app.use(errorHandlers.err500);
};