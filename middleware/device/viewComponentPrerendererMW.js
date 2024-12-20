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
	viewComponent.html = `<div class="viewControll-button">
                            <button id="${viewComponent._id}" class="btn btn-primary">${viewComponent.data.label}</button>
                            <a hidden>${JSON.stringify(viewComponent)}</a>
                        </div>`;
}

function renderSwitch(viewComponent) {
	viewComponent.html = `<div class="viewControll-switch">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="${viewComponent._id}">
                                <label class="form-check-label" for="${viewComponent._id}">${viewComponent.data.label}</label>
                            </div>
                            <a hidden>${JSON.stringify(viewComponent)}</a>
                        </div>`;
}

function renderLamp(viewComponent) {
	viewComponent.html = `<div class="viewControll-lamp">
							<div id="${viewComponent._id}"></div>
							<a hidden>${JSON.stringify(viewComponent)}</a>
						  </div>`;
}

function renderNumInput(viewComponent) {
	viewComponent.html = `<div class="viewControll-numberinput">
							<input id="${viewComponent._id}" type="number" class="form-control" placeholder="${viewComponent.name}">
							<a hidden>${JSON.stringify(viewComponent)}</a>
						  </div>`;
}

function renderNumDisplay(viewComponent) {
	viewComponent.html = `<div class="viewControll-numberdisplay ">
							<div class="d-flex flex-row">
								<div>
									<h1 id="${viewComponent._id}">0</h1>
								</div>
								<div>
									${viewComponent.suffix ? `<h1>${viewComponent.suffix}</h1>` : ""}
								</div>
							</div>
							<a hidden>${JSON.stringify(viewComponent)}</a>
							<div class="error text-danger"></div>
						  </div>`;
}
