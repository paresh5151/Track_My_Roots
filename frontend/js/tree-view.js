const API = "https://track-my-roots-api.onrender.com";
const token = localStorage.getItem("token");

let editMode = false;
let deleteMode = false;

let map;
let markers = [];

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
  .then(res => res.json())
  .then(trees => {
    const container = document.getElementById("treeList");
    container.innerHTML = "";

    // Initialize map
    map = L.map("map").setView([16.5062, 80.6480], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    trees.forEach(tree => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.marginBottom = "10px";
      div.style.cursor = "pointer";

      const lat = tree.location?.coordinates?.[1];
      const lng = tree.location?.coordinates?.[0];

      div.innerHTML = `
        <b>${tree.treeName}</b><br>
        ${tree.treeId || ""}<br>
        ${tree.scientificName}<br>
        <button onclick="event.stopPropagation(); zoomToTree(${lat}, ${lng})">🧭 Zoom</button>
      `;

      // Highlight searched tree
      if (window.SEARCH_QUERY && tree.treeName.toLowerCase().includes(window.SEARCH_QUERY)) {
        div.style.background = "#d4edda";

        if (lat && lng) {
          setTimeout(() => {
            map.setView([lat, lng], 17);
          }, 500);
        }
      }

      div.onclick = () => {
        if (editMode) {
          window.location.href = `add-tree.html?id=${tree._id}`;
        }

        if (deleteMode) {
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
          });
        }
      };

      // Add marker to map
      if (lat && lng) {
        const marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<b>${tree.treeName}</b><br>${tree.scientificName}`);

        markers.push(marker);
      }

      container.appendChild(div);
    });
  });

function zoomToTree(lat, lng) {
  if (!lat || !lng) return;
  map.setView([lat, lng], 18);
}
