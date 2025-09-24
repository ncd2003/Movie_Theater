import authorApi from "./baseAPI/AuthorBaseApi";
import unAuthorApi from "./baseAPI/UnauthorBaseApi";

class ResetPasswordApi {
  constructor() {
    this.url = "/auth";
  }

  // Lấy token từ localStorage
  getToken = () => {
    return localStorage.getItem("access_token"); // Lấy access token
  };

  requestPasswordReset = (email) => {
    return authorApi.post(
      `${this.url}/request-password-reset`,
      JSON.stringify({ email }), // Chuyển object thành JSON string
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  forgotPassword = (email) =>
    unAuthorApi.post(`${this.url}/forgot-password-reset`, email);

  verifyOtp = (token) => {
    return authorApi.get(`${this.url}/verify-otp`, {
      params: { token },
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
        "Content-Type": "application/json",
      },
    });
  };

  resetPassword = (data) => {
    console.log(
      "Gửi yêu cầu reset password đến:",
      `${this.url}/reset-password`
    );
    return authorApi.post(`${this.url}/reset-password`, data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
        "Content-Type": "application/json",
      },
    });
  };
}

export default new ResetPasswordApi();
