async function changePass() {
  const res = await fetch("https://trackmyroots.onrender.com/api/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      oldPassword: oldPass.value,
      newPassword: newPass.value
    })
  });

  const data = await res.json();
  msg.innerText = data.message || data.error;
}
