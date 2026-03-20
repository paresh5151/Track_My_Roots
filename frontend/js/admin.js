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

/* =========================
   LOAD SUBADMINS + PAGINATION + SEARCH
========================= */
let allSubAdmins = [];
let currentPage = 1;
const pageSize = 5;

function loadSubAdmins() {
  fetch("https://track-my-roots-api.onrender.com/api/users", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(users => {
      allSubAdmins = users.filter(u => u.role === "subadmin");
      renderSubAdmins();
    })
    .catch(() => {
      document.getElementById("subadminList").innerText = "Error loading subadmins";
    });
}

function renderSubAdmins() {
  const container = document.getElementById("subadminList");
  const start = (currentPage - 1) * pageSize;
  const paginated = allSubAdmins.slice(start, start + pageSize);

  container.innerHTML = "";

  if (paginated.length === 0) {
    container.innerHTML = "No subadmins found";
    return;
  }

  paginated.forEach(u => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${u.name}</strong>
      <span style="background:#2196f3;color:white;padding:2px 6px;border-radius:4px;font-size:12px;margin-left:8px;">
        SUBADMIN
      </span><br>
      ${u.email}<br>

      <button onclick="editSubAdmin('${u._id}', '${u.name}', '${u.email}')">✏️ Edit</button>
      <button onclick="resetPassword('${u._id}')">🔑 Reset</button>
      <button onclick="deleteSubAdmin('${u._id}')">❌ Delete</button>
      <hr>
    `;

    container.appendChild(div);
  });

  renderPagination();
}

function filterSubAdmins() {
  const query = document.getElementById("subadminSearch").value.toLowerCase();

  fetch("https://track-my-roots-api.onrender.com/api/users", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(users => {
      allSubAdmins = users
        .filter(u => u.role === "subadmin")
        .filter(u =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
        );

      currentPage = 1;
      renderSubAdmins();
    });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(allSubAdmins.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.onclick = () => {
      currentPage = i;
      renderSubAdmins();
    };
    pagination.appendChild(btn);
  }
}

/* =========================
   DELETE SUBADMIN
========================= */
function deleteSubAdmin(id) {
  if (!confirm("Delete this subadmin?")) return;

  fetch(`https://track-my-roots-api.onrender.com/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  }).then(() => loadSubAdmins());
}

/* =========================
   EDIT SUBADMIN
========================= */
function editSubAdmin(id, name, email) {
  const newName = prompt("Enter new name", name);
  const newEmail = prompt("Enter new email", email);

  if (!newName || !newEmail) return;

  fetch(`https://track-my-roots-api.onrender.com/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name: newName, email: newEmail })
  }).then(() => loadSubAdmins());
}

/* =========================
   RESET PASSWORD
========================= */
function resetPassword(id) {
  const newPass = prompt("Enter new password");
  if (!newPass) return;

  fetch(`https://track-my-roots-api.onrender.com/api/users/${id}/reset-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ password: newPass })
  }).then(() => alert("Password updated"));
}

/* =========================
   ANALYTICS
========================= */
function loadAnalytics() {
  fetch("https://track-my-roots-api.onrender.com/api/trees")
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalTrees").innerText = data.length;
    });

  fetch("https://track-my-roots-api.onrender.com/api/users", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(users => {
      const subadmins = users.filter(u => u.role === "subadmin");
      document.getElementById("totalSubadmins").innerText = subadmins.length;
    });
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}