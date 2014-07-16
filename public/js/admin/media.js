function ImageCropper() {
	var x, y, height, width
	var $save_btn,
		$crop_div

	var create_objects = function(ratio) {
		$save_btn = $('<button type="button">Save</button>')

		height = 100 * ratio
		width = 100

		$crop_div = $('<div></div>')
			.css('border', '2px solid black')
			.width(width)
			.height(height)
			.css('position', 'absolute')
	}

	return {
		crop : function crop(image_, ratio_, btn_container_, callback) {

			var $btn_container = $(btn_container_)
				ratio = ratio_
				$image = $(image_)

			create_objects(ratio)

			// Handlers
			$save_btn.click(save_handler)
			
			$image.click(crop_func)
			$crop_div.click(crop_func)

			var save_handler = function(e) {
				var dimensions = {
					x: x,
					y: y,
					height: height,
					width: width
				}

				callback(dimensions)
			}

			var crop_func = function(e) {
				// A shift click sets the coordinate of the bottom right corner
				// The height is then calculated from the ratio
				if(e.shiftKey) {
					$crop_div.width(function() {
						width = e.pageX - $(this).offset().left
						return width
					}).height(function() {
						height = $(this).width() * ratio
						return height
					})
				} else { // A click sets the coordinates of the top left corner
					$crop_div.offset({top: e.pageY, left: e.pageX})
					x = e.pageX
					y = e.pageY
				}
			}
		}
	}

}

function PreviewHandler() {
	var $container,
		post_url,
		$images = []

	var $header = $('<h2>Preview Image Selection</h2>')
	var $help_block = $('<p class="help-block">Select the thumbnail of the image you would like to be shown in the main blog page preview.</p>')
	// Display images that have been uploaded
	// input of some sort to select image
	
	return {
		register_image : function register_image(image_) {
			$image = $(image_)
			$images.push($image)
		},
		run : function run(post_url_, container_) {
			// Copy parameters to locals
			post_url = post_url_
			$container = $(container_)

			// Handler for image click
			var selected_image_index
			var add_click_handler

			add_click_handler = function(element, index, array) { // will this have to go before?
				var image_handler = function(e) {
					selected_image_index = index
					$images.forEach(function(element, index, array) {
						// turn off all listeners
						element.off()
						// hide all images
						element.detach()
					})

					// At this point, the image has been selected. Time to crop.
					var $selected_image = $images[selected_image_index]
					var data // data to send

					$selected_image.show()
						.width('100%')
						.appendTo($container)

					var cropper = ImageCropper()
					var most_recent_ratio = 0.7632
						archive_ratio = 0.7486
					var $save_btn_container = $('<div></div>').appendTo($container)

					// Handlers
					var most_recent_crop_handler,
						archive_crop_handler
					cropper.crop($selected_image[0], most_recent_ratio, $save_btn_container[0], most_recent_crop_handler)
					most_recent_crop_handler = function(dimensions) {
						// Save dimension in data to send later
						data.most_recent = dimensions
						// Call next crop function
						cropper.crop($selected_image[0], archive_ratio, $save_btn_container[0], archive_crop_handler)
					}
					archive_crop_handler = function(dimensions) {
						// Save dimensions to data objects
						data.archive = dimensions
						// success handler
						var success_handler,
							err_handler

						// Send data to server
						var send_data = function() {
							$.ajax({
								type: 'POST',
								url: post_url, 
								data: data,
								succes: success_handler,
								error: err_handler
							})
						}

						success_handler = function() {
							window.location.replace('/admin/dashboard')
						}

						err_handler = function() {
							send_data()
						}

						send_data($header, $help_block)
					}
				}
				element.click(image_handler)
			}

			$images.forEach(add_click_handler)

			// Show objects for inital use
			for(var m = 0; m < $images.length; m++) {
				$container.append($images[m].width(150))
			}
			$container.append(help_block)
		}
	}	
}

function AWSUploader(bucket_, access_key_id_, secret_access_key_, bucket_url_) {
	var bucket = bucket_,
		access_key_id = access_key_id_,
		secret_access_key = secret_access_key_,
		bucket_url = bucket_url_

	// configure
	AWS.config.update({
		accessKeyId: access_key_id,
		secretAccessKey: secret_access_key
	})

	var bucket = new AWS.S3({
		params: {
			Bucket: bucket
		}
	})

	return {
		upload: function upload(file_, file_name_, callback) {

			var file = file_,
				file_name = file_name_

			var params = {
				Key: file_name,
				ContentType: file.type,
				Body: file,
				ACL: 'public-read'
			}

			bucket.putObject(params, function(err, data) {

				callback(err, data)

			})
		},

		bucket_url: bucket_url
	}
}

function Uploader(container_, type_, text_, aws_uploader_, post_id_) {
	var type = type_,
		text = text_,
		aws_uploader = aws_uploader_,
		post_id = post_id_

	// Create DOM objects
	var $container = $(container_),
		$file_chooser = $('<input type="file" />'),
		$help_block = $('<p></p>'),
		$upload_btn = $('<button type="button">Upload</button>')

	// Add handlers and configure
	$upload_btn.hide()
	$help_block.html(text)

	var finish_handler // callback for when a media file is uploaded

	$file_chooser.change(function() {

		$upload_btn.show()

	})

	$upload_btn.click(function() {

		$file_chooser.off()
		var file = $file_chooser[0].files[0] // A JS object, not jQuery
		if(file) { // file found, uploading

			$help_block.html('Uploading...')
			var file_name = Date.now() + file.name

			var upload_complete_handler = function(err, data) {

				if(err) {

					$help_block.html('Error in uploading to Amazon. We\'ll try again for you, but maybe check your Internet? #minionsatwork')

				} else {

					$help_block.html('Uploaded to Amazon! Now reporting back to the server...')

					var save_data // Defined later

					var saved_handler = function() {
						$help_block.html('Saved in the database! Next!')
						window.setTimeout(function() {
							// Clear container
							$container.html('')

							// Call finish handler
							$image = $('<img src="' + aws_uploader.bucket_url + file_name + '" alt="Image not found" />')
							finish_handler($image[0])
						}, 1000)
					}

					var save_err_handler = function() {
						$help_block.html('Huh... seems like we\'re having some trouble connecting to the server... check your internet connection? We\'ll try again here #minionsatwork')
						save_data()
					}

					save_data = function() {
						$.ajax({
							url: '/admin/blog/addMedia/' + post_id, // POST to url
							type: 'POST',
							data: {
								type: type,
								url: aws_uploader.bucket_url + file_name
							},
							success: saved_handler,
							error: save_err_handler
						})
					}

					save_data()
				}
			}
			aws_uploader.upload(file, file_name, upload_complete_handler)
		} else { // No file to upload

			$help_block.html('No file to upload')

		}
	})

	return {
		run: function run(callback) {
			finish_handler = callback
			$container.append($file_chooser)
				.append($help_block)
				.append($upload_btn)
		}
	}
}

function Queue() {
	var queue = []

	// Removes the entry at index from the array, returning the altered array
	// Also modifies the array in place
	var array_remove = function (array, index) {
		if (index >= 0) {
			return array.splice(index, 1)
		}
	}

	return {
		append: function register(uploader) {
			queue.push(uploader)
		},
		// Executes callback upon completion of all functions
		execute: function execute(every_callback, complete_callback) {
			var next = function(image) {
				// Remove the uploader that was just run from the queue
				array_remove(queue, 0)
				every_callback(image)
				// Check if there's another uploader to run
				if(queue[0] !== undefined) {
					// If so, run it
					queue[0].run(next)
				} else { // Else, you're finished, execute callback
					complete_callback()
				}
			}
			if(queue[0] !== undefined) {
				queue[0].run(next)
			} else {
				complete_callback()
			}
		}
	}
}

// function ImageUploader() {
// 	// !!! Insecure, take this out!
// 	AWS.config.update({accessKeyId: 'AKIAJGSNN2L5MQLAT2MA', secretAccessKey: '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'});
// 	var bucket = new AWS.S3({params: {Bucket: 'voices-from-ghana'}});
// 	var modal_id = '#voices-admin-media-modal';
// 	var modal_content_id = '#voices-admin-media-modal-content';
// 	var modal_body_id = '#voices-admin-media-modal-body';

// 	// Used to help the user crop the image. image_container contains the image.
// 	// The ratio represents the ratio of the box to which the image must be cropped,
// 	// height/width
// 	// !!! Need to handle callbacks
// 	function ImageCropper(image, ratio, callback) {
// 		$image = $(image);
// 		$modal = $(modal_id);
// 		$modal_body = $(modal_body_id);

// 		// Indicates whether the modal is up or not
// 		var isModaled = false;
// 		// Set modal listeners
// 		$modal.on('hide.bs.modal', function(e) {
// 			isModaled = false;
// 			// Clear modal of content
// 			$modal_body.html('');
// 		});
// 		$modal.on('show.bs.modal', function(e) {
// 			isModaled = true;
// 			// Create stuff inside modal
// 			var $hidden_dimensions_fields = $('<input type="hidden" ng-model="startX"/> \
// 				<input type="hidden" ng-model="startY" /> \
// 				<input type="hidden" ng-model="endX"/> \
// 				<input type="hidden" ng-model="endY"/>')
// 			var $help_block = $('<p>Click somewhere on the image to set the top left corner of the crop box. Use shift+click to set the width. The ratio is locked to optimize for display on the blog page.</p>');
// 			var $caption_field = $('<input class="form-control" type="text" placeholder="caption"/>')
// 			$image.appendTo($modal_body); // May want to reverse order so that methods can be chained
// 			$caption_field.appendTo($modal_body);
// 			$hidden_dimensions_fields.appendTo($modal_body);
// 			// Set listener for mouse clicks
// 			$crop_div = $('<div></div>')
// 				.css('border', '2px solid black')
// 				.width('100px')
// 				.height(function() {
// 					return $(this).width() * ratio;
// 				})
// 				.css('position', 'absolute')
// 				.appendTo($modal_body);

// 			// Class to ensure that the dimensions of one object is contained within that of another (outside).

// 			var offset = function(object) {
// 				$obj = $(object);
// 				$obj_offset = $obj.offset();

// 				return {
// 					get_bottom : function get_bottom() {
// 						return $obj_offset.top + $obj.height();
// 					},
// 					set_bottom : function set_bottom(coordinate) {
// 						var top_coordinate = coordinate - $obj.height();
// 						$obj.offset({top: top_coordinate});
// 					},
// 					get_right : function get_right() {
// 						return $obj_offset.left + $obj.width();
// 					},
// 					set_right : function set_right(coordinate) {
// 						var left_coordinate = coordinate - $obj.width();
// 						$obj.offset({left: left_coordinate});
// 					}
// 				}
// 			}

// 			var Container = function Container(frame) {
// 				$frame = $(frame);
// 				offset_frame = offset(frame);

// 				return {
// 					// Returns true if the object is contained within the frame, false otherwise.
// 					does_contain : function does_contain(inside) {
// 						$in = $(inside);
// 						offset_inside = offset(inside);
// 						return offset_inside.get_bottom() < offset_frame.get_bottom() &&
// 							offset_inside.get_right() > offset_frame.get_right();
// 					},
// 					contains : function contains(inside) {
// 						// Reduce height, since width cannot be outside
// 						$in = $(inside);
// 						offset_inside = offset(inside);
// 						offset_inside.set_bottom(offset_frame.get_bottom());
// 						// Set the width to match the height in ratio
// 						$in.width(function() {
// 							return $(this).height() * ratio;
// 						})
// 					}
// 				};
// 			};

// 			var img_container = Container($image);
// 			var crop_func = function(e) {
// 				// A shift click sets the coordinate of the bottom right corner
// 				// The height is then calculated from the ratio
// 				if(e.shiftKey) {
// 					$crop_div.width(function() {
// 						return e.pageX - $(this).offset().left;
// 					}).height(function() {
// 						return $(this).width() * ratio;
// 					});
// 				} else { // A click sets the coordinates of the top left corner
// 					$crop_div.offset({top: e.pageY, left: e.pageX});
// 				}
// 				if(img_container.does_contain($crop_div)) {
// 					img_container.contains($crop_div);
// 				}
// 			};
// 			$image.click(crop_func);
// 			$crop_div.click(crop_func);
			
// 			$image.dblclick(function(e) {
				
// 			})
// 		});

// 		$image.load(function() {
// 			$modal.modal('show');
// 		});

// 		return {
// 			show: function() {
// 				isModaled = true;
// 				$modal.modal('show');
// 			},
// 			isModaled: function() {
// 				return isModaled;
// 			}
// 		};
// 	};

// 	return {
// 		register: function register(object) {
// 			var $container = $(object);
// 			var $file_chooser = $($container.children()[0]);
// 			var $help_block = $($container.children()[1]);
// 			var $upload_button = $($container.children()[2]);
// 			// Listen for change to fileChooser
// 			$file_chooser.change(function() {
// 				$upload_button.show();
// 			});
// 			// Attempt upload
// 			$upload_button.click(function() {
// 				$file_chooser.off();
// 				var file = $file_chooser[0].files[0]; // A JS object, not jQuery
// 				if(file) { // file found, uploading
// 					$help_block.html('Uploading...');
// 					var file_name = Date.now() + file.name;
// 					var params = {Key: file_name, ContentType: file.type, Body: file, ACL: 'public-read'};
// 		            bucket.putObject(params, function (err, data) {
// 		                $help_block.html(err ? 'Error!' : 'Uploaded... Switching to crop view.')
// 		                window.setTimeout(function() {
// 		                	$help_block.remove();
// 		                	$file_chooser.remove();
// 		                	$upload_button.html('Crop')
// 		                		.removeClass('btn-default')
// 		                		.addClass('btn-success')
// 		                		.off();
// 		                	// Create DOM objects for images
// 		                	// !!! Probably not good for security to store the url here
// 		                	var $uploaded_image = $('<img src="https://s3-us-west-2.amazonaws.com/voices-from-ghana/' + file_name + '" alt="No image found" />');
// 		                	var cropper = ImageCropper($uploaded_image[0], 0.76, function() {
// 		                		$upload_button.html('Uploaded & Saved!')
// 		                			.removeClass('btn-success')
// 		                			.addClass('btn-default');
// 		                	});
// 		                	$upload_button.click(function() {
// 		                		if(!cropper.isModaled()) {
// 		                			cropper.show();
// 		                		}
// 		                	});
// 		                }, 100);
// 		            });
// 				} else { // No file to upload
// 					$help_block.html('No file to upload');
// 				}
// 			});
// 		}
// 	};
// };