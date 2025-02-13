const Package = require("./tools").Package;
const pack = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, startAddress, endAddress) {
	return new Package(transactionId, unitId, "READ_HOLDING_REGISTERS", pack(startAddress, endAddress - startAddress + 1));
};
exports.response = function (transactionId, unitId, registers) {
	let buf = new Buffer.alloc(registers.length * 2 + 1);

	buf.writeUInt8(registers.length * 2, 0);

	for (let i = 0; i < registers.length; i++) {
		registers[i].copy(buf, i * 2 + 1, 0, 2);
	}

	return new Package(transactionId, unitId, "READ_HOLDING_REGISTERS", buf);
};
