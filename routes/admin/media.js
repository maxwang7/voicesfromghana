var utilities = require('./utilities'),
	status = require('http-status-codes'),
	Post = require('../../models/post'),
	Image = require('../../models/image'),
	Audio = require('../../models/audio'),
	Video = require('../../models/video');
// TODO: encapsulate the above variables in an object for metaprogramming?
// might save a lot of code in the POST method especially

var id,
	body,
	params;

// Defines some constants that are used by multiple methods in this module
exports.define_vars = function(req, res) {
	id = req.params.id;
	body = req.body;
	params = req.params;
};

// Renders the media page
// req.params.id contains the id of the Post
// to which all the media belongs
exports.GET = function(req, res) {
	var post_id = id;
	if(post_id) {
		var template = 'admin/media';
		Post
			.findById(post_id)
			.populate('media.image')
			// TODO: Implement audio and video
			//.populate('media.audio')
			//.populate('media.video')
			.exec(function(err, post) {
				if(err) {
					res.send(status.INTERNAL_SERVER_ERROR);
				}
				res.render(template, { post : post });
			});
	} else {
		var template = 'admin/allMedia';
		// TODO: implement as Promises -- see mongoose documentation for promises
		Image.find({}, function(err, images) {
			if(err) {
				res.send(status.INTERNAL_SERVER_ERROR);
			}
			Audio.find({}, function(err, audios) {
				if(err) {
					res.send(status.INTERNAL_SERVER_ERROR);
				}
				Video.find({}, function(err, videos) {
					if(err) {
						res.send(status.INTERNAL_SERVER_ERROR);
					}
					var medias = {
						images : images,
						audios : audios,
						videos : videos
					};
					res.render(template, medias);
				});
			});
		});
	}
};


//// Used to create an image
//// if req.params.id is defined, it is the id of the
// media object to change
//// req.body.type is the type of media object. Options:
// 'image', 'video', or 'audio'. If not one of these 
// options, responds with an error.
//// req.body.media is a JS object of the correct 
// media type, set the urls equal
exports.POST = function(req, res) {
	var media_id = id;
	if(media_id) {
		var type = req.body.type,
			media = req.body.media;
		if(type === 'image') {
			Image.findById(media_id, function(err, image) {
				if(err) {
					res.send(status.INTERNAL_SERVER_ERROR);
				}
				image.urls = media.urls;
				image.save(function(err, product, numAffected) {
					if(err) {
						res.send(status.INTERNAL_SERVER_ERROR);
					}
					res.send(status.OK);
				});
			});
		}
		// TODO: implement audio and video handling
		// TODO: implement error handling if the media type isn't either of the three media types
	} else {

	}
};