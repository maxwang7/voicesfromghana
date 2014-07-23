var utilities = require('./utilities'),
	status = require('http-status-codes'),
	Post = require('../../models/post'),
	Image = require('../../models/image'),
	Audio = require('../../models/audio'),
	Video = require('../../models/video');

var id,
	body,
	params;

// Defines some constants that are used by multiple methods in this module
exports.define_vars = function(req, res) {
	post_id = req.params.post_id;
	body = req.body;
	params = req.params;
};

// Renders the media page
// req.params._postid contains the post_id of the Post
// to which all the media belongs
exports.GET = function(req, res) {
	if(post_id) {
		var template = 'admin/media';
		Post
			.findById(post_id)
			.populate('media.image')
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
//// if req.params.post_id is defined, it is the 
// id of the Post object to which the media object
// should belong. If req.params.post_id isn't defined,
// create an unattached media object
//// if req.params.id is defined, then req.body.media_id
// contains the id of the media object
//// req.body.type is the type of media object. Options:
// 'image', 'video', or 'audio'. If not one of these 
// options, responds with an error.
//// req.body.media is a JS object of the correct 
// media type, set the urls equal
exports.POST = function(req, res) {
	if(post_id) {
		var media_id = req.body.media_id,
			type = req.body.type,
			media = req.body.media;
		if(type === 'image') {
			Image.findById(media_id, function(err, image) {
				if(err) {
					res.send(status.INTERNAL_SERVER_ERROR);
				}
				image.urls = media.urls;
				console.log(image);
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