import React, { useState } from 'react';
import EmailForm from './components/EmailForm';
import Alert from './components/Alert';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📧 Bulk Email Sender
          </h1>
          <p className="text-gray-600 text-lg">
            Send emails to multiple recipients at once
          </p>
        </div>

        {/* Alert Component */}
        {alert && <Alert type={alert.type} message={alert.message} />}

        {/* Main Form */}
        <EmailForm showAlert={showAlert} />

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🔧 Setup Instructions
          </h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">1.</span>
              <p>
                <strong>Gmail Setup:</strong> You'll need to use an "App Password" instead of your regular Gmail password.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">2.</span>
              <p>
                <strong>Enable 2-Factor Authentication:</strong> Go to your Google Account settings and enable 2FA.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">3.</span>
              <p>
                <strong>Generate App Password:</strong> Go to Google Account → Security → App passwords → Generate a new app password for "Mail".
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">4.</span>
              <p>
                <strong>Use App Password:</strong> Use the generated 16-character app password in the "App Password" field.
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800">Security Note</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Your email credentials are only used to send emails and are not stored.
                However, always use app passwords instead of your main password for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 