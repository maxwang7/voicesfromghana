/* FILE: routes/index.js
 * --------------------
 * Description: 
 */

module.exports = function(app) {
	var defaultHandlers = require('./default.js');
	var errorHandlers = require('./error.js');
	var postHandlers = require('./post.js');
	var pageHandlers = require('./pages.js');

	// Default
	app.get('/', pageHandlers.blog);

	// For audience
	app.get('/blog', pageHandlers.blog);

	app.get('/about', pageHandlers.about);

	// For Christine
	app.get('/admin/blog', adminHandlers.blog);

	app.post('/admin/blog/create', adminHandlers.blogCreate);

	app.get('/admin/blog/get/:id', adminHandlers.blogGet);

	app.post('/admin/blog/edit/:id', adminHandlers.blogEdit);

	app.post('/admin/blog/delete/:id', adminHandlers.blogEdit);

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