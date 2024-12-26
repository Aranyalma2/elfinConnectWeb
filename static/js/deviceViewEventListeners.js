function addEventListener(isEditMode) {
	toggleDragAndDrop(isEditMode);
	addNewCardEventListeners(isEditMode);
	if (isEditMode === false) addActiveComponentEventListeners();
}

function addNewCardEventListeners(isEditMode) {
	if (isEditMode !== true) return;
	const addNewCard = document.getElementById("card-addNewCard");
	addNewCard.addEventListener("click", function () {
		const newCardData = {
			id: `id_${Date.now()}`,
			name: "New Component",
			type: "button",
			modbus: {
				functionCode: "01",
				deviceAddress: "1",
				registerAddress: "1",
			},
			order: editModeComponents.length,
			extra: {
				label: "New Button",
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
					console.log("Button clicked", content.value);
					componentObject.data = content.value;
					sendDataRequest(componentObject);
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
					console.log("Number input changed", content.value);
					const value = content.value * Math.pow(10, decimalPlaces * -1 || 0);
					componentObject.data = value;
					sendDataRequest(componentObject);
				});
				break;
			}
		}
	}
}
