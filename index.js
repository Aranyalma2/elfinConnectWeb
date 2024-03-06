const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const locales = require("./languages/locales");
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
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
locales.config({
	languages: ['en', 'hu'],
	defaultLang: 'en',
});

// Session setup
app.use(
	session({
		name: crypto.randomBytes(128).toString('hex'),
		secret: crypto.randomBytes(128).toString('hex'),
		httpOnly: true,
		resave: false,
		saveUninitialized: true,
		path: "/",
		sameSite: 'strict',
		expires: null
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
