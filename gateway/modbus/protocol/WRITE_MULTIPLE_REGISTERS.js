const Package = require("./tools").Package;
const packbits = require("./tools").packbits;
const pack = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, startAddress, endAddress, data) {
	let buf = new Buffer.alloc(data.length * 2 + 5);

	buf.writeUInt16BE(startAddress, 0);
	buf.writeUInt16BE(endAddress - startAddress + 1, 2);
	buf.writeUInt8((endAddress - startAddress + 1) * 2, 4);

	for (let i = 0; i < data.length; i++) {
		data[i].copy(buf, 5 + i * 2, 0, 2);
	}

	return new Package(transactionId, unitId, "WRITE_MULTIPLE_REGISTERS", buf);
};

exports.response = function (transactionId, unitId, startAddress, endAddress) {
	return new Package(
		transactionId,
		unitId,
		"WRITE_MULTIPLE_REGISTERS",
		pack(startAddress, endAddress - startAddress + 1),
	);
};
