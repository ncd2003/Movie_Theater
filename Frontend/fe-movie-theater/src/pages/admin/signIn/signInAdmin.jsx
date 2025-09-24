import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleApiRequest } from "../../../utils/ApiHandler";
import AuthApi from "../../../api/AuthApi";
import { clearPermissions, saveListIfEmpty } from "../../../utils/indexedDBService";
import { toast } from "react-toastify";

export default function LoginAdmin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();


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


  const handleLogin = async () => {
    if (!validateInputs()) return;
    await handleApiRequest({
      apiCall: () => AuthApi.login(email, password),
      onSuccess: (res) => {
        if (res.data.userLogin.role.roleId === 3) {
          toast.error("Email or password incorrect!")
          return;
        }
        localStorage.setItem("email", res.data.userLogin.email);
        localStorage.setItem("fullName", res.data.userLogin.fullName);
        localStorage.setItem("roleId", res.data.userLogin.role.roleId);
        localStorage.setItem("role", res.data.userLogin.role.roleName);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("accountId", res.data.userLogin.accountId);
        if (res.data.userLogin.role.roleId === 1 || res.data.userLogin.role.roleId === 2) {
          localStorage.setItem("isAuthenticated", "true")
        }
        clearPermissions();
        saveListIfEmpty();
        toast.success("Welcome " + res.data.userLogin.fullName);
          navigate("/admin/rooms-management");
      },
      showSuccessToast: false
    });
  };


  return (
    <div className="h-screen w-full bg-cover bg-center relative" style={{ backgroundImage: "url(https://cdn5.f-cdn.com/contestentries/1578585/21468461/5d62b49ac544b_thumb900.jpg)" }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-30">
        <div className="bg-white bg-opacity-10 p-8 rounded-3xl shadow-lg backdrop-blur-md w-96">
          <h2 className="text-white text-4xl font-semibold text-center">Sign In </h2>

          {/* Input fields */}
          <div className="mt-6">
            <label className="text-white block mb-2">Email</label>
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

          <div className="mt-4 relative">
            <label className="text-white block mb-2">Password</label>
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
          <div className='text-right mt-2'>
            <Link to='/forgot-password' className='text-blue-600 text-sm'>
              Forgot your password?
            </Link>
          </div>
          {/* Button */}
          <button
            className="ml-[120px] mt-6 px-3 bg-blue-500 text-black font-semibold py-2 rounded-full shadow-md hover:bg-red-500 transition"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            SIGN IN
          </button>

          {/* Remember Me & Forgot Password */}
          {/* <div className="flex justify-between items-center mt-4">
            <label className="flex items-center text-white">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            {/* <a href="#" className="text-gray-300 hover:text-white">Forgot Password</a> */}
          {/* </div> */}


        </div>
      </div>
    </div>
  );
}
