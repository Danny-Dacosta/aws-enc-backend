const zlib = require("zlib");

const compressBuffer = (buffer) => {
  return zlib.gzipSync(buffer);
};

const decompressBuffer = (buffer) => {
  return zlib.gunzipSync(buffer);
};

module.exports = {
  compressBuffer,
  decompressBuffer,
};
