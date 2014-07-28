var Post = require('../models/post'),
	Image = require('../models/image'),
	Audio = require('../models/audio'),
	Video = require('../models/video'),
	assert = require('assert'),
	mongoose = require('mongoose');

describe('Models', function() {
	
	before(function(done) {
		var DB_TEST_SERVER = 'mongodb://localhost/voices-test';
		mongoose.connect(DB_TEST_SERVER);
		done();
	});

	beforeEach(function(done) {
		done();
	});

	afterEach(function(done) {
		done();
	});

	after(function(done) {
		// mongoose.disconnect();
		done();
	});

	describe('Post', function() {
		describe('default', function() {
			it('should save without error when saving a post with default values', function(done) {
				var post = new Post();
				post.save(function(err, product, numAffected) {
					if(err) {
						throw new Error(err.message);
						done();
					}
					done();
				});
			});
		});

		describe('info', function() {
			describe('description', function() {
				it('should save without error when saving a description of 0 characters', function(done) {
					var post = new Post({
						info: {
							description: ''
						}
					});
					post.save(function(err, product, numAffected) {
						if(err) {
							throw new Error(err.message);
							done();
						}
						done();
					});
				});


				it('should save without error when saving a description of 150 characters', function(done) {
					var post = new Post({
						info: {
							description: ''
						}
					});
					post.save(function(err, product, numAffected) {
						if(err) {
							throw new Error(err.message);
							done();
						}
						done();
					});
				});


				it('should raise an error when saving a description of 151 characters', function(done) {
					var one_hundred_fifty_one = ''
					for(var m = 0; m < 151; m++) {
						one_hundred_fifty_one += 'x';
					}
					var post = new Post({
						info: {
							description: one_hundred_fifty_one
						}
					});
					post.save(function(err, product, numAffected) {
						if(err) {
							done();
						} else {
							throw new Error('Error');
							done();
						}
					});
				});
			});
		});

		describe('media', function() {
			describe('primary_image', function() {
				it('should save without error when saving a primary image of 0 and image array length of 1', function(done) {
					var img = new Image();
					var post = new Post({
						media: {
							image: [img._id],
							primary_image: 0
						}
					});
					post.save(function(err, product, numAffected) {
						if(err) {
							throw new Error(err.message);
						}
						done();
					});
				});

				it('should raise an error when saving a primary image of 1 and image array length of 1', function(done) {
					var img = new Image();
					var post = new Post({
						media: {
							image: [img._id],
							primary_image: 1
						}
					});
					post.save(function(err, product, numAffected) {
						if(err) {
							done();
						} else {
							throw new Error(err.message);
							done();
						}
					});
				});
			});
		});
	});
});