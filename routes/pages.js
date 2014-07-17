var Post = require('../models/post.js');

exports.index = function(req, res) {
	res.redirect('/blog');
}

exports.blog = function(req, res) {
	Post.find({})
		.sort('-timestamp')
		.populate('media.image')
		.exec(function(err, posts) {
			if(err) console.log(err);
			if(err) next(err);
			res.render('audience/blog/blog', {posts: posts, current_page: 'home'});
		});
};

exports.about = function(req, res) {
	res.render('audience/about/about', {current_page: 'about'});
}