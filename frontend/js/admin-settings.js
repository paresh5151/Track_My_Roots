const API_BASE = "http://localhost:5000/api/auth";
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}

// UPDATE PROFILE
async function updateProfile() {
  const currentPassword = document.getElementById("currentPassword").value;
  const newUsername = document.getElementById("newUsername").value;
  const newPassword = document.getElementById("newPassword").value;

  const res = await fetch(`${API_BASE}/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      currentPassword,
      newUsername,
      newPassword
    })
  });

  const data = await res.json();
  document.getElementById("profileMsg").innerText =
    data.message || data.error;
}

// CREATE SUB ADMIN
async function createSubAdmin() {
  const username = document.getElementById("subUsername").value;
  const password = document.getElementById("subPassword").value;

  const res = await fetch(`${API_BASE}/create-subadmin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("subAdminMsg").innerText =
    data.message || data.error;

  loadSubAdmins();
}

// LOAD SUB ADMINS
async function loadSubAdmins() {
  const res = await fetch(`${API_BASE}/audit-logs`, {
    headers: { "Authorization": token }
  });

  const logs = await res.json();
  const list = document.getElementById("subAdminList");
  list.innerHTML = "";

  logs
    .filter(log => log.action === "CREATE_SUB_ADMIN")
    .forEach(log => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${log.targetUser?.username || "Deleted"}
        <button onclick="deleteSubAdmin('${log.targetUser?._id}')">Delete</button>
      `;
      list.appendChild(li);
    });
}

// DELETE SUB ADMIN
async function deleteSubAdmin(id) {
  await fetch(`${API_BASE}/delete-subadmin/${id}`, {
    method: "DELETE",
    headers: { "Authorization": token }
  });

  loadSubAdmins();
}

loadSubAdmins();
