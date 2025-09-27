// GoogleLogin.jsx
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from './api';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const responseGoogle = async (authResult, isAdmin = false) => {
    try {
      if (authResult['code']) {
        setLoading(true);
        const result = await googleAuth(authResult.code);
        const { email, name, image } = result.data.user;
        const token = result.data.token;
        const obj = { email, name, token, image };
        localStorage.setItem('user-info', JSON.stringify(obj));
        
        if (email === 'jainabhishek624@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error(authResult);
      }
    } catch (e) {
      console.log('Error while Google Login...', e);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (authResult) => responseGoogle(authResult),
    onError: (authResult) => responseGoogle(authResult),
    flow: 'auth-code',
  });

  const adminLogin = useGoogleLogin({
    onSuccess: (authResult) => responseGoogle(authResult, true),
    onError: (authResult) => responseGoogle(authResult, true),
    flow: 'auth-code',
  });

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center p-4 bg-white rounded shadow-sm">
        <h1 className="display-4 text-primary mb-3">Welcome to TechStore</h1>
        <p className="text-muted mb-4">Sign in to explore our products</p>
        <button
          onClick={googleLogin}
          className="btn btn-primary btn-lg d-flex align-items-center justify-content-center mb-3"
          disabled={loading}
          aria-label="Sign in with Google"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <LogIn className="me-2" />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
        <button
          onClick={adminLogin}
          className="btn btn-secondary btn-lg d-flex align-items-center justify-content-center"
          disabled={loading}
          aria-label="Admin Login"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <LogIn className="me-2" />
              <span>Admin Login</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;