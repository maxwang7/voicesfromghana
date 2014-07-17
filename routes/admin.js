var Post = require('../models/post.js'),
	Img = require('../models/image.js');
	// Audio = require('../models/audio.js'),
	// Video = require('../models/video.js');
var utilities = require('./admin/utilities');

exports.dashboard = function(req, res) {
	Post.find({}, function(err, posts) {
		if(err) console.log(err);
		res.render('admin/dashboard', {posts: posts});
	});
};

exports.blogCreateGET = function(req, res) {
	res.render('admin/create', {debug : true});
};

exports.blogCreatePOST = function(req, res, next) {
	// Create new images
	var count = 0;

	var post = new Post({
		info: {
			title: req.body.title,
			description: req.body.description,
			text: req.body.story,
			tags: utilities.processTags(req.body.tags),
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
		if(utilities.contains_media(product.info.text)) {
			res.redirect('/admin/blog/addMedia/' + post._id);
		} else {
			res.redirect('/admin/dashboard');
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

exports.blogGetJSON = function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		console.log(post);
		if(err) console.log(err);
		if(err) next(err);
		res.json(post);
	});
}

exports.blogUpdate = function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		if(err) next(err);
		post.info = {
			title: req.body.title,
			description: req.body.description,
			text: req.body.text,
			tags: utilities.processTags(req.body.tags),
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
		var num_images = utilities.count_images(post.info.text);
		res.render('admin/media', {
			post: post,
			num_images: num_images
		}); // !!! Need to make dynamic
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
			url: req.body.url,
		});
		media.save();
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
		});
	});
};

exports.blogAddImagePreviewPOST = function(req, res, next) {
	var condition = { url : req.body.selected_image_url },
		update = {
			most_recent : req.body.most_recent, 
			archive: req.body.archive
		},
		options = { multi : true };

	Img.update(condition, update, options, function(err, numAffected, rawResponse) {
		if(err) {
			res.send(500);
		}

		Post.findById(req.params.id, function(err, post) {
			if(err) {
				res.send(500);
			}
			post.media.primary_image = req.body.selected_image_index;
			post.save();
			res.redirect('admin/dashboard');
		});
	});
};

exports.blogGetMedia = function(req, res, next) {
	Post
		.findById(req.params.id)
		.populate('media.image')
		.exec(function(err, post) {
			if(err) {
				res.send(500);
			}
			res.render('admin/view_media', { images : post.media.image });
		});
};