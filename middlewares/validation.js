const { body, param, validationResult } = require("express-validator");

exports.validateUpload = [
  body("email").isEmail().withMessage("Enter a valid email"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateDownload = [
  body("fileId").notEmpty().withMessage("File ID is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateDelete = [
  body("fileId").notEmpty().withMessage("File ID is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateFile = [
  param("fileId").notEmpty().withMessage("File ID is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateOTP = [
  body("email").isEmail().withMessage("Enter a valid email"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
