import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/verify-email/${token}`
        );

        if (response.data.success) {
          setVerificationStatus("success");
          toast.success("Email verified successfully!");
          setTimeout(() => {
            navigate("/signin");
          }, 5000);
        }
      } catch (error) {
        setVerificationStatus("error");
        toast.error(error.response?.data?.mes || "Verification failed");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#6374AE] mb-4">
            Email Verification
          </h2>

          {verificationStatus === "verifying" && (
            <div className="text-gray-600">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6374AE] mx-auto mb-4"></div>
              <p>Verifying your email...</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="text-green-600">
              <i className="fas fa-check-circle text-5xl mb-4"></i>
              <p>Your email has been verified successfully!</p>
              <p className="text-sm mt-2">Redirecting to login page...</p>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="text-red-600">
              <i className="fas fa-times-circle text-5xl mb-4"></i>
              <p>Verification failed. The link may be invalid or expired.</p>
              <button
                onClick={() => navigate("/signin")}
                className="mt-4 px-4 py-2 bg-[#6374AE] text-white rounded-lg hover:bg-[#4A5578]"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
