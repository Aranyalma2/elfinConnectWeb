const mongoose = require("mongoose");
const mongodb = require("mongodb");

const dbAddress = "10.101.2.4:27017";
const dbCollectionName = "elfinconnect";

let filesCollection;
let gridfsBucket;

const connectDB = async () => {
	await mongoose.connect(`mongodb://${dbAddress}/${dbCollectionName}`);
	console.log("DB Connected!");

	gridfsBucket = new mongodb.GridFSBucket(mongoose.connection.db, {
		bucketName: "downloads",
	});
	filesCollection = mongoose.connection.db.collection("downloads.files");
};

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

module.exports = {
	connectDB,
	filesCollection: () => filesCollection,
	gridfsBucket: () => gridfsBucket,
	Device,
	User,
};
