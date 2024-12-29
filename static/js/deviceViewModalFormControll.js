const modal = document.getElementById("editComponentModal");

const isSignedCheckbox = modal.querySelector("#numberInputSigned");
const minInput = modal.querySelector("#numberInputMin");
const maxInput = modal.querySelector("#numberInputMax");

// Add event listeners for real-time validation
isSignedCheckbox.addEventListener("input", validateMinMax);
minInput.addEventListener("input", validateMinMax);
maxInput.addEventListener("input", validateMinMax);

function validateMinMax() {
	const isSigned = isSignedCheckbox.checked;

	if (minInput.value === "" || maxInput.value === "") return;
	if (isSigned && (minValue === "-" || maxValue === "-")) return;

	let minVal = parseInt(minInput.value, 10);
	let maxVal = parseInt(maxInput.value, 10);

	if (isSigned) {
		minInput.min = -32768;
		minInput.max = 32767;
		maxInput.min = -32768;
		maxInput.max = 32767;
	} else {
		minInput.min = 0;
		minInput.max = 65535;
		maxInput.min = 0;
		maxInput.max = 65535;
	}

	if (minVal < minInput.min) {
		minVal = minInput.min;
	} else if (minVal > minInput.max) {
		minVal = minInput.max;
	}
	minInput.value = minVal;

	if (maxVal < maxInput.min) {
		maxVal = maxInput.min;
	} else if (maxVal > maxInput.max) {
		maxVal = maxInput.max;
	}
	maxInput.value = maxVal;
}

modal.addEventListener("show.bs.modal", (event) => {
	const button = event.relatedTarget;
	const selectedComponentId = button.parentNode.parentNode.parentNode.id.replace("card-", "");
	const selectedComponent = editModeComponents.find((component) => component.id === selectedComponentId);

	if (selectedComponent === undefined) return;

	const modalTitle = modal.querySelector(".modal-title");
	modalTitle.textContent = `${_texts.Edit} ${selectedComponent.name}`;

	const componentIdAttribute = modal.querySelector("#formComponentId");
	componentIdAttribute.textContent = selectedComponent.id;

	const componentNameInput = modal.querySelector("#formComponentName");
	componentNameInput.value = selectedComponent.name;

	const componentTypeInput = modal.querySelector("#formComponentType");
	componentTypeInput.value = selectedComponent.type;

	const functionCodeInput = modal.querySelector("#formFunctionCode");
	functionCodeInput.value = selectedComponent.modbus?.functionCode;

	const deviceAddressInput = modal.querySelector("#formDeviceAddress");
	deviceAddressInput.value = selectedComponent.modbus?.deviceAddress;

	const registerAddressInput = modal.querySelector("#formRegisterAddress");
	registerAddressInput.value = selectedComponent.modbus?.registerAddress;

	const buttonGroup = modal.querySelector("#buttonGroup");
	const numberDisplayGroup = modal.querySelector("#numberDisplayGroup");
	const numberInputGroup = modal.querySelector("#numberInputGroup");

	// Hide all extra fields
	buttonGroup.classList.add("d-none");
	numberDisplayGroup.classList.add("d-none");
	numberInputGroup.classList.add("d-none");

	switch (selectedComponent.type) {
		case "button": {
			buttonGroup.classList.remove("d-none");
			const buttonLabelInput = modal.querySelector("#buttonLabel");
			buttonLabelInput.value = selectedComponent.extra?.label;
			break;
		}
		case "number-display": {
			numberDisplayGroup.classList.remove("d-none");
			const isSignedCheckbox = modal.querySelector("#numberDisplaySigned");
			isSignedCheckbox.checked = selectedComponent.extra?.isSigned;
			const numberDisplaySuffixInput = modal.querySelector("#numberDisplaySuffix");
			numberDisplaySuffixInput.value = selectedComponent.extra?.suffix;
			const numberDisplayDecimalPointInput = modal.querySelector("#numberDisplayDecimalPoint");
			numberDisplayDecimalPointInput.value = selectedComponent.extra?.decimalpoint;
			break;
		}
		case "number-input": {
			numberInputGroup.classList.remove("d-none");
			const isSignedCheckbox = modal.querySelector("#numberInputSigned");
			isSignedCheckbox.checked = selectedComponent.extra?.isSigned;
			const numberInputDecimalPointInput = modal.querySelector("#numberInputDecimalPoint");
			numberInputDecimalPointInput.value = selectedComponent.extra?.decimalpoint;
			const numberInputMinInput = modal.querySelector("#numberInputMin");
			numberInputMinInput.value = selectedComponent.extra?.min;
			numberInputMinInput.min = isSignedCheckbox.checked ? -32768 : 0;
			const numberInputMaxInput = modal.querySelector("#numberInputMax");
			numberInputMaxInput.value = selectedComponent.extra?.max;
			numberInputMaxInput.max = isSignedCheckbox.checked ? 32767 : 65535;
			break;
		}
	}
});

// Toggle visibility of extra fields based on selected type
document.getElementById("formComponentType").addEventListener("change", function () {
	const formComponentType = document.getElementById("formComponentType");
	buttonGroup.classList.toggle("d-none", formComponentType.value !== "button");
	numberDisplayGroup.classList.toggle("d-none", formComponentType.value !== "number-display");
	numberInputGroup.classList.toggle("d-none", formComponentType.value !== "number-input");
});

document.getElementById("editComponentForm").addEventListener("submit", function (event) {
	event.preventDefault();

	const componentId = modal.querySelector("#formComponentId").textContent;
	const componentName = modal.querySelector("#formComponentName").value;
	const componentType = modal.querySelector("#formComponentType").value;
	const functionCode = modal.querySelector("#formFunctionCode").value;
	const deviceAddress = modal.querySelector("#formDeviceAddress").value;
	const registerAddress = modal.querySelector("#formRegisterAddress").value;

	const componentObject = editModeComponents.find((component) => component.id === componentId);

	componentObject.name = componentName;
	componentObject.type = componentType;
	componentObject.extra = {};
	componentObject.modbus.deviceAddress = deviceAddress;
	componentObject.modbus.registerAddress = registerAddress;
	componentObject.modbus.functionCode = functionCode;

	switch (componentType) {
		case "button": {
			const buttonLabel = modal.querySelector("#buttonLabel").value;
			componentObject.extra.label = buttonLabel;
			break;
		}
		case "number-display":
			{
				const isSigned = modal.querySelector("#numberDisplaySigned").checked;
				componentObject.extra.isSigned = isSigned;
				const numberDisplaySuffix = modal.querySelector("#numberDisplaySuffix").value;
				componentObject.extra.suffix = numberDisplaySuffix;
				const numberDisplayDecimalPoint = modal.querySelector("#numberDisplayDecimalPoint").value;
				componentObject.extra.decimalpoint = numberDisplayDecimalPoint;
			}
			break;
		case "number-input": {
			const isSigned = modal.querySelector("#numberInputSigned").checked;
			componentObject.extra.isSigned = isSigned;
			const numberInputDecimalPoint = modal.querySelector("#numberInputDecimalPoint").value;
			componentObject.extra.decimalpoint = numberInputDecimalPoint;
			const numberInputMin = modal.querySelector("#numberInputMin").value;
			componentObject.extra.min = numberInputMin;
			const numberInputMax = modal.querySelector("#numberInputMax").value;
			componentObject.extra.max = numberInputMax;
			break;
		}
	}

	//Overwrite the component in the array
	editModeComponents = editModeComponents.map((component) => {
		if (component.id === componentId) {
			return componentObject;
		}
		return component;
	});

	renderer(cardContainer, createLayout(editModeComponents, isEditMode), isEditMode);
});
