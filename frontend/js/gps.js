let latitude = null;
let longitude = null;

/* =========================
   GET LOCATION (PROMISE)
========================= */
function getLocationPromise(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options
      }
    );
  });
}

/* =========================
   UI HELPER
========================= */
function setStatus(text, isError = false) {
  const el = document.getElementById("locationStatus");
  if (!el) return;
  el.innerText = text;
  el.style.color = isError ? "red" : "green";
}

/* =========================
   MAIN LOCATION FUNCTION
========================= */
async function getLocation() {
  try {
    setStatus("📡 Detecting location...");

    const { lat, lng, accuracy } = await getLocationPromise();

    latitude = lat;
    longitude = lng;

    setStatus(
      `📍 Location detected (${lat.toFixed(5)}, ${lng.toFixed(5)}) • ±${Math.round(
        accuracy
      )}m`
    );
  } catch (err) {
    console.error(err);

    if (err.code === 1) {
      setStatus("❌ Permission denied. Please allow location.", true);
    } else if (err.code === 2) {
      setStatus("❌ Position unavailable.", true);
    } else if (err.code === 3) {
      setStatus("⏱️ Location request timed out.", true);
    } else {
      setStatus("❌ Failed to get location.", true);
    }
  }
}

/* =========================
   EXPORT (if needed)
========================= */
function getCoords() {
  return { latitude, longitude };
}
