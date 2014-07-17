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

			$file_chooser.addClass('form-control')
				.attr('accept', 'image/*')
			$upload_btn.addClass('form-control')

			$container.append($file_chooser)
				.append($help_block)
				.append($upload_btn)
		}
	}
}