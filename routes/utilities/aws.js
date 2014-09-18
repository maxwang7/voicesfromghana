// This file contains all of the necessary functions to
// read from and write to AWS S3. All files should be 
// designated public

var AWS = require('aws-sdk');
var fs = require('fs');
var mime = require('mime');
var path = require('path');

// The authenitication information necessary to interact with AWS
var auth = {
	"accessKeyId" : "AKIAI2WFBX77PAQOZIRQ",
	"secretAccessKey" : "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",
}

function bucket_name(app) {
	if(process.env.NODE_ENV == 'development') {
		return 'voices-from-ghana-test';
	}
	if(process.env.NODE_ENV == 'production') {
		return 'voices-from-ghana'
	}
}

AWS.config.update(auth);
var s3 = new AWS.S3();

// Returns the name of the bucket to use
exports.bucket_name = function(app) {
	return bucket_name(app);
}

// Reads a file from AWS, saves it in the local drive
// with the same name (i.e. key).
// When complete, calls callback with the filename, the
// name of the file just written
exports.read = function(bucket, key, callback) {
	var params = {
		Bucket : bucket,
		Key : key
	};
	var file = fs.createWriteStream(key);
	s3.getObject(params, function(err, data) {
		if (err) {
			return new Error('Error: Object not found');
		}
		fs.writeFile(key, data.Body, 'utf8', function(err) {
			if(err) {
				return new Error('Couldn\'t write to disk');
			}
			callback(key);
		})
	});
};

// Writes a file to AWS
// The filename must contain the correct extension for the method
// to function correctly
exports.write = function(bucket, filename, callback) {
	var key = Date.now() + path.extname(filename);
	var mime_type = mime.lookup(key);
	console.log(mime_type);
	file = fs.createReadStream(filename);
	var params = {
		Bucket: bucket,
		Key: key,
		ContentType: mime_type,
		Body: file,
		ACL: 'public-read'
	}

	s3.putObject(params, function(err, data) {
		if(err) {
			throw err;
		}
		callback(key);
	});
};