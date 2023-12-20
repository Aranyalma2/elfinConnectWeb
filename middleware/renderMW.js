/**
 * Using the template engine render the values into the template
 */

const requireOption = require("./requireOption");

module.exports = function (objectrepository, viewName) {
	return function (req, res) {
		res.locals.version = "Version 0.1.13 (pre-alpha)";
		res.render(viewName);
	};
};
