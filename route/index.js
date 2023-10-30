const authMW = require("../middleware/auth/authMW");
const getUserAttributesMW = require("../middleware/user/getUserAttributesMW");
const getDevicesMW = require("../middleware/device/getDevicesMW");
const database = require("../db");
const renderMW = require("../middleware/renderMW");
const registerUserMW = require("../middleware/user/registerUserMW");

module.exports = function (app) {
	const objRepo = {
		User: database.User,
		Device: database.Device,
	};

	app.use("/home", authMW.isLoggedIn(), renderMW(objRepo, "home"));

	app.use("/devices", authMW.isLoggedIn(), getDevicesMW(objRepo), renderMW(objRepo, "devices"));

	app.use("/user", authMW.isLoggedIn(), getUserAttributesMW(objRepo), renderMW(objRepo, "user"));

	app.use("/logout", authMW.logout());

	app.use("/login", authMW.login(objRepo), renderMW(objRepo, "login"));

	app.get("/register", authMW.isLoggedInAdmin(), renderMW(objRepo, "register"));
	app.post("/register", authMW.isLoggedInAdmin(), registerUserMW(objRepo), renderMW(objRepo, "register"));

	app.use("/", authMW.isLoggedIn(), renderMW(objRepo, "home"));

	/*
	app.get("/register", (req, res) => {
		res.render("register");
	});

	app.post("/register", async (req, res) => {
		
	});
    */
};
