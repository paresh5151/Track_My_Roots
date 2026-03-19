// 🔐 Role + Auth check
const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

// If no token → logout
if (!token) {
  alert("Session expired. Please login again.");
  window.location.href = "login.html";
}

// Decode JWT to check expiry
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // convert to ms
    return Date.now() > exp;
  } catch (e) {
    return true; // invalid token
  }
}

// Auto logout if expired
if (isTokenExpired(token)) {
  localStorage.clear();
  alert("Session expired. Please login again.");
  window.location.href = "login.html";
}

// Allow both admin and subadmin
if (role !== "admin" && role !== "subadmin") {
  alert("Access denied");
  window.location.href = "index.html";
}