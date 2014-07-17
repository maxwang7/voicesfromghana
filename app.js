// app.js
var express = require("express"),
	app = express();
// middleware
var favicon = require('static-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');
var logfmt = require("logfmt"),
	path = require('path');
//var passport = require('passport'); // decompose

// middleware
app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Heroku logging
app.use(logfmt.requestLogger());

// Config view engine
require('./config/jade')(app, __dirname);

// Config Mongoose
var mongoose = require('mongoose');
require('./config/mongoose')(mongoose);

// Routes
require('./routes/index.js')(app);

// Tell server to listen
var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
