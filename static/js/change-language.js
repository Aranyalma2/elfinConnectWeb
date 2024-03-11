// change-language.js

function setLanguageCookie(value) {
	document.cookie = `lang=${encodeURIComponent(value)}; Max-Age=86400; path=/; sameSite=strict`;
	location.reload();
}
