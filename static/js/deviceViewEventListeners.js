function addEventListener(isEditMode) {
	toggleDragAndDrop(isEditMode);
	addNewCardEventListeners(isEditMode);
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
				functionCode: 1,
				deviceAddress: 1,
				registerAddress: 1,
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
