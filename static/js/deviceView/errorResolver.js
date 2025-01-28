ErrorResolver = {
	resolve: function (error) {
		return {
			title: "Test",
			level: Math.random() > 0.5 ? "critical" : "warning",
			message: "random",
		};
	},
};
