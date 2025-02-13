const mongoose = require("mongoose");
const mongodb = require("mongodb");
const { type } = require("jquery");

const dbAddress = process.env.DATABASE || "localhost";
const dbCollectionName = process.env.DATABASE_COLLECTION || "elfinconnect";

let filesCollection;
let gridfsBucket;

const connectDB = async () => {
	try {
		await mongoose.connect(`mongodb://${dbAddress}/${dbCollectionName}`);
		console.log("DB Connected!");
	} catch (err) {
		console.log("DB Connection Error: ", err);
		process.exit(1);
	}

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
	id: String,
	name: String,
	type: String,
	style: mongoose.Schema.Types.Mixed,
	order: Number,
	modbus: mongoose.Schema.Types.Mixed,
	extra: mongoose.Schema.Types.Mixed,
});

const layoutSchema = new mongoose.Schema({
	type: String,
});

const ViewComponent = mongoose.model("ViewComponent", viewComponentSchema);

const viewSchema = new mongoose.Schema({
	layout: layoutSchema,
	components: [viewComponentSchema],
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
