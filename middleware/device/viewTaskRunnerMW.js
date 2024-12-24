const gateway = require("../../gateway/serverConnectionHandler");

module.exports = function () {
	return function (req, res, next) {
		const component = req.body.data;

		if (component === undefined || component.destinationMAC === undefined || component.data === undefined || component.data.modbus === undefined) {
			return next();
		}

		gateway
			.getModbusClient(res.locals.user.uuid, component.destinationMAC)
			.then((client) => {
				const deviceAddress = component.data.modbus.deviceAddress;
				const registerAddress = component.data.modbus.registerAddress;

				switch (component.data.modbus.functionCode) {
					case 1:
						client.readCoils(deviceAddress, registerAddress, registerAddress, function (err, coils) {
							console.log("Read coils:", coils);
							console.log("Read error:", err);
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
					case 2:
						client.readDiscreteInputs(deviceAddress, registerAddress, registerAddress, function (err, discreteInputs) {
							console.log("Read discrete inputs:", discreteInputs);
							console.log("Read error:", err);
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
					case 3:
						client.readHoldingRegisters(deviceAddress, registerAddress, registerAddress, function (err, registers) {
							console.log("Read registers:", registers);
							console.log("Read error:", err);
							if (err) {
								res.locals.error = err;
								return next();
							}
							if (registers.length > 0) {
								res.locals.component = component;
								switch (component.data.modbus.dataType) {
									case "signed":
										res.locals.data = registers[0].readInt16BE();
										break;
									case "unsigned":
										res.locals.data = registers[0].readUInt16BE();
										break;
									default:
										res.locals.data = registers[0].readUInt16BE();
								}
							}
							return next();
						});
						break;
					case 4:
						client.readInputRegisters(deviceAddress, registerAddress, registerAddress, function (err, registers) {
							console.log("Read registers:", registers);
							console.log("Read error:", err);
							if (err) {
								res.locals.error = err;
								return next();
							}
							if (registers.length > 0) {
								res.locals.component = component;
								switch (component.data.modbus.dataType) {
									case "signed":
										res.locals.data = registers[0].readInt16BE();
										break;
									case "unsigned":
										res.locals.data = registers[0].readUInt16BE();
										break;
									default:
										return next(new Error("Unsupported data type"));
								}
							}
							return next();
						});
						break;
					case 5:
						client.writeSingleCoil(deviceAddress, component.data, function (err, coils) {
							console.log("Write coils:", coils);
							console.log("Write error:", err);
							if (err) {
								res.locals.error = err;
								return next();
							}
						});
						break;
					case 6:
						client.writeSingleRegister(deviceAddress, component.data, function (err, registers) {
							console.log("Write registers:", registers);
							console.log("Write error:", err);
							if (err) {
								res.locals.error = err;
								return next();
							}
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
