const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const viewDB = requireOption(objectrepository, "View");

	return function (req, res, next) {
		if (typeof req.body.layout === "undefined" || typeof req.body.components === "undefined") {
			return next();
		}
		const viewId = res.locals.device.view;
		viewDB
			.findByIdAndUpdate(viewId, { $set: { layout: req.body.layout, components: req.body.components } }, { new: true, runValidators: true })
			.then((updatedView) => {
				return res.end(JSON.stringify(updatedView));
			})
			.catch((error) => {
				console.error("Error Updating View:", error);
				return next(error);
			});
	};
};
