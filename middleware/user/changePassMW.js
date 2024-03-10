/**
 * Able to change password for user
 *
 * Check req.session.user.username for loged in user. Check current password is valid.
 * User entered a valid password, then check and update for new one
 */
const bcrypt = require("bcrypt");
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const dbUser = requireOption(objectrepository, "User");

	return function (req, res, next) {
		res.locals.passwordChangeError = true;
		const { currentPassword, newPassword, confirmNewPassword } = req.body;

		if (
			typeof currentPassword === "undefined" ||
			typeof newPassword === "undefined" ||
			typeof confirmNewPassword === "undefined" ||
			newPassword !== confirmNewPassword
		) {
			return next();
		}
		if (typeof res.locals.user === "undefined") {
			return next();
		}

		const saltRounds = 10;
		let newHashedPassword = bcrypt.hashSync(newPassword, saltRounds);

		if (!bcrypt.compareSync(currentPassword, res.locals.user.password)) {
			return next();
		}

		dbUser
			.updateOne(
				{ username: { $eq: res.locals.user.username } },
				{ $set: { password: newHashedPassword } },
			)
			.then((userDB) => {
				if (!userDB || userDB.matchedCount !== 1) {
					//Invalid
					return next();
				}

				res.locals.passwordChangeError = false;
				return next();
			});
	};
};
