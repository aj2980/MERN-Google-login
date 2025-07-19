// Admin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('user-info');
    // Redirect to login page
    navigate('/login');
  };

  // Fetch purchase details when the component mounts
  useEffect(() => {
    async function fetchPurchases() {
      try {
        const response = await fetch('http://localhost:3000/purchases');
        if (!response.ok) {
          throw new Error('Failed to fetch purchase details');
        }
        const purchases = await response.json();
        setPurchases(purchases); // Store the purchase data in state
      } catch (error) {
        console.error('Error fetching purchase details:', error);
      }
    }

    fetchPurchases();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="min-h-screen flex-center bg-gray-50">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      <p className="text-gray-600">Welcome to the admin panel.</p>
      <button
        onClick={handleLogout}
        className="mt-6 btn-primary"
        aria-label="Logout"
      >
        Logout
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Purchase Details</h2>
        {purchases.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">User Email</th>
                <th className="py-2">Items</th>
                <th className="py-2">Total Amount</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{purchase.userEmail}</td>
                  <td className="py-2">
                    {purchase.items.map((item, idx) => (
                      <div key={idx}>
                        {item.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="py-2">₹{purchase.totalAmount.toLocaleString()}</td>
                  <td className="py-2">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No purchase details available.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;