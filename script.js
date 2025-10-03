// ------------------ chart-utils.js ------------------
// ฟังก์ชันดึง CSS variables สำหรับ chart
function getChartColors() {
  const styles = getComputedStyle(document.body);
  return {
    textColor: styles.getPropertyValue("--color-text").trim(),
    borderColor: styles.getPropertyValue("--color-border").trim(),
    textColorLight: styles.getPropertyValue("--color-text-light").trim(),
    textColorMuted: styles.getPropertyValue("--color-text-muted").trim(),
    bgColor: styles.getPropertyValue("--color-bg").trim(),
    bgColorLight: styles.getPropertyValue("--color-bg-light").trim(),
  };
}

// ------------------ dark-mode.js ------------------
// โหลดโหมดจาก localStorage
function loadDarkMode() {
  const isLight = localStorage.getItem("lightMode") === "true";
  if (isLight) document.body.classList.add("light-mode");
  else document.body.classList.remove("light-mode");
}

// Toggle dark/light mode และเซฟลง localStorage
function toggleDarkMode(chart) {
  const isLight = document.body.classList.toggle("light-mode");
  localStorage.setItem("lightMode", isLight);

  if (!chart) return;

  const newColors = getChartColors();
  const dataset = chart.data.datasets[0];
  dataset.borderColor = newColors.textColorMuted;
  dataset.backgroundColor = newColors.bgColor;
  dataset.pointBackgroundColor = newColors.textColorMuted;
  dataset.pointBorderColor = newColors.textColorMuted;

  chart.options.scales.x.ticks.color = newColors.textColorMuted;
  chart.options.scales.y.ticks.color = newColors.textColorMuted;
  chart.options.scales.x.grid.color = newColors.borderColor;
  chart.options.scales.y.grid.color = newColors.borderColor;

  if (chart.options.plugins.tooltip) {
    chart.options.plugins.tooltip.backgroundColor = newColors.bgColorLight;
    chart.options.plugins.tooltip.titleColor = newColors.textColor;
    chart.options.plugins.tooltip.bodyColor = newColors.textColorLight;
  }

  chart.update();
}

// ------------------ main.js ------------------
document.addEventListener("DOMContentLoaded", () => {
  // โหลด dark mode
  loadDarkMode();

  // Sidebar toggle
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector("aside");
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("show-sidebar");
      sidebar.classList.toggle("hide-sidebar");
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth < 800) {
        sidebar.classList.remove("show-sidebar");
        sidebar.classList.add("hide-sidebar");
      }
    });
  }

  // Chart ถ้ามี canvas
  const priceCanvas = document.getElementById("priceChart");
  let priceChart = null;
  if (priceCanvas) {
    const labels = Array.from({ length: 28 }, (_, i) => `May ${i + 1}`);
    const prices = [
      45, 120, 78, 34, 190, 156, 189, 150, 23, 67, 11, 98, 12, 76, 69, 63, 69, 59,
      43, 77, 65, 80, 92, 33, 40, 58, 110, 169,
    ];

    const ctx = priceCanvas.getContext("2d");
    const colors = getChartColors();

    priceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Price",
          data: prices,
          borderColor: colors.textColorMuted,
          backgroundColor: colors.bgColor,
          tension: 0.5,
          pointRadius: 2,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: colors.textColorMuted }, grid: { color: colors.borderColor } },
          y: { ticks: { color: colors.textColorMuted }, grid: { color: colors.borderColor }, beginAtZero: true },
        },
      },
    });
  }

  // Dark mode toggle button
  const magicBtn = document.querySelector(".magic-btn");
  if (magicBtn) {
    magicBtn.addEventListener("click", () => toggleDarkMode(priceChart));
  }

  // ------------------ Search Province ------------------
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");
  const overlay = document.getElementById("overlay");
  let provinceData = [];

  // โหลด CSV
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

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none";
    overlay.style.display = "none";
    if (!query) return;

    const results = provinceData.filter(item => item.province.toLowerCase().includes(query));
    if (!results.length) return;

    const ul = document.createElement("ul");
    results.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.province;

      // คลิกเลือกจังหวัด -> ไป province.html พร้อม parameter
      li.addEventListener("click", () => {
        console.log("เลือกจังหวัด:", item.province, "Ratio:", item.ratio);
        searchInput.value = item.province;
        resultsContainer.style.display = "none";
        overlay.style.display = "none";
        window.location.href = `province.html?province=${encodeURIComponent(item.province)}`;
      });

      ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
    resultsContainer.style.display = "block";
  });

  // กด Enter
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const province = searchInput.value.trim();
      if (!province) return;
      const found = provinceData.find(item => item.province === province);
      if (found) {
        console.log("กด Enter:", found.province, "Ratio:", found.ratio);
        window.location.href = `province.html?province=${encodeURIComponent(found.province)}`;
      } else {
        console.log("ไม่พบจังหวัด:", province);
      }
    }
  });
});
