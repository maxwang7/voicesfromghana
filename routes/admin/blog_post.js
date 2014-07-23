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
		res.render(template);
	}
};


//// Creates/update a blog post without media elements
// If req.params.id is defined, it is the id of the Post
// object to update. If undefined, creates a new Post.
//// Respond with a 200 if successful (don't redirect).
exports.POST = function(req, res) {
	var redirect_path = '/admin/media/';

	// Counts the number of times the search_str appears
	// in the text
	function count(text, search_str) {
		return text.split(search_str).length - 1;
	}

	var text = body.text;
	var num_images = count(text, '##image##'),
		num_audios = count(text, '##audio##'),
		num_videos = count(text, '##video##');

	var is_profile = req.body.isProfile === 'on';

	if(id) { // req.params.id exists, updating an existing post
		Post.findById(id, function(err, post) {
			if(err) {
				res.send(status.INTERNAL_SERVER_ERROR);
			}
			post.info = create_post_info(body);
			post.isProfile = is_profile;
			post.save(function(err, product, numAffected) {
				if(err) {
					res.send(status.INTERNAL_SERVER_ERROR);
				}
			});
			res.redirect(redirect_path + post._id);
		});
	} else { // req.params.id is not defined, creating a new post
		var post = new Post({
			info : create_post_info(body),
			isProfile : is_profile
		});

		// Create empty images and push into image array
		// Do similar with audios and videos
		// TODO: Is there a better way to do this?
		for(var m = 0; m < num_images; m++) {
			var image = new Image();
			post.media.image.push(image._id);
			image.save();
		}
		for(var m = 0; m < num_audios; m++) {
			var audio = new Audio();
			post.media.audio.push(audio._id);
			audio.save();
		}
		for(var m = 0; m < num_videos; m++) {
			var video = new Video();
			post.media.video.push(video._id);
			video.save();
		}

		post.save();
		res.redirect(redirect_path + post._id);
	}
};

// No handler exists for the http verb that was
// used
exports.NO_VERB = function(req, res) {
	res.send(status.INTERNAL_SERVER_ERROR);
};