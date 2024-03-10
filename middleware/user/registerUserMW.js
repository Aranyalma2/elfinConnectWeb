/**
 * Register a user to the database
 */
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	return async function (req, res, next) {
		const dbUser = requireOption(objectrepository, "User");
		const { username, password, admin } = req.body;

		if (typeof username === "undefined" || typeof password === "undefined") {
			return next();
		}
		// Check if the username is already taken
		let usernameDB = await dbUser.findOne({ username: { $eq: username } });
		if (usernameDB) {
			res.locals.error = `${res.locals.texts.registerFailed_Exists} ${usernameDB.username}`;
			return next();
		}

		// Hash the password
		const saltRounds = 10;
		const hashedPassword = bcrypt.hashSync(password, saltRounds);

		try {
			const id = await generateUniqueID(dbUser);

			let elevatedPermission = false;
			if (typeof admin !== "undefined") {
				elevatedPermission = true;
			}

			const newUser = new dbUser({
				uuid: id,
				username: username,
				password: hashedPassword,
				admin: elevatedPermission,
			});

			const savedUser = await newUser.save();
			res.locals.success = `${res.locals.texts.registerSucces_Created} ${savedUser.username}`;
			return next();
		} catch (err) {
			console.log("User creation failed:", err.message);
			res.locals.error = res.locals.texts.registerFailed_UnknownFail;
			return next();
		}
	};
};

// Function to generate a unique 8-byte ID
async function generateUniqueID(dbUser) {
	let uniqueId;
	let isUnique = false;

	while (!isUnique) {
		// Generate a random 8-byte ID
		const randomBytes = crypto.randomBytes(8);
		uniqueId = randomBytes.toString("hex");

		// Check if the generated ID already exists in the database
		const existingRecord = await dbUser.findOne({ uuid: uniqueId });

		if (!existingRecord) {
			isUnique = true;
		}
	}

	return uniqueId;
}