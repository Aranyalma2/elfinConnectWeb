
const requireOption = require("../requireOption");



module.exports = function (objectrepository) {
	const desktopAppDB = requireOption(objectrepository, "DesktopApp");

	return function (req, res, next) {

        const { name, version } = req.body;
        if (typeof name === "undefined" || typeof version === "undefined" || typeof req.file.filename === "undefined") {
			return next();
		}

            const newAppDB = new desktopAppDB({
                name: name,
                version: version,
                uploadtime: new Date(),
                path: `desktopclient/${req.file.filename}`
            });

            newAppDB.save().then((newEntry) => {
                res.locals.success = res.locals.texts.upload_success;
                return next();
            })
            .catch((err) => {
				console.log("File upload failed:", err);
				res.locals.error = res.locals.texts.upload_fail;
				return next();
			});
	};
};