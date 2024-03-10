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

			await bucket.delete(file._id);

			return next();
		} catch (err) {
			return next(err);
		}
	};
};
