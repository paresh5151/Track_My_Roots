if (!localStorage.getItem("token")) {
  alert("Please login");
  window.location.href = "login.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

if (localStorage.getItem("role") === "sub-admin") {
  const audit = document.getElementById("auditNav");
  if (audit) audit.style.display = "none";
}
