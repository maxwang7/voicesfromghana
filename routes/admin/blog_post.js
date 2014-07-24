var utilities = require('./utilities'),
	status = require('http-status-codes'),
	Post = require('../../models/post'),
	Image = require('../../models/image'),
	Audio = require('../../models/audio'),
	Video = require('../../models/video');

var id,
	params,
	body;

// Returns a JS object containing all the information
// for a post's info field, provided the body property of the
// request object (req.body)
function create_post_info(body) {
	return {
		title : body.title,
		description : body.description,
		text : body.text,
		tags : utilities.process_tags(body.tags),
		location : body.location
	};
};

// TODO: remove define vars and define them in each handler
// Remove them from the main admin page as well.

// Defines some constants that are used by multiple methods in this module
exports.define_vars = function(req, res) {
	id = req.params.id;
	params = req.params;
	body = req.body;
};

//// Renders the blog create/update page
//// If req.params.id is defined, it is the id of the
// post, and should be used to render the page.
// If req.params.id is undefined, render the page
// without any placeholders.
exports.GET = function(req, res) {
	var template = 'admin/create'	
	if(id) { // req.params.id exists, updating an existing post
		Post.findById(id, function(err, post) {
			if(err) {
				res.send(status.INTERNAL_SERVER_ERROR);
			}
			res.render(template, { post : post });
		});
	} else { // req.params.id is not defined, creating a new post
		var post = new Post();
		post.save();
		res.render(template, { post : post });
	}
};


//// Creates/update a blog post without media elements
// If req.params.id is defined, it is the id of the Post
// object to update. If undefined, creates a new Post.
//// Respond with a 200 if successful (don't redirect).
exports.POST = function(req, res) {
	var redirect_path = '/admin/media/';
	var is_profile = (req.body.isProfile === 'on');

	function count(text, search_str) {
		return text.split(search_str).length - 1;
	}

	var text = body.text;
	var num_images = count(text, '##image##'),
		num_audios = count(text, '##audio##'),
		num_videos = count(text, '##video##');

	Post.findById(id, function(err, post) {
		if(err) {
			res.send(status.INTERNAL_SERVER_ERROR);
		}

		post.info = create_post_info(body);
		post.isProfile = is_profile;
		// TODO: Clean this up, this is atrocious
		// How can it be cleaned up though?
		if(post.media.image.length !== num_images) {
			// Create new images, replace old image array in post
			var images = [];
			for(var m = 0; m < num_images; m++) {
				var image = new Image();
				image.save();
				images.push(image._id);
			}
			post.media.image = images;
		}
		if(post.media.audio.length !== num_audios) {
			// Create new audios, replace old audio array in post
			var audios = [];
			for(var m = 0; m < num_audios; m++) {
				var audio = new Audio();
				audio.save();
				audios.push(audio._id);
			}
			post.media.audio = audios;
		}
		if(post.media.video.length !== num_videos) {
			// Create new images, replace old image array in post
			var videos = [];
			for(var m = 0; m < num_videos; m++) {
				var video = new Video();
				video.save();
				videos.push(video._id);
			}
			post.media.video = videos;
		}


		post.save(function(err, product, numAffected) {
			if(err) {
				res.send(status.INTERNAL_SERVER_ERROR);
			}
		});
		res.redirect(redirect_path + post._id);
	})
};

// No handler exists for the http verb that was
// used
exports.NO_VERB = function(req, res) {
	res.send(status.INTERNAL_SERVER_ERROR);
};