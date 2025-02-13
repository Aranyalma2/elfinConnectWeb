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
const getFileMW = require("../middleware/files/getFileMW");
const getFilesMW = require("../middleware/files/getFilesMW");
const uploadFileMW = require("../middleware/files/uploadFileMW");
const deleteFileMW = require("../middleware/files/deleteFileMW");
const getViewMW = require("../middleware/device/getViewMW");
const updateViewMW = require("../middleware/device/updateViewMW");
const getViewComponentsMW = require("../middleware/device/getViewComponentsMW");
const apiQueryJsonBuilderMW = require("../middleware/device/apiQueryJsonBuilderMW");
const viewTaskRunnerMW = require("../middleware/device/viewTaskRunnerMW");

module.exports = function (app) {
	database
		.connectDB()
		.then(() => {
			const objRepo = {
				User: database.User,
				Device: database.Device,
				View: database.View,
				ViewComponent: database.ViewComponent,
				Files: database.filesCollection(),
				GridFSBucket: database.gridfsBucket(),
			};

			try {
				app.use("/devices/:deviceid/delete", authMW.isLoggedIn(objRepo), delDeviceMW(objRepo), getDevicesMW(objRepo), renderMW("inAppViews/devices"));

				app.post("/devices/:deviceid/view/api", authMW.isLoggedIn(objRepo), getDeviceMW(objRepo), viewTaskRunnerMW(), apiQueryJsonBuilderMW());

				app.post("/devices/:deviceid/view", authMW.isLoggedIn(objRepo), getDeviceMW(objRepo), updateViewMW(objRepo));

				app.get(
					"/devices/:deviceid/view",
					authMW.isLoggedIn(objRepo),
					getDeviceMW(objRepo),
					getViewMW(objRepo),
					getViewComponentsMW(objRepo),
					renderMW("inAppViews/deviceView"),
				);

				app.get("/devices/:deviceid/properties", authMW.isLoggedIn(objRepo), getDeviceMW(objRepo), renderMW("inAppViews/deviceProp"));

				app.use("/devices", authMW.isLoggedIn(objRepo), getDevicesMW(objRepo), renderMW("inAppViews/devices"));

				app.post("/user/changepassword", authMW.isLoggedIn(objRepo), changePassMW(objRepo), renderMW("inAppViews/user"));

				app.use("/user", authMW.isLoggedIn(objRepo), getUserAttributesMW(objRepo), renderMW("inAppViews/user"));

				app.use("/logout", authMW.logout());

				app.use("/login", authMW.login(objRepo), renderMW("outAppViews/login"));

				app.get("/register", authMW.isLoggedInAdmin(objRepo), renderMW("inAppViews/register"));

				app.post("/register", authMW.isLoggedInAdmin(objRepo), registerUserMW(objRepo), renderMW("inAppViews/register"));

				app.use("/home", authMW.isLoggedIn(objRepo), getDevicesMW(objRepo), getDeviceStateStatMW(), renderMW("inAppViews/home"));

				app.use("/setup", getUsersMW(objRepo), setupMW(), registerUserMW(objRepo), renderMW("outAppViews/setup"));

				app.use(
					"/downloads/:filename/delete",
					authMW.isLoggedInAdmin(objRepo),
					deleteFileMW(objRepo),
					getFilesMW(objRepo),
					renderMW("inAppViews/downloads"),
				);

				app.use("/downloads/:filename", authMW.isLoggedIn(objRepo), getFileMW(objRepo));

				app.use("/downloads", authMW.isLoggedIn(objRepo), getFilesMW(objRepo), renderMW("inAppViews/downloads"));

				app.post(
					"/upload",
					authMW.isLoggedInAdmin(objRepo),
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
			} catch (err) {
				console.error("MW runtime ERROR:", err);
				app.get("/", (req, res) => {
					res.end(`MW runtime error: ${err.message}`);
				});
			}
		})
		.catch((err) => {
			console.error("DB Connection ERROR:", err);
			app.get("/", (req, res) => {
				res.end(`Unable to connect to the database: ${err.message}`);
			});

			app.get("*", (req, res) => {
				// Redirect all requests to the root path "/"
				res.redirect(301, "/");
			});
		});
};
