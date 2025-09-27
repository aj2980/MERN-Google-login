// Admin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-4 text-primary">Admin Dashboard</h1>
        <p className="text-muted">Welcome to the admin panel.</p>
        <button
          onClick={handleLogout}
          className="btn btn-danger mt-3"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <div className="mt-5">
        <h2 className="h4 mb-4">Purchase Details</h2>
        {purchases.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">User Email</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total Amount</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>{purchase.userEmail}</td>
                    <td>
                      {purchase.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} (x{item.quantity})
                        </div>
                      ))}
                    </td>
                    <td>₹{purchase.totalAmount.toLocaleString()}</td>
                    <td>{new Date(purchase.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No purchase details available.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;