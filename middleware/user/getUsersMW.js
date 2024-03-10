/**
 * Load all user from database
 * The result is saved to res.locals.users
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const dbUser = requireOption(objectrepository, "User");

	return function (req, res, next) {
		dbUser
			.find({})
			.then((users) => {
				res.locals.users = users;
				return next();
			})
			.catch((err) => {
				console.error("Error loading users:", err.message);
				return next(err);
			});
	};
};
