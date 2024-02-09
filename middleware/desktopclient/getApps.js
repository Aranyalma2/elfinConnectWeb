

const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const desktopAppDB = requireOption(objectrepository, "DesktopApp");

	return function (req, res, next) {

		desktopAppDB.find({})
        .then((entries) => {
            res.locals.apps = [];
            if(entries){
                res.locals.apps = entries;
            }
            return next();
        })
        .catch((err) => {
				console.error(err);
				return next(err);
		});
	};
};