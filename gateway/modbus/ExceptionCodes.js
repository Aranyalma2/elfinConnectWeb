const codes = {
	ILLEGAL_FUNCTION: 1,
	ILLEGAL_DATA_ADDRESS: 2,
	ILLEGAL_DATA_VALUE: 3,
	SERVER_DEVICE_FAILURE: 4,
	ACKNOWLEDGE: 5,
	SERVER_DEVICE_BUSY: 6,
	NEGATIVE_ACKNOWLEDGE: 7,
	MEMORY_PARITY_ERROR: 8,
	GATEWAY_PATH_UNAVAILABLE: 10,
	GATEWAY_TARGET_DEVICE_FAILED_TO_RESPOND: 11,
};

function ExceptionCodes(str) {
	if (ExceptionCodes.hasOwnProperty(str)) {
		const err = new Error(str);

		err.code = ExceptionCodes[str];

		return err;
	}

	return ExceptionCodes.lookup(str);
}

for (let k in codes) {
	ExceptionCodes[k] = codes[k];
}

ExceptionCodes.lookup = function (val) {
	for (let k in codes) {
		if (val == codes[k]) {
			return k;
		}
	}

	return val;
};

ExceptionCodes.build = function (val) {
	const msg = this.lookup(val);
	const err = new Error(msg);

	err.code = val;

	return err;
};

module.exports = ExceptionCodes;
