const {
  handleUpload,
  handleDownload,
  handleDelete,
  fetchFilesMetadata,
  fetchFileMetadata,
} = require("../services/fileService");

exports.uploadFile = async (req, res) => {
  try {
    const response = await handleUpload(req.file, req.body.email);
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const response = await handleDownload(req.body.fileId, req.file.buffer);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${response.originalFileName}"`
    );
    res.send(response.buffer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "File download failed", error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const response = await handleDelete(req.body.fileId, req.file.buffer);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "File deletion failed", error: error.message });
  }
};

exports.getFilesMetadata = async (req, res) => {
  try {
    const metadata = await fetchFilesMetadata();
    res.json(metadata);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch files metadata",
      error: error.message,
    });
  }
};

exports.getFileMeta = async (req, res) => {
  try {
    // console.log(req.body);
    const fileId = req.params.fileId;
    const metadata = await fetchFileMetadata(fileId);
    res.json(metadata);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch file metadata",
      error: error.message,
    });
  }
};
