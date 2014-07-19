var Post = require('../models/post.js');
var utilities = require('./pages/utilities.js');

exports.index = function(req, res) {
	res.redirect('/blog');
}

exports.blog = function(req, res) {
	Post.find({})
		.sort('-timestamp')
		.populate('media.image')
		.exec(function(err, posts) {
			if(err) console.log(err);
			if(err) next(err);
			res.render('audience/blog/blog', {posts: posts, current_page: 'home'});
		});
};

exports.about = function(req, res) {
	res.render('audience/about/about', {current_page: 'about'});
};

exports.post = function(req, res) {
	Post
		.findById(req.params.id)
		.populate('media.image')
		//.populate('media.audio')
		//.populate('media.video')
		.exec(function(err, post) {
			post.info.text = utilities.processText(post);
			res.render('audience/blog_post/blog_post', {post: post});
		});
};

exports.thanks = function(req, res) {
	res.render('audience/thanks/thanks');
};