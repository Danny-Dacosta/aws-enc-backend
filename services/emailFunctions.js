const nodemailer = require("nodemailer");
require("dotenv").config();

const sendPrivateKeyEmail = async (filename, email, privateKey) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "Secure File Backup and Restore <dcubedacosta@gmail.com>",
      to: email,
      subject: "Private Key for file access",
      text: `Here is your private key for ${filename} file access. Keep it safe!`,
      attachments: [
        {
          filename: `${filename}_private_key.pem`,
          content: privateKey,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Private key sent via email");
  } catch (error) {
    console.error("Error sending private key email:", error);
    throw new Error("Error sending private key email");
  }
};

module.exports = { sendPrivateKeyEmail };
