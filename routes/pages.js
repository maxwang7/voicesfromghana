var Post = require('../models/post.js');

exports.blog = function(req, res) {
	Post.find({}, function(err, posts) {
		if(err) console.log(err);
		if(err) next(err);
		res.render('home/home', {posts: posts});
	});
};