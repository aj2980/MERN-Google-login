// GoogleLogin.jsx
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from './api';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

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
    <div className="min-h-screen flex-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to TechStore
        </h1>
        <p className="text-gray-600">Sign in to explore our products</p>
        <button
          onClick={googleLogin}
          className="btn-primary flex items-center justify-center space-x-2 mx-auto"
          disabled={loading}
          aria-label="Sign in with Google"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
        <button
          onClick={adminLogin}
          className="btn-secondary flex items-center justify-center space-x-2 mx-auto"
          disabled={loading}
          aria-label="Admin Login"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Admin Login</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;