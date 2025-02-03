const layoutEditModalDOM = document.getElementById("editLayoutModal");

const LayoutEditFormControll = {};

document.getElementById("editLayoutForm").addEventListener("submit", function (event) {
	event.preventDefault();

	const layoutType = layoutEditModalDOM.querySelector("#formLayoutType").value;

	editModeLayout.type = layoutType;

	renderer(cardContainer, createLayout(editModeLayout, editModeComponents, isEditMode), isEditMode);
});

layoutEditModalDOM.addEventListener("show.bs.modal", (event) => {
	layoutEditModalDOM.querySelector("#formLayoutType").value = editModeLayout.type;
});
