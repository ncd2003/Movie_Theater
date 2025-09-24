import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ResetPasswordApi from "../../../api/ResetPasswordApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(" reset password", {
        token,
        newPassword: password,
      });
      await ResetPasswordApi.resetPassword({ token, newPassword: password });
      setMessage("Mật khẩu đã được cập nhật thành công!");
      setTimeout(() => navigate("/auth/signIn"), 2000); // Chuyển về trang login sau 2 giây
    } catch (error) {
      setMessage("Lỗi: Không thể đặt lại mật khẩu.");
    }
  };

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Xác nhận</button>
      </form>
    </div>
  );
};

export default ResetPassword;
