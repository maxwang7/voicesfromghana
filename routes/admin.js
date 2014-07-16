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
		res.render('admin/media', {post: post, num_images: 2}); // !!! Need to make dynamic
	});
};

// For uploading media. Takes an id in the params field. 
// Creates new media objects, then puts the object ids in
// the post's media arrays.
exports.blogAddMediaPOST = function(req, res, next) {
	// Create Image object
	var media;
	if(req.body.type === 'image') {
		media = new Img({
			url: req.body.url
		});
	}
	// Get Post
	Post.findById(req.params.id, function(err, post) {
		post.media.image.push(media._id);
		post.save(function(err, product, numAffected) {
			if(err) {
				res.send(500);
			} else {
				res.send(200);
			}
		})
	});
};

exports.blogAddImagePreviewPOST = function(req, res, next) {
	var image;
	Image.findById(req.body.id, function(err, img) {
		if(err) res.send(500);
		img.most_recent = req.body.most_recent;
		img.archive = req.body.archive;
		img.save(function(err, product, numAffected) {
			if(err) res.send(500);
		})
	});
};