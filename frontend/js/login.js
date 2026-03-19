async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loader = document.getElementById("loader");
  const errorMsg = document.getElementById("errorMsg");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  errorMsg.innerText = "";
  errorMsg.style.color = "";

  // Validation
  if (!email || !password) {
    errorMsg.innerText = "Email and password are required";
    errorMsg.style.color = "red";
    return;
  }

  loader.style.display = "block";

  try {
    const res = await fetch("https://track-my-roots-api.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    loader.style.display = "none";

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      errorMsg.innerText = "Login successful ✅";
      errorMsg.style.color = "green";

      setTimeout(() => {
        window.location.href = "tree-view.html";
      }, 800);
    } else {
      errorMsg.innerText = data.message || "Login failed";
      errorMsg.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    loader.style.display = "none";
    errorMsg.innerText = "Something went wrong";
    errorMsg.style.color = "red";
  }
}
