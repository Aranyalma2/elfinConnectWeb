const Package = require("./tools").Package;
const packbits = require("./tools").packbits;
const pack = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, startAddress, endAddress, status) {
	let bits = packbits(status);
	let buf = new Buffer.alloc(bits.length + 4);

	buf.writeUInt16BE(startAddress, 0);
	buf.writeUInt16BE(endAddress - startAddress + 1, 2);
	bits.copy(buf, 4);

	return new Package(transactionId, unitId, "WRITE_MULTIPLE_COILS", buf);
};

exports.response = function (transactionId, unitId, startAddress, endAddress) {
	return new Package(transactionId, unitId, "WRITE_MULTIPLE_COILS", pack(startAddress, endAddress - startAddress + 1));
};
