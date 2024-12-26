const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const viewDB = requireOption(objectrepository, "View");

	return function (req, res, next) {
		if (typeof req.body.view === "undefined") {
			return next();
		}
		const viewId = res.locals.device.view;
		viewDB
			.findByIdAndUpdate(viewId, { $set: { components: req.body.view } }, { new: true, runValidators: true })
			.then((updatedView) => {
				console.log("Updated View:", updatedView);
				res.end(JSON.stringify(updatedView.components));
			})
			.catch((error) => {
				console.error("Error Updating View:", error);
				return next(error);
			});
	};
};
