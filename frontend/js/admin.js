if (localStorage.getItem("role") !== "admin") {
  alert("Admin only");
  window.location.href = "index.html";
}
