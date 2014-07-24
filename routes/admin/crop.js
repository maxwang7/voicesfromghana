var status = require('http-status-codes'),
	Post = require('../../models/post'),
	Image = require('../../models/image'),
    path = require('path'),
    gm = require('../utilities/gm'),
    aws = require('../utilities/aws'),
    file_manager = require('../utilities/files');


/* Renders the crop page
   req.params.index must be defined.
   req.params.id is the id of the post to which
   image belongs.
   req.params.index must be less than the length of the
   post's media.image array length
 */
exports.GET = function(req, res) {
	var post_id = req.params.id,
		index = req.params.index;
	if(index === undefined) {
		res.send(500);
	}
    Post
        .findById(post_id)
        .populate('media.image')
        .exec(function(err, post) {
            if(err) {
                res.send(500);
            }
            var image = post.media.image[index];
            res.render('admin/crop', { post : post, image : image, index : index });
        });
};

/*	Crops the images to the normalized dimensions
received.
	req.params.id is the id of the post
    req.params.index is the index of the image in the
        post's media.image array
    req.body.type is the type of crop (most recent, etc.)
	req.body.dim contains the normalized dimensions
   		normalized dimensions have the following
        four properties:
        * x
        * y
        * width
        * height
        these values represent the proportion of the
        length in the direction of the value. For
        example, the value of x is a proportion of
        the length of the width.
    Should respond with a url to the new cropped image.
 */
exports.POST = function(req, res) {
    var post_id = req.params.id,
        index = req.params.index,
        type = req.body.type,
        dim = req.body.dim;

    // TODO: change at production time
    var bucket_name = 'voices-from-ghana-test',
        key;

    Post.findById(post_id, function(err, post) {

        post.media.primary_image = index;

        var image_id = post.media.image[index];
        Image.findById(image_id, function(err, image) {

            var key = path.basename(image.urls.original),
                ext = path.extname(key);

            aws.read(bucket_name, key, function(key) {

                file_manager.add(key);

                function get_crop_type(type_from_client) {
                    if(type_from_client === 'Most Recent') {
                        return 'most_recent';
                    } else if(type_from_client === 'Archive') {
                        return 'archive';
                    } else if(type_from_client === 'People') {
                        return 'people';
                    }
                }

                function get_final_dim(crop_type) {
                    if(crop_type === 'most_recent') {
                        return {
                            width: 473,
                            height: 361
                        };
                    } else if(crop_type === 'archive') {
                        return {
                            width: 350,
                            height: 262
                        };
                    } else if(crop_type === 'people') {
                        return {
                            width: 270,
                            height: 270
                        };
                    }
                }

                type = get_crop_type(type);
                var final_dim = get_final_dim(type);

                gm.crop(key, ext, dim, final_dim, function(file_name) {

                    file_manager.add(file_name);

                    aws.write(bucket_name, file_name, function(key) {

                        image.urls[type] = 'https://s3-us-west-2.amazonaws.com/voices-from-ghana-test/' + key;

                        // TODO: Should use Promises for these two
                        image.save(function(err, product, numAffected) {

                            if(err) {
                                res.send(500);
                            }

                            post.save(function(err, product, numAffected) {
                                if(err) {
                                    res.send(500);
                                }
                                // TODO: clearing files produces errors when the same 
                                // image is cropped twice
                                file_manager.clearAll();

                                res.redirect('/admin/crop/' + post_id + '/' + index);
                            });
                        });
                    });
                });
            });
        });
    })
};


exports.NO_VERB = function(req, res) {
	res.send(500);
};