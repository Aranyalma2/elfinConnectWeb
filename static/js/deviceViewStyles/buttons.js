const ButtonStyles = {
	getStyles: function () {
		return [
			{ id: "rectangle", name: _texts.Rectangle },
			{ id: "rounded", name: _texts.Rounded },
			{ id: "outline", name: _texts.Outline },
			{ id: "gradient", name: _texts.Gradient },
		];
	},

	getDefaultStyle: function () {
		return {
			name: "rectangle",
			backgroundColor: "#0D6EFD", // Background color
			textColor: "#FFFFFF", // Text color
			borderColor: "#0D6EFD", // Border color
			borderWidth: "1", // Border width
			textStyle: "normal", // Text style (normal, italic, bold)
			fontSize: "16", // Font size
		};
	},

	checkStyleAttributes: function (style) {
		if (!style) style = ButtonStyles.getDefaultStyle();
		if (!style.name) style.name = ButtonStyles.getDefaultStyle().name;
		if (!style.backgroundColor) style.backgroundColor = ButtonStyles.getDefaultStyle().backgroundColor;
		if (!style.textColor) style.textColor = ButtonStyles.getDefaultStyle().textColor;
		if (!style.borderColor) style.borderColor = ButtonStyles.getDefaultStyle().borderColor;
		if (!style.borderWidth) style.borderWidth = ButtonStyles.getDefaultStyle().borderWidth;
		if (!style.textStyle) style.textStyle = ButtonStyles.getDefaultStyle().textStyle;
		if (!style.fontSize) style.fontSize = ButtonStyles.getDefaultStyle().fontSize;
		return style;
	},

	getRenderWithStyle: function (componentObject) {
		componentObject.style = ButtonStyles.checkStyleAttributes(componentObject.style);

		console.log(componentObject.style);

		switch (componentObject.style.name) {
			case "rectangle":
				return ButtonStyles.getRectangleButton(componentObject);
			case "rounded":
				return ButtonStyles.getRoundedButton(componentObject);
			case "outline":
				return ButtonStyles.getOutlineButton(componentObject);
			case "gradient":
				return ButtonStyles.getGradientButton(componentObject);
			default:
				componentObject.style = ButtonStyles.getDefaultStyle();
				return ButtonStyles.getRenderWithStyle(componentObject);
		}
	},

	getRectangleButton: function (component) {
		return `
            <div id="${component.id}" class="viewActive w-100">
                <input hidden class="viewContent" value="1"></input>
                <button 
                    style="
                        background-color: ${component.style.backgroundColor}; 
                        color: ${component.style.textColor}; 
                        border-color: ${component.style.borderColor};
                        border-width: ${component.style.borderWidth}px;
                        font-style: ${component.style.textStyle === "italic" ? "italic" : "normal"};
                        font-weight: ${component.style.textStyle === "bold" ? "bold" : "normal"};
                        font-size: ${component.style.fontSize}px;
                    " 
                    class="btn btn-primary viewEvent w-100 h-100"
                    onmousedown="this.style.backgroundColor='${darkenColor(component.style.backgroundColor, 20)}'"
                    onmouseup="this.style.backgroundColor='${component.style.backgroundColor}'"
                >
                    ${component.extra?.label}
                </button>
                <div class="error text-danger"></div>
            </div>`;
	},

	getRoundedButton: function (component) {
		return `
            <div id="${component.id}" class="viewActive w-100">
                <input hidden class="viewContent" value="1"></input>
                <button 
                    style="
                        background-color: ${component.style.backgroundColor}; 
                        color: ${component.style.textColor}; 
                        border-color: ${component.style.borderColor};
                        border-width: ${component.style.borderWidth}px;
                        border-radius: 20px;
                        font-style: ${component.style.textStyle === "italic" ? "italic" : "normal"};
                        font-weight: ${component.style.textStyle === "bold" ? "bold" : "normal"};
                        font-size: ${component.style.fontSize}px;
                    " 
                    class="btn btn-primary viewEvent w-100 h-100"
                    onmousedown="this.style.backgroundColor='${darkenColor(component.style.backgroundColor, 20)}'"
                    onmouseup="this.style.backgroundColor='${component.style.backgroundColor}'"
                >
                    ${component.extra?.label}
                </button>
                <div class="error text-danger"></div>
            </div>`;
	},

	getOutlineButton: function (component) {
		return `
            <div id="${component.id}" class="viewActive w-100">
                <input hidden class="viewContent" value="1"></input>
                <button 
                    style="
                        background-color: transparent; 
                        color: ${component.style.textColor}; 
                        border-color: ${component.style.borderColor};
                        border-width: ${component.style.borderWidth}px;
                        font-style: ${component.style.textStyle === "italic" ? "italic" : "normal"};
                        font-weight: ${component.style.textStyle === "bold" ? "bold" : "normal"};
                        font-size: ${component.style.fontSize}px;
                    " 
                    class="btn btn-outline-primary viewEvent w-100 h-100"
                    onmousedown="this.style.backgroundColor='${darkenColor(component.style.backgroundColor, 20)}'; this.style.color='#FFFFFF'"
                    onmouseup="this.style.backgroundColor='transparent'; this.style.color='${component.style.backgroundColor}'"
                >
                    ${component.extra?.label}
                </button>
                <div class="error text-danger"></div>
            </div>`;
	},

	getGradientButton: function (component) {
		return `
            <div id="${component.id}" class="viewActive w-100">
                <input hidden class="viewContent" value="1"></input>
                <button 
                    style="
                        background: linear-gradient(45deg, ${component.style.backgroundColor}, ${darkenColor(component.style.backgroundColor, 20)}); 
                        color: ${component.style.textColor}; 
                        border: none;
                        font-style: ${component.style.textStyle === "italic" ? "italic" : "normal"};
                        font-weight: ${component.style.textStyle === "bold" ? "bold" : "normal"};
                        font-size: ${component.style.fontSize}px;
                    " 
                    class="btn btn-primary viewEvent w-100 h-100"
                    onmousedown="this.style.background='linear-gradient(45deg, ${darkenColor(component.style.backgroundColor, 20)}, ${darkenColor(component.style.backgroundColor, 40)})'"
                    onmouseup="this.style.background='linear-gradient(45deg, ${component.style.backgroundColor}, ${darkenColor(component.style.backgroundColor, 20)})'"
                >
                    ${component.extra?.label}
                </button>
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
