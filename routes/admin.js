var Post = require('../models/post.js');

exports.dashboard = function(req, res) {
	Post.find({}, function(err, posts) {
		if(err) console.log(err);
		res.render('admin/dashboard', {posts: posts});
	});
};

exports.blogCreateGET = function(req, res) {
	res.render('admin/create', {debug : true});
};

// Need to finish implementation!
var processTags = function(tags_str) {
	return tags_str;
};

exports.blogCreatePOST = function(req, res, next) {
	var post = new Post({
		info: {
			title: req.body.title,
			description: req.body.description,
			text: req.body.text,
			tags: processTags(req.body.tags),
			location: req.body.location
		},
		isProfile: req.body.isProfile,
		media: {
			audio: [],
			photo: [],
			video: []
		},
	});
	post.save(function(err, product, numAffected) {
		if(err) next(err);
		res.redirect('/admin/dashboard');
	});
};

exports.blogGet = function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		console.log(post);
		if(err) console.log(err);
		if(err) next(err);
		res.render('admin/get', {post: post});
	});
};

exports.blogUpdate = function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		if(err) next(err);
		post.info = {
			title: req.body.title,
			description: req.body.description,
			text: req.body.text,
			tags: processTags(req.body.tags),
			location: req.body.location
		};
		post.save(function(err, product, numAffected) {
			if(err) next(err);
			res.redirect('/admin/dashboard');
		});
	});
};

exports.blogDelete = function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		if(err) next(err);
		post.remove();
		res.redirect('/admin/dashboard');
	})
}