module.exports = function () {
	return function (req, res, next) {
        //LOG REQUEST BODY LANDED
        console.log("viewTaskRunnerMW");
        console.log(req.body.data);
        return next();
		        
    };
};