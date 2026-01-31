const API = "https://track-my-roots-api.onrender.com";
const token = localStorage.getItem("token");

let latitude = null;
let longitude = null;

/* =========================
   GPS DETECTION
========================= */
function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;

      document.getElementById("locationStatus").innerText =
        `📍 Location detected (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
    },
    () => {
      alert("Location permission denied");
    }
  );
}

/* =========================
   ADD TREE SUBMIT
========================= */
document.getElementById("treeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (latitude === null || longitude === null) {
    alert("Please detect live location first");
    return;
  }

  if (!confirm("Are you sure you want to add this tree?")) {
    return;
  }

  const formData = new FormData();

  formData.append("treeName", treeName.value);
  formData.append("scientificName", scientificName.value);
  formData.append("plantedYear", plantedYear.value);
  formData.append("maintainedBy", maintainedBy.value);
  formData.append("rollNo", rollNo.value);
  formData.append("email", email.value);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("image", image.files[0]);

  const res = await fetch(`${API}/api/trees`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
    },
    body: formData
  });

  const data = await res.json();

  if (res.ok) {
    alert("Tree added successfully");
    window.location.href = "tree-view.html";
  } else {
    alert(data.message || "Error adding tree");
  }
});
