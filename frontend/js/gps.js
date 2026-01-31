let latitude = null;
let longitude = null;

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
