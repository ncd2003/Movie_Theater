// import { STORAGE } from "../constants";

const storage = {

    // saveRememberMe: function (isChecked) {
    //     localStorage.setItem(STORAGE.REMEMBER_ME, isChecked);
    // },

    // getRememberMe: function () {
    //     let isChecked = localStorage.getItem(STORAGE.REMEMBER_ME);
    //     if (isChecked == null || isChecked == undefined) {
    //         return true;
    //     }
    //     return isChecked === "true";
    // },

    // setItem(key, value) {
    //     if (storage.getRememberMe() == true) {
    //         localStorage.setItem(key, value);
    //     } else {
    //         sessionStorage.setItem(key, value);
    //     }
    // },

    // getItem(key) {
    //     if (storage.getRememberMe() == true) {
    //         return localStorage.getItem(key);
    //     } else {
    //         return sessionStorage.getItem(key);
    //     }
    // },

    // removeItem(key) {
    //     if (storage.getRememberMe() == true) {
    //         localStorage.removeItem(key);
    //     } else {
    //         sessionStorage.removeItem(key);
    //     }
    // },

    // saveUserInfo: function (id, fullname, email, status, role, token, refreshToken) {
    //     storage.setItem(STORAGE.USER_INFO_ID, id);
    //     storage.setItem(STORAGE.USER_INFO_FULLNAME, fullname);
    //     storage.setItem(STORAGE.USER_INFO_EMAIL, email);
    //     storage.setItem(STORAGE.USER_INFO_STATUS, status);
    //     storage.setItem(STORAGE.USER_INFO_ROLE, role);
    //     storage.setItem(STORAGE.USER_INFO_TOKEN, token);
    //     storage.setItem(STORAGE.USER_INFO_REFRESH_TOKEN, refreshToken);
    // },

    // getUserInfo: function () {
    //     return {
    //         "id": storage.getItem(STORAGE.USER_INFO_ID),
    //         "fullname": storage.getItem(STORAGE.USER_INFO_FULLNAME),
    //         "email": storage.getItem(STORAGE.USER_INFO_EMAIL),
    //         "status": storage.getItem(STORAGE.USER_INFO_STATUS),
    //         "role": storage.getItem(STORAGE.USER_INFO_ROLE),
    //         "isLogin": storage.isLogin()
    //     };
    // },

    // deleteUserInfo: function () {
    //     storage.removeItem(STORAGE.USER_INFO_ID);
    //     storage.removeItem(STORAGE.USER_INFO_FULLNAME);
    //     storage.removeItem(STORAGE.USER_INFO_EMAIL);
    //     storage.removeItem(STORAGE.USER_INFO_STATUS);
    //     storage.removeItem(STORAGE.USER_INFO_ROLE);
    //     storage.removeItem(STORAGE.USER_INFO_TOKEN);
    //     storage.removeItem(STORAGE.USER_INFO_REFRESH_TOKEN);
    // },

    // saveNewTokenInfo: function (token, refreshToken) {
    //     storage.setItem(STORAGE.USER_INFO_TOKEN, token);
    //     storage.setItem(STORAGE.USER_INFO_REFRESH_TOKEN, refreshToken);
    // },

    // getToken: function () {
    //     return storage.getItem(STORAGE.USER_INFO_TOKEN);
    // },

    // getRefreshToken: function () {
    //     return storage.getItem(STORAGE.USER_INFO_REFRESH_TOKEN);
    // },

    // isLogin: function () {
    //     return storage.getItem(STORAGE.USER_INFO_TOKEN) != null && storage.getItem(STORAGE.USER_INFO_TOKEN) != undefined;
    // }
}

export default storage;