// 🔐 Admin check
if (localStorage.getItem("role") !== "admin" && localStorage.getItem("role") !== "subadmin") {
  alert("Access denied");
  window.location.href = "index.html";
}

let currentLocation = null;

// 📍 Detect Location
function detectLocation() {
  const status = document.getElementById("locStatus");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      currentLocation = { lat, lng };

      status.innerText = `Location detected: ${lat}, ${lng}`;
    },
    () => {
      status.innerText = "Unable to fetch location";
    }
  );
}

// ➕ Add Tree
function addTree() {
  const loader = document.getElementById("loader");
  const message = document.getElementById("message");

  const treeName = document.getElementById("treeName").value.trim();
  const scientificName = document.getElementById("scientificName").value.trim();
  const plantedYear = document.getElementById("plantedYear").value;

  const maintainedBy = document.getElementById("maintainedBy").value.trim();
  const rollNo = document.getElementById("rollNo").value.trim();
  const email = document.getElementById("email").value.trim();

  const imageFile = document.getElementById("image").files[0];

  message.innerText = "";

  // Validation
  if (!treeName || !scientificName || !plantedYear || !maintainedBy || !rollNo || !email || !imageFile) {
    message.innerText = "Please fill all fields";
    message.style.color = "red";
    return;
  }

  if (!currentLocation) {
    message.innerText = "Please detect location first";
    message.style.color = "red";
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
  formData.append("image", imageFile);

  formData.append("latitude", currentLocation.lat);
  formData.append("longitude", currentLocation.lng);

  fetch("https://track-my-roots-api.onrender.com/api/trees", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      loader.style.display = "none";

      if (data.message) {
        message.innerText = data.message;
        message.style.color = "red";
        return;
      }

      message.innerText = "Tree added successfully ✅";
      message.style.color = "green";

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    })
    .catch(err => {
      console.error(err);
      loader.style.display = "none";
      message.innerText = "Something went wrong";
      message.style.color = "red";
    });
}
