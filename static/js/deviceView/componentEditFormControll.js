const componentEditModalDOM = document.getElementById("editComponentModal");

const ComponentEditFormControll = {
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
		const dropdownDOMRenderer = function (list) {
			let domString = "";
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
				const buttonBackgroundColorInput = componentEditModalDOM.querySelector("#buttonBackgroundColor");
				buttonBackgroundColorInput.value = data.backgroundColor;
				buttonBackgroundColorInput.jscolor.fromString(data.backgroundColor);
				const buttonTextColorInput = componentEditModalDOM.querySelector("#buttonTextColor");
				buttonTextColorInput.value = data.textColor;
				buttonTextColorInput.jscolor.fromString(data.textColor);
				const buttonFontSizeInput = componentEditModalDOM.querySelector("#buttonFontSize");
				buttonFontSizeInput.value = data.fontSize;
				const buttonBorderColorInput = componentEditModalDOM.querySelector("#buttonBorderColor");
				buttonBorderColorInput.value = data.borderColor;
				buttonBorderColorInput.jscolor.fromString(data.borderColor);
				const buttonBorderWidthInput = componentEditModalDOM.querySelector("#buttonBorderWidth");
				buttonBorderWidthInput.value = data.borderWidth;
				const buttonTextStyleInput = componentEditModalDOM.querySelector("#buttonTextStyle");
				buttonTextStyleInput.value = data.textStyle;

				break;
			case "switch":
				styleDropdownDOM.innerHTML = dropdownDOMRenderer(SwitchStyles.getStyles());
				data = SwitchStyles.checkStyleAttributes(data);
				// Set values of the style fields
				styleDropdownDOM.value = data.name;
				const switchBackgroundColorInput = componentEditModalDOM.querySelector("#switchBackgroundColor");
				switchBackgroundColorInput.value = data.backgroundColor;
				switchBackgroundColorInput.jscolor.fromString(data.backgroundColor);
				break;
			case "lamp":
				styleDropdownDOM.innerHTML = dropdownDOMRenderer(LampStyles.getStyles());
				data = LampStyles.checkStyleAttributes(data);
				// Set values of the style fields
				styleDropdownDOM.value = data.name;
				const lampBackgroundColorOnInput = componentEditModalDOM.querySelector("#lampBackgroundColorOn");
				lampBackgroundColorOnInput.value = data.backgroundColorOn;
				lampBackgroundColorOnInput.jscolor.fromString(data.backgroundColorOn);
				const lampBackgroundColorOffInput = componentEditModalDOM.querySelector("#lampBackgroundColorOff");
				lampBackgroundColorOffInput.value = data.backgroundColorOff;
				lampBackgroundColorOffInput.jscolor.fromString(data.backgroundColorOff);
				const lampStateOnTextInput = componentEditModalDOM.querySelector("#lampStateOnText");
				lampStateOnTextInput.value = data.stateOnText;
				const lampStateOffTextInput = componentEditModalDOM.querySelector("#lampStateOffText");
				lampStateOffTextInput.value = data.stateOffText;
				const lampBorderColorInput = componentEditModalDOM.querySelector("#lampBorderColor");
				lampBorderColorInput.value = data.borderColor;
				lampBorderColorInput.jscolor.fromString(data.borderColor);
				const lampBorderWidthInput = componentEditModalDOM.querySelector("#lampBorderWidth");
				lampBorderWidthInput.value = data.borderWidth;
				const lampEffectInput = componentEditModalDOM.querySelector("#lampEffect");
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

	extraParamSectionRenderer: function (componentType, extraParamSectionDOM, data) {
		switch (componentType) {
			case "button": {
				// Set the values of the extra fields
				const buttonLabelInput = extraParamSectionDOM.querySelector("#buttonLabel");
				buttonLabelInput.value = data.label;
				break;
			}
			case "switch":
				break;
			case "lamp":
				break;
			case "number-display": {
				// Set the values of the extra fields
				const isSignedCheckbox = extraParamSectionDOM.querySelector("#numberDisplaySigned");
				isSignedCheckbox.checked = data.isSigned;
				const numberDisplaySuffixInput = extraParamSectionDOM.querySelector("#numberDisplaySuffix");
				numberDisplaySuffixInput.value = data.suffix;
				const numberDisplayDecimalPointInput = extraParamSectionDOM.querySelector("#numberDisplayDecimalPoint");
				numberDisplayDecimalPointInput.value = data.decimalpoint;
				break;
			}
			case "number-input": {
				// Set the values of the extra fields
				const isSignedCheckbox = extraParamSectionDOM.querySelector("#numberInputSigned");
				isSignedCheckbox.checked = data.isSigned;
				const numberInputDecimalPointInput = extraParamSectionDOM.querySelector("#numberInputDecimalPoint");
				numberInputDecimalPointInput.value = data.decimalpoint;
				const numberInputMinInput = extraParamSectionDOM.querySelector("#numberInputMin");
				numberInputMinInput.value = data.min;
				numberInputMinInput.min = isSignedCheckbox.checked ? -32768 : 0;
				const numberInputMaxInput = extraParamSectionDOM.querySelector("#numberInputMax");
				numberInputMaxInput.value = data.max;
				numberInputMaxInput.max = isSignedCheckbox.checked ? 32767 : 65535;
				break;
			}
		}
	},

	justShowDependantFields: function (componentType) {
		const buttonGroups = componentEditModalDOM.querySelectorAll(".buttonGroup");
		const switchGroups = componentEditModalDOM.querySelectorAll(".switchGroup");
		const lampGroups = componentEditModalDOM.querySelectorAll(".lampGroup");
		const numberDisplayGroups = componentEditModalDOM.querySelectorAll(".numberDisplayGroup");
		const numberInputGroups = componentEditModalDOM.querySelectorAll(".numberInputGroup");

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

const isSignedCheckbox = componentEditModalDOM.querySelector("#numberInputSigned");
const minInput = componentEditModalDOM.querySelector("#numberInputMin");
const maxInput = componentEditModalDOM.querySelector("#numberInputMax");

// Add event listeners for real-time validation
isSignedCheckbox.addEventListener("input", ComponentEditFormControll.validateMinMax);
minInput.addEventListener("input", ComponentEditFormControll.validateMinMax);
maxInput.addEventListener("input", ComponentEditFormControll.validateMinMax);

componentEditModalDOM.addEventListener("show.bs.modal", (event) => {
	const button = event.relatedTarget;
	const selectedComponentId = button.parentNode.parentNode.parentNode.id.replace("card-", "");
	const selectedComponent = editModeComponents.find((component) => component.id === selectedComponentId);

	if (selectedComponent === undefined) return;

	const modalTitle = componentEditModalDOM.querySelector(".modal-title");
	modalTitle.textContent = `${_texts.Edit} ${selectedComponent.name}`;

	const componentIdAttribute = componentEditModalDOM.querySelector("#formComponentId");
	componentIdAttribute.textContent = selectedComponent.id;

	const componentNameInput = componentEditModalDOM.querySelector("#formComponentName");
	componentNameInput.value = selectedComponent.name;

	const componentTypeInput = componentEditModalDOM.querySelector("#formComponentType");
	componentTypeInput.value = selectedComponent.type;

	const functionCodeInput = componentEditModalDOM.querySelector("#formFunctionCode");
	functionCodeInput.value = selectedComponent.modbus?.functionCode;

	const deviceAddressInput = componentEditModalDOM.querySelector("#formDeviceAddress");
	deviceAddressInput.value = selectedComponent.modbus?.deviceAddress;

	const registerAddressInput = componentEditModalDOM.querySelector("#formRegisterAddress");
	registerAddressInput.value = selectedComponent.modbus?.registerAddress;

	//Style section
	const styleSection = document.getElementById("formSectionStyle");
	ComponentEditFormControll.styleSectionRenderer(selectedComponent.type, styleSection, selectedComponent.style);

	//Extra parameter section
	const extraParamSection = document.getElementById("formSectionExtra");
	ComponentEditFormControll.extraParamSectionRenderer(selectedComponent.type, extraParamSection, selectedComponent.extra);

	ComponentEditFormControll.justShowDependantFields(selectedComponent.type);
});

// Toggle visibility of extra fields based on selected type
document.getElementById("formComponentType").addEventListener("change", function () {
	//Extra paramter groups
	const formComponentType = document.getElementById("formComponentType");
	ComponentEditFormControll.justShowDependantFields(formComponentType.value);

	//Styles
	const styleSection = document.getElementById("formSectionStyle");
	ComponentEditFormControll.styleSectionRenderer(formComponentType.value, styleSection, null);
});

document.getElementById("editComponentForm").addEventListener("submit", function (event) {
	event.preventDefault();

	const componentId = componentEditModalDOM.querySelector("#formComponentId").textContent;
	const componentName = componentEditModalDOM.querySelector("#formComponentName").value;
	const componentType = componentEditModalDOM.querySelector("#formComponentType").value;
	const functionCode = componentEditModalDOM.querySelector("#formFunctionCode").value;
	const deviceAddress = componentEditModalDOM.querySelector("#formDeviceAddress").value;
	const registerAddress = componentEditModalDOM.querySelector("#formRegisterAddress").value;
	const styleName = componentEditModalDOM.querySelector("#formComponentTypeStyle").value;

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
			const buttonLabel = componentEditModalDOM.querySelector("#buttonLabel").value;
			componentObject.extra.label = buttonLabel;
			componentObject.style.backgroundColor = componentEditModalDOM.querySelector("#buttonBackgroundColor").value;
			componentObject.style.textColor = componentEditModalDOM.querySelector("#buttonTextColor").value;
			componentObject.style.fontSize = componentEditModalDOM.querySelector("#buttonFontSize").value;
			componentObject.style.borderColor = componentEditModalDOM.querySelector("#buttonBorderColor").value;
			componentObject.style.borderWidth = componentEditModalDOM.querySelector("#buttonBorderWidth").value;
			componentObject.style.textStyle = componentEditModalDOM.querySelector("#buttonTextStyle").value;
			break;
		}
		case "lamp": {
			componentObject.style.backgroundColorOn = componentEditModalDOM.querySelector("#lampBackgroundColorOn").value;
			componentObject.style.backgroundColorOff = componentEditModalDOM.querySelector("#lampBackgroundColorOff").value;
			componentObject.style.stateOnText = componentEditModalDOM.querySelector("#lampStateOnText").value;
			componentObject.style.stateOffText = componentEditModalDOM.querySelector("#lampStateOffText").value;
			componentObject.style.borderColor = componentEditModalDOM.querySelector("#lampBorderColor").value;
			componentObject.style.borderWidth = componentEditModalDOM.querySelector("#lampBorderWidth").value;
			componentObject.style.effect = componentEditModalDOM.querySelector("#lampEffect").value;
			break;
		}
		case "switch": {
			componentObject.style.backgroundColor = componentEditModalDOM.querySelector("#switchBackgroundColor").value;
			break;
		}
		case "number-display": {
			const isSigned = componentEditModalDOM.querySelector("#numberDisplaySigned").checked;
			componentObject.extra.isSigned = isSigned;
			const numberDisplaySuffix = componentEditModalDOM.querySelector("#numberDisplaySuffix").value;
			componentObject.extra.suffix = numberDisplaySuffix;
			const numberDisplayDecimalPoint = componentEditModalDOM.querySelector("#numberDisplayDecimalPoint").value;
			componentObject.extra.decimalpoint = numberDisplayDecimalPoint;
			break;
		}
		case "number-input": {
			const isSigned = componentEditModalDOM.querySelector("#numberInputSigned").checked;
			componentObject.extra.isSigned = isSigned;
			const numberInputDecimalPoint = componentEditModalDOM.querySelector("#numberInputDecimalPoint").value;
			componentObject.extra.decimalpoint = numberInputDecimalPoint;
			const numberInputMin = componentEditModalDOM.querySelector("#numberInputMin").value;
			componentObject.extra.min = numberInputMin;
			const numberInputMax = componentEditModalDOM.querySelector("#numberInputMax").value;
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

	renderer(cardContainer, createLayout(editModeLayout, editModeComponents, isEditMode), isEditMode);
});
