function ImageUploader() {
	// !!! Insecure, take this out!
	AWS.config.update({accessKeyId: 'AKIAJGSNN2L5MQLAT2MA', secretAccessKey: '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'});
	var bucket = new AWS.S3({params: {Bucket: 'voices-from-ghana'}});

	// Used to help the user crop the image. image_container contains the image.
	// The ratio represents the ratio of the box to which the image must be cropped,
	// height/width
	function ImageCropper(image_container, image, ratio) {
		$image_container = $(image_container);
		$image = $(image);
		$image.load(function() { // Wait for image to load
			// Style the image
			$image.css('border-radius','5px')
				.css('position', 'relative');
			if($image.width() > $image.height()) {
				$image.width($image_container.width());
			} else {
				$image.height($image_container.height());
			}
			// Create box for cropping
			var initial_width = 100;
			var initial_height = initial_width * ratio;
			var $crop_box = $('<div></div>')
				.css('border', '1px solid black')
				.css('position', 'absolute')
				.width(initial_width)
				.height(initial_height);
			$image.click(function(e) {
				var mouse_x = e.pageX, mouse_y = e.pageY;
				$crop_box.appendTo($image_container)
					.offset({top: mouse_y, left: mouse_x});
			})

		});
	};

	return {
		register: function register(object) {
			var $container = $(object);
			var $image_container = $($container.children()[0]);
			var $file_chooser = $($image_container.children()[0]);
			var $help_block = $($image_container.children()[1]);
			var $upload_button = $($image_container.next());
			// Set initial state
			// Listen for change to fileChooser
			$file_chooser.change(function() {
				$upload_button.show();
			});
			// Attempt upload
			$upload_button.click(function() {
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
		                	$upload_button.html('Crop & Save').addClass('btn-success').removeClass('btn-default');
		                	// Create DOM objects for images
		                	// !!! Probably not good for security to store the url here
		                	var $uploaded_image = $('<img src="https://s3-us-west-2.amazonaws.com/voices-from-ghana/' + file_name + '" alt="No image found" />')
		                		.appendTo($image_container);
		                	var cropper = ImageCropper($image_container[0], $uploaded_image[0], 0.667);
		                }, 1000);
		            });
				} else { // No file to upload
					$help_block.html('No file to upload');
				}
			});
		}
	};
};