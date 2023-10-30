const bcrypt = require("bcrypt");
const requireOption = require("../requireOption");

// Middleware to check if a user is logged in
exports.isLoggedIn = function () {
	return function (req, res, next) {
		console.log(req.session.user);
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
		console.log(req.session.user);
		if ((typeof req.session.logedIn === "undefined" || req.session.logedIn !== true, req.session.user.admin === true)) {
			return res.redirect("/login");
		}
		//Loged in as Admin
		res.locals.user = req.session.user;
		return next();
	};
};

// Middleware to handle login
exports.login = function (objectrepository) {
	return function (req, res, next) {
		const UserDB = requireOption(objectrepository, "User");

		if (typeof req.body.username === "undefined" && typeof req.body.password === "undefined") {
			return next();
		}

		const { username, password } = req.body;

		UserDB.findOne({ username })
			.then((user) => {
				if (!user || !bcrypt.compareSync(password, user.password)) {
					res.locals.error = "Invalid username or password";
					return next();
				}
				// Store the user in the session
				req.session.logedIn = true;
				req.session.user = user;
				return req.session.save((err) => res.redirect("/home"));
			})
			.catch((err) => {
				console.error(err);
				return next(err);
			});
	};
};

// Middleware to handle logout
exports.logout = function () {
	return function (req, res, next) {
		req.session.destroy((err) => {
			res.redirect("/");
		});
	};
};
