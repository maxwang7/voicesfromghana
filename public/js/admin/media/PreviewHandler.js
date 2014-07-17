/* Class: PreviewHandler
 * ---------------------
 * The PreviewHandler class provides an interface to allow the user
 * to select an image from a set of images to crop to a certain set
 * of sizes, depending on how it will be displayed on the screen.
 *
 * It has two public functions: register_image and run.
 *
 * register_image provides PreviewHandler an <img> DOM object, and makes
 * that image part of the set of images which a user can choose from
 * when he/she is selecting the image to be displayed for previewing.
 *
 * run provides the user interface with which the user interacts. First,
 * the user is displayed a series of thumbnails from which to select the
 * image that should be previewed. Next, the selected image is displayed.
 * finish_callback is then called.
 */

function PreviewHandler() {
	var $container,
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

		/* The container is the div element where the DOM objects will be displayed
		 * 
		 * callback: function(container, help_block, selected_image_DOM)
		 */
		run : function run(container_, finish_callback) {

			// Copy parameters to locals
			$container = $(container_)

			// Handler for image click
			var selected_image_index
			var add_click_handler

			add_click_handler = function(element, index, array) { // will this have to go before?
				var image_handler = function(e) {

					//// Once the image is selected, save the index of
					// the image, then turn off all of the listeners to
					// the images and hide them
					selected_image_index = index
					$images.forEach(function(element, index, array) {
						// turn off all listeners
						element.off()
						// hide all images
						element.detach()
					})

					//// The preview image has been selected
					var $selected_image = $images[selected_image_index]

					finish_callback($container[0], $help_block[0], $selected_image[0], selected_image_index)
					
				}

				element.click(image_handler)
			}

			$images.forEach(add_click_handler)

			// 1 - Display image thumbnails
			for(var m = 0; m < $images.length; m++) {
				$container.append($images[m]
					.width(150)
					.css('border', '1px solid black')
					.css('margin', '5px')
					.css('cursor', 'pointer'))
			}
			$container.append(help_block)
		}
	}	
}