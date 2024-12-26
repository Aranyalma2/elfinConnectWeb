const modal = document.getElementById("editComponentModal");
modal.addEventListener("show.bs.modal", (event) => {
	const button = event.relatedTarget;
	const selectedComponentId = button.parentNode.parentNode.parentNode.id.replace("card-", "");
	const selectedComponent = editModeComponents.find((component) => component.id === selectedComponentId);

	if (selectedComponent === undefined) return;

	const modalTitle = modal.querySelector(".modal-title");
	modalTitle.textContent = `Edit ${selectedComponent.name}`;

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

	switch (selectedComponent.type) {
		case "button":
			const buttonLabelGroup = modal.querySelector("#buttonGroup");
			buttonLabelGroup.classList.remove("d-none");
			const buttonLabelInput = modal.querySelector("#buttonLabel");
			buttonLabelInput.value = selectedComponent?.extra?.label;
			break;
		case "number-display":
			const numberDisplayGroup = modal.querySelector("#numberDisplayGroup");
			numberDisplayGroup.classList.remove("d-none");
			const isSignedCheckbox = modal.querySelector("#numberDisplaySigned");
			isSignedCheckbox.checked = selectedComponent?.extra?.isSigned;
			const numberDisplaySuffixInput = modal.querySelector("#numberDisplaySuffix");
			numberDisplaySuffixInput.value = selectedComponent?.extra?.suffix;
			break;
	}
});

// Toggle visibility of extra fields based on selected type
document.getElementById("formComponentType").addEventListener("change", function () {
	const formComponentType = document.getElementById("formComponentType");
	buttonGroup.classList.toggle("d-none", formComponentType.value !== "button");
	numberDisplayGroup.classList.toggle("d-none", formComponentType.value !== "number-display");
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
		case "button":
			const buttonLabel = modal.querySelector("#buttonLabel").value;
			componentObject.extra.label = buttonLabel;
			break;
		case "number-display":
			const isSigned = modal.querySelector("#numberDisplaySigned").checked;
			componentObject.extra.isSigned = isSigned;
			const numberDisplaySuffix = modal.querySelector("#numberDisplaySuffix").value;
			componentObject.extra.suffix = numberDisplaySuffix;
			break;
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
