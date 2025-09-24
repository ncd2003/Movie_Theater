import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import LeftSideBarUser from "../DashBoard/LeftSideBarUser";
import ResetPasswordApi from "../../../api/ResetPasswordApi";

function SetPasswordUser() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await ResetPasswordApi.resetPassword({ token, newPassword: password });
      setMessage("Mật khẩu đã được cập nhật thành công!");
      setTimeout(() => navigate("/user/signIn"), 3000);
    } catch (error) {
      setMessage("Lỗi: Không thể đặt lại mật khẩu.");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[#FDFCF0] ">
        <div className="relative mb-5">
          <div className="absolute left-0 w-full h-[10px] bg-[repeating-linear-gradient(-45deg,#ff416c,#ff416c_5px,transparent_5px,transparent_10px)]"></div>
        </div>

        <div className="flex mx-32 bg-[#FDFCF0] min-h-[90vh] mb-[-12px]">
          <LeftSideBarUser />

          <div className="flex-[4] mt-5 ml-[-50px]">
            <p className="text-xl text-white bg-slate-900 text-center py-[2px]">
              RESET PASSWORD
            </p>
            <p className="text-center text-red-600">{message}</p>

            <form
              className="bg-white p-6 rounded-lg shadow-md mt-6 w-2/3 mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-300 mt-4"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SetPasswordUser;
