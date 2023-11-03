/**
 * Calculate online/offline device number
 * The result is saved to res.locals
 */
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const dbUser = requireOption(objectrepository, "User");

	return function (req, res, next) {
		if (typeof res.locals.user === "undefined" || typeof res.locals.devices === "undefined") {
			return next();
		}
		res.locals.online = 0;
		res.locals.offline = 0;
		for (let i = 0; i < res.locals.devices.length; i++) {
			res.locals.devices[i].online ? res.locals.online++ : res.locals.offline++;
		}
		return next();
	};
};
