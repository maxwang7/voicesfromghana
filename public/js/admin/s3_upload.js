function s3_upload() {
	var s3upload = new S3Upload({
		file_dom_selector: '#voices-image0',
		s3_sign_put_url: '/admin/blog/create/sign',
		onProgress: function(percent, message) {
			$('#voices-image-status0').html('Upload progress: ' + percent + '%' + message);
		},
		onFinishS3Put: function(public_url) {
			$('#voices-image-status0').html('Upload completed. Uploaded to: ' + public_url);
			$('#voices-image0-url').val(public_url);
			$('#voices-image-preview0').html('<img src="'+public_url+'" style="width:300px;" />')
		},
		onError: function(status) {
			$('#voices-image-status0').html('Upload error: ' + status);
		}
	});
}
$(document).ready(function() {
	$('#voices-image0').on("change", s3_upload);
});