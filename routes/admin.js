var Post = require('../models/post.js'),
	Img = require('../models/image.js');
	// Audio = require('../models/audio.js'),
	// Video = require('../models/video.js');
var utilities = require('./admin/utilities');

// TODO: Selecting the verb/method type can totally be done using
// some JS metaprogramming, encapsulating each handler in
// a JS object property


// Renders the main dashboard page with all of the posts
exports.dashboard = function(req, res) {
	Post.find({}, function(err, posts) {
		if(err) console.log(err);
		res.render('admin/dashboard', {posts: posts});
	});
};


exports.blog_post = function(req, res) {
	var blog_post = require('./admin/blog_post');
	blog_post.define_vars(req, res);

	var method = req.method;
	if(method === 'GET') {
		blog_post.GET(req, res);
	} else if(method === 'POST') {
		blog_post.POST(req, res);
	} else {
		blog_post.NO_VERB(req, res);
	}
};


exports.media = function(req, res) {
	var media = require('./admin/media');
	media.define_vars(req, res);

	var method = req.method;
	if(method === 'GET') {
		media.GET(req, res);
	} else if(method === 'POST') {
		media.POST(req, res);
	} else {
		media.NO_VERB(req, res);
	}
};


exports.crop = function(req, res) {
	var crop = require('./admin/crop');

	var method = req.method;
	if(method === 'GET') {
		crop.GET(req, res);
	} else if(method === 'POST') {
		crop.POST(req, res);
	} else {
		crop.NO_VERB(req, res);
	}
};


exports.blog_delete = function(req, res) {
	var blog_delete = require('./admin/blog_delete');

	var method = req.method;
	if(method === 'POST') {
		blog_delete.POST(req, res);
	} else {
		blog_delete.NO_VERB(req, res);
	}
};