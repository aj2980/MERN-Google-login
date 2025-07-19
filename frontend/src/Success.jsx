// Success.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Payment Successful!
        </h1>
        <p className="text-gray-600">Thank you for your purchase. Your transaction has been completed successfully.</p>
        <button
          onClick={handleReturnToDashboard}
          className="btn-primary"
          aria-label="Return to Dashboard"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Success;