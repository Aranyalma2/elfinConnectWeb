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

		dbUser.findOne({ username: req.session.user.username }).then((userDB) => {
			if (!userDB) {
				return next();
			}
			res.locals.user.uuid = userDB.uuid;
			res.locals.user.elfinHeathbeatMSG = `beat;${userDB.uuid};%MAC;%HOST;0`;
			res.locals.user.elfindataMSG = `data;${userDB.uuid};%MAC;`;
			return next();
		});
	};
};
