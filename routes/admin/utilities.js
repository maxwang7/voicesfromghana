var fs = require('fs'),
	request = require('request');
var AWS = require('aws-sdk'),
	aws_keys = require('../../config/aws.json');
var gm = require('gm'),
	imageMagick = gm.subClass({ imageMagick : true });

exports.processTags = function() {
	// Need to finish implementation!
	var processTags = function(tags_str) {
		return tags_str;
	};
};

exports.contains_media = function(text) {
	// Need to finish implementation
	return text.indexOf('##image') !== -1 ||
		text.indexOf('##video') !== -1 ||
		text.indexOf('##audio') !== -1;
};

exports.count_images = function(text) {
	return text.split('##image##').length - 1;
};

// Given a the url of an image and the dimensions, 
// normalized to a proportion of the image size, returns
// a url that corresponds with the newly cropped image in AWS
exports.crop_image = function(image_url_, relative_dimensions_, final_width) {

	var s3 = new AWS.S3();
	var read_params = {
		Bucket: 'voices-from-ghana-test'.
		Key: image_url_.split('/')
	}

	// var crop = function(relative_dimensions_, filename, callback) {
	// 	var abs_dimensions;
	// 	imageMagick(filename)
	// 		.size(function(err, value) {
	// 			abs_dimensions = {
	// 				x: relative_dimensions_.x * value.width,
	// 				y: relative_dimensions_.y * value.height,
	// 				width: relative_dimensions_.width * value.width,
	// 				height: relative_dimensions_.height * value.height
	// 			};
	// 		})
	// 		.crop(abs_dimensions.width, abs_dimensions.height, abs_dimensions.x, abs_dimensions.y)
	// 		.resize(final_width)
	// 		.write(filename, callback);
	// };

	// var upload_image = function() {
	// 	AWS.config.loadFromPath('../../config/aws.json');
	// };

	// var filename = "temp";
	// var config_aws_path = '../../config/aws.json';
	// var bucket = 'voices-from-ghana-test'

	// request.head(image_url_, function(err, res, body) {
	// 	request(image_url_).pipe(fs.createWriteStream(filename)).on('close', function() {
	// 		var abs_dimensions;
	// 		imageMagick(filename)
	// 			.size(function(err, value) {
	// 				abs_dimensions = {
	// 					x: relative_dimensions_.x * value.width,
	// 					y: relative_dimensions_.y * value.height,
	// 					width: relative_dimensions_.width * value.width,
	// 					height: relative_dimensions_.height * value.height
	// 				};
	// 			})
	// 			.crop(abs_dimensions.width, abs_dimensions.height, abs_dimensions.x, abs_dimensions.y)
	// 			.resize(final_width)
	// 			.write(filename, function() {
	// 				AWS.config.loadFromPath(config_aws_path);
	// 				var s3 = new AWS.S3();
	// 				s3.createBucket({ Bucket : bucket}, function() {
	// 					var params = {
	// 						Key: filename,
	// 						ContentType: file.type,
	// 						Body: file,
	// 						ACL: 'public-read'
	// 					}
	// 				});
	// 			});
	// 	});
	// });



};