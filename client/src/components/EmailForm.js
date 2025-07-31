import React, { useState } from 'react';

const EmailForm = ({ showAlert }) => {
  const [formData, setFormData] = useState({
    sender: '',
    password: '',
    subject: '',
    body: '',
    recipients: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sender.trim()) {
      newErrors.sender = 'Sender email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.sender)) {
      newErrors.sender = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'App password is required';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Email body is required';
    }
    
    if (!formData.recipients.trim()) {
      newErrors.recipients = 'At least one recipient is required';
    } else {
      const recipientList = formData.recipients
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      if (recipientList.length === 0) {
        newErrors.recipients = 'At least one valid recipient email is required';
      } else {
        const invalidEmails = recipientList.filter(email => !/\S+@\S+\.\S+/.test(email));
        if (invalidEmails.length > 0) {
          newErrors.recipients = `Invalid email format: ${invalidEmails.join(', ')}`;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showAlert('error', 'Please fix the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add attachments
      attachments.forEach(file => {
        formDataToSend.append('attachments', file);
      });
      
      const response = await fetch('/send-emails', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (data.success) {
        showAlert('success', data.message);
        // Clear form on success
        setFormData({
          sender: '',
          password: '',
          subject: '',
          body: '',
          recipients: ''
        });
        setAttachments([]);
      } else {
        showAlert('error', data.message || 'Failed to send emails');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      showAlert('error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        📝 Email Form
      </h2>
      
             <form onSubmit={handleSubmit} className="space-y-6">
         {/* Sender Email */}
         <div>
           <label htmlFor="sender" className="block text-sm font-medium text-gray-700 mb-2">
             Sender Email *
           </label>
           <input
             type="email"
             id="sender"
             name="sender"
             value={formData.sender}
             onChange={handleChange}
             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
               errors.sender ? 'border-red-500' : 'border-gray-300'
             }`}
             placeholder="your-email@gmail.com"
             disabled={isLoading}
           />
           {errors.sender && (
             <p className="mt-1 text-sm text-red-600">{errors.sender}</p>
           )}
         </div>

         {/* App Password */}
         <div>
           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
             App Password *
           </label>
           <input
             type="password"
             id="password"
             name="password"
             value={formData.password}
             onChange={handleChange}
             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
               errors.password ? 'border-red-500' : 'border-gray-300'
             }`}
             placeholder="16-character app password"
             disabled={isLoading}
           />
           {errors.password && (
             <p className="mt-1 text-sm text-red-600">{errors.password}</p>
           )}
         </div>

         {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email subject"
            disabled={isLoading}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* Email Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Email Body *
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
              errors.body ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email content here..."
            disabled={isLoading}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body}</p>
          )}
        </div>

                 {/* Recipients */}
         <div>
           <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-2">
             Recipients *
           </label>
           <textarea
             id="recipients"
             name="recipients"
             value={formData.recipients}
             onChange={handleChange}
             rows={4}
             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
               errors.recipients ? 'border-red-500' : 'border-gray-300'
             }`}
             placeholder="Enter email addresses separated by commas or new lines&#10;example1@gmail.com&#10;example2@gmail.com&#10;example3@gmail.com"
             disabled={isLoading}
           />
           {errors.recipients && (
             <p className="mt-1 text-sm text-red-600">{errors.recipients}</p>
           )}
           <p className="mt-1 text-sm text-gray-500">
             Separate multiple email addresses with commas or new lines
           </p>
         </div>

         {/* File Attachments */}
         <div>
           <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
             Attachments (Optional)
           </label>
           <div className="space-y-3">
             <input
               type="file"
               id="attachments"
               multiple
               onChange={handleFileChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               disabled={isLoading}
               accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx,.csv"
             />
             <p className="text-sm text-gray-500">
               Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP, XLS, XLSX, CSV (Max 5 files, 10MB each)
             </p>
             
             {/* Display selected files */}
             {attachments.length > 0 && (
               <div className="mt-3 space-y-2">
                 <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                 <div className="space-y-2">
                   {attachments.map((file, index) => (
                     <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                       <div className="flex items-center space-x-2">
                         <span className="text-blue-600">📎</span>
                         <span className="text-sm text-gray-700">{file.name}</span>
                         <span className="text-xs text-gray-500">
                           ({(file.size / 1024 / 1024).toFixed(2)} MB)
                         </span>
                       </div>
                       <button
                         type="button"
                         onClick={() => removeAttachment(index)}
                         className="text-red-500 hover:text-red-700 text-sm"
                         disabled={isLoading}
                       >
                         ✕
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending Emails...</span>
              </div>
            ) : (
              '📤 Send Emails'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm; 