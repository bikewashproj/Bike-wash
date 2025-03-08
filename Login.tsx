// Login.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
//import Userlogin from "../pages/Userlogin";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = (response: any) => {
    setIsLoading(true);
    const decoded: any = jwtDecode(response.credential);
    const userData = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      isAdmin: false, 
    };
    login(userData);
    setIsLoading(false);
    navigate("/dashboard");
  };

  const handleGoogleLoginFailure = () => {
    alert("Google Login Failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Droplet className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <button onClick={() => navigate('/')} className="font-medium text-blue-600 hover:text-blue-500">
                continue as guest
              </button>
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/Userlogin')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
            >
              <LogIn className="h-5 w-5 mr-2" /> User Login
            </button>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
