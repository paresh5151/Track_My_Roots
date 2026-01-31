const API = "https://track-my-roots-api.onrender.com";
const params = new URLSearchParams(window.location.search);
const query = params.get("query");

fetch(`${API}/api/trees`)
.then(res => res.json())
.then(trees => {
  const tree = trees.find(t =>
    t.treeName.toLowerCase() === query.toLowerCase() ||
    t._id === query
  );

  if (!tree) {
    document.getElementById("treeDetails").innerHTML = "Tree not found";
    return;
  }

  document.getElementById("treeDetails").innerHTML = `
    <p><b>ID:</b> ${tree._id}</p>
    <p><b>Name:</b> ${tree.treeName}</p>
    <p><b>Location:</b> ${tree.location}</p>
    <p><b>Age:</b> ${tree.age}</p>
  `;

  document.getElementById("map").src =
    `https://www.google.com/maps?q=${encodeURIComponent(tree.location)}&output=embed`;
});
