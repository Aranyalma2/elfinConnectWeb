/**
 * If system not has any user in  db, then display a first setup page.
 * Here creator can register an admin account
 */

module.exports = function () {
	return function (req, res, next) {
		if (res.locals.users.length === 0) {
			req.body.admin = true;
			return next();
		} else {
			return res.redirect("/login");
		}
	};
};
