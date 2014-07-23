// Used to upload media files. First uploads to S3, then 
// sends the name of the file to the server.
function Uploader(aws) {
	return {
		// TODO: don't need post_id any more. Remove from jade template as well
		// TODO: too many params, handle better?
		register: function register(post_id_, media_id_, file_chooser_, btn_, help_block_, media, callback) {
			var post_id = post_id_,
				media_id = media_id_,
				$file_chooser = $(file_chooser_),
				$btn = $(btn_),
				$help = $(help_block_),
				file_type = get_file_type($file_chooser);

			// Analyzes the file chooser's accept field
			// to decide on the file type. Does a string search.
			function get_file_type($file_chooser) { // param must be jQuery object
				function search_file_type(type) {
					if($file_chooser.attr('accept').indexOf(type) === 0) {
						return type;
					}
					return null;
				}
				return search_file_type('image') || 
					search_file_type('audio') ||
					search_file_type('video');
			}

			$btn.click(function(e) {
				// TODO: Error handling if no name

				// upload to S3 first
				var file = $file_chooser[0].files[0];
				var file_name = Date.now() + file.name;

				function upload_to_amazon() {
					$help.html('Uploading to Amazon...');
					aws.upload(file, file_name, upload_callback);
				};

				upload_to_amazon();
				
				// TODO: increase the number of seconds after
				// which the browser will again try to contact the server
				// by the nth try squared.

				var attempt_num = 0;

				function upload_callback(err, data) {
					if(err) {
						$help.html('Error in uploading to Amazon. We\'ll try again for you, but maybe check your Internet? #minionsatwork');
						// Countdown the number of seconds until the program will try again
						window.setTimeout(function() {
							if(attempt_num < 10) {
								upload_to_amazon();
							}
						}, 2000);
					} else {
						$help.html('Uploaded to Amazon. Reporting back to the home server!');

						/* Great! Amazon has it now, time to report back
						   to the server
						   Info needed: 
						   * id of the media object
						   * type of media object
						   * media object, corresponding with the DB representation
						*/

						if(file_type === 'image') {
							var url_prefix = 'https://s3-us-west-2.amazonaws.com/voices-from-ghana-test/';
							var data = {
								media_id : media_id,
								type : file_type,
								media : {
									urls : {
										original : url_prefix + file_name
									}
								}
							};

							function sendToServer() {
								attempts = 0;
								sendToServerLoop();
							}
							function sendToServerLoop() {
								attempts += 1;
								if(attempts > 10) {
									$help.html('10 failed attempts. Please try again to upload.');
									return;
								}
								$.ajax({
									type : 'POST',
									url : '/admin/media/' + post_id,
									data : data,
									success : function() {
										$help.html('Fin! Upload again if you want to make changes.');
									}
								}).done(function(data, textStatus, jqXHR) {
									$help.html('Fin! Upload again if you want to make changes.');

									// TODO: What other info might be needed in the future? Add those params in.
									callback(media, url_prefix + file_name);
								}).fail(function(jqXHR, textStatus, errorThrown) {
									$help.html('Failed. We\'ll try again, but maybe check your internet connection?');
									sendToServerLoop();
								})
							}
							sendToServer();
						}
						// TODO: implement audio and video once the models are decided

					}
				}
			});

		}
	}
}