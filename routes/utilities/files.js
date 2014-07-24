// This module helps to manage local files that are created
// at run time and that should be removed to prevent from
// using all of the device's disk space.

var fs = require('fs');

var files = [];

// Add the name of a file under the management of this module
exports.add = function(file_name) {
	files.push(file_name);
};

// Returns the files array.
exports.get = function() {
	return files;
};

// Removes all files under management from the file system
exports.clearAll = function() {
	function arr_remove(arr, index) {
		arr.splice(index, 1);
	}

	files.forEach(function(element, index, arr) {
		fs.unlink(element, function(err) {
			if(err) {
				console.log(err);
			}
			arr_remove(files, index);
		});
	});
};

// IMPORTANT: DOES NOT AFFECT THE FILES ARRAY
// This function is simply used to remove a file,
// provided the file name, and is meant as a helper
// method
exports.clear = function(filename) {
	fs.unlink(filename, function(err) {
		if(err) {
			throw err;
		}
	});
};