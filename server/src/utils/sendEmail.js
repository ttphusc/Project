const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  console.log("Sending email with following details:");
  console.log("API Key:", process.env.SENDGRID_API_KEY ? "Exists" : "Missing");
  console.log("From Email:", process.env.SENDGRID_FROM_EMAIL);
  console.log("To Email:", email);
  console.log("Client URL:", process.env.CLIENT_URL);

  try {
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "FitNutritionHub",
      },
      subject: "Verify your email",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Verify your email</h2>
          <p>Thank you for registering! Please click the link below to verify your email:</p>
          <a href="${process.env.CLIENT_URL}/verify-email/${verificationToken}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    console.log("Attempting to send email with message:", msg);
    const result = await sgMail.send(msg);
    console.log("SendGrid API Response:", result);
    return true;
  } catch (error) {
    console.error("Email sending error details:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("API Error Response:", error.response.body);
    }
    return false;
  }
};

module.exports = { sendVerificationEmail };
