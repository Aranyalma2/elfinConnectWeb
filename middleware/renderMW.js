/**
 * Using the template engine render the values into the template
 */

const version = require('../route/version');


module.exports = function (viewName) {
	return function (req, res) {
		res.locals.version = version;
		res.render(viewName);
	};
};
