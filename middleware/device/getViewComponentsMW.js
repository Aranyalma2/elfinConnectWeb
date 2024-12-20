const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const viewCompsDB = requireOption(objectrepository, "ViewComponent");

	return function (req, res, next) {
		if (res.locals.view === undefined || res.locals.view === null) {
			return next();
		}
		viewCompsDB
			.find()
			.where("_id")
			.in(res.locals.view.components)
			.then((viewComponentsArray) => {
				res.locals.viewComponents = viewComponentsArray;
				return next();
			})
			.catch((err) => {
				return next(err);
			});
	};
};
