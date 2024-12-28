const express = require("express");
const router = express.Router();
const { sendVerificationEmail } = require("../utils/sendEmail");

router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;

    // Log environment variables
    console.log("Environment check:", {
      hasApiKey: !!process.env.SENDGRID_API_KEY,
      sender: process.env.SENDGRID_FROM_EMAIL,
      clientUrl: process.env.CLIENT_URL,
    });

    const testToken = "test-token-123";
    const result = await sendVerificationEmail(email, testToken);

    res.json({
      success: result,
      message: result ? "Test email sent successfully" : "Failed to send email",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test route error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: {
        message: error.message,
        code: error.code,
        response: error.response?.body,
      },
    });
  }
});

module.exports = router;
