const SwitchStyles = {
	getStyles: function () {
		return [{ id: "simple", name: _texts.Default }];
	},

	getDefaultStyle: function () {
		return {
			name: "simple",
			backgroundColor: "#0D6EFD", // Background color
		};
	},

	checkStyleAttributes: function (style) {
		if (!style) style = SwitchStyles.getDefaultStyle();
		if (!style.name) style.name = SwitchStyles.getDefaultStyle().name;
		if (!style.backgroundColor) style.backgroundColor = SwitchStyles.getDefaultStyle().backgroundColor;
		return style;
	},

	getRenderWithStyle: function (componentObject) {
		componentObject.style = SwitchStyles.checkStyleAttributes(componentObject.style);

		switch (componentObject.style.name) {
			case "simple":
				return SwitchStyles.getSimpleSwitch(componentObject);
			default:
				componentObject.style = SwitchStyles.getDefaultStyle();
				return SwitchStyles.getRenderWithStyle(componentObject);
		}
	},

	getSimpleSwitch: function (component) {
		return `<div id="${component.id}" class="viewPassive viewActive switch-container">
									<div class="d-flex align-items-center">
										<div class="form-check form-switch">
											<input class="form-check-input viewContent viewEvent" type="checkbox" role="switch" 
                                            style="
                                                --tooltip-background-color: ${component.style.backgroundColor};
                                                --tooltip-border-color: ${darkenColor(component.style.backgroundColor, 10)};
                                                ">
										</div>
									</div>
									<div class="error text-danger"></div>
								</div>
    `;
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
