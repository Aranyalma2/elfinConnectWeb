/**
 * Register a user to the database
 */
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	return function (req, res, next) {
		const dbUser = requireOption(objectrepository, "User");
		const { username, password, admin } = req.body;

		if (typeof username === "undefined" || typeof password === "undefined") {
			return next();
		}
		// Check if the username is already taken
		dbUser.findOne({ name: username }).then((usernameDB) => {
			if (usernameDB) {
				res.locals.error = "Username already exists.";
				return next();
			}

			// Hash the password
			const saltRounds = 10;
			bcrypt.hash(password, saltRounds).then((hashedPassword) => {
				generateUniqueID(dbUser)
					.then((id) => {
						// Create a new user and save it to the database
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
						newUser
							.save()
							.then((newUser) => {
								res.locals.success = "User successfully created.";
								return next();
							})
							.catch((err) => {
								console.log("User creation failed:", err);
								res.locals.error = "User creation failed.";
								return next();
							});
					})
					.catch((err) => {
						console.log("User creation failed:", err);
						res.locals.error = "User creation failed.";
						return next();
					});
			});
		});
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
