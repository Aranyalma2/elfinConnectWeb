const modal = document.getElementById("editComponentModal");

const FormControll = {
	validateMinMax: function () {
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
	},

	styleSectionRenderer: function (componentType, styleSectionDOM, data) {
		console.log(componentType);
		const dropdownDOMRenderer = function (list) {
			let domString = "";
			console.log(list);
			list.forEach((item) => {
				const option = document.createElement("option");
				option.value = item.id;
				option.text = item.name;
				domString += option.outerHTML;
			});
			return domString;
		};

		styleDropdownDOM = styleSectionDOM.querySelector("#formComponentTypeStyle");
		styleDropdownDOM.innerHTML = "";
		switch (componentType) {
			case "button":
				styleDropdownDOM.innerHTML = dropdownDOMRenderer(ButtonStyles.getStyles());
				data = ButtonStyles.checkStyleAttributes(data);
				// Set values of the style fields
				styleDropdownDOM.value = data.name;
				const buttonBackgroundColorInput = modal.querySelector("#buttonBackgroundColor");
				buttonBackgroundColorInput.value = data.backgroundColor;
				buttonBackgroundColorInput.jscolor.fromString(data.backgroundColor);
				const buttonTextColorInput = modal.querySelector("#buttonTextColor");
				buttonTextColorInput.value = data.textColor;
				buttonTextColorInput.jscolor.fromString(data.textColor);
				const buttonFontSizeInput = modal.querySelector("#buttonFontSize");
				buttonFontSizeInput.value = data.fontSize;
				const buttonBorderColorInput = modal.querySelector("#buttonBorderColor");
				buttonBorderColorInput.value = data.borderColor;
				buttonBorderColorInput.jscolor.fromString(data.borderColor);
				const buttonBorderWidthInput = modal.querySelector("#buttonBorderWidth");
				buttonBorderWidthInput.value = data.borderWidth;
				const buttonTextStyleInput = modal.querySelector("#buttonTextStyle");
				buttonTextStyleInput.value = data.textStyle;

				break;
			case "switch":
				styleDropdownDOM.innerHTML = `<option value="default">${_texts?.Default}</option>`;
				break;
			case "lamp":
				styleDropdownDOM.innerHTML = dropdownDOMRenderer(LampStyles.getStyles());
				data = LampStyles.checkStyleAttributes(data);
				// Set values of the style fields
				styleDropdownDOM.value = data.name;
				const lampBackgroundColorOnInput = modal.querySelector("#lampBackgroundColorOn");
				lampBackgroundColorOnInput.value = data.backgroundColorOn;
				lampBackgroundColorOnInput.jscolor.fromString(data.backgroundColorOn);
				const lampBackgroundColorOffInput = modal.querySelector("#lampBackgroundColorOff");
				lampBackgroundColorOffInput.value = data.backgroundColorOff;
				lampBackgroundColorOffInput.jscolor.fromString(data.backgroundColorOff);
				const lampStateOnTextInput = modal.querySelector("#lampStateOnText");
				lampStateOnTextInput.value = data.stateOnText;
				const lampStateOffTextInput = modal.querySelector("#lampStateOffText");
				lampStateOffTextInput.value = data.stateOffText;
				const lampBorderColorInput = modal.querySelector("#lampBorderColor");
				lampBorderColorInput.value = data.borderColor;
				lampBorderColorInput.jscolor.fromString(data.borderColor);
				const lampBorderWidthInput = modal.querySelector("#lampBorderWidth");
				lampBorderWidthInput.value = data.borderWidth;
				const lampEffectInput = modal.querySelector("#lampEffect");
				lampEffectInput.innerHTML = dropdownDOMRenderer(LampStyles.getEffects());
				lampEffectInput.value = data.effect;
				break;
			case "number-display":
				styleDropdownDOM.innerHTML = `<option value="default">${_texts?.Default}</option>`;
				break;
			case "number-input":
				styleDropdownDOM.innerHTML = `<option value="default">${_texts?.Default}</option>`;
		}
	},

	justShowDependantFields: function (componentType) {
		const buttonGroups = modal.querySelectorAll(".buttonGroup");
		const switchGroups = modal.querySelectorAll(".switchGroup");
		const lampGroups = modal.querySelectorAll(".lampGroup");
		const numberDisplayGroups = modal.querySelectorAll(".numberDisplayGroup");
		const numberInputGroups = modal.querySelectorAll(".numberInputGroup");

		// Hide all type dependant fields
		buttonGroups.forEach((group) => {
			group.classList.add("d-none");
		});
		switchGroups.forEach((group) => {
			group.classList.add("d-none");
		});
		lampGroups.forEach((group) => {
			group.classList.add("d-none");
		});
		numberDisplayGroups.forEach((group) => {
			group.classList.add("d-none");
		});
		numberInputGroups.forEach((group) => {
			group.classList.add("d-none");
		});

		switch (componentType) {
			case "button":
				buttonGroups.forEach((group) => {
					group.classList.remove("d-none");
				});
				break;
			case "switch":
				switchGroups.forEach((group) => {
					group.classList.remove("d-none");
				});
				break;
			case "lamp":
				lampGroups.forEach((group) => {
					group.classList.remove("d-none");
				});
				break;
			case "number-display":
				numberDisplayGroups.forEach((group) => {
					group.classList.remove("d-none");
				});
				break;
			case "number-input":
				numberInputGroups.forEach((group) => {
					group.classList.remove("d-none");
				});
				break;
		}

		$("#myModal").modal("handleUpdate");
	},
};

const isSignedCheckbox = modal.querySelector("#numberInputSigned");
const minInput = modal.querySelector("#numberInputMin");
const maxInput = modal.querySelector("#numberInputMax");

// Add event listeners for real-time validation
isSignedCheckbox.addEventListener("input", FormControll.validateMinMax);
minInput.addEventListener("input", FormControll.validateMinMax);
maxInput.addEventListener("input", FormControll.validateMinMax);

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

	//Style section
	const styleSection = document.getElementById("formSectionStyle");
	FormControll.styleSectionRenderer(selectedComponent.type, styleSection, selectedComponent.style);

	FormControll.justShowDependantFields(selectedComponent.type);

	switch (selectedComponent.type) {
		case "button": {
			// Set the values of the extra fields
			const buttonLabelInput = modal.querySelector("#buttonLabel");
			buttonLabelInput.value = selectedComponent.extra?.label;
			break;
		}

		case "lamp": {
			// Set values of the style fields

			break;
		}

		case "number-display": {
			// Set the values of the extra fields
			const isSignedCheckbox = modal.querySelector("#numberDisplaySigned");
			isSignedCheckbox.checked = selectedComponent.extra?.isSigned;
			const numberDisplaySuffixInput = modal.querySelector("#numberDisplaySuffix");
			numberDisplaySuffixInput.value = selectedComponent.extra?.suffix;
			const numberDisplayDecimalPointInput = modal.querySelector("#numberDisplayDecimalPoint");
			numberDisplayDecimalPointInput.value = selectedComponent.extra?.decimalpoint;
			break;
		}
		case "number-input": {
			// Set the values of the extra fields
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
	//Extra paramter groups
	const formComponentType = document.getElementById("formComponentType");
	FormControll.justShowDependantFields(formComponentType.value);

	//Styles
	const styleSection = document.getElementById("formSectionStyle");
	FormControll.styleSectionRenderer(formComponentType.value, styleSection, null);
});

document.getElementById("editComponentForm").addEventListener("submit", function (event) {
	event.preventDefault();

	const componentId = modal.querySelector("#formComponentId").textContent;
	const componentName = modal.querySelector("#formComponentName").value;
	const componentType = modal.querySelector("#formComponentType").value;
	const functionCode = modal.querySelector("#formFunctionCode").value;
	const deviceAddress = modal.querySelector("#formDeviceAddress").value;
	const registerAddress = modal.querySelector("#formRegisterAddress").value;
	const styleName = modal.querySelector("#formComponentTypeStyle").value;

	const componentObject = editModeComponents.find((component) => component.id === componentId);

	componentObject.name = componentName;
	componentObject.type = componentType;
	componentObject.extra = {};
	componentObject.modbus.deviceAddress = deviceAddress;
	componentObject.modbus.registerAddress = registerAddress;
	componentObject.modbus.functionCode = functionCode;
	componentObject.style = { name: styleName };

	switch (componentType) {
		case "button": {
			const buttonLabel = modal.querySelector("#buttonLabel").value;
			componentObject.extra.label = buttonLabel;
			componentObject.style.backgroundColor = modal.querySelector("#buttonBackgroundColor").value;
			componentObject.style.textColor = modal.querySelector("#buttonTextColor").value;
			componentObject.style.fontSize = modal.querySelector("#buttonFontSize").value;
			componentObject.style.borderColor = modal.querySelector("#buttonBorderColor").value;
			componentObject.style.borderWidth = modal.querySelector("#buttonBorderWidth").value;
			componentObject.style.textStyle = modal.querySelector("#buttonTextStyle").value;
			break;
		}
		case "lamp": {
			componentObject.style.backgroundColorOn = modal.querySelector("#lampBackgroundColorOn").value;
			componentObject.style.backgroundColorOff = modal.querySelector("#lampBackgroundColorOff").value;
			componentObject.style.stateOnText = modal.querySelector("#lampStateOnText").value;
			componentObject.style.stateOffText = modal.querySelector("#lampStateOffText").value;
			componentObject.style.borderColor = modal.querySelector("#lampBorderColor").value;
			componentObject.style.borderWidth = modal.querySelector("#lampBorderWidth").value;
			componentObject.style.effect = modal.querySelector("#lampEffect").value;
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
