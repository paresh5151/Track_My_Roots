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

/* =========================
   CREATE SUBADMIN
========================= */
function createSubAdmin() {
  const name = document.getElementById("subadminName")?.value.trim();
  const email = document.getElementById("subadminEmail")?.value.trim();
  const password = document.getElementById("subadminPassword")?.value.trim();

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  fetch("https://track-my-roots-api.onrender.com/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      role: "subadmin"
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === "User created successfully") {
        alert("Subadmin created successfully ✅");
        window.location.reload();
      } else {
        alert(data.message || "Error creating subadmin");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong");
    });
}