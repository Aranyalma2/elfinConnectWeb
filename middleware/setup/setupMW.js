/**
 * If system not has any user in  db, then display a first setup page.
 * Here creator can register an admin account
 */

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	return function (req, res, next) {
		if (res.locals.users == 0) {
			req.body.admin = true;
			return next();
		} else {
			return res.redirect("/login");
		}
	};
};
