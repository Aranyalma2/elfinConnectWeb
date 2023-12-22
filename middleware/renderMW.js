/**
 * Using the template engine render the values into the template
 */

const version = require('../route/version');

const requireOption = require("./requireOption");

module.exports = function (objectrepository, viewName) {
	return function (req, res) {
		res.locals.version = version;
		res.render(viewName);
	};
};
