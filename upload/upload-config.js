const multer = require('multer');
const path = require('path');

// Set up multer storage
const desktopClientApps = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/downloads/desktopclient'); // Uploads will be stored in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const { name, ext } = splitByLastDot(file.originalname)
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

function splitByLastDot(inputString) {
  const lastDotIndex = inputString.lastIndexOf('.');

  if (lastDotIndex !== -1) {
    const firstPart = inputString.slice(0, lastDotIndex);
    const secondPart = inputString.slice(lastDotIndex + 1);

    return [firstPart, secondPart];
  } else {
    // If no dot is found, return the entire string as the first part
    return [inputString];
  }
}

module.exports = { desktopClientApps };