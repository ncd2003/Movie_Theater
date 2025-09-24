import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react"; // Icon từ Lucide React
import ResetPasswordApi from "../../../api/ResetPasswordApi";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xác thực OTP...");
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await ResetPasswordApi.verifyOtp(token);
        setMessage("OTP hợp lệ. Đang chuyển hướng...");
        setStatus("success");
        setTimeout(
          () => navigate(`/customer/reset-password?token=${token}`),
          5000
        );
      } catch (error) {
        setMessage("OTP không hợp lệ hoặc đã hết hạn. Quay lại trang trước...");
        setStatus("error");
        setTimeout(() => navigate("/customer/change-password-user"), 5000);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setMessage("Thiếu mã OTP hoặc link không hợp lệ.");
      setStatus("error");
      setTimeout(() => navigate("/customer/change-password-user"), 5000);
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        {status === "loading" && <p className="text-gray-700">{message}</p>}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-green-600 font-medium mt-2">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <p className="text-red-600 font-medium mt-2">{message}</p>
          </>
        )}
        <p className="text-gray-500 text-sm mt-2">
          Bạn sẽ được chuyển hướng sau 5 giây...
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
