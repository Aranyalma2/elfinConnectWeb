const bcrypt = require("bcrypt");
const requireOption = require("../requireOption");

// Middleware to check if a user is logged in
exports.isLoggedIn = function () {
	return function (req, res, next) {
		if (typeof req.session.logedIn === "undefined" || req.session.logedIn !== true) {
			return res.redirect("/login");
		}
		//Loged in
		res.locals.user = req.session.user;
		return next();
	};
};

// Middleware to check if a user is logged in as Admin
exports.isLoggedInAdmin = function () {
	return function (req, res, next) {
		if (
			typeof req.session.logedIn === "undefined" ||
			req.session.logedIn !== true ||
			typeof req.session.user.admin === "undefined" ||
			req.session.user.admin === false
		) {
			req.session.loginwaring = res.locals.texts.loginWarning_MissingAdminPermission;
			return res.redirect("/login");
		}
		//Loged in as Admin
		res.locals.user = req.session.user;
		return next();
	};
};

// Middleware to handle login
exports.login = function (objectrepository) {
	return async function (req, res, next) {
		const UserDB = requireOption(objectrepository, "User");

		if (typeof req.session.loginwaring !== "undefined" || req.session.loginwaring !== "") {
			res.locals.warning = req.session.loginwaring;
			req.session.loginwaring = undefined;
		}
		if (typeof req.body.username === "undefined" && typeof req.body.password === "undefined") {
			return next();
		}

		const { username, password } = req.body;

		try {
			const user = await UserDB.findOne({ username });

			if (!user || !bcrypt.compareSync(password, user.password)) {
				res.locals.error = res.locals.texts.loginWarning_InvalidUserOrPass;
				return next();
			}

			// Store the user in the session
			if (user.admin) {
				console.log(`Administrator login: ${user.username} | ${new Date()}`);
			} else {
				console.log(`User login: ${user.username} | ${new Date()}`);
			}

			req.session.logedIn = true;
			req.session.user = user;

			req.session.save((err) => {
				if (err) {
					console.log(err);
				}
				res.redirect("/home");
			});
		} catch (err) {
			console.error(err);
			return next(err);
		}
	};
};

// Middleware to handle logout
exports.logout = function () {
	return function (req, res, next) {
		req.session.destroy((err) => {
			if (typeof err !== "undefined") {
				console.log(err);
			}
			res.redirect("/");
		});
	};
};
