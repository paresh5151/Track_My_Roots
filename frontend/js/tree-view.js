fetch("https://YOUR-BACKEND.onrender.com/api/trees", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
})
.then(res => res.json())
.then(trees => {
  const ul = document.getElementById("trees");
  trees.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.treeName} - ${t.location} - ${t.age} yrs`;
    ul.appendChild(li);
  });
});
