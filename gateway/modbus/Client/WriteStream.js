const stream = require("stream");

exports.WriteStream = WriteStream;

//let encapsulationHeader;

function WriteStream(encapsulationHeader) {
	stream.Transform.call(this, { objectMode: true });

	this.encapsulationHeader = encapsulationHeader;

	this.transactionId = 0;
}

WriteStream.prototype = Object.create(stream.Transform.prototype, {
	constructor: { value: WriteStream },
});

WriteStream.prototype._transform = function (chunk, encoding, next) {
	if (typeof chunk != "object" || chunk === null) {
		this.emit("error", new Error("Unsupported data mode"));
	}

	if (typeof chunk.toJSON == "function") {
		chunk = chunk.toJSON();
	}

	if (!chunk.hasOwnProperty("functionCode")) {
		this.emit("error", new Error("Missing functionCode"));
	}

	if (!chunk.data) {
		chunk.data = new Buffer.alloc(0);
	} else if (!Buffer.isBuffer(chunk.data)) {
		chunk.data = new Buffer.alloc(chunk.data);
	}

	let req = new Buffer.alloc(8 + chunk.data.length);

	req.writeUInt16BE(chunk.hasOwnProperty("transactionId") ? chunk.transactionId : ++this.transactionId, 0);
	req.writeUInt16BE(chunk.protocol || 0, 2);
	req.writeUInt16BE(chunk.data.length + 2, 4);
	req.writeUInt8(chunk.unitId || 0, 6);
	req.writeUInt8(chunk.functionCode, 7);

	chunk.data.copy(req, 8);

	req = Buffer.concat([Buffer.from(this.encapsulationHeader), req]);

	this.push(req);
	next();
};

WriteStream.prototype._write = function () {
	this._transform.apply(this, arguments);
};

WriteStream.prototype.end = function () {
	this._transform.apply(this, arguments);
	this.emit("end");
};
