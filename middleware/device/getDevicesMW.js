/**

 */
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const userDB = requireOption(objectrepository, "User");
	const deviceDB = requireOption(objectrepository, "Device");

	return function (req, res, next) {
		if (typeof res.locals.user === "undefined") {
			return next();
		}

		userDB.findOne({ _id: req.session.user._id }).then((deviceList) => {
			deviceDB
				.find({ _id: deviceList.allDevices })
				.then((devices) => {
					res.locals.devices = calcOnlineAndTime(devices);
					return next();
				})
				.catch((err) => {
					return next(err);
				});
		});
	};
};

function calcOnlineAndTime(devices) {
	for (let i = 0; i < devices.length; i++) {
		devices[i].online = devices[i].lastSeenDate > new Date(Date.now() - 60000);
		devices[i].lastSeenDate = convertESTto24Time(devices[i].lastSeenDate);

	}
	return devices;
}

function convertESTto24Time(estDateString) {
  // Create a formatter with the desired format and set the time zone to 'America/New_York'
  const formatter = new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Budapest'
  });

  // Parse the EST date string
  const estDate = new Date(estDateString);

  // Format the date in the 24-hour format
  const formattedESTString = formatter.format(estDate);

  return formattedESTString;
}
