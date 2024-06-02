# Secure File Upload and Download Using Hybrid Encryption

Project Backend

## Install the packages

```cmd
npm i crypto aws-sdk body-parser cors dotenv express express-validator  multer nodemailer express-rate-limit util zlib
```

## Env Setup for the project
```env
PORT=""
EMAIL=""
PASSWORD=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
S3_BUCKET=""
SMTP_HOST=""
SMTP_PORT=""
```

## Run the Server
```bash
node app.js
