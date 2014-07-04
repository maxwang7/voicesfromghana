/* FILE: routes/post.js
 * --------------------
 * Description: 
 */

var Post = require('../models/post.js')

exports.create = function(req, res, next) {
	var post = new Post(req.body.post);
	post.save(function(err) {
		if(err) next(err);
	})
	res.send(200);
}

exports.get = function(req, res, next) {
	Post.findById(req.params.id, function(err, post) {
		if(err) return next(err);
		if(!post) return next(new Error('Failed to find post'));
		res.json(post);
	})
}

exports.update = function(req, res, next) {
	Post.findById(req.body.post.id, function(err, post) {
		if(err) return next(err);
		if(!post) return next(new Error('Failed to find post'));
		post.info = req.body.post.info;
		post.media = req.body.post.media;
		post.save(function(err) {
			if(err) next(new Error('Update not saved'));
		});
		res.send(200);
	})
}

exports.delete = function(req, res, next) {
	Post.findByIdAndRemove(req.body.post.id, function(err, post) {
		if(err) return next(err);
		if(!post) return next(new Error('Post not deleted'));
		res.send(200);
	})
}

exports.get_recent = function(req, res, next) {
	var callback = function(err, post) {
		if(err) next(err);
		if(!post) next(new Error('Post not found'));
		res.json(post);
	}
	Post.sort('-timestamp')
		.limit(1)
		.exec(callback);
}

exports.get_all = function(req, res, next) {
	var callback = function(err, posts) {
		if(err) next(err);
		if(!posts) next(new Error('Posts not found'));
		res.json(posts);
	}
	Post.find()
		.sort('-timestamp')
		.exec(callback);
}