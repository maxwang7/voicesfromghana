var Post = require('../models/post.js');
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

exports.blogCreateSIGN = function(req, res, next) {
	var object_name = req.query.s3_object_name + Date.now();
	var mime_type = req.query.s3_object_type;
	var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
	var AWS_ACCESS_KEY = process.env.AWS_SECRET_KEY;
	var S3_BUCKET = process.env.S3_BUCKET;

	var now = new Date();
	var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;

    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
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