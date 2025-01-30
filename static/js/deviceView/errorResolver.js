ErrorResolver = {
	resolve: function (error) {
		console.error(error);
		try {
			if (error.includes("Connection failed: Remote operation timed out")) {
				return {
					title: _texts.RegisterTimeout,
					level: "warning",
					message: _texts.OpTimeout,
				};
			}

			if (error.includes("Connection failed: Device is not exists")) {
				return {
					title: _texts.ConnectionFailed,
					level: "critical",
					message: _texts.UnreachRemoteDevice,
				};
			}

			if (error.includes("Connection failed: Device is offline")) {
				return {
					title: _texts.ConnectionFailed,
					level: "critical",
					message: _texts.UnreachRemoteDevice,
				};
			}

			if (error.includes("Connection failed: Unable to reach the gateway server")) {
				return {
					title: _texts.InternalError,
					level: "critical",
					message: _texts.UnreachGatewayServer,
				};
			}

			if (error.includes("Unsupported function code")) {
				return {
					title: _texts.InternalError,
					level: "warning",
					message: _texts.UnsupportedFcCode,
				};
			}
		} catch {}

		return {
			title: _texts.UnknowError,
			level: "critical",
			message: error,
		};
	},
};
