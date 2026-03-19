const API = "https://track-my-roots-api.onrender.com";

/* =========================
   TOKEN HELPERS
========================= */
function getToken() {
  return localStorage.getItem("token");
}

function isLoggedIn() {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // ms
    return Date.now() > exp;
  } catch (e) {
    return true; // invalid token
  }
}

/* =========================
   AUTH GUARDS
========================= */
function requireAuth() {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/* =========================
   AUTH HEADER HELPER
========================= */
function getAuthHeaders(extra = {}) {
  const token = getToken();
  return {
    Authorization: "Bearer " + token,
    ...extra
  };
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
