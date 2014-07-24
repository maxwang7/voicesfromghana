var Post = require('../../models/post');

exports.POST = function(req, res) {
	var post_id = req.params.id;

	Post.findById(post_id, function(err, post) {
		if(err) {
			res.send(500);
		}
		post.remove(function(err, product) {
			if(err) {
				res.send(500);
			}
			res.redirect('/admin/dashboard');
		});
	});
};


exports.NO_VERB = function(req, res) {
	res.send(500);
};