/**
 * Load a befott from the database using the :befottid param
 * The result is saved to res.locals.nagymbefottama
 */
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const dbDevice = requireOption(objectrepository, "Device");

	return function (req, res, next) {
		if (typeof res.locals.user === "undefined") {
			return next();
		}

		database.Device.find({ _id: { $in: user.deviceCollection } })
			.exec()
			.then((devices) => {
				console.log(devices);
				res.locals.devices = devices;
				return next();
			})
			.catch((err) => {
				return next(err);
			});
	};
};
