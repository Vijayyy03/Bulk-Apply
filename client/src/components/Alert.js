import React from 'react';

const Alert = ({ type, message }) => {
  const alertStyles = {
    success: {
      container: 'bg-green-50 border border-green-200 text-green-800',
      icon: 'text-green-600',
      title: 'Success!'
    },
    error: {
      container: 'bg-red-50 border border-red-200 text-red-800',
      icon: 'text-red-600',
      title: 'Error!'
    },
    warning: {
      container: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
      icon: 'text-yellow-600',
      title: 'Warning!'
    }
  };

  const styles = alertStyles[type] || alertStyles.error;

  return (
    <div className={`rounded-lg p-4 mb-6 ${styles.container}`}>
      <div className="flex items-start space-x-3">
        <div className={`text-xl ${styles.icon}`}>
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'warning' && '⚠️'}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${styles.title}`}>
            {styles.title}
          </h3>
          <p className="mt-1 text-sm">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alert; 