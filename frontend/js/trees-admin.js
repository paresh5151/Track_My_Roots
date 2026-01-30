const API = "https://trackmyroots.onrender.com/api/trees";
const token = localStorage.getItem("token");

async function loadTrees() {
  const res = await fetch(API);
  const trees = await res.json();
  const list = document.getElementById("treeList");
  list.innerHTML = "";

  trees.forEach(t => {
    let li = document.createElement("li");
    li.innerHTML = `${t.name} - ${t.location}`;

    if (localStorage.getItem("role") === "main-admin") {
      const btn = document.createElement("button");
      btn.innerText = "Delete";
      btn.onclick = () => deleteTree(t._id);
      li.appendChild(btn);
    }

    list.appendChild(li);
  });
}

async function addTree() {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      name: name.value,
      location: location.value
    })
  });

  loadTrees();
}

async function deleteTree(id) {
  if (!confirm("Delete tree?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadTrees();
}

loadTrees();
