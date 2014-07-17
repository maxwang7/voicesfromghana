exports.processTags = function() {
	// Need to finish implementation!
	var processTags = function(tags_str) {
		return tags_str;
	};
};

exports.contains_media = function(text) {
	// Need to finish implementation
	return text.indexOf('##image') !== -1 ||
		text.indexOf('##video') !== -1 ||
		text.indexOf('##audio') !== -1;
};

exports.count_images = function(text) {
	return text.split('##image##').length - 1;
};