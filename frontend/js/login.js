async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://YOUR-BACKEND.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Login success");
    window.location.href = "tree-view.html";
  } else {
    alert(data.message);
  }
}
