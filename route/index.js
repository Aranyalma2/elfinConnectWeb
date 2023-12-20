const authMW = require("../middleware/auth/authMW");
const getUserAttributesMW = require("../middleware/user/getUserAttributesMW");
const registerUserMW = require("../middleware/user/registerUserMW");
const getDeviceMW = require("../middleware/device/getDeviceMW");
const getDevicesMW = require("../middleware/device/getDevicesMW");
const getDeviceStateStatMW = require("../middleware/device/getDeviceStateStatMW");
const database = require("../db");
const renderMW = require("../middleware/renderMW");
const delDeviceMW = require("../middleware/device/delDeviceMW");
const getUsersMW = require("../middleware/user/getUsersMW");
const setupMW = require("../middleware/setup/setupMW");

module.exports = function (app) {
	const objRepo = {
		User: database.User,
		Device: database.Device,
	};

	app.use("/devices/delete/:deviceid", authMW.isLoggedIn(), delDeviceMW(objRepo), getDevicesMW(objRepo), renderMW(objRepo, "inAppViews/devices"));

	app.use("/devices", authMW.isLoggedIn(), getDevicesMW(objRepo), renderMW(objRepo, "inAppViews/devices"));

	app.use("/user", authMW.isLoggedIn(), getUserAttributesMW(objRepo), renderMW(objRepo, "inAppViews/user"));

	app.use("/logout", authMW.logout());

	app.use("/login", authMW.login(objRepo), renderMW(objRepo, "outAppViews/login"));

	app.get("/register", authMW.isLoggedInAdmin(), renderMW(objRepo, "inAppViews/register"));

	app.post("/register", authMW.isLoggedInAdmin(), registerUserMW(objRepo), renderMW(objRepo, "inAppViews/register"));

	app.use("/home", authMW.isLoggedIn(), getDevicesMW(objRepo), getDeviceStateStatMW(objRepo), renderMW(objRepo, "inAppViews/home"));

	app.use("/setup", getUsersMW(objRepo), setupMW(), registerUserMW(objRepo), renderMW(objRepo, "outAppViews/setup"));

	app.get("/", (req, res) => {
		res.redirect(301, "/home");
	});

	/*
	app.get("/register", (req, res) => {
		res.render("register");
	});

	app.post("/register", async (req, res) => {
		
	});
    */
};
