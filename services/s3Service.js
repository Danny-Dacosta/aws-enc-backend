const AWS = require("aws-sdk");
const crypto = require("crypto");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.fetchFilesMetadata = async () => {
  const params = {
    Bucket: process.env.S3_BUCKET,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents;
    const metadata = {};

    for (const file of files) {
      const fileId = file.Key;
      metadata[fileId] = await this.headFile(fileId);
    }

    return metadata;
  } catch (error) {
    console.error("Error fetching files metadata:", error);
    return {};
  }
};

exports.fetchFileMetadata = async (fileId) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileId,
  };

  try {
    const headData = await s3.headObject(params).promise();
    return headData.Metadata;
  } catch (error) {
    console.error("Error fetching file metadata from S3:", error);
    throw error;
  }
};

exports.headFile = async (fileId) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileId,
  };

  try {
    const { Metadata } = await s3.headObject(params).promise();
    return Metadata;
  } catch (error) {
    console.error(`Error fetching metadata for file ${fileId}:`, error);
    return {};
  }
};

exports.getFile = async (fileId) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileId,
  };

  try {
    const file = await s3.getObject(params).promise();
    return { encryptedFileBuffer: file.Body, metadata: file.Metadata };
  } catch (error) {
    console.error(`Error fetching file ${fileId}:`, error);
    throw new Error("File not found");
  }
};

exports.multipartUpload = async ({ fileId, buffer, metadata }) => {
  const uploadId = await s3
    .createMultipartUpload({
      Bucket: process.env.S3_BUCKET,
      Key: fileId,
      Metadata: metadata,
    })
    .promise()
    .then((data) => data.UploadId);

  const partSize = 5 * 1024 * 1024; // 5MB parts
  const parts = [];

  for (let start = 0; start < buffer.length; start += partSize) {
    const end = Math.min(start + partSize, buffer.length);
    const partBuffer = buffer.slice(start, end);

    const part = await s3
      .uploadPart({
        Bucket: process.env.S3_BUCKET,
        Key: fileId,
        PartNumber: parts.length + 1,
        UploadId: uploadId,
        Body: partBuffer,
      })
      .promise();

    parts.push({
      ETag: part.ETag,
      PartNumber: parts.length + 1,
    });
  }

  await s3
    .completeMultipartUpload({
      Bucket: process.env.S3_BUCKET,
      Key: fileId,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    })
    .promise();
};

exports.deleteFile = async (fileId) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileId,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    throw new Error("File deletion failed");
  }
};
