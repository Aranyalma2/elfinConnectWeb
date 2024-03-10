const authMW = require("../middleware/auth/authMW");
const getUserAttributesMW = require("../middleware/user/getUserAttributesMW");
const registerUserMW = require("../middleware/user/registerUserMW");
//const getDeviceMW = require("../middleware/device/getDeviceMW");
const getDevicesMW = require("../middleware/device/getDevicesMW");
const getDeviceStateStatMW = require("../middleware/device/getDeviceStateStatMW");
const database = require("../db");
const renderMW = require("../middleware/renderMW");
const delDeviceMW = require("../middleware/device/delDeviceMW");
const getUsersMW = require("../middleware/user/getUsersMW");
const setupMW = require("../middleware/setup/setupMW");
const changePassMW = require("../middleware/user/changePassMW");
const getFileMW = require("../middleware/files/getFileMW");
const getFilesMW = require("../middleware/files/getFilesMW");
const uploadFileMW = require("../middleware/files/uploadFileMW");
const deleteFileMW = require("../middleware/files/deleteFileMW");

module.exports = function (app) {
	database.connectDB().then(() => {
		const objRepo = {
			User: database.User,
			Device: database.Device,
			Files: database.filesCollection(),
			GridFSBucket: database.gridfsBucket(),
		};

		app.use(
			"/devices/delete/:deviceid",
			authMW.isLoggedIn(),
			delDeviceMW(objRepo),
			getDevicesMW(objRepo),
			renderMW("inAppViews/devices"),
		);

		app.use("/devices", authMW.isLoggedIn(), getDevicesMW(objRepo), renderMW("inAppViews/devices"));

		app.post("/user/changepassword", authMW.isLoggedIn(), changePassMW(objRepo), renderMW("inAppViews/user"));

		app.use("/user", authMW.isLoggedIn(), getUserAttributesMW(objRepo), renderMW("inAppViews/user"));

		app.use("/logout", authMW.logout());

		app.use("/login", authMW.login(objRepo), renderMW("outAppViews/login"));

		app.get("/register", authMW.isLoggedInAdmin(), renderMW("inAppViews/register"));

		app.post("/register", authMW.isLoggedInAdmin(), registerUserMW(objRepo), renderMW("inAppViews/register"));

		app.use(
			"/home",
			authMW.isLoggedIn(),
			getDevicesMW(objRepo),
			getDeviceStateStatMW(),
			renderMW("inAppViews/home"),
		);

		app.use("/setup", getUsersMW(objRepo), setupMW(), registerUserMW(objRepo), renderMW("outAppViews/setup"));

		app.use(
			"/downloads/delete/:filename",
			authMW.isLoggedIn(),
			deleteFileMW(objRepo),
			getFilesMW(objRepo),
			renderMW("inAppViews/downloads"),
		);

		app.use("/downloads/:filename", authMW.isLoggedIn(), getFileMW(objRepo));

		app.use("/downloads", authMW.isLoggedIn(), getFilesMW(objRepo), renderMW("inAppViews/downloads"));

		app.post(
			"/upload",
			authMW.isLoggedInAdmin(),
			uploadFileMW.fileUploader.single("file"),
			uploadFileMW.toDBUploader(objRepo),
			getFilesMW(objRepo),
			renderMW("inAppViews/downloads"),
		);

		app.get("/", (req, res) => {
			res.redirect(301, "/home");
		});

		app.get("*", (req, res) => {
			// Redirect all requests to the root path "/"
			res.redirect(301, "/");
		});
	})
	.catch((err) =>{
		console.log("DB Connection ERROR");
		app.get("/", (req, res) => {
			res.end(`Unable to connect to the database: ${err.message}`);
		});

		app.get("*", (req, res) => {
			// Redirect all requests to the root path "/"
			res.redirect(301, "/");
		});
	});
};
