const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, documents, and text files are allowed.'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email sending endpoint with file attachments
app.post('/send-emails', upload.array('attachments', 5), async (req, res) => {
  try {
    const { sender, password, subject, body, recipients } = req.body;
    const attachments = req.files || [];

    // Basic validation
    if (!sender || !password || !subject || !body || !recipients) {
      // Clean up uploaded files if validation fails
      attachments.forEach(file => {
        try { fs.unlinkSync(file.path); } catch (error) { console.error('Error deleting file:', file.path, error); }
      });
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Parse recipients (split by comma or newline)
    const recipientList = recipients
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (recipientList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one recipient email is required'
      });
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: sender,
        pass: password
      }
    });

    // Prepare attachments for nodemailer
    const emailAttachments = attachments.map(file => ({
      filename: file.originalname,
      path: file.path
    }));

    // Send emails to each recipient
    const results = [];
    for (const recipient of recipientList) {
      try {
        const mailOptions = {
          from: sender,
          to: recipient,
          subject: subject,
          text: body,
          html: body.replace(/\n/g, '<br>'), // Convert newlines to HTML breaks
          attachments: emailAttachments
        };

        await transporter.sendMail(mailOptions);
        results.push({
          email: recipient,
          status: 'success'
        });
      } catch (error) {
        results.push({
          email: recipient,
          status: 'error',
          error: error.message
        });
      }
    }

    // Clean up uploaded files
    attachments.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error('Error deleting file:', file.path, error);
      }
    });

    // Count successes and failures
    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;

    res.json({
      success: true,
      message: `Emails sent successfully! ${successful} successful, ${failed} failed.`,
      results: results
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails. Please check your credentials and try again.',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bulk Email Sender Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email sending endpoint: http://localhost:${PORT}/send-emails`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
}); 