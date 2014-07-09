var Post = require('../models/post.js');

exports.index = function(req, res) {
	res.redirect('/blog');
}

exports.blog = function(req, res) {
	Post.find({}, function(err, posts) {
		if(err) console.log(err);
		if(err) next(err);
		res.render('home/home', {posts: posts, current_page: 'home'});
	});
};