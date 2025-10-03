let provinceData = [];

fetch("provinceRatio.csv")
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n").slice(1);
    provinceData = rows.map(row => {
      const parts = row.split(",");
      return { province: parts[0].trim(), ratio: parseFloat(parts[1] || 0) };
    });
  })
  .catch(err => console.error("โหลด provinceRatio.csv ไม่ได้:", err));

const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("searchResults");
const overlay = document.getElementById("overlay");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "none";
  overlay.style.display = "none";

  if (!query) return;

  const results = provinceData.filter(item => item.province.toLowerCase().includes(query));

  if (results.length === 0) return;

  const ul = document.createElement("ul");

  results.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.province;

    

    li.addEventListener("mouseleave", () => {
      overlay.style.display = "none";
    });

    ul.appendChild(li);
  });

  resultsContainer.appendChild(ul);
  resultsContainer.style.display = "block";
});
