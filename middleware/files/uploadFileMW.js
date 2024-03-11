const multer = require("multer");
const requireOption = require("../requireOption");
const crypto = require("crypto");
const path = require("path");

// Multer setup for file uploading
const storage = multer.memoryStorage();
const fileUploader = multer({ storage: storage });

function toDBUploader(objectrepository) {
	return function (req, res, next) {
		const bucket = requireOption(objectrepository, "GridFSBucket");

		const file = req.file;

		const { name, version } = req.body;
		if (!file || typeof name === "undefined" || typeof version === "undefined") {
			res.locals.error = res.locals.texts.upload_fail;
			res.set("Upload-Status", "error:fields");
			return next();
		}
		try {
			const filename = `${name.replaceAll(" ", "-")}-${version}-${crypto.randomBytes(16).toString("hex")}${path.extname(file.originalname)}`;
			const writeStream = bucket.openUploadStream(filename, {
				chunkSizeBytes: 1048576,
				metadata: {
					contentType: file.mimetype,
					name: name,
					version: version,
				},
			});
			writeStream.end(file.buffer);
			res.locals.success = res.locals.texts.upload_success;
			res.set("Upload-Status", "success");

			return next();
		} catch (err) {
			res.locals.error = res.locals.texts.upload_fail;
			console.log(err);
			res.set("Upload-Status", "error:db");
			return next();
		}
	};
}

module.exports = { fileUploader, toDBUploader };
