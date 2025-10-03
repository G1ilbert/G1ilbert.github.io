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

// ฟังก์ชันสร้าง suggestion
function createSuggestions(query) {
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "none";
  overlay.style.display = "none";

  if (!query) return;

  const results = provinceData.filter(item =>
    item.province.toLowerCase().includes(query)
  );

  if (results.length === 0) return;

  const ul = document.createElement("ul");

  results.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.province;

    // กดเลือกจังหวัด
    li.addEventListener("click", () => {
  console.log("เลือกจังหวัด:", item.province, "Ratio:", item.ratio);

  searchInput.value = item.province; // ใส่ชื่อจังหวัดใน input
  resultsContainer.style.display = "none"; // ซ่อน dropdown
  overlay.style.display = "none"; // ซ่อน overlay

  // ไปหน้า province.html พร้อมส่งตัวแปร
  window.location.href = `province.html?province=${encodeURIComponent(item.province)}`;
});

    

    ul.appendChild(li);
  });

  resultsContainer.appendChild(ul);
  resultsContainer.style.display = "block";
}

// Event input
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  createSuggestions(query);
});


// Event enter กดจาก keyboard
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const province = searchInput.value.trim();
    if (!province) return;

    const found = provinceData.find(item => item.province === province);
    if (found) {
      console.log("กด Enter:", found.province, "Ratio:", found.ratio);

      // ไปหน้า province.html พร้อมส่งตัวแปร
      window.location.href = `province.html?province=${encodeURIComponent(found.province)}`;
    } else {
      console.log("ไม่พบจังหวัด:", province);
    }
  }
});


