var Post = require('../models/post.js');

exports.blog = function(req, res, next) {
	Post.find({}, function(err, posts) {
		if(err) next(err);
		res.render('admin/dashboard', {posts: posts});
	})
}