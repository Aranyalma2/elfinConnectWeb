const gateway = require("../../gateway/serverConnectionHandler");

const RemoteOperationTimeout = process.env.REMOTE_OPERATION_TIMEOUT || 3000;

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
						const timedReadCoils = withTimeout(client.readCoils.bind(client), RemoteOperationTimeout);

						timedReadCoils(deviceAddress, registerAddress, registerAddress, function (err, coils) {
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
						const timedReadDiscreteInputs = withTimeout(client.readDiscreteInputs.bind(client), RemoteOperationTimeout);

						timedReadDiscreteInputs(deviceAddress, registerAddress, registerAddress, function (err, discreteInputs) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							if (discreteInputs.length > 0) {
								res.locals.component = component;
								res.locals.data = discreteInputs[0];
							}
							return next();
						});
						break;
					case "03":
						const timedReadHoldingRegisters = withTimeout(client.readHoldingRegisters.bind(client), RemoteOperationTimeout);

						timedReadHoldingRegisters(deviceAddress, registerAddress, registerAddress, function (err, registers) {
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
						const timedReadInputRegisters = withTimeout(client.readInputRegisters.bind(client), RemoteOperationTimeout);

						timedReadInputRegisters(deviceAddress, registerAddress, registerAddress, function (err, registers) {
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
						const timedWriteSingleCoil = withTimeout(client.writeSingleCoil.bind(client), RemoteOperationTimeout);

						timedWriteSingleCoil(deviceAddress, registerAddress, component.data, function (err, coils) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							res.locals.component = component;
							res.locals.data = "";
							return next();
						});
						break;
					case "06":
						const timedWriteSingleRegister = withTimeout(client.writeSingleRegister.bind(client), RemoteOperationTimeout);

						timedWriteSingleRegister(deviceAddress, registerAddress, component.data, function (err, registers) {
							if (err) {
								res.locals.error = err;
								return next();
							}
							res.locals.component = component;
							res.locals.data = "";
							return next();
						});
						break;
					default:
						res.locals.error = new Error("Unsupported function code");
						return next();
				}
			})
			.catch((err) => {
				// Handle any errors here
				console.error("Error in connection:", err);
				gateway.closeConnection(res.locals.user.uuid, component.destinationMAC);
				res.locals.error = err;
				return next();
			});
	};
};

function withTimeout(fn, timeoutDuration) {
	return function (...args) {
		let timeoutReached = false;

		// Find the callback function in the arguments
		const callback = args[args.length - 1];

		// Set up a timeout to throw an error if the callback isn't called within the specified time
		const timeout = setTimeout(() => {
			timeoutReached = true;
			const error = new Error("Operation failed: Remote operation timed out");
			callback(error);
		}, timeoutDuration);

		// Wrap the original callback to clear the timeout and prevent multiple calls
		args[args.length - 1] = function (...callbackArgs) {
			if (timeoutReached) {
				// If the timeout has already been reached, we ignore this callback
				return;
			}

			// Clear the timeout as the callback has been called within the time limit
			clearTimeout(timeout);

			// Call the original callback with the provided arguments
			callback(...callbackArgs);
		};

		// Call the original function with the modified arguments
		fn(...args);
	};
}
