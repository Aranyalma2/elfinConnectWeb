module.exports = function (objectrepository) {
	return function (req, res, next) {
		if (
			res.locals.error ||
			res.locals.data === undefined ||
			res.locals.data === null ||
			res.locals.component === undefined ||
			res.locals.component === null
		) {
			res.end(JSON.stringify({ error: res.locals.error || "No data" }));
			return;
		}

		let response = {
			id: res.locals.component.id,
			data: res.locals.data,
		};
		//console.log("response: ", response);
		res.end(JSON.stringify(response));
	};
};
