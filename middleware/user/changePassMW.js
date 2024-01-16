/**
 * Able to change password for user
 * 
 * Check req.session.user.username for loged in user. Check current password is valid. 
 * User entered a valid password, then check and update for new one
 */
const bcrypt = require("bcrypt");
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const dbUser = requireOption(objectrepository, "User");

	return function (req, res, next) {
            res.locals.passwordChangeError = true;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (typeof currentPassword === "undefined" || typeof newPassword === "undefined" || typeof confirmNewPassword === "undefined" || newPassword !== confirmNewPassword) {
            return next();
        }
        if (typeof res.locals.user === "undefined") {
            return next();
        }

        const saltRounds = 10;
        let newHashedPassword = bcrypt.hashSync(newPassword, saltRounds);

        console.log(currentPassword);
        console.log(res.locals.user.password);
        console.log(bcrypt.compareSync(currentPassword, res.locals.user.password));
        if(!bcrypt.compareSync(currentPassword, res.locals.user.password)){
            return next();
        };

		dbUser.updateOne({ username: res.locals.user.username},{$set: {password:newHashedPassword}}).then((userDB) => {
			if (!userDB && userDB.matchedCount <= 0) {
                //Invalid
				return next();
			}

            console.log(userDB);

            res.locals.passwordChangeError = false;
			return next();
		});
	};
};