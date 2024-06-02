const express = require("express");
const {
  validateUpload,
  validateDownload,
  validateDelete,
  validateFile,
} = require("../middlewares/validation");
const {
  uploadFile,
  downloadFile,
  deleteFile,
  getFilesMetadata,
  getFileMeta,
} = require("../controllers/fileController");

const uploadRoutes = express.Router();
const downloadRoutes = express.Router();
const deleteRoutes = express.Router();
const readRoutes = express.Router();
const readSingleRoutes = express.Router();

uploadRoutes.post("/", validateUpload, uploadFile);

// Download Routes
downloadRoutes.post("/", validateDownload, downloadFile);

// Delete Routes
deleteRoutes.post("/", validateDelete, deleteFile);

// Read Routes
readRoutes.get("/", getFilesMetadata);

// Read Single Routes
readSingleRoutes.get("/:fileId", validateFile, getFileMeta);

module.exports = {
  uploadRoutes,
  downloadRoutes,
  deleteRoutes,
  readRoutes,
  readSingleRoutes,
};
