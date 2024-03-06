/**
 * Calculate online/offline device number
 * The result is saved to res.locals
 */

module.exports = function () {

	return function (req, res, next) {
		if (typeof res.locals.user === "undefined" || typeof res.locals.devices === "undefined") {
			return next();
		}
		res.locals.online = 0;
		res.locals.offline = 0;
		res.locals.devices.forEach(device => {
			device.online ? res.locals.online++ : res.locals.offline++;
		});
		
		return next();
	};
};
