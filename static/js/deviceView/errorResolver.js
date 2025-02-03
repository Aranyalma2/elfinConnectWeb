ErrorResolver = {
	resolve: function (error) {
		console.error(error);
		if (error instanceof Error) {
			error = error.message;
		}
		try {
			if (error.includes("The operation timed out.")) {
				return {
					title: _texts.NetError,
					level: "warning",
					message: _texts.NetTimeout,
				};
			}

			if (error.includes("NetworkError when attempting to fetch resource.")) {
				return {
					title: _texts.NetError,
					level: "critical",
					message: _texts.NetConnectError,
				};
			}

			if (error.includes("Connection failed: Remote operation timed out")) {
				return {
					title: _texts.OpTimeout,
					level: "critical",
					message: _texts.RegisterTimeout,
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
