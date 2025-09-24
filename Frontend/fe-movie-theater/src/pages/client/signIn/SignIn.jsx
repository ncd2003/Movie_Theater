import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleApiRequest } from "../../../utils/ApiHandler";
import AuthApi from "../../../api/AuthApi";
import {
  clearPermissions,
  saveListIfEmpty,
} from "../../../utils/indexedDBService";
import { toast } from "react-toastify";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import ResetPasswordApi from "../../../api/ResetPasswordApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const validateInputs = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await ResetPasswordApi.forgotPassword(forgotEmail).then(() => {
      toast.success("Reset password link has been sent to your email!");
      setShowModal(false);
    });
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    await handleApiRequest({
      apiCall: () => AuthApi.login(email, password),
      onSuccess: (res) => {
        console.log(res.data.userLogin.role.roleId);
        if (res.data.userLogin.role.roleId !== 3) {
          toast.error("Email or password incorrect!");
          return;
        }
        if (res.data.userLogin.status === "BANNED") {
          toast.error("Your account had banned. Contact admin to unlock!");
          return;
        } else {
          localStorage.setItem("email", res.data.userLogin.email);
          localStorage.setItem("fullName", res.data.userLogin.fullName);
          localStorage.setItem("roleId", res.data.userLogin.role.roleId);
          localStorage.setItem("role", res.data.userLogin.role.roleName);
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("accountId", res.data.userLogin.accountId);
          localStorage.setItem("isAuthenticated", "true");
          clearPermissions();
          saveListIfEmpty();
          toast.success("Welcome " + res.data.userLogin.fullName);
          navigate("/");
        }
      },
      showSuccessToast: false,
    });
  };
  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setForgotError("Email is required.");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError("Invalid email format.");
      return;
    }

    setForgotError("");
    // Gọi API gửi mail quên mật khẩu tại đây
    toast.success("Reset password link has been sent to your email!");
    setShowModal(false); // Đóng modal sau khi xử lý
  };

  return (
    <div>
      <Header />
      <div
        className="flex items-center justify-center"
        style={{ marginTop: "45px" }}
      >
        <div
          className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden"
          style={{
            border: "1px solid rgb(210, 212, 200)", // Đặt đường viền với độ dày 1px và màu đen
            borderRadius: "10px", // Bo tròn các góc với bán kính 10px
            marginBottom: "50px",
          }}
        >
          {/* Left - Form Đăng Nhập */}
          <div className="w-1/2 bg-gray-30 p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              SIGN IN
            </h2>

            {/* Form Login */}
            <form className="mt-5">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="mt-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right mt-2">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowModal(true);
                  }}
                  className="text-blue-600 text-sm"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 mt-4 rounded-lg hover:bg-blue-700 transition "
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                SIGN IN
              </button>
            </form>
          </div>

          {/* Right - Sign Up Section */}
          <div
            className="w-1/2 flex flex-col justify-center items-center p-10 relative"
            style={{
              backgroundImage: `url("https://i.pinimg.com/736x/e9/e7/04/e9e7045f9a47cf534c8fc2b66d7ff3d1.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#000000", // Chữ màu đen giúp tăng độ tương phản
              textShadow: "1px 1px 4px rgba(255, 255, 255, 0.6)", // Hiệu ứng bóng sáng giúp nổi bật
            }}
          >
            <h2 className="text-2xl font-bold">Hello, Friend!</h2>
            <Link
              to="/user/signup"
              className="mt-4 px-6 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4 text-center">
                Forgot Password
              </h3>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              {forgotError && (
                <p className="text-red-500 text-sm mt-1">{forgotError}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Login;
