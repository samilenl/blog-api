const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config()

const mongoDB = process.env.MONGODB_URI;

const storageStrategy = new GridFsStorage({
  url: mongoDB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const fileInfo = {
        filename,
        bucketName: "Images"
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({ storage: storageStrategy });

module.exports = upload;
