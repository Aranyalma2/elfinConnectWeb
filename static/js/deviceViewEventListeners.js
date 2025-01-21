function addEventListener(isEditMode) {
	toggleDragAndDrop(isEditMode);

	if (isEditMode === true) {
		addNewCardEventListeners(isEditMode);
	}

	if (isEditMode === false) {
		addActiveComponentEventListeners();
		addOnFocusDisableUpdate();
	}
}

function addNewCardEventListeners(isEditMode) {
	const addNewCard = document.getElementById("card-addNewCard");
	addNewCard.addEventListener("click", function () {
		const newCardData = {
			id: `id_${Date.now()}`,
			name: _texts.New_Component,
			type: "button",
			style: ButtonStyles.getDefaultStyle(),
			modbus: {
				functionCode: "01",
				deviceAddress: "1",
				registerAddress: "1",
			},
			order: editModeComponents.length,
			extra: {
				label: _texts.New_Button,
			},
		};
		editModeComponents.push(newCardData);
		renderer(cardContainer, createLayout(editModeComponents, isEditMode), isEditMode);
	});
}

function inputFieldRangeCorrector(value, min, max, decimalPlaces = 0) {
	value = parseFloat(value);
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	if (decimalPlaces < 0) value = parseFloat(value).toFixed(decimalPlaces * -1);
	return value;
}

function addActiveComponentEventListeners() {
	const activeViewComponents = document.querySelectorAll(".viewActive");

	for (componentDOM of activeViewComponents) {
		const componentObject = runModeComponents.find((component) => component.id === componentDOM.id);
		const content = componentDOM.querySelector(".viewContent");
		const eventGenerator = componentDOM.querySelector(".viewEvent");

		switch (componentObject.type) {
			case "button": {
				eventGenerator.addEventListener("click", function () {
					// Send the event to the server
					const value = content.value;
					activeRequestRunner(componentObject, value);
				});
				break;
			}
			case "switch": {
				eventGenerator.addEventListener("change", function () {
					// Send the event to the server
					const value = content.checked;
					activeRequestRunner(componentObject, value);
				});
				break;
			}
			case "number-input": {
				eventGenerator.addEventListener("click", function () {
					//Validate the input
					const min = componentObject.extra.min;
					const max = componentObject.extra.max;
					const decimalPlaces = componentObject.extra.decimalpoint;
					content.value = inputFieldRangeCorrector(content.value, min, max, decimalPlaces);
					// Send the event to the server
					const value = content.value * Math.pow(10, decimalPlaces * -1 || 0);
					activeRequestRunner(componentObject, value);
				});
				break;
			}
		}
	}
}

function addOnFocusDisableUpdate() {
	const activeViewComponents = document.querySelectorAll(".disableUpdateOnFocus");

	for (componentDOM of activeViewComponents) {
		const content = componentDOM.querySelector(".viewContent");
		content.addEventListener("focus", function () {
			//remove viewPassive class from grandparent
			componentDOM.classList.remove("viewPassive");
		});
		content.addEventListener("blur", function () {
			//add viewPassive class to grandparent
			componentDOM.classList.add("viewPassive");
		});
	}
}
