const API = "https://trackmyroots.onrender.com/api/audit";
const table = document.getElementById("logTable");

async function loadLogs() {
  try {
    const res = await fetch(API, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    if (!res.ok) {
      table.innerHTML = "<tr><td colspan='4'>Failed to load logs</td></tr>";
      return;
    }

    const logs = await res.json();

    if (logs.length === 0) {
      table.innerHTML = "<tr><td colspan='4'>No logs found</td></tr>";
      return;
    }

    table.innerHTML = "";

    logs.forEach(log => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${log.action}</td>
        <td>${log.performedBy}</td>
        <td>${log.target || "-"}</td>
        <td>${new Date(log.createdAt).toLocaleString()}</td>
      `;
      table.appendChild(row);
    });

  } catch (err) {
    table.innerHTML = "<tr><td colspan='4'>Error loading logs</td></tr>";
  }
}

loadLogs();
