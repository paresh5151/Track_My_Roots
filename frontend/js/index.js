function searchTree() {
  const input = document.getElementById("searchInput");
  const value = input.value.trim();

  // Clear previous error styling
  input.style.border = "";

  if (!value) {
    input.style.border = "2px solid red";
    alert("Please enter a Tree ID or Name");
    return;
  }

  // Encode query to avoid URL issues
  const encodedQuery = encodeURIComponent(value);

  // Redirect to tree details page
  window.location.href = `tree-view.html?query=${encodedQuery}`;
}
