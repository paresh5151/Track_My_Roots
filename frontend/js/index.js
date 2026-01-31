function searchTree() {
  const value = document.getElementById("searchInput").value.trim();

  if (!value) {
    alert("Enter Tree ID or Name");
    return;
  }

  // redirect to tree details page
  window.location.href = `tree-view.html?query=${value}`;
}
