const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use("/css", express.static(path.join("node_modules", "bootstrap", "dist", "css")));
app.use("/css", express.static(path.join("node_modules", "bootstrap-icons", "font")));
app.use("/js", express.static(path.join("node_modules", "bootstrap", "dist", "js")));
app.use("/js", express.static(path.join("node_modules", "jquery", "dist")));
app.use("/js", express.static(path.join("node_modules", "chart.js", "dist")));

app.use(express.static("static"));

// Session setup
app.use(
	session({
		secret: "kJbQ48RwPEmXDGKKwQivXhvPCh1PkeAposzJz37GVMxwHkM9l43mw507QpuXMF1zxk2RHwC42xsZpkB2ulr0O5EVWHZotOV3x98AM5QDw6YiPpaG5szjU3LRLtERS7Ye",
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
