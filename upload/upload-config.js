const multer = require('multer');
const path = require('path');

// Set up multer storage
const desktopClientApps = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/downloads/desktopclient'); // Uploads will be stored in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

module.exports = {desktopClientApps};