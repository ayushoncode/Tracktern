const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Email credentials are missing");
      }

      console.warn("⚠️ Email credentials are missing. Skipping email send in non-production mode.");
      console.log(`📩 Email fallback -> to: ${to}, subject: ${subject}, text: ${text}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Tracktern" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email send response", {
      to,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    if (info.rejected?.length) {
      throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
    }
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err.message);
    throw err; // important
  }
};

module.exports = sendEmail;
