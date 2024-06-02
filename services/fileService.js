const {
  generateRSAKeyPair,
  generateAESKey,
  generateIV,
  encryptAES,
  decryptAES,
} = require("../utils/encryptionUtils");
const {
  compressBuffer,
  decompressBuffer,
} = require("../utils/compressionUtils");
const { sendPrivateKeyEmail } = require("./emailFunctions");
const s3Service = require("./s3Service");
const crypto = require("crypto");

let filesMetadata = {};

exports.initializeMetadata = async () => {
  filesMetadata = await s3Service.fetchFilesMetadata();
};

exports.handleUpload = async (file, email) => {
  const fileBuffer = file.buffer;
  const compressedBuffer = compressBuffer(fileBuffer);

  const aesKey = generateAESKey();

  const iv = generateIV();

  const encryptedFileBuffer = encryptAES(compressedBuffer, aesKey, iv);

  const { publicKey, privateKey } = await generateRSAKeyPair("rsa", {
    modulusLength: 2048,
  });

  const encryptedAESKey = crypto.publicEncrypt(publicKey, aesKey);

  await sendPrivateKeyEmail(
    file.originalname,
    email,
    privateKey.export({ type: "pkcs1", format: "pem" })
  );
  const fileId = crypto.randomBytes(16).toString("hex");

  await s3Service.multipartUpload({
    fileId,
    buffer: encryptedFileBuffer,
    metadata: {
      originalFileName: file.originalname,
      email,
      aesKey: encryptedAESKey.toString("base64"),
      iv: iv.toString("base64"),
      fileSize: file.size.toString(),
      compressedFileSize: compressedBuffer.length.toString(),
      mimeType: file.mimetype,
      dateCreated: new Date().toLocaleDateString("en-GB"),
    },
  });

  filesMetadata[fileId] = {
    originalFileName: file.originalname,
    fileSize: file.size,
    compressedFileSize: compressedBuffer.length,
    email,
    fileId,
    mimeType: file.mimetype,
    dateCreated: new Date().toLocaleDateString("en-GB"),
  };

  return { message: "File uploaded successfully", fileId };
};

exports.handleDownload = async (fileId, privateKeyBuffer) => {
  const privateKey = privateKeyBuffer.toString("utf-8");
  const { encryptedFileBuffer, metadata } = await s3Service.getFile(fileId);
  const encryptedAESKey = Buffer.from(metadata.aeskey, "base64");
  const iv = Buffer.from(metadata.iv, "base64");
  const aesKey = crypto.privateDecrypt(privateKey, encryptedAESKey);
  const compressedBuffer = decryptAES(encryptedFileBuffer, aesKey, iv);
  const originalBuffer = decompressBuffer(compressedBuffer);

  return {
    buffer: originalBuffer,
    originalFileName: metadata.originalfilename,
  };
};

exports.handleDelete = async (fileId, privateKeyBuffer) => {
  const privateKey = privateKeyBuffer.toString("utf-8");
  const metadata = await s3Service.headFile(fileId);

  const encryptedAESKey = Buffer.from(metadata.aeskey, "base64");
  const aesKey = crypto.privateDecrypt(privateKey, encryptedAESKey);

  await s3Service.deleteFile(fileId);

  delete filesMetadata[fileId];

  return { message: "File deleted successfully" };
};

exports.fetchFilesMetadata = async () => {
  filesMetadata = await s3Service.fetchFilesMetadata();
  return filesMetadata;
};

exports.fetchFileMetadata = async (fileId) => {
  try {
    const metadata = await s3Service.fetchFileMetadata(fileId);
    return metadata;
  } catch (error) {
    console.error("Error fetching file metadata:", error);
    throw error;
  }
};
