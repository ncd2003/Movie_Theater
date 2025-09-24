import React, { useState } from "react";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import LeftSideBarUser from "./LeftSideBarUser";
import ResetPasswordApi from "../../../api/ResetPasswordApi";

function ChangePasswordUser() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ResetPasswordApi.requestPasswordReset(email);
      setMessage("Email đặt lại mật khẩu đã được gửi.");
    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data);
      setMessage(
        "Lỗi: " +
          (typeof err.response?.data === "string"
            ? err.response.data
            : JSON.stringify(err.response?.data || "Có lỗi xảy ra"))
      );
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[#FDFCF0]">
        <div className="relative mb-5">
          <div className="absolute left-0 w-full h-[10px] bg-[repeating-linear-gradient(-45deg,#ff416c,#ff416c_5px,transparent_5px,transparent_10px)]"></div>
        </div>

        <div className="flex mx-32 bg-[#FDFCF0] min-h-[90vh] mb-[-12px]">
          <LeftSideBarUser />
          <div className="flex-[4] mt-5 ml-[-50px]">
            <p className="text-xl text-white bg-slate-900 text-center py-[2px]">
              RESET PASSWORD
            </p>
            <form
              className="bg-white p-6 rounded-lg shadow-md mt-6 w-2/3 mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-300 mt-4"
              >
                Send Request
              </button>
              {message && (
                <p className="text-center mt-3 text-red-600">{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ChangePasswordUser;
