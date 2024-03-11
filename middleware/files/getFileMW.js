const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	return async function (req, res, next) {
		const bucket = requireOption(objectrepository, "GridFSBucket");
		const filesCollection = requireOption(objectrepository, "Files");

		if (typeof req.params.filename === "undefined") {
			return next();
		}

		try {
			// Find the file by filename in the uploads.files collection
			const file = await filesCollection.findOne({
				filename: { $eq: req.params.filename },
			});

			if (!file) {
				return next();
			}

			// Create a read stream from the GridFS bucket
			const readStream = bucket.openDownloadStream(file._id);

			// Set response headers
			res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
			res.set("Content-Type", file.metadata.contentType);

			// Pipe the read stream to the response stream
			readStream.pipe(res);

			return;
		} catch (err) {
			return next(err);
		}
	};
};
