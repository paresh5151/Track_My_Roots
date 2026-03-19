const API = "https://track-my-roots-api.onrender.com";
const token = localStorage.getItem("token");

let latitude = null;
let longitude = null;

/* =========================
   GPS DETECTION
========================= */
function getLocation() {
  const status = document.getElementById("locationStatus");

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;

      status.innerText =
        `📍 Location detected (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
    },
    () => {
      status.innerText = "❌ Location permission denied";
    }
  );
}

/* =========================
   ADD TREE SUBMIT
========================= */
document.getElementById("treeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loader = document.getElementById("loader");
  const message = document.getElementById("message");

  message.innerText = "";
  message.style.color = "";

  const treeName = document.getElementById("treeName").value.trim();
  const scientificName = document.getElementById("scientificName").value.trim();
  const plantedYear = document.getElementById("plantedYear").value;

  const maintainedBy = document.getElementById("maintainedBy").value.trim();
  const rollNo = document.getElementById("rollNo").value.trim();
  const email = document.getElementById("email").value.trim();

  const imageFile = document.getElementById("image").files[0];

  // Validation
  if (!treeName || !scientificName || !plantedYear || !maintainedBy || !rollNo || !email || !imageFile) {
    message.innerText = "Please fill all fields";
    message.style.color = "red";
    return;
  }

  if (latitude === null || longitude === null) {
    message.innerText = "Please detect live location first";
    message.style.color = "red";
    return;
  }

  if (!confirm("Are you sure you want to add this tree?")) {
    return;
  }

  loader.style.display = "block";

  const formData = new FormData();

  formData.append("treeName", treeName);
  formData.append("scientificName", scientificName);
  formData.append("plantedYear", plantedYear);
  formData.append("maintainedBy", maintainedBy);
  formData.append("rollNo", rollNo);
  formData.append("email", email);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("image", imageFile);

  try {
    const res = await fetch(`${API}/api/trees`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });

    const data = await res.json();

    loader.style.display = "none";

    if (res.ok) {
      message.innerText = "Tree added successfully ✅";
      message.style.color = "green";

      setTimeout(() => {
        window.location.href = "tree-view.html";
      }, 1500);
    } else {
      message.innerText = data.message || "Error adding tree";
      message.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    loader.style.display = "none";
    message.innerText = "Something went wrong";
    message.style.color = "red";
  }
});
