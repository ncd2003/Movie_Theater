// import storage from '../utils/storage';
import UnauthorApi from "./baseAPI/UnauthorBaseApi";

class AuthAPI {
  constructor() {
    this.url = "/auth";
  }

  login = async (email, password) => {
    const body = {
      email: email,
      password: password,
    };
    return UnauthorApi.post(`${this.url}/login`, body);
  };

  refreshToken = () => UnauthorApi.get(`${this.url}/refresh`);

  register = (formData) => {
    return UnauthorApi.post(`${this.url}/register`, formData);
  };

  logout = () => UnauthorApi.post(`${this.url}/logout`); 

}

export default new AuthAPI();
