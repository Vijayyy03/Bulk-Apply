import React, { useState, useEffect } from 'react';
import EmailForm from './EmailForm';
import Alert from './Alert';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Check authentication status
    fetch('/auth/user', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.authenticated) {
        setUser(data.user);
      } else {
        window.location.href = '/';
      }
    })
    .catch(error => {
      console.error('Auth check failed:', error);
      window.location.href = '/';
    });
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📧 Bulk Email Sender
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back, {user.name}!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Signed in as</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Alert Component */}
        {alert && <Alert type={alert.type} message={alert.message} />}

        {/* Main Form */}
        <EmailForm showAlert={showAlert} />

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🔧 How to Use
          </h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">1.</span>
              <p>
                <strong>Fill in the form:</strong> Enter the subject, email body, and recipient email addresses.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">2.</span>
              <p>
                <strong>Add attachments (optional):</strong> Select files to attach to your emails.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">3.</span>
              <p>
                <strong>Send emails:</strong> Click "Send Emails" to send to all recipients at once.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 font-bold">4.</span>
              <p>
                <strong>View results:</strong> Check the success/error messages for each recipient.
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-green-600 text-xl">🔒</span>
            <div>
              <h3 className="font-semibold text-green-800">Secure Authentication</h3>
              <p className="text-green-700 text-sm mt-1">
                You're securely signed in with Google OAuth. Your email credentials are managed by Google and not stored by this application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 