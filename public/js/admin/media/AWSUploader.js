function AWSUploader(bucket_, access_key_id_, secret_access_key_) {
	var bucket = bucket_,
		access_key_id = access_key_id_,
		secret_access_key = secret_access_key_;

	// configure
	AWS.config.update({
		accessKeyId: access_key_id,
		secretAccessKey: secret_access_key
	})

	var bucket = new AWS.S3({
		params: {
			Bucket: bucket
		}
	})

	return {
		upload: function upload(file_, file_name_, callback) {

			var file = file_,
				file_name = file_name_

			var params = {
				Key: file_name,
				ContentType: file.type,
				Body: file,
				ACL: 'public-read'
			}

			bucket.putObject(params, function(err, data) {

				callback(err, data)

			})
		}
	}
}