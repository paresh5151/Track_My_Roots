async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://trackmyroots.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("msg").innerText = data.error;
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("username", data.username);

  window.location.href = "index.html";
}
