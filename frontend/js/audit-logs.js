fetch("https://trackmyroots.onrender.com/api/audit", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") }
})
.then(r => r.json())
.then(data => {
  const tbody = document.getElementById("logs");
  data.forEach(l => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.action}</td>
      <td>${l.performedBy}</td>
      <td>${new Date(l.createdAt).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
});
