const API = "https://trackmyroots.onrender.com/api/trees";

function loadTree() {
  const id = document.getElementById("treeIdInput").value.trim();
  if (!id) return alert("Enter Tree ID");

  fetch(API)
    .then(r => r.json())
    .then(trees => {
      const tree = trees.find(t => t.treeId === id);
      if (!tree) return alert("Tree not found");

      // Fill details
      tid.innerText = tree.treeId;
      tname.innerText = tree.name;
      tyear.innerText = tree.plantedYear;
      tmaint.innerText = tree.maintainedBy;
      troll.innerText = tree.rollNo;
      temail.innerText = tree.email;
      tdistance.innerText = tree.note || "";

      treeImage.src = tree.imageUrl;

      // Google Maps
      mapFrame.src =
        `https://www.google.com/maps?q=${tree.latitude},${tree.longitude}&output=embed`;
    });
}

// Auto-load from URL (QR support)
const params = new URLSearchParams(window.location.search);
if (params.get("id")) {
  treeIdInput.value = params.get("id");
  loadTree();
}
