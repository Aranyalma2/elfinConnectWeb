const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const viewCompsDB = requireOption(objectrepository, "ViewComponent");

	return function (req, res, next) {
		if (res.locals.view === undefined || res.locals.view === null || res.locals.view.components === undefined || res.locals.view.components === null) {
			return next();
		}
		res.locals.viewComponents = res.locals.view.components;
		return next();
	};
};
