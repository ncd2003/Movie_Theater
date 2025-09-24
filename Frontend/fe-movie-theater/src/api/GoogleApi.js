class GoogleApi {
  loginGoogle() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }
}

export default new GoogleApi();
