const API = "https://track-my-roots-api.onrender.com";
const token = localStorage.getItem("token");

const container = document.getElementById("logs");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");

loader.style.display = "block";

fetch(`${API}/api/audit`, {
  headers: {
    Authorization: "Bearer " + token
  }
})
  .then(res => res.json())
  .then(logs => {
    loader.style.display = "none";
    container.innerHTML = "";

    if (!logs || logs.length === 0) {
      container.innerHTML = "<p>No audit logs found</p>";
      return;
    }

    logs.forEach(log => {
      const div = document.createElement("div");
      div.style.borderBottom = "1px solid #ccc";
      div.style.padding = "10px 0";

      let icon = "📌";
      if (log.action === "CREATE_TREE") icon = "🌳";
      if (log.action === "DELETE_TREE") icon = "❌";
      if (log.action === "LOGIN") icon = "🔐";

      const time = new Date(log.createdAt).toLocaleString();

      div.innerHTML = `
        <strong>${icon} ${log.action}</strong><br>
        👤 ${log.userEmail || "Unknown"}<br>
        📄 ${log.details || "No details"}<br>
        🕒 ${time}
      `;

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error(err);
    loader.style.display = "none";
    errorMsg.innerText = "Failed to load audit logs";
  });
