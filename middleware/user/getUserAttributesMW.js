/**
 * Load a user from the database using the :userid param
 * The result is saved to res.locals.user
 */
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const dbUser = requireOption(objectrepository, "User");

	return function (req, res, next) {
		if (typeof res.locals.user === "undefined") {
			return next();
		}

		return next();
	};
};
