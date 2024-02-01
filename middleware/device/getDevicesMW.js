/**
 * Load a befott from the database using the :befottid param
 * The result is saved to res.locals.nagymbefottama
 */
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const userDB = requireOption(objectrepository, "User");
	const deviceDB = requireOption(objectrepository, "Device");

	return function (req, res, next) {
		if (typeof res.locals.user === "undefined") {
			return next();
		}

		userDB.findOne({ _id: req.session.user._id }).then((deviceList) => {
			deviceDB
				.find({ _id: deviceList.allDevices })
				.then((devices) => {
					res.locals.devices = calcOnline(devices);
					return next();
				})
				.catch((err) => {
					return next(err);
				});
		});
	};
};

function calcOnline(devices) {
	for (let i = 0; i < devices.length; i++) {
		devices[i].online = devices[i].lastSeenDate > new Date(Date.now() - 60000);
	}
	return devices;
}
