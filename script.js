// Get CSS variables
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

// --- สร้าง chart เฉพาะถ้ามี canvas ---
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

// --- Toggle sidebar ---
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

// --- Toggle dark mode ---
const magicBtn = document.querySelector(".magic-btn");
if (magicBtn) {
  magicBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (priceChart) {
      const newColors = getChartColors();
      const dataset = priceChart.data.datasets[0];
      dataset.borderColor = newColors.textColorMuted;
      dataset.backgroundColor = newColors.bgColor;
      dataset.pointBackgroundColor = newColors.textColorMuted;
      dataset.pointBorderColor = newColors.textColorMuted;

      priceChart.options.scales.x.ticks.color = newColors.textColorMuted;
      priceChart.options.scales.y.ticks.color = newColors.textColorMuted;
      priceChart.options.scales.x.grid.color = newColors.borderColor;
      priceChart.options.scales.y.grid.color = newColors.borderColor;

      if (priceChart.options.plugins.tooltip) {
        priceChart.options.plugins.tooltip.backgroundColor = newColors.bgColorLight;
        priceChart.options.plugins.tooltip.titleColor = newColors.textColor;
        priceChart.options.plugins.tooltip.bodyColor = newColors.textColorLight;
      }

      priceChart.update();
    }
  });
}
