const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const localization = require("./languages/locales");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const mongoSanitize = require("express-mongo-sanitize");
//const localesMW = require("./middleware/localesMW");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use("/css", express.static(path.join("node_modules", "bootstrap", "dist", "css")));
app.use("/css", express.static(path.join("node_modules", "bootstrap-icons", "font")));
app.use("/js", express.static(path.join("node_modules", "bootstrap", "dist", "js")));
app.use("/js", express.static(path.join("node_modules", "jquery", "dist")));
app.use("/js", express.static(path.join("node_modules", "chart.js", "dist")));

app.use(express.static("static"));

//Multi language framework setup
localization.config({
	languages: ["en", "hu"],
	defaultLang: "en",
});

// Session setup
app.use(
	session({
		name: crypto.randomBytes(16).toString("hex"),
		secret: crypto.randomBytes(128).toString("hex"),
		httpOnly: true,
		resave: false,
		saveUninitialized: true,
		path: "/",
		sameSite: "strict",
		expires: 86400,
	}),
);

app.use(mongoSanitize());

app.use(localization.placeTexts());

require("./route/index")(app);

app.use((err, req, res, next) => {
	res.end("Problem...");
	console.log(err);
});

const PORT = process.env.WEBPORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
