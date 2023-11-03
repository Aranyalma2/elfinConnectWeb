/*
  Remove device by id, from database :deviceid
  Redirects to index
*/

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const UserDB = requireOption(objectrepository, "User");
	const DeviceDB = requireOption(objectrepository, "Device");

	return function (req, res, next) {
		UserDB.findOneAndUpdate({ _id: req.session.user._id }, { $pull: { allDevices: req.params.deviceid } })
			.then(() => {
				//return res.redirect("/devices");
			})
			.catch((err) => {
				return next(err);
			});

		DeviceDB.findOneAndDelete({ _id: req.params.deviceid })
			.then(() => {
				return res.redirect("/devices");
			})
			.catch((err) => {
				return next(err);
			});
	};
};
