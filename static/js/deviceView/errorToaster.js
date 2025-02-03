const errorToastDOM = document.getElementById("errorToast");
const errorToast = bootstrap.Toast.getOrCreateInstance(errorToastDOM);
const toggleErrorToastBodyButton = document.getElementById("toggleErrorToastBodyButton");

const ErrorToaster = {
	errors: [],

	addError: ({ title, level, message }) => {
		// Check if the error already exists
		const existingError = ErrorToaster.errors.find((error) => error.title === title && error.level === level && error.message === message);

		if (existingError) {
			// Increment the count if the error already exists
			existingError.count += 1;
		} else {
			// Add the new error with a count of 1
			ErrorToaster.errors.push({ title, level, message, count: 1 });
		}

		ErrorToaster.show();
	},

	clear: () => {
		ErrorToaster.errors = [];
	},

	show: () => {
		// Sort errors by critical first, then warning, then others
		ErrorToaster.errors.sort((a, b) => {
			const levels = { critical: 1, warning: 2 };
			return (levels[a.level] || 3) - (levels[b.level] || 3);
		});

		// Initialize counts for critical and warning errors
		let criticalCount = 0;
		let warningCount = 0;

		// Count the number of critical and warning errors
		ErrorToaster.errors.forEach((error) => {
			if (error.level === "critical") {
				criticalCount += error.count;
			} else if (error.level === "warning") {
				warningCount += error.count;
			}
		});

		// Clear previous icons
		const iconsDiv = errorToastDOM.querySelector(".icons");
		iconsDiv.innerHTML = "";

		// Add icons with counts
		if (criticalCount > 0) {
			const criticalIcon = document.createElement("span");
			criticalIcon.innerHTML = `<i class="ms-1 bi bi-exclamation-triangle-fill text-danger" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"></i> ${criticalCount}`;
			iconsDiv.appendChild(criticalIcon);
		}

		if (warningCount > 0) {
			const warningIcon = document.createElement("span");
			warningIcon.innerHTML = `<i class="ms-1 bi bi-exclamation-circle-fill text-warning"></i> ${warningCount}`;
			iconsDiv.appendChild(warningIcon);
		}

		// Update the toast body content without emptying it
		const toastBody = errorToastDOM.querySelector(".toast-body");
		let newContent = "";

		ErrorToaster.errors.forEach((error) => {
			newContent += `<div class="${error.level === "critical" ? "text-danger" : "text-warning"}">
                            <strong>${error.title}</strong> - ${error.message}`;
			if (error.count > 1) {
				newContent += ` (${error.count})`; // Append count if greater than 1
			}
			newContent += `</div>`;
		});

		toastBody.innerHTML = newContent;

		// Show the toast only if it's not already shown
		if (!errorToastDOM.classList.contains("show")) {
			errorToast.show();
		}
	},
};

// Toggle the visibility of the toast-body
toggleErrorToastBodyButton.addEventListener("click", () => {
	const toastBody = errorToastDOM.querySelector(".toast-body");
	const icon = toggleErrorToastBodyButton.querySelector("i");
	if (toastBody.style.display === "none") {
		toastBody.style.display = "block";
		icon.classList.remove("bi-chevron-up");
		icon.classList.add("bi-chevron-down");
	} else {
		toastBody.style.display = "none";
		icon.classList.remove("bi-chevron-down");
		icon.classList.add("bi-chevron-up");
	}
});

// Clear the errors when the toast is closed
errorToastDOM.addEventListener("hidden.bs.toast", () => {
	ErrorToaster.clear();
});
