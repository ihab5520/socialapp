// config/cloudinary.config.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "drisrefu7",
  api_key: "122712113739478",
  api_secret: "0WCM3aOho05WIoVtAkZNUhn3Nvo",
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"],
    folder: "test", // The name of the folder in clocudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  },
});

var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/images");
  },
  filename: function (req, file, cb) {
    cb(null, "UploadedOn" + Date.now() + "fileOrigName" + file.originalname);
  },
});
//                     storage: storage
module.exports = multer({ storage });
