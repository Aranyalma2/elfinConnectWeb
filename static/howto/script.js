import { marked } from "./marked.esm.js";

document.addEventListener("DOMContentLoaded", function () {
	// Fetch language file and set the selected one to url
	fetch("contents/content-lang.json")
		.then((response) => response.json())
		.then((content) => {
			const languageSelect = document.getElementById("language-select");

			// Clear existing options
			languageSelect.innerHTML = "";

			// Create an option for each language in the response
			content.languages.forEach((language) => {
				const option = document.createElement("option");
				option.value = language.code;
				option.textContent = language.name;

				languageSelect.appendChild(option);
			});

			const activeLanguage = localStorage.getItem("activeLanguage") || languageSelect[0];

			if (activeLanguage !== languageSelect[0]) {
				languageSelect.value = activeLanguage;
			}

			languageSelect.addEventListener("change", function () {
				const selectedLanguage = languageSelect.value;
				localStorage.setItem("activeLanguage", selectedLanguage);
				window.location.reload();
			});
		});
	// Fetch the list of Markdown files and populate the menu
	fetch("contents/content-list.json")
		.then((response) => response.json())
		.then((filesList) => {
			const menuList = document.getElementById("menu-list");

			// Load the current selected item from localStorage if available
			const activeMenuItem = localStorage.getItem("activeMenuItem") || filesList[0].filename;

			filesList.forEach((file) => {
				const listItem = document.createElement("li");
				listItem.textContent = file.title;
				listItem.dataset.filename = file.filename; // Set data attribute for identification
				listItem.addEventListener("click", () => {
					loadMarkdownFile(file.filename);
					setActiveMenuItem(listItem);
				});

				// Check if the current item is the active one
				if (file.filename === activeMenuItem) {
					listItem.classList.add("active");
				}

				if (file.subcategories && file.subcategories.length > 0) {
					// If there are subcategories, create a nested list but initially show it
					const subcategoryList = document.createElement("ul");
					subcategoryList.classList.add("subcategory");

					file.subcategories.forEach((subcategory) => {
						const subItem = document.createElement("li");
						subItem.textContent = subcategory.title;
						subItem.dataset.filename = subcategory.filename;
						subItem.addEventListener("click", (event) => {
							event.stopPropagation(); // Prevent click on subcategory from bubbling to the main category
							loadMarkdownFile(subcategory.filename);
							setActiveMenuItem(subItem);
						});

						if (subcategory.filename === activeMenuItem) {
							subItem.classList.add("active");
						}

						subcategoryList.appendChild(subItem);
					});

					listItem.appendChild(subcategoryList);
				}

				menuList.appendChild(listItem);
			});

			// Load the first file by default
			loadMarkdownFile(activeMenuItem);
		});

	// Function to load and render Markdown content
	function loadMarkdownFile(filename) {
		const languageSelectValue = document.getElementById("language-select").value;
		fetch(`contents/${languageSelectValue}/${filename}`)
			.then((response) => response.text())
			.then((markdownContent) => {
				const markdownContentDiv = document.getElementById("markdown-content");
				// Use a library like marked.js to render Markdown as HTML
				// For simplicity, we assume a function renderMarkdown exists
				markdownContentDiv.innerHTML = renderMarkdown(markdownContent);
				markdownEmbedding();
			});
	}
	// Function to set the active menu item
	function setActiveMenuItem(selectedItem) {
		// Remove active class from all items
		const allItems = document.querySelectorAll(".menu li, .subcategory li");
		allItems.forEach((item) => item.classList.remove("active"));

		// Add active class to the selected item
		selectedItem.classList.add("active");

		// Save the selected item in localStorage
		localStorage.setItem("activeMenuItem", selectedItem.dataset.filename);
	}

	// Placeholder function, replace with a Markdown rendering library
	function renderMarkdown(markdownContent) {
		// Replace this with a library like marked.js or remark
		return marked.parse(markdownContent);
	}

	function markdownEmbedding() {
		const hostname = document.getElementById("location");
		if (hostname !== null) {
			hostname.innerHTML = new URL(window.location.href).hostname;
		}
	}
});
