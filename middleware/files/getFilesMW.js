const requireOption = require("../requireOption");

module.exports = function (objectrepository) {
	return async function (req, res, next) {
		const filesCollection = requireOption(objectrepository, "Files");

		try {
			const files = await filesCollection
				.find()
				.sort({ uploadDate: -1 })
				.toArray();
			res.locals.apps = getMetadata(files);
			return next();
		} catch (err) {
			return next(err);
		}
	};
};

function getMetadata(dbObject) {
	const files = [];

	dbObject.forEach((item) => {
		const entry = {
			name: item.metadata.name,
			version: item.metadata.version,
			filesize: formatFileSize(item.length),
			uploadtime: convertESTto24Time(item.uploadDate),
			filename: item.filename,
		};
		files.push(entry);
	});

	return files;
}

function formatFileSize(bytes) {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

	return `${formattedSize} ${sizes[i]}`;
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
