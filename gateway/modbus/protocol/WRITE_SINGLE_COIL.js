const Package = require("./tools").Package;
const pack = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, address, value) {
	let buf = new Buffer.alloc(4);

	buf.writeUInt16BE(address, 0);

	buf[2] = value ? 0xff : 0x00;
	buf[3] = 0x00;

	return new Package(transactionId, unitId, "WRITE_SINGLE_COIL", buf);
};
exports.response = exports.request;
