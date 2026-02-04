import React, { useEffect, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login, navigate } = useContext(ShopContext);
  const hasHandledAuth = useRef(false);

  useEffect(() => {
    if (hasHandledAuth.current) return;
    hasHandledAuth.current = true;

    const handleAuth = async () => {
      const token = searchParams.get("token");

      if (token) {
        await login(token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Authentication failed");
        navigate("/login");
      }
    };

    handleAuth();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
