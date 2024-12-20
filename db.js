const mongoose = require("mongoose");
const mongodb = require("mongodb");

const dbAddress = process.env.DATABASE || "localhost";
const dbCollectionName = process.env.DATABASE_COLLECTION || "elfinconnect";

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
	view: { type: mongoose.Schema.Types.ObjectId, ref: "View" },
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

const viewComponentSchema = new mongoose.Schema({
	name: String,
	type: String,
	order: Number,
	data: mongoose.Schema.Types.Mixed,
	suffix: String,
});

const ViewComponent = mongoose.model("ViewComponent", viewComponentSchema);

const viewSchema = new mongoose.Schema({
	components: [{ type: mongoose.Schema.Types.ObjectId, ref: "ViewComponent" }],
});

const View = mongoose.model("View", viewSchema);

// Export the database connection and models
module.exports = {
	connectDB,
	filesCollection: () => filesCollection,
	gridfsBucket: () => gridfsBucket,
	Device,
	User,
	View,
	ViewComponent,
};
