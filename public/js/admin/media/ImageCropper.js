function ImageCropper() {
	var x, y, height, width
	var $save_btn,
		$crop_div

	var create_objects = function(ratio) {
		$save_btn = $('<button type="button">Save</button>')
			.addClass('form-control')

		height = 100 * ratio
		width = 100

		$crop_div = $('<div></div>')
			.css('border', '2px solid black')
			.width(width)
			.height(height)
			.css('position', 'absolute')
			.css('background-color', 'white')
			.css('opacity', 0.5)
	}

	return {
		crop : function crop(image_, ratio_, container_, btn_container_, callback) {

			var crop_div_on_screen = false

			var $btn_container = $(btn_container_)
				ratio = ratio_
				$container = $(container_)
				$image = $(image_)

			create_objects(ratio)

			// Handlers
			var save_handler = function(e) {
				$save_btn.detach()
				$crop_div.detach()

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
				if(!crop_div_on_screen) {
					$container.append($crop_div)
				}
				if(e.shiftKey) {
					$crop_div.width(function() {
						screen_width = e.pageX - $(this).offset().left
						width = screen_width / $image.width()
						return screen_width
					}).height(function() {
						screen_height = $(this).width() * ratio
						height = screen_height / $image.height()
						return screen_height
					})
				} else { // A click sets the coordinates of the top left corner
					$crop_div.offset({
						top: e.pageY, left: e.pageX
					})
					x = (e.pageX - $image.offset().left) / $image.width()
					y = (e.pageY - $image.offset().top) / $image.height()

					console.log("x: " + x)
					console.log("y: " + y)
				}
			}

			$save_btn.click(save_handler)
			
			$image.click(crop_func)
			$crop_div.click(crop_func)

			$btn_container.append($save_btn)

			// $btn_container.appendTo($container)
			// 	.appendTo($save_btn)

		}
	}
}