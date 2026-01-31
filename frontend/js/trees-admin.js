if (localStorage.getItem("role") !== "admin") {
  alert("Admin access only");
  window.location.href = "index.html";
}

function addTree() {
  const treeName = document.getElementById("treeName").value;
  const location = document.getElementById("location").value;
  const age = document.getElementById("age").value;

  fetch("https://track-my-roots-api.onrender.com/api/trees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ treeName, location, age })
  })
  .then(res => res.json())
  .then(() => {
    alert("Tree added successfully");
    window.location.reload();
  });
}
