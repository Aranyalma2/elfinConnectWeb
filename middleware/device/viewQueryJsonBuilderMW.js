module.exports = function (objectrepository) {

	return function (req, res, next) {
        if(typeof res.locals.device === "undefined"){
            return next();
        }
		res.end(JSON.stringify(""));
	};
};