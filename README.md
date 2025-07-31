# 📧 Bulk Email Sender

A full-stack web application for sending bulk emails to multiple recipients at once. Built with React, Node.js, Express, and Nodemailer.

## 🚀 Features

- **Bulk Email Sending**: Send emails to multiple recipients simultaneously
- **File Attachments**: Support for multiple file attachments (PDF, DOC, images, etc.)
- **Gmail SMTP Integration**: Uses Gmail's SMTP server for reliable email delivery
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Form Validation**: Comprehensive client-side and server-side validation
- **Real-time Feedback**: Loading states and success/error messages
- **Security**: Uses Gmail App Passwords for enhanced security

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Nodemailer** - Email sending library
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request body parsing

## 📁 Project Structure

```
bulk-email-sender/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmailForm.js
│   │   │   └── Alert.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Node.js backend
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Gmail account** with App Password setup

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the files, just navigate to the project directory
   cd bulk-email-sender
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the frontend (port 3000) and backend (port 5000) servers.

### Manual Installation (Alternative)

If the above doesn't work, install dependencies manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## 🔧 Gmail Setup Instructions

### Step 1: Enable 2-Factor Authentication
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down and click **App passwords**
4. Select **Mail** as the app and **Other** as the device
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Use App Password
- Use your Gmail address as the **Sender Email**
- Use the generated 16-character app password as the **App Password**

## 📝 Usage

1. **Open the application** in your browser: `http://localhost:3000`

2. **Fill in the form**:
   - **Sender Email**: Your Gmail address
   - **App Password**: The 16-character app password from Gmail
   - **Subject**: Email subject line
   - **Email Body**: Your email content
   - **Recipients**: Email addresses separated by commas or new lines
   - **Attachments** (Optional): Select files to attach (PDF, DOC, images, etc.)

3. **Click "Send Emails"** to send to all recipients

4. **View results** - you'll see success/error messages for each recipient

## 🔒 Security Notes

- **App Passwords**: Always use Gmail App Passwords instead of your main password
- **No Storage**: Email credentials are not stored and are only used for sending
- **Local Development**: This is designed for local development use
- **Rate Limits**: Gmail has daily sending limits (500 emails/day for regular accounts)

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid credentials" error**
   - Ensure you're using an App Password, not your regular Gmail password
   - Make sure 2-Factor Authentication is enabled
   - Verify the App Password is correctly copied

2. **"Network error"**
   - Check that both servers are running (frontend on port 3000, backend on port 5000)
   - Verify your internet connection

3. **"Failed to send emails"**
   - Check Gmail's daily sending limits
   - Verify recipient email addresses are valid
   - Ensure your Gmail account allows "less secure app access" (if not using App Passwords)

### Development Commands

```bash
# Start both servers
npm run dev

# Start only the backend
npm run server

# Start only the frontend
npm run client

# Install all dependencies
npm run install-all
```

## 📊 API Endpoints

### POST `/send-emails`
Sends emails to multiple recipients.

**Request Body:**
```json
{
  "sender": "your-email@gmail.com",
  "password": "your-app-password",
  "subject": "Email Subject",
  "body": "Email content",
  "recipients": "email1@gmail.com,email2@gmail.com"
}
```

**File Attachments:**
- Supports multiple file uploads (max 5 files, 10MB each)
- Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP, XLS, XLSX, CSV
- Files are automatically cleaned up after sending

**Response:**
```json
{
  "success": true,
  "message": "Emails sent successfully! 2 successful, 0 failed.",
  "results": [
    {
      "email": "email1@gmail.com",
      "status": "success"
    },
    {
      "email": "email2@gmail.com",
      "status": "success"
    }
  ]
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Bulk Email Sender Server is running"
}
```

## 🎨 Customization

### Styling
- Modify `client/src/index.css` for global styles
- Update `client/tailwind.config.js` for Tailwind configuration
- Edit component files for specific styling changes

### Backend Configuration
- Modify `server/server.js` for server-side changes
- Add new endpoints in the Express app
- Update email sending logic in the `/send-emails` route

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**⚠️ Important**: This application is designed for local development and personal use. For production use, consider implementing additional security measures, rate limiting, and proper error handling.
