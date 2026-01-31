const API = "https://track-my-roots-api.onrender.com";
const token = localStorage.getItem("token");

let editMode = false;
let deleteMode = false;

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

    trees.forEach(tree => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.marginBottom = "10px";
      div.style.cursor = "pointer";

      div.innerHTML = `
        <b>${tree.treeName}</b><br>
        ${tree.treeId}<br>
        ${tree.scientificName}
      `;

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

      container.appendChild(div);
    });
  });
