const API = "https://trackmyroots.onrender.com/api/trees";

function loadTree() {
  const id = document.getElementById("treeIdInput").value.trim();
  if (!id) {
    alert("Please enter Tree ID");
    return;
  }

  fetch(API)
    .then(res => res.json())
    .then(trees => {
      const tree = trees.find(t => t.treeId === id);

      if (!tree) {
        alert("Tree not found");
        return;
      }

      // Fill text data
      tid.innerText = tree.treeId;
      tname.innerText = tree.name;
      tyear.innerText = tree.plantedYear;
      tmaint.innerText = tree.maintainedBy;
      troll.innerText = tree.rollNo;
      temail.innerText = tree.email;
      tdistance.innerText = tree.note || "";

      // Image
      treeImage.src = tree.imageUrl;

      // Google Map
      mapFrame.src =
        `https://www.google.com/maps?q=${tree.latitude},${tree.longitude}&output=embed`;
    })
    .catch(() => alert("Failed to load tree data"));
}

// Auto-load from URL (QR support)
const params = new URLSearchParams(window.location.search);
if (params.get("id")) {
  treeIdInput.value = params.get("id");
  loadTree();
}
