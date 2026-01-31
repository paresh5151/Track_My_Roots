const API = "https://track-my-roots-api.onrender.com";
const token = localStorage.getItem("token");

document.getElementById("treeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (latitude === null || longitude === null) {
    alert("Please detect live location first");
    return;
  }

  if (!confirm("Are you sure you want to save this tree?")) {
    return;
  }

  const treeData = {
    treeId: treeId.value,
    treeName: treeName.value,
    scientificName: scientificName.value,
    plantedYear: plantedYear.value,
    maintainedBy: maintainedBy.value,
    rollNo: rollNo.value,
    email: email.value,
    imageUrl: imageUrl.value,
    location: {
      latitude,
      longitude
    }
  };

  const res = await fetch(`${API}/api/trees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(treeData)
  });

  const data = await res.json();

  if (res.ok) {
    alert("Tree saved successfully");
    window.location.href = "tree-view.html";
  } else {
    alert(data.message || "Error saving tree");
  }
});
