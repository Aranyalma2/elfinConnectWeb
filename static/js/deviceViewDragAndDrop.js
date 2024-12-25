  // Drag-and-drop reordering
  function toggleDragAndDrop(enable) {
    const container = document.getElementById('cardContainer');
    if (enable) {
        container.addEventListener('dragstart', handleDragStart);
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
    } else {
        container.removeEventListener('dragstart', handleDragStart);
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
    }

    const cards = container.querySelectorAll('.card:not(#addNewCard)');
    cards.forEach((card) => {
        card.setAttribute('draggable', enable);
    });
}

let draggedCard = null;
let dragStartIndex = null;
let lastDragOverIndex = null

function handleDragStart(event) {
    draggedCard = event.target;
    dragStartIndex = Array.from(draggedCard.parentNode.children).indexOf(draggedCard);
    lastDragOverIndex = dragStartIndex;
    draggedCard.style.opacity = 0.5;
}

function handleDragOver(event) {
    event.preventDefault();
    const target = event.target.closest('.card');
    let dragOverIndex = Array.from(event.target.closest('#cardContainer').children).indexOf(
        event.target.closest('.card')
    );

    if (target && target.id === 'addNewCard') return;


    if (target && target !== draggedCard) {
        //Some times it can be buggy
        const container = document.getElementById('cardContainer');
        if (dragStartIndex > dragOverIndex) {
            container.insertBefore(draggedCard, target);
        } else if (dragStartIndex < dragOverIndex) {
            container.insertBefore(draggedCard, target.nextSibling);
        } else {
            if (dragOverIndex > lastDragOverIndex) {
                container.insertBefore(draggedCard, target.nextSibling);
            } else {
                container.insertBefore(draggedCard, target);
            }
        }
    }

    lastDragOverIndex = dragOverIndex == lastDragOverIndex ? lastDragOverIndex : dragOverIndex;
}

function handleDrop(event) {
    event.preventDefault();

    const dragEndIndex = Array.from(event.target.closest('#cardContainer').children).indexOf(
        event.target.closest('.card')
    );

    if (dragStartIndex !== null && dragEndIndex !== null && draggedCard) {
        // Reorder the components array
        const draggedComponent = editModeComponents.splice(dragStartIndex, 1)[0];
        editModeComponents.splice(dragEndIndex, 0, draggedComponent);

        // Update order attribute
        editModeComponents.forEach((component, index) => {
            component.order = index;
        });
    }

    draggedCard.style.opacity = '';
    draggedCard = null;
    dragStartIndex = null;

    renderer(cardContainer, createLayout(editModeComponents, isEditMode), isEditMode);
}