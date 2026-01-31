const API = "https://trackmyroots.onrender.com/api/trees";
const token = localStorage.getItem("token");

let latitude = null;
let longitude = null;

/* ===== LIVE LOCATION ===== */
function detectLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
      document.getElementById("locStatus").innerText =
        `Location detected (${latitude}, ${longitude})`;
    },
    () => alert("Location access denied")
  );
}

/* ===== ADD TREE ===== */
async function addTree() {
  if (!latitude || !longitude) {
    alert("Please detect location first");
    return;
  }

  if (!confirm("Are you sure you want to add this tree?")) return;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      treeId: treeId.value,
      name: name.value,
      plantedYear: year.value,
      maintainedBy: maintainedBy.value,
      rollNo: rollNo.value,
      email: email.value,
      latitude,
      longitude,
      imageUrl: imageUrl.value,
      note: note.value
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert("Tree added successfully");
  location.reload();
}
