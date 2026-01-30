const API = "http://localhost:5000/api/trees";
const token = localStorage.getItem("token");

if (!token) location.href = "login.html";

async function loadTrees() {
  const res = await fetch(API);
  const trees = await res.json();

  const list = document.getElementById("treeList");
  list.innerHTML = "";

  trees.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${t.name}</b> - ${t.location}
      <button onclick='editTree(${JSON.stringify(t)})'>Edit</button>
      <button onclick='deleteTree("${t._id}")'>Delete</button>
    `;
    list.appendChild(li);
  });
}

async function saveTree() {
  const id = treeId.value;

  const data = {
    name: name.value,
    location: location.value,
    plantedYear: year.value,
    imageUrl: imageUrl.value,
    description: description.value
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${API}/${id}` : API;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(data)
  });

  msg.innerText = (await res.json()).message || "Saved";
  clearForm();
  loadTrees();
}

function editTree(t) {
  treeId.value = t._id;
  name.value = t.name;
  location.value = t.location;
  year.value = t.plantedYear;
  imageUrl.value = t.imageUrl;
  description.value = t.description;
}

async function deleteTree(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": token }
  });
  loadTrees();
}

function clearForm() {
  treeId.value = "";
  name.value = location.value = year.value = imageUrl.value = description.value = "";
}

function logout() {
  localStorage.clear();
  location.href = "login.html";
}

loadTrees();
