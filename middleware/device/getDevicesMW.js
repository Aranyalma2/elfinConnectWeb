/**

 */
const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	const deviceDB = requireOption(objectrepository, "Device");

	return function (req, res, next) {
		if (typeof res.locals.user === "undefined") {
			return next();
		}
		deviceDB
			.find({ _id: res.locals.user.allDevices })
			.then((devices) => {
				res.locals.devices = calcOnlineAndTime(devices);
				return next();
			})
			.catch((err) => {
				return next(err);
			});
	};
};

function calcOnlineAndTime(devices) {
	devices.forEach((device) => {
		device.online = device.lastSeenDate > new Date(Date.now() - 60000);
		device.lastSeenDate_converted = convertESTto24Time(device.lastSeenDate);
	});

	return devices;
}

function convertESTto24Time(estDateString) {
	// Create a formatter with the desired format and set the time zone to 'Europe/Budapest'
	const formatter = new Intl.DateTimeFormat("hu-HU", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		timeZone: "Europe/Budapest",
	});

	// Parse the EST date string
	const estDate = new Date(estDateString);

	// Format the date in the 24-hour format
	const formattedESTString = `${formatter.format(estDate)} (Europe/Budapest)`;

	return formattedESTString;
}
