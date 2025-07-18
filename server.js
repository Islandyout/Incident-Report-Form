require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true }));

// Check environment variables at startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
  console.error("❌ EMAIL_USER, EMAIL_PASS, and EMAIL_TO must be set in .env");
  process.exit(1);
}

app.post('/submit', upload.none(), async (req, res) => {
  const data = req.body;

  // Validate required fields
  if (typeof data.name !== 'string' || typeof data.description !== 'string' ||
      !data.name.trim() || !data.description.trim()) {
    return res.status(400).send("❌ Missing or invalid required fields: name or description");
  }

  try {
    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Compose email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: 'New Incident Report Submitted',
      text: `An incident report has been submitted by ${data.name}.\n\nDescription: ${data.description}`,
      attachments: [
        {
          filename: 'incident.json',
          content: JSON.stringify(data, null, 2)
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Report emailed: ${data.name}`);
    res.send("✅ Report submitted and emailed.");
  } catch (err) {
    console.error("❌ Error processing report:", err);
    res.status(500).send("❌ Failed to process report. Please try again later.");
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
