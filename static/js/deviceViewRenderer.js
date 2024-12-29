//The runtime layout creator function
function createLayout(components = [], editMode = false) {
	const cardArray = [];

	// Sort components by order
	components.sort((a, b) => a.order - b.order);

	// Render each component as a card
	components.forEach((component) => {
		const card = renderComponent(component, editMode);
		cardArray.push(card);
	});

	// Add "Add New" card button if in edit mode
	if (editMode) {
		const newCardObject = {
			id: "addNewCard",
			type: "addNew",
		};
		const card = renderComponent(newCardObject, editMode);
		cardArray.push(card);
	}

	return cardArray;
}

function renderComponent(component, editMode) {
	const card = createCard(component, editMode);
	card.innerHTML = createCardContent(component, editMode);
	return card;
}

function createCard(component, editMode) {
	const card = document.createElement("div");
	card.id = `card-${component.id}`;
	card.className = "card m-1";
	card.style.width = "200px";
	card.style.height = "150px";
	if (editMode && component.type !== "addNew") {
		card.style.border = "2px dashed #007bff";
		card.style.cursor = "move";
	} else if (editMode && component.type === "addNew") {
		card.style.cursor = "pointer";
	}
	return card;
}

function createCardContent(component, editMode) {
	let cardContent = "";
	switch (component.type) {
		case "button":
			cardContent = `<div id="${component.id}" class="viewActive">
                            <input hidden class="viewContent" value="1"></input>
                            <button class="btn btn-primary viewEvent">${component.extra?.label}</button>
                            <div class="error text-danger"></div>
                        </div>`;
			break;
		case "lamp":
			cardContent = `<div id="${component.id}" class="viewPassive">
							<div class="viewContent">0</div>
							<div class="error text-danger"></div>
						  </div>`;
			break;
		case "number-display":
			cardContent = `<div id="${component.id}" class="viewPassive">
							<div class="d-flex flex-row">
								<div>
									<h1 class="viewContent">0</h1>
								</div>
								<div>
									${component.extra.suffix ? `<h1>${component.extra?.suffix}</h1>` : ""}
								</div>
							</div>
							<div class="error text-danger"></div>
						  </div>`;
			break;
		case "number-input":
			cardContent = `<div id="${component.id}" class="viewActive viewPassive">
                            <div class="d-flex flex-row align-items-center justify-content-between flex-wrap">
                                <input class="viewContent form-control me-1" style="flex: 1;" type="number" step=${Math.pow(10, component.extra?.decimalpoint) || 0} value=${component.extra?.min || 0} min=${component.extra?.min || 0} max==${component.extra?.max || 65535}style="flex: 1;">
                                <button class="btn btn-primary viewEvent" style="flex-shrink: 0;">${_texts.NumberInput_Set}</button>
                            </div>
                            <div class="error text-danger mt-2"></div>
                        </div>
                        `;
			break;
		case "addNew":
			cardContent = `<div class="card-body d-flex justify-content-center align-items-center">
                                <span class="text-muted">+ ${_texts.AddNew_Card}</span>`;
			return cardContent;
		default:
			return "Unknown component type";
	}
	const cardFrame = `
        <div class="card-body">
        ${
			editMode
				? `
          <div class="card-title d-flex justify-content-between">
            <button class="edit-card-btn btn" data-bs-toggle="modal" data-bs-target="#editComponentModal" title="${_texts.Edit}"><i class="bi bi-pencil btn-secondary"></i></button>
            <button class="delete-card-btn btn-close" title="${_texts.Delete}"></button>
          </div>
          `
				: ""
		}
          <div class="card-title d-flex justify-content-between">
            <h5 class="fw-bold">${component.name}</h5>
          </div>
          <div class="card-text d-flex justify-content-center">${cardContent}</div>
        </div>
      `;
	return cardFrame;
}

function updateCardContent(componentId, data, error) {
	const viewElement = document.getElementById(componentId).querySelector(".viewContent");
	const errorElement = document.getElementById(componentId).querySelector(".error");
	if (errorElement) {
		errorElement.textContent = error || "";
	}
	if (error || !viewElement) {
		return;
	}

	const componentObject = runModeComponents.find((element) => element.id === componentId);
	switch (componentObject.type) {
		case "button":
			break;
		case "lamp":
			viewElement.textContent = data;
			break;
		case "number-display":
			data = parseFloat(data) * Math.pow(10, componentObject.extra.decimalpoint || 0);
			if (componentObject.extra.decimalpoint < 0) data = data.toFixed(componentObject.extra.decimalpoint * -1);
			viewElement.textContent = data;
			break;
		case "number-input":
			data = parseFloat(data) * Math.pow(10, componentObject.extra.decimalpoint || 0);
			if (componentObject.extra.decimalpoint < 0) data = data.toFixed(componentObject.extra.decimalpoint * -1);
			viewElement.value = data;
			break;
		default:
			return "Unknown component type";
	}
}

// Function to enable/disable edit mode on a card
function renderer(container, layout, isEditMode = false) {
	//Clear the container
	container.innerHTML = "";

	layout.forEach((card) => {
		//Add card to the container
		container.appendChild(card);

		//Disable/Enable input fields and buttons
		const inputsAndButtons = card.querySelectorAll("button, input, a");
		inputsAndButtons.forEach((element) => {
			element.disabled = isEditMode;

			//Enable/Disable delete/edit buttons if in edit mode
			if (element.classList.contains("delete-card-btn") || element.classList.contains("edit-card-btn")) {
				element.disabled = !isEditMode;
			}
		});
	});

	// Re-add event listeners
	addEventListener(isEditMode);
}
