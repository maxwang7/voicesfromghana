// catch 404 and forwarding to error handler
exports.err404 = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

// production error handler
// no stacktraces leaked to user
exports.err500 = function(err, req, res, next) {
	res.status(err.status || 500);
    res.render('audience/error/error', {
        message: err.message,
        error: {}
    });
};