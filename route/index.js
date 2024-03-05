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
const localesMW = require("../middleware/localesMW");
const getFileMW = require("../middleware/files/getFileMW");
const getFilesMW = require("../middleware/files/getFilesMW");
const uploadFileMW = require("../middleware/files/uploadFileMW");
const deleteFileMW = require("../middleware/files/deleteFileMW");

/*

const multer = require("multer");
const storageConfigs = require("../upload/upload-config");
const desktopAppStorage = multer({ storage: storageConfigs.desktopClientApps });

*/
module.exports = function (app) {

	database.connectDB().then(() => {

		const objRepo = {
			User: database.User,
			Device: database.Device,
			Files: database.filesCollection(),
			GridFSBucket: database.gridfsBucket()
		};

		app.use("/devices/delete/:deviceid", localesMW(), authMW.isLoggedIn(), delDeviceMW(objRepo), getDevicesMW(objRepo), renderMW("inAppViews/devices"));

		app.use("/devices", localesMW(), authMW.isLoggedIn(), getDevicesMW(objRepo), renderMW("inAppViews/devices"));

		app.post("/user/changepassword", localesMW(), authMW.isLoggedIn(), changePassMW(objRepo), renderMW("inAppViews/user"));

		app.use("/user", localesMW(), authMW.isLoggedIn(), getUserAttributesMW(objRepo), renderMW("inAppViews/user"));

		app.use("/logout", authMW.logout());

		app.use("/login", localesMW(), authMW.login(objRepo), renderMW("outAppViews/login"));

		app.get("/register", localesMW(), authMW.isLoggedInAdmin(), renderMW("inAppViews/register"));

		app.post("/register", localesMW(), authMW.isLoggedInAdmin(), registerUserMW(objRepo), renderMW("inAppViews/register"));

		app.use("/home", localesMW(), authMW.isLoggedIn(), getDevicesMW(objRepo), getDeviceStateStatMW(objRepo), renderMW("inAppViews/home"));

		app.use("/setup", localesMW(), getUsersMW(objRepo), setupMW(), registerUserMW(objRepo), renderMW("outAppViews/setup"));

		app.use("/downloads/delete/:filename", localesMW(), authMW.isLoggedIn(), deleteFileMW(objRepo), getFilesMW(objRepo), renderMW("inAppViews/downloads"));

		app.use("/downloads/:filename", localesMW(), authMW.isLoggedIn(), getFileMW(objRepo));

		app.use("/downloads", localesMW(), authMW.isLoggedIn(), getFilesMW(objRepo), renderMW("inAppViews/downloads"));

		app.post("/upload", localesMW(), authMW.isLoggedInAdmin(), uploadFileMW.fileUploader.single('file'), uploadFileMW.toDBUploader(objRepo), getFilesMW(objRepo), renderMW("inAppViews/downloads"));

		app.get("/", (req, res) => {
			res.redirect(301, "/home");
		});

		app.get('*', (req, res) => {
			// Redirect all requests to the root path "/"
			res.redirect(301, '/');
		});

	});
};
