import './App.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from './GoogleLogin';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Cart from './Cart'; // Import the Cart component
import Admin from './admin'; // Import the Admin component
import Success from './Success'; // Import the Success component
import { useState } from 'react';
import RefrshHandler from './RefreshHandler';
import NotFound from './NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const GoogleWrapper = () => (
    <GoogleOAuthProvider clientId="1099471200725-tehl5mmvlhk785phbhd0m9k3h6ipoq0j.apps.googleusercontent.com">
      <GoogleLogin />
    </GoogleOAuthProvider>
  );

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/login" element={<GoogleWrapper />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} /> {/* Cart Route */}
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} /> {/* Admin Route */}
        <Route path="/success" element={<Success />} /> {/* Success Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;