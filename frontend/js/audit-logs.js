fetch("https://track-my-roots-api.onrender.com/api/audit", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
})
.then(res => res.json())
.then(logs => {
  const container = document.getElementById("logs");
  container.innerHTML = "";

  logs.forEach(log => {
    const p = document.createElement("p");
    p.innerText = `${log.action} | ${log.user} | ${new Date(log.time).toLocaleString()}`;
    container.appendChild(p);
  });
});
