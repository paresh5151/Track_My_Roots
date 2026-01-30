const API_URL = "http://localhost:5000/api/auth/audit-logs";
const token = localStorage.getItem("token");

// Protect page
if (!token) {
  alert("Unauthorized. Please login.");
  window.location.href = "login.html";
}

async function loadAuditLogs() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "Authorization": token
      }
    });

    if (!res.ok) {
      throw new Error("Access denied");
    }

    const logs = await res.json();
    const table = document.getElementById("logTable");
    table.innerHTML = "";

    logs.forEach(log => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${formatAction(log.action)}</td>
        <td>${log.performedBy?.username || "Unknown"} (${log.performedBy?.role})</td>
        <td>${log.targetUser?.username || "Deleted User"}</td>
        <td>${new Date(log.createdAt).toLocaleString()}</td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    alert("You are not authorized to view audit logs.");
  }
}

function formatAction(action) {
  switch (action) {
    case "UPDATE_PROFILE": return "Updated Profile";
    case "CREATE_SUB_ADMIN": return "Created Sub-Admin";
    case "DELETE_SUB_ADMIN": return "Deleted Sub-Admin";
    default: return action;
  }
}

loadAuditLogs();
