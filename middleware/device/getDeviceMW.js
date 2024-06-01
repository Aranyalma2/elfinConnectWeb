/*
  Get a device entry from DB by index :deviceid
*/

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const DeviceDB = requireOption(objectrepository, "Device");

	return function (req, res, next) {

		if(!req.session.user.allDevices.includes(req.params.deviceid)){
			return res.redirect("/");
		}

		DeviceDB.findOne({ _id: { $eq: req.params.deviceid } })
			.then((device) => {
				res.locals.device = device;
				return next();
			})
			.catch((err) => {
				return next(err);
			});
	};
};
