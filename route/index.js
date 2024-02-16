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
const changePassMW = require("../middleware/user/changePassMW");
const localesMW = require("../middleware/localesMW");
const getFileMW = require("../middleware/files/getFileMW");
const getFilesMW = require("../middleware/files/getFilesMW");
const uploadFileMW = require("../middleware/files/uploadFileMW");

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

		app.use("/devices/delete/:deviceid", localesMW(), authMW.isLoggedIn(), delDeviceMW(objRepo), getDevicesMW(objRepo), renderMW(objRepo, "inAppViews/devices"));

		app.use("/devices", localesMW(), authMW.isLoggedIn(), getDevicesMW(objRepo), renderMW(objRepo, "inAppViews/devices"));

		app.post("/user/changepassword", localesMW(), authMW.isLoggedIn(), changePassMW(objRepo), renderMW(objRepo, "inAppViews/user"));

		app.use("/user", localesMW(), authMW.isLoggedIn(), getUserAttributesMW(objRepo), renderMW(objRepo, "inAppViews/user"));

		app.use("/logout", authMW.logout());

		app.use("/login", localesMW(), authMW.login(objRepo), renderMW(objRepo, "outAppViews/login"));

		app.get("/register", localesMW(), authMW.isLoggedInAdmin(), renderMW(objRepo, "inAppViews/register"));

		app.post("/register", localesMW(), authMW.isLoggedInAdmin(), registerUserMW(objRepo), renderMW(objRepo, "inAppViews/register"));

		app.use("/home", localesMW(), authMW.isLoggedIn(), getDevicesMW(objRepo), getDeviceStateStatMW(objRepo), renderMW(objRepo, "inAppViews/home"));

		app.use("/setup", localesMW(), getUsersMW(objRepo), setupMW(), registerUserMW(objRepo), renderMW(objRepo, "outAppViews/setup"));

		app.use("/downloads/:filename", localesMW(), authMW.isLoggedIn(), getFileMW(objRepo));

		app.use("/downloads", localesMW(), authMW.isLoggedIn(), getFilesMW(objRepo), renderMW(objRepo, "inAppViews/downloads"));

		app.post("/upload", localesMW(), authMW.isLoggedInAdmin(), uploadFileMW.fileUploader.single('file'), uploadFileMW.toDBUploader(objRepo), getFilesMW(objRepo), renderMW(objRepo, "inAppViews/downloads"));

		app.get("/", (req, res) => {
			res.redirect(301, "/home");
		});

		app.get('*', (req, res) => {
			// Redirect all requests to the root path "/"
			res.redirect(301,'/');
		});

	});
};
