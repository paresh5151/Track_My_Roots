const API = "https://track-my-roots-api.onrender.com";
const token = localStorage.getItem("token");

// Read search query from URL and normalize
const params = new URLSearchParams(window.location.search);
window.SEARCH_QUERY = (params.get("search") || "").toLowerCase();

let editMode = false;
let deleteMode = false;

let map;
let markers = [];
let allTrees = [];
let hasAutoZoomed = false;

function enableEditMode() {
  editMode = true;
  deleteMode = false;
  alert("Edit mode enabled. Click a tree to edit.");
}

function enableDeleteMode() {
  deleteMode = true;
  editMode = false;
  alert("Delete mode enabled. Click a tree to delete.");
}

fetch(`${API}/api/trees`)
  .then(res => {
    if (!res.ok) throw new Error("Failed to load trees");
    return res.json();
  })
  .then(trees => {
    allTrees = trees || [];

    // Initialize map (once)
    if (!map) {
      map = L.map("map").setView([16.5062, 80.6480], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(map);
    }

    renderTrees(allTrees);
  })
  .catch(() => {
    const container = document.getElementById("treeList");
    if (container) container.innerText = "Failed to load trees";
  });

function renderTrees(trees) {
  const container = document.getElementById("treeList");
  container.innerHTML = "";

  // clear old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  let firstMatchCoords = null;

  trees.forEach(tree => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.style.cursor = "pointer";

    const lat = tree?.location?.coordinates?.[1];
    const lng = tree?.location?.coordinates?.[0];

    div.innerHTML = `
      <b>${tree.treeName}</b><br>
      ${tree.treeId || ""}<br>
      ${tree.scientificName}<br>
      <button ${lat && lng ? "" : "disabled"} onclick="event.stopPropagation(); zoomToTree(${lat}, ${lng})">🧭 Zoom</button>
    `;

    // Highlight searched tree
    if (window.SEARCH_QUERY && tree.treeName.toLowerCase().includes(window.SEARCH_QUERY)) {
      div.style.background = "#d4edda";

      if (!firstMatchCoords && lat && lng) {
        firstMatchCoords = [lat, lng];
      }
    }

    div.onclick = () => {
      if (editMode) {
        if (!token) {
          alert("Please login to edit");
          return;
        }
        window.location.href = `add-tree.html?id=${tree._id}`;
      }

      if (deleteMode) {
        if (!token) {
          alert("Please login to delete");
          return;
        }
        if (!confirm("Are you sure you want to delete this tree permanently?")) return;

        fetch(`${API}/api/trees/${tree._id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(res => res.json())
        .then(() => {
          alert("Tree deleted");
          location.reload();
        })
        .catch(() => alert("Delete failed"));
      }
    };

    // Add marker to map
    if (lat && lng) {
      const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${tree.treeName}</b><br>${tree.scientificName}`);

      // open popup for matched tree
      if (window.SEARCH_QUERY && tree.treeName.toLowerCase().includes(window.SEARCH_QUERY)) {
        marker.openPopup();
      }

      markers.push(marker);
    }

    container.appendChild(div);
  });

  // Auto zoom to first match
  if (firstMatchCoords && !hasAutoZoomed) {
    map.setView(firstMatchCoords, 17);
    hasAutoZoomed = true;
  }
}

function setupLiveSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();

    const filtered = allTrees.filter(t =>
      t.treeName.toLowerCase().includes(q) ||
      (t.scientificName || "").toLowerCase().includes(q)
    );

    renderTrees(filtered);
  });
}

document.addEventListener("DOMContentLoaded", setupLiveSearch);

function zoomToTree(lat, lng) {
  if (!lat || !lng) return;
  map.setView([lat, lng], 18);
}
