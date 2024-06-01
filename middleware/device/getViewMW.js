const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const viewDB = requireOption(objectrepository, "View");

	return function (req, res, next) {
        if(typeof res.locals.device === "undefined"){
            return next();
        }
			viewDB
				.findOne({ _id: res.locals.device.view })
				.then((view) => {
					res.locals.view = view;
					return next();
				})
				.catch((err) => {
					return next(err);
				});
	};
};