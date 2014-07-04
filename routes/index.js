/* FILE: routes/index.js
 * --------------------
 * Description: 
 */

module.exports = function(app) {
	var defaultHandlers = require('./default.js');
	var errorHandlers = require('./error.js');
	var postHandlers = require('./post.js');

	// Default
	app.get('/', defaultHandlers.home);

	app.get('/partials/:name', defaultHandlers.partials);

	// Renders pages
	app.post('/api/post/create', postHandlers.create);

	app.get('/api/post/get/:id', postHandlers.get);

	app.post('/api/post/update', postHandlers.update);

	app.post('/api/post/delete', postHandlers.delete);

	app.get('/api/post/get/recent', postHandlers.get_recent);

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