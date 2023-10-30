const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("static"));

// Session setup
app.use(
	session({
		secret: "your_secret_key",
		resave: true,
		saveUninitialized: true,
	}),
);

require("./route/index")(app);

app.use((err, req, res, next) => {
	res.end("Problem...");
	console.log(err);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
