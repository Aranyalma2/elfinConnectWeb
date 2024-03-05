const langModel = require("../languages/locales");

module.exports = function () {
    return function (req, res, next) {
        res.locals.texts = langModel.getModel(req.cookies['lang']);
        return next();
    }
}