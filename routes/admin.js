var Post = require('../models/post.js'),
	Img = require('../models/image.js');
	// Audio = require('../models/audio.js'),
	// Video = require('../models/video.js');

var crypto = require('crypto');

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


// Need to finish implementation!
var story_contains_media = function(story) {
	return story.indexOf('##image') !== -1 ||
		story.indexOf('##video') !== -1 ||
		story.indexOf('##audio') !== -1;
}

exports.blogCreatePOST = function(req, res, next) {
	// Create new images
	var count = 0;

	var post = new Post({
		info: {
			title: req.body.title,
			description: req.body.description,
			text: req.body.story,
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
		if(story_contains_media(product.info.text)) {
			res.redirect('/admin/blog/addMedia/' + post._id);
		} else {
			res.redirect('/admin/dashboard')
		}
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
	});
};

// For uploading media. Takes an id in the params field. Parses
// the text field for '#photo:name#', '#audio:name#', and '#video:name#', then
// creates a template to upload the number of each media element.
exports.blogAddMediaGET = function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		if(err) next(err);
		res.render('admin/media', {post: post});
	});
};

// For uploading media. Takes an id in the params field. 
// Creates new media objects, then puts the object ids in
// the post's media arrays.
exports.blogAddMediaPOST = function(req, res, next) {
	// Create Image objects
	var images = JSON.stringify(req.body.images);
	var image_ids = [];
	req.body.images.forEach(function(element, index, array) {
		var img = new Img(element);
		img.save(function(err, product, numAffected) {
			image_ids.append(img._id);
			if(err) next(err);
		});
	});
	// Create Video objects
	// Create Audio objects
	Post.findById(req.params.id, function(err, post) {
		if(err) next(err);
		post.media.image = image_ids;
		// add video and audio objects
		post.save();
	});
};