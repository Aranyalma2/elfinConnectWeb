const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const viewDB = requireOption(objectrepository, "View");

	return function (req, res, next) {
		if (typeof res.locals.device === "undefined") {
			return next();
		}
		if (typeof res.locals.device.view === "undefined") {
			// No view is assigned to the device, create one
			const view = new viewDB();
			view.save()
				.then((view) => {
					res.locals.device.view = view._id;
					res.locals.device
						.save()
						.then(() => {
							res.locals.view = view;
							return next();
						})
						.catch((err) => {
							return next(err);
						});
				})
				.catch((err) => {
					return next(err);
				});
		}
		viewDB
			.findById(res.locals.device.view)
			.then((view) => {
				res.locals.view = view;
				return next();
			})
			.catch((err) => {
				return next(err);
			});
	};
};
