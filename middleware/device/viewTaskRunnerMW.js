const gateway = require("../../gateway/serverConnectionHandler");

module.exports = function () {
	return function (req, res, next) {
		const component = req.body.data;

		if (component === undefined || component.destinationMAC === undefined || component.modbus === undefined) {
			return next();
		}

		gateway
			.getModbusClient(res.locals.user.uuid, component.destinationMAC)
			.then((client) => {
				const deviceAddress = component.modbus.deviceAddress;
				const registerAddress = component.modbus.registerAddress;

				switch (component.modbus.functionCode) {
					case "01":
						client.readCoils(deviceAddress, registerAddress, registerAddress, function (err, coils) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							if (coils.length > 0) {
								res.locals.component = component;
								res.locals.data = coils[0];
							}
							return next();
						});
						break;
					case "02":
						client.readDiscreteInputs(deviceAddress, registerAddress, registerAddress, function (err, discreteInputs) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							if (discreteInputs.length > 0) {
								res.locals.component = component;
								res.locals.data = discreteInputs[0].readUInt8();
							}
							return next();
						});
						break;
					case "03":
						client.readHoldingRegisters(deviceAddress, registerAddress, registerAddress, function (err, registers) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							if (registers.length > 0) {
								res.locals.component = component;
								if (component.extra?.isSigned) {
									res.locals.data = registers[0].readInt16BE();
								} else {
									res.locals.data = registers[0].readUInt16BE();
								}
							}
							return next();
						});
						break;
					case "04":
						client.readInputRegisters(deviceAddress, registerAddress, registerAddress, function (err, registers) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							if (registers.length > 0) {
								res.locals.component = component;
								if (component.extra?.isSigned) {
									res.locals.data = registers[0].readInt16BE();
								} else {
									res.locals.data = registers[0].readUInt16BE();
								}
							}
							return next();
						});
						break;
					case "05":
						client.writeSingleCoil(deviceAddress, registerAddress, component.data, function (err, coils) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							return next();
						});
						break;
					case "06":
						client.writeSingleRegister(deviceAddress, registerAddress, component.data, function (err, registers) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							return next();
						});
						break;
					default:
						return next(new Error("Unsupported function code"));
				}
			})
			.catch((err) => {
				// Handle any errors here
				console.error("Error in:", err);
				gateway.closeConnection(res.locals.user.uuid, component.destinationMAC);
				res.locals.error = err;
				return next();
			});
	};
};
