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
			cardContent = `<div class="viewControll-button">
                            <button id="${component.id}" class="btn btn-primary">${component.extra?.label}</button>
                            <div class="error text-danger"></div>
                        </div>`;
			break;
		case "lamp":
			cardContent = `<div class="viewControll-lamp">
							<div id="${component.id}">0</div>
							<div class="error text-danger"></div>
						  </div>`;
			break;
		case "number-display":
			cardContent = `<div class="viewControll-numberdisplay ">
							<div class="d-flex flex-row">
								<div>
									<h1 id="${component.id}">0</h1>
								</div>
								<div>
									${component.extra.suffix ? `<h1>${component.extra?.suffix}</h1>` : ""}
								</div>
							</div>
							<div class="error text-danger"></div>
						  </div>`;
			break;
		case "number-input":
			break;
		case "addNew":
			cardContent = `<div class="card-body d-flex justify-content-center align-items-center">
                                <span class="text-muted">+ Add New</span>`;
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
            <button class="edit-card-btn btn" data-bs-toggle="modal" data-bs-target="#editComponentModal" title="Edit"><i class="bi bi-pencil btn-secondary"></i></button>
            <button class="delete-card-btn btn-close" title="Delete"></button>
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
