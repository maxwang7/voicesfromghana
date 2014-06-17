// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();
//var mongoose = require('mongoose'); // decompose
//var passport = require('passport'); // decompose

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    res.send('Hello Chistine :)');
});

app.get('/test', function(req, res) {
  res.send('Successful test');
});

app.get('*', function(req, res) {
  res.send('404');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
