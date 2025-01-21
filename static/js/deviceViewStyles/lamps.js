const LampStyles = {
	getStyles: function () {
		return [
			{ id: "rectangle", name: _texts.Rectangle },
			{ id: "rectangle-neon", name: _texts.RectangleNeon },
			{ id: "rounded", name: _texts.Rounded },
			{ id: "rounded-neon", name: _texts.RoundedNeon },
			{ id: "circle", name: _texts.Circle },
			{ id: "circle-neon", name: _texts.CircleNeon },
		];
	},

	getEffects: function () {
		return [
			{ id: "none", name: _texts.None },
			{ id: "blink", name: _texts.Blink },
		];
	},

	getDefaultStyle: function () {
		return {
			name: "rectangle",
			backgroundColorOn: "#0D6EFD", // Background color when on
			backgroundColorOff: "#CCCCCC", // Background color when off
			stateOnText: "", // Text when on
			stateOffText: "", // Text when off
			borderColor: "#0D6EFD", // Border color
			borderWidth: "1", // Border width
			effect: "none", // Effect type
		};
	},

	checkStyleAttributes: function (style) {
		if (!style) style = LampStyles.getDefaultStyle();
		if (!style.name) style.name = LampStyles.getDefaultStyle().name;
		if (!style.backgroundColorOn) style.backgroundColorOn = LampStyles.getDefaultStyle().backgroundColorOn;
		if (!style.backgroundColorOff) style.backgroundColorOff = LampStyles.getDefaultStyle().backgroundColorOff;
		if (!style.stateOnText) style.stateOnText = LampStyles.getDefaultStyle().stateOnText;
		if (!style.stateOffText) style.stateOffText = LampStyles.getDefaultStyle().stateOffText;
		if (!style.borderColor) style.borderColor = LampStyles.getDefaultStyle().borderColor;
		if (!style.borderWidth) style.borderWidth = LampStyles.getDefaultStyle().borderWidth;
		if (!style.effect) style.effect = LampStyles.getDefaultStyle().effect;
		return style;
	},

	getEffect: function (effect) {
		switch (effect) {
			case "none":
				return "";
			case "blink":
				return "blink";
			default:
				return "";
		}
	},

	getRenderWithStyle: function (componentObject) {
		componentObject.style = LampStyles.checkStyleAttributes(componentObject.style);

		switch (componentObject.style.name) {
			case "rectangle":
				return LampStyles.getRectangleLamp(componentObject);
			case "rectangle-neon":
				return LampStyles.getRectangleNeonLamp(componentObject);
			case "rounded":
				return LampStyles.getRoundedLamp(componentObject);
			case "rounded-neon":
				return LampStyles.getRoundedNeonLamp(componentObject);
			case "circle":
				return LampStyles.getCircleLamp(componentObject);
			case "circle-neon":
				return LampStyles.getCircleNeonLamp(componentObject);
			default:
				componentObject.style = LampStyles.getDefaultStyle();
				return LampStyles.getRenderWithStyle(componentObject);
		}
	},

	getRectangleLamp: function (component) {
		const backgroundColor = component.state === 1 ? component.style.backgroundColorOn : component.style.backgroundColorOff;
		return `
            <div id="${component.id}" class="viewPassive w-100">
                <div class="w-100 h-100 d-flex justify-content-center align-items-center ${component.state === 1 ? LampStyles.getEffect(component.style.effect) : ""}"
                    style="
                        background-color: ${backgroundColor};
                        border-color: ${component.style.borderColor};
                        border-width: ${component.style.borderWidth}px;
                        border-style: solid;
                        position: relative;
                    ">
                    <div class="viewContent position-absolute" style="color:${getTextColorForBackground(backgroundColor)};">${component.state === 1 ? component.style.stateOnText : component.style.stateOffText}</div>
                </div>
                <div class="error text-danger"></div>
            </div>`;
	},

	getRectangleNeonLamp: function (component) {
		const backgroundColor = component.state === 1 ? component.style.backgroundColorOn : component.style.backgroundColorOff;
		return `
            <div id="${component.id}" class="viewPassive w-100">
                <div class="w-100 h-100 d-flex justify-content-center align-items-center ${component.state === 1 ? LampStyles.getEffect(component.style.effect) : ""}"
                    style="
                        background-color: ${backgroundColor};
                        border-color: ${component.style.borderColor};
                        border-width: ${component.style.borderWidth}px;
                        border-style: solid;
                        position: relative;
                        box-shadow: 0 0 10px ${backgroundColor}, 0 0 20px ${backgroundColor}, 0 0 30px ${backgroundColor};
                    ">
                    <div class="viewContent position-absolute" style="color:${getTextColorForBackground(backgroundColor)};">${component.state === 1 ? component.style.stateOnText : component.style.stateOffText}</div>
                </div>
                <div class="error text-danger"></div>
            </div>`;
	},

	getRoundedLamp: function (component) {
		const backgroundColor = component.state === 1 ? component.style.backgroundColorOn : component.style.backgroundColorOff;
		return `
        <div id="${component.id}" class="viewPassive w-100">
            <div class="w-100 h-100 d-flex justify-content-center align-items-center ${component.state === 1 ? LampStyles.getEffect(component.style.effect) : ""}"
                style="
                    background-color: ${backgroundColor};
                    border-color: ${component.style.borderColor};
                    border-width: ${component.style.borderWidth}px;
                    border-style: solid;
                    position: relative;
                    border-radius: 20px;
                ">
                <div class="viewContent position-absolute" style="color:${getTextColorForBackground(backgroundColor)};">${component.state === 1 ? component.style.stateOnText : component.style.stateOffText}</div>
            </div>
            <div class="error text-danger"></div>
        </div>`;
	},

	getRoundedNeonLamp: function (component) {
		const backgroundColor = component.state === 1 ? component.style.backgroundColorOn : component.style.backgroundColorOff;
		return `
        <div id="${component.id}" class="viewPassive w-100">
            <div class="w-100 h-100 d-flex justify-content-center align-items-center ${component.state === 1 ? LampStyles.getEffect(component.style.effect) : ""}"
                style="
                    background-color: ${backgroundColor};
                    border-color: ${component.style.borderColor};
                    border-width: ${component.style.borderWidth}px;
                    border-style: solid;
                    position: relative;
                    border-radius: 20px;
                    box-shadow: 0 0 10px ${backgroundColor}, 0 0 20px ${backgroundColor}, 0 0 30px ${backgroundColor};
                ">
                <div class="viewContent position-absolute" style="color:${getTextColorForBackground(backgroundColor)};">${component.state === 1 ? component.style.stateOnText : component.style.stateOffText}</div>
            </div>
            <div class="error text-danger"></div>
        </div>`;
	},

	getCircleLamp: function (component) {
		const backgroundColor = component.state === 1 ? component.style.backgroundColorOn : component.style.backgroundColorOff;
		return `
        <div id="${component.id}" class="viewPassive justify-content-center align-items-center">
            <div class="d-flex justify-content-center align-items-center ${component.state === 1 ? LampStyles.getEffect(component.style.effect) : ""}"
                style="
                    background-color: ${backgroundColor};
                    border-color: ${component.style.borderColor};
                    border-width: ${component.style.borderWidth}px;
                    border-style: solid;
                    position: relative;
                    height: 75px;
                    width: 75px;
                    border-radius: 50%;
                ">
                <div class="viewContent position-absolute" style="color:${getTextColorForBackground(backgroundColor)};">${component.state === 1 ? component.style.stateOnText : component.style.stateOffText}</div>
            </div>
            <div class="error text-danger"></div>
        </div>`;
	},

	getCircleNeonLamp: function (component) {
		const backgroundColor = component.state === 1 ? component.style.backgroundColorOn : component.style.backgroundColorOff;
		return `
        <div id="${component.id}" class="viewPassive justify-content-center align-items-center">
            <div class="d-flex justify-content-center align-items-center ${component.state === 1 ? LampStyles.getEffect(component.style.effect) : ""}"
                style="
                    background-color: ${backgroundColor};
                    border-color: ${component.style.borderColor};
                    border-width: ${component.style.borderWidth}px;
                    border-style: solid;
                    position: relative;
                    height: 75px;
                    width: 75px;
                    border-radius: 50%;
                    box-shadow: 0 0 10px ${backgroundColor}, 0 0 20px ${backgroundColor}, 0 0 30px ${backgroundColor};
                ">
                <div class="viewContent position-absolute" style="color:${getTextColorForBackground(backgroundColor)};">${component.state === 1 ? component.style.stateOnText : component.style.stateOffText}</div>
            </div>
            <div class="error text-danger"></div>
        </div>`;
	},
};

function darkenColor(color, percent) {
	if (!color || color.length < 7) return color;
	const num = parseInt(color.slice(1), 16),
		amt = Math.round(2.55 * percent),
		R = (num >> 16) - amt,
		G = ((num >> 8) & 0x00ff) - amt,
		B = (num & 0x0000ff) - amt;

	return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255))
		.toString(16)
		.slice(1)
		.toUpperCase()}`;
}

/**
 * Determines whether white or black text should be used
 * to ensure good contrast against the provided hex color.
 *
 * @param {string} hexColor - The background color in hex format (e.g., "#ffffff").
 * @returns {string} - Returns "#000000" for black or "#ffffff" for white text.
 */
function getTextColorForBackground(hexColor) {
	// Remove the "#" if present
	hexColor = hexColor.replace("#", "");

	// Parse the R, G, and B values as integers from the hex string
	const r = parseInt(hexColor.substring(0, 2), 16);
	const g = parseInt(hexColor.substring(2, 4), 16);
	const b = parseInt(hexColor.substring(4, 6), 16);

	// Calculate the relative luminance in the sRGB color space
	// Common formula: 0.299*R + 0.587*G + 0.114*B
	const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

	// If luminance is high, return black text; otherwise, white text
	return luminance > 186 ? "#000000" : "#ffffff";
}
