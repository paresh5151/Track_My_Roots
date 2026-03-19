
// Track My Roots - Trees List, Map, and Search Highlight
const API = "https://track-my-roots-api.onrender.com";

// Elements
const list = document.getElementById("treeList");
const mapContainer = document.getElementById("map");
let map;
let markers = [];

// =========================
//   INIT MAP
// =========================
function initMap() {
  // Default to Vijayawada
  map = L.map("map").setView([16.5062, 80.6480], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);
}

// =========================
//   FETCH TREES FROM API
// =========================
async function fetchTrees() {
  try {
    const res = await fetch(`${API}/api/trees`);
    if (!res.ok) throw new Error("Failed to fetch trees");
    return await res.json();
  } catch (err) {
    console.error("Error fetching trees:", err);
    return [];
  }
}

// =========================
//   RENDER TREE LIST & MAP
// =========================
function renderTrees(trees, searchQuery = "") {
  list.innerHTML = "";
  // Remove old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  // For search highlighting
  const q = (searchQuery || "").toLowerCase().trim();
  let firstHighlightLatLng = null;

  if (!trees || trees.length === 0) {
    list.innerHTML = "<p>No trees found</p>";
    return;
  }

  trees.forEach(tree => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";

    const lat = tree.location?.coordinates?.[1];
    const lng = tree.location?.coordinates?.[0];

    // Highlight search match
    let highlight = false;
    let treeNameHtml = tree.treeName;
    if (q && tree.treeName && tree.treeName.toLowerCase().includes(q)) {
      highlight = true;
      // Highlight matched part
      const re = new RegExp(`(${q})`, "ig");
      treeNameHtml = tree.treeName.replace(re, '<mark>$1</mark>');
      div.style.background = "#d4edda";
      if (!firstHighlightLatLng && lat && lng) {
        firstHighlightLatLng = [lat, lng];
      }
    }

    div.innerHTML = `
      <b>${treeNameHtml}</b><br>
      🌿 ${tree.scientificName || ""}<br>
      👨‍🌾 ${tree.maintainedBy || ""}<br>
      <button type="button" class="zoom-btn" data-lat="${lat || ""}" data-lng="${lng || ""}">🧭 Zoom</button>
    `;
    list.appendChild(div);

    // Add marker to map
    if (lat && lng) {
      const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${tree.treeName}</b><br>${tree.scientificName || ""}`);
      markers.push(marker);
    }
  });

  // If search highlight, zoom to first match
  if (firstHighlightLatLng) {
    map.setView(firstHighlightLatLng, 17);
  }
}

// =========================
//   ZOOM TO TREE
// =========================
function zoomToTree(lat, lng) {
  if (!lat || !lng) return;
  map.setView([Number(lat), Number(lng)], 18);
}

// =========================
//   SEARCH HANDLER
// =========================
function setupSearch(trees) {
  const searchInput = document.getElementById("treeSearch");
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value;
    renderTrees(trees, q);
  });
}

// =========================
//   INIT
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  if (!mapContainer) return;
  initMap();
  const trees = await fetchTrees();
  renderTrees(trees);
  setupSearch(trees);

  // Delegate zoom buttons (event delegation for dynamic content)
  list.addEventListener("click", function(e) {
    const btn = e.target.closest(".zoom-btn");
    if (btn) {
      const lat = btn.getAttribute("data-lat");
      const lng = btn.getAttribute("data-lng");
      if (lat && lng) {
        zoomToTree(lat, lng);
      }
    }
  });
});
