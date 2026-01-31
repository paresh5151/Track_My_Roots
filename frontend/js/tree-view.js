if (!localStorage.getItem("token")) {
  alert("Please login first");
  window.location.href = "login.html";
}

fetch("https://track-my-roots-api.onrender.com/api/trees", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
})
.then(res => res.json())
.then(trees => {
  const container = document.getElementById("treeList");
  container.innerHTML = "";

  trees.forEach(tree => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${tree.treeName}</h3>
      <p>Location: ${tree.location}</p>
      <p>Age: ${tree.age} years</p>
      <a href="tree-view.html?id=${tree._id}">QR View</a>
      <hr>
    `;
    container.appendChild(div);
  });
});
