const API = "https://track-my-roots-api.onrender.com";

function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
