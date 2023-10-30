/**
 * Load a user from the database using the :userid param
 * The result is saved to res.locals.user
 */
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const dbUser = requireOption(objectrepository, "User");

	return function (req, res, next) {
		const user = req.local.user;
		if (!user) {
			return next("Unknown session");
		}

		res.local.user.username = req.session.user.username;
		return next();
	};
};
