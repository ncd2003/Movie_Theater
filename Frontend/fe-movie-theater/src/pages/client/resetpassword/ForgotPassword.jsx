import React, { useState } from "react";
import ResetPasswordApi from "../../../api/ResetPasswordApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ResetPasswordApi.requestPasswordReset({
        email: email,
      });
      setMessage("Email đặt lại mật khẩu đã được gửi.");
      console.log("Response:", response);
    } catch (err) {
      setMessage("Lỗi: " + (err.response?.data || "Có lỗi xảy ra"));
    }
  };

  return (
    <div>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Gửi yêu cầu</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
