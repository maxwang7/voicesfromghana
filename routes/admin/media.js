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
	id = req.params.id;
	body = req.body;
	params = req.params;
};

// Renders the media page
// req.params.id contains the id of the Post
// to which all the media belongs
exports.GET = function(req, res) {
	var template = 'admin/media';
};


//// Used to create an image
//// if req.params.id is defined, it is the 
// id of the Post object to which the media object
// should belong. If req.params.id isn't defined,
// create an unattached media object
//// req.body.type is the type of media object. Options:
// 'image', 'video', or 'audio'. If not one of these 
// options, responds with an error.
//// req.body.media is a JS object of the correct 
// media type
exports.POST = function(req, res) {
	if(id) {

	} else {
		
	}
};