/* FILE: routes/pages/utilities
 * ----------------------------
 * Helper functions for the pages route.
 */

// Used to process the raw text stored in the database.
// Returns a string containing the original text, separated
// by paragraphs according to the media tags (##image##,
// ##video##, ##audio##). The media tags are replaced with
// html tags containing the correct url references.
// Provide the function with a Post object populated with 
// all three media objects
exports.processText = function(post) {
	// A helper function used to replace media tags
	// with HTML tags with the correct source urls
	// from the post object.
	function insertMedia(text_str, post) {
		var image_count = 0;
		return text_str.replace(new RegExp('##image##', 'g'), function(match) {
			var str = '<img src="' + post.media.image[image_count].urls.original + '" alt="No image found""/>';
			image_count++;
			return str;
		});
		// Do the same with video and audio
	};

	// Provide with a string containing the post's text
	// Will break up the text by line breaks, then insert
	// HTML paragraph (p) tags for each part.
	// Returns a string with the paragraph tags
	function insertParagraphs(text_str) {
		return text_str.split('\r\n').map(function(element, index, arr) {
			return '<p>' + element + '</p>';
		}).join('');
	};

	var text = post.info.text;
	var text_with_p = insertParagraphs(text);
	return insertMedia(text_with_p, post);
};