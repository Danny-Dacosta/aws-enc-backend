require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const multer = require("multer");

const { initializeMetadata } = require("./services/fileService");
const {
  uploadRoutes,
  downloadRoutes,
  deleteRoutes,
  readRoutes,
  readSingleRoutes,
} = require("./routes/fileRoutes");

const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(bodyParser.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
  })
);

app.use("/upload", upload.single("file"), uploadRoutes);
app.use("/download", upload.single("privateKey"), downloadRoutes);
app.use("/delete", upload.single("privateKey"), deleteRoutes);
app.use("/files", readRoutes);
app.use("/file", readSingleRoutes);

initializeMetadata();

app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
