const nodemailer = require("nodemailer");

const main = async (email, url, text) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "helloworldsout333@gmail.com",
        pass: "Power@123",
      },
    });

    let info = await transporter.sendMail({
      from: "helloworldsout333@gmail.com",
      to: email,
      subject: "Hello ✔",
      text: "Hello world?",
      html: text,
      html:
        '<p>You requested for email verification, kindly use this <a href="' +
        url +
        '">Verify link</a> to verify your email address</p>',
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("error:", error);
  }
};

module.exports = main;
