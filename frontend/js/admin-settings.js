
async function changePass() {
  const oldPassInput = document.getElementById("oldPass");
  const newPassInput = document.getElementById("newPass");
  const confirmPassInput = document.getElementById("confirmPass");

  const loader = document.getElementById("loader");
  const msg = document.getElementById("msg");

  const oldPassword = oldPassInput.value.trim();
  const newPassword = newPassInput.value.trim();
  const confirmPassword = confirmPassInput.value.trim();

  msg.innerText = "";
  msg.style.color = "";

  // Validation
  if (!oldPassword || !newPassword || !confirmPassword) {
    msg.innerText = "All fields are required";
    msg.style.color = "red";
    return;
  }

  if (newPassword !== confirmPassword) {
    msg.innerText = "New passwords do not match";
    msg.style.color = "red";
    return;
  }

  if (newPassword.length < 6) {
    msg.innerText = "Password must be at least 6 characters";
    msg.style.color = "red";
    return;
  }

  loader.style.display = "block";

  try {
    const res = await fetch("https://track-my-roots-api.onrender.com/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        oldPassword,
        newPassword
      })
    });

    const data = await res.json();

    loader.style.display = "none";

    if (res.ok) {
      msg.innerText = "Password updated successfully ✅";
      msg.style.color = "green";

      oldPassInput.value = "";
      newPassInput.value = "";
      confirmPassInput.value = "";
    } else {
      msg.innerText = data.message || "Failed to update password";
      msg.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    loader.style.display = "none";
    msg.innerText = "Something went wrong";
    msg.style.color = "red";
  }
}
