const mongoose = require("mongoose");

mongoose.connect("mongodb://database:27017/test").then(() => console.log("DB Connected!"));

// Define the Device schema and model
const deviceSchema = new mongoose.Schema({
	hostName: String,
	macAddress: String,
	lastSeenDate: Date,
});

const Device = mongoose.model("Device", deviceSchema);

// Define the User schema and model
const userSchema = new mongoose.Schema({
	uuid: String,
	username: String,
	password: String,
	admin: { type: Boolean, default: false },
	allDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
});

const User = mongoose.model("User", userSchema);

const desktopAppSchema = new mongoose.Schema({
	name: String,
	version: String,
	uploadtime: Date,
	path: String
});

const DesktopApp = mongoose.model("DesktopApp", desktopAppSchema);

module.exports = {
	mongoose,
	Device,
	User,
	DesktopApp
};
