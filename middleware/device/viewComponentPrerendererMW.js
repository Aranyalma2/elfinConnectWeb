module.exports = function () {
	return function (req, res, next) {
		let viewComponents = res.locals.viewComponents;
		if (typeof viewComponents === "undefined") {
			return next();
		}
		viewComponents.sort((a, b) => a.order - b.order);

		viewComponents.forEach((viewComponent) => {
			switch (viewComponent.type) {
				case "button":
					renderButton(viewComponent);
					break;
				case "switch":
					renderSwitch(viewComponent);
					break;
				case "lamp":
					renderLamp(viewComponent);
					break;
				case "number-input":
					renderNumInput(viewComponent);
					break;
				case "number-display":
					renderNumDisplay(viewComponent);
					break;
			}
		});

		return next();
	};
};

function renderButton(viewComponent) {
	/* data structure of viewComponent.data
    {
        "label": "Button label",
        "holdTime": 1000, // hold time in milliseconds, for example "1000
        "modbus": {
            "slaveId": 1, // the slave id of the modbus device, for example "1
            "address": 1, // address of the coil
            "functionCode": 5 // 5 is for writing single coil
        }
    }
    */

	viewComponent.html = `<div class="viewControll-button">
                            <button id="${viewComponent._id}" class="btn btn-primary">${viewComponent.data.label}</button>
                            <a hidden>${JSON.stringify(viewComponent.data)}</a>
                        </div>`;
}

function renderSwitch(viewComponent) {
	/* data structure of viewComponent.data
    {
        "label": "Switch label",
        "modbus": {
            "slaveId": 1, // the slave id of the modbus device, for example "1
            "address": 1, // address of the coil
            "functionCode": 5 // 5 is for writing single coil
        }
    }
    */

	viewComponent.html = `<div class="viewControll-switch">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="${viewComponent._id}">
                                <label class="form-check-label" for="${viewComponent._id}">${viewComponent.data.label}</label>
                            </div>
                            <a hidden>${JSON.stringify(viewComponent.data)}</a>
                        </div>`;
}

function renderLamp(viewComponent) {
	viewComponent.html = `<div id="${viewComponent._id}" class="lamp"></div>`;
}

function renderNumInput(viewComponent) {
	viewComponent.html = `<input id="${viewComponent._id}" type="number" class="form-control" placeholder="${viewComponent.name}">`;
}

function renderNumDisplay(viewComponent) {
	viewComponent.html = `<h1 id="${viewComponent._id}" class="display-1">0</h1>`;
}
