var Post = require('../models/post.js');
var utilities = require('./pages/utilities.js');

exports.index = function(req, res) {
	res.redirect('/home');
}

exports.blog = function(req, res) {
	Post.find({})
		.sort('-date')
		.populate('media.image')
		.exec(function(err, posts) {
			if(err) console.log(err);
			if(err) next(err);
			var filtered_posts = [];
			posts.forEach(function(element, index, arr) {
				try {
					var primary_image = element.media.primary_image;
					var urls = element.media.image[primary_image].urls;
					if(urls.original && urls.most_recent && urls.archive) {
						filtered_posts.push(element);
					}
				} catch (err) {
					console.log(err);
				}
			})

			res.render('audience/blog/blog', {posts: filtered_posts, current_page: 'home'});
		});
};

exports.about = function(req, res) {
	res.render('audience/about/about', {current_page: 'about'});
};

exports.post = function(req, res) {
	Post
		.findById(req.params.id)
		.populate('media.image')
		//.populate('media.audio')
		//.populate('media.video')
		.exec(function(err, post) {
			if(err) {
				res.send(500);
			}
			post.info.text = utilities.processText(post);
			res.render('audience/blog_post/blog_post', { post: post, current_page: post.info.title });
		});
};

exports.thanks = function(req, res) {
	res.render('audience/thanks/thanks', {current_page: 'thanks'});
};