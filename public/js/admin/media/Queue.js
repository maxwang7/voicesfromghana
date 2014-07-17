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