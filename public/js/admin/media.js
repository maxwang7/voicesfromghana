function ImageUploader() {
	// !!! Insecure, take this out!
	AWS.config.update({accessKeyId: 'AKIAJGSNN2L5MQLAT2MA', secretAccessKey: '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'});
	var bucket = new AWS.S3({params: {Bucket: 'voices-from-ghana'}});
	var modal_id = '#voices-admin-media-modal';
	var modal_content_id = '#voices-admin-media-modal-content';
	var modal_body_id = '#voices-admin-media-modal-body';

	// Used to help the user crop the image. image_container contains the image.
	// The ratio represents the ratio of the box to which the image must be cropped,
	// height/width
	// !!! Need to handle callbacks
	function ImageCropper(image, ratio, callback) {
		$image = $(image);
		$modal = $(modal_id);
		$modal_body = $(modal_body_id);

		// Indicates whether the modal is up or not
		var isModaled = false;
		// Set modal listeners
		$modal.on('hide.bs.modal', function(e) {
			isModaled = false;
			// Clear modal of content
			$modal_body.html('');
		});
		$modal.on('show.bs.modal', function(e) {
			isModaled = true;
			// Create stuff inside modal
			var $hidden_dimensions_fields = $('<input type="hidden" ng-model="startX"/> \
				<input type="hidden" ng-model="startY" /> \
				<input type="hidden" ng-model="endX"/> \
				<input type="hidden" ng-model="endY"/>')
			var $help_block = $('<p>Click somewhere on the image to set the top left corner of the crop box. Use shift+click to set the width. The ratio is locked to optimize for display on the blog page.</p>');
			var $caption_field = $('<input class="form-control" type="text" placeholder="caption"/>')
			$image.appendTo($modal_body); // May want to reverse order so that methods can be chained
			$caption_field.appendTo($modal_body);
			$hidden_dimensions_fields.appendTo($modal_body);
			// Set listener for mouse clicks
			$crop_div = $('<div></div>')
				.css('border', '2px solid black')
				.width('100px')
				.height(function() {
					return $(this).width() * ratio;
				})
				.css('position', 'absolute')
				.appendTo($modal_body);

			// Class to ensure that the dimensions of one object is contained within that of another (outside).

			var offset = function(object) {
				$obj = $(object);
				$obj_offset = $obj.offset();

				return {
					get_bottom : function get_bottom() {
						return $obj_offset.top + $obj.height();
					},
					set_bottom : function set_bottom(coordinate) {
						var top_coordinate = coordinate - $obj.height();
						$obj.offset({top: top_coordinate});
					},
					get_right : function get_right() {
						return $obj_offset.left + $obj.width();
					},
					set_right : function set_right(coordinate) {
						var left_coordinate = coordinate - $obj.width();
						$obj.offset({left: left_coordinate});
					}
				}
			}

			var Container = function Container(frame) {
				$frame = $(frame);
				offset_frame = offset(frame);

				return {
					// Returns true if the object is contained within the frame, false otherwise.
					does_contain : function does_contain(inside) {
						$in = $(inside);
						offset_inside = offset(inside);
						return offset_inside.get_bottom() < offset_frame.get_bottom() &&
							offset_inside.get_right() > offset_frame.get_right();
					},
					contains : function contains(inside) {
						// Reduce height, since width cannot be outside
						$in = $(inside);
						offset_inside = offset(inside);
						offset_inside.set_bottom(offset_frame.get_bottom());
						// Set the width to match the height in ratio
						$in.width(function() {
							return $(this).height() * ratio;
						})
					}
				};
			};

			var img_container = Container($image);
			var crop_func = function(e) {
				// A shift click sets the coordinate of the bottom right corner
				// The height is then calculated from the ratio
				if(e.shiftKey) {
					$crop_div.width(function() {
						return e.pageX - $(this).offset().left;
					}).height(function() {
						return $(this).width() * ratio;
					});
				} else { // A click sets the coordinates of the top left corner
					$crop_div.offset({top: e.pageY, left: e.pageX});
				}
				img_container.contains($crop_div);
			};
			$image.click(crop_func);
			$crop_div.click(crop_func);
			
			$image.dblclick(function(e) {
				
			})
		});

		$image.load(function() {
			$modal.modal('show');
		});

		return {
			show: function() {
				isModaled = true;
				$modal.modal('show');
			},
			isModaled: function() {
				return isModaled;
			}
		};
	};

	return {
		register: function register(object) {
			var $container = $(object);
			var $file_chooser = $($container.children()[0]);
			var $help_block = $($container.children()[1]);
			var $upload_button = $($container.children()[2]);
			// Listen for change to fileChooser
			$file_chooser.change(function() {
				$upload_button.show();
			});
			// Attempt upload
			$upload_button.click(function() {
				$file_chooser.off();
				var file = $file_chooser[0].files[0]; // A JS object, not jQuery
				if(file) { // file found, uploading
					$help_block.html('Uploading...');
					var file_name = Date.now() + file.name;
					var params = {Key: file_name, ContentType: file.type, Body: file, ACL: 'public-read'};
		            bucket.putObject(params, function (err, data) {
		                $help_block.html(err ? 'Error!' : 'Uploaded... Switching to crop view.')
		                window.setTimeout(function() {
		                	$help_block.remove();
		                	$file_chooser.remove();
		                	$upload_button.html('Crop')
		                		.removeClass('btn-default')
		                		.addClass('btn-success')
		                		.off();
		                	// Create DOM objects for images
		                	// !!! Probably not good for security to store the url here
		                	var $uploaded_image = $('<img src="https://s3-us-west-2.amazonaws.com/voices-from-ghana/' + file_name + '" alt="No image found" />');
		                	var cropper = ImageCropper($uploaded_image[0], 0.667, function() {
		                		$upload_button.html('Uploaded & Saved!')
		                			.removeClass('btn-success')
		                			.addClass('btn-default');
		                	});
		                	$upload_button.click(function() {
		                		if(!cropper.isModaled()) {
		                			cropper.show();
		                		}
		                	});
		                }, 100);
		            });
				} else { // No file to upload
					$help_block.html('No file to upload');
				}
			});
		}
	};
};