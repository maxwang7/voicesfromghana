var Post = require('../models/post.js'),
	Img = require('../models/image.js');
	// Audio = require('../models/audio.js'),
	// Video = require('../models/video.js');
var utilities = require('./admin/utilities');


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

//// Renders the crop page
//// req.params.img_id is the id of the image,
// and must be defined
//// req.params.post_id is the id of the post,
// and must be defined
//// req.params.index is the index of the image
// in the post array.
exports.crop_page = function(req, res) {

};

//// Used to crop an image
//// req.params.id is the id of the image 
exports.crop = function(req, res) {

};