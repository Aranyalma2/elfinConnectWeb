const Package = require("./tools").Package;
const pack = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, address, value) {
	let buf = new Buffer.alloc(4);

	buf.writeUInt16BE(address, 0);
	buf.writeUInt16BE(value, 2);

	return new Package(transactionId, unitId, "WRITE_SINGLE_REGISTER", buf);
};
exports.response = exports.request;
