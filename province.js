// province-table.js
// ใช้ selectedProvince ที่ประกาศแล้วใน history.js
// ตัวอย่าง: history.js ประกาศ
// const selectedProvince = new URLSearchParams(window.location.search).get("province") || "กรุงเทพมหานคร";

Promise.all([
  fetch("predictions.csv").then(res => res.text()),
  fetch("provinceRatio.csv").then(res => res.text()),
  fetch("province.csv").then(res => res.text())
])
.then(([predCsv, ratioCsv, provCsv]) => {
  // แปลง ratioCSV เป็น object
  const ratioData = {};
  ratioCsv.trim().split("\n").slice(1).forEach(row => {
    const [province, ratio] = row.split(",");
    ratioData[province.trim()] = parseFloat(ratio);
  });

  // แปลง prediction CSV
  const predData = predCsv.trim().split("\n").slice(1).map(row => {
    const [year, expense] = row.split(",");
    return { year: parseInt(year), expense: Math.round(parseFloat(expense)) };
  });

  // แปลง province CSV
  const provData = {};
  provCsv.trim().split("\n").slice(1).forEach(row => {
    const [year, province, totalExpense] = row.split(",");
    if (province && province.trim().toLowerCase() === selectedProvince.trim().toLowerCase()) {
      provData[parseInt(year)] = parseFloat(totalExpense);
    }
  });

  // หา lastAdjustedExpense เริ่มต้นจากปีล่าสุดใน provData
  const provYears = Object.keys(provData).map(y => parseInt(y));
  const minProvYear = Math.min(...provYears);
  let lastAdjustedExpense = provData[minProvYear] || 0;

  // สร้าง table
  const tbody = document.getElementById("province-table");
  predData.forEach(item => {
    const tr = document.createElement("tr");

    // Year
    const tdYear = document.createElement("td");
    tdYear.textContent = item.year;
    tr.appendChild(tdYear);

    // Expense
    const ratio = ratioData[selectedProvince] || 1;
    const adjustedExpense = Math.round(item.expense * ratio);
    const tdExpense = document.createElement("td");
    tdExpense.textContent = adjustedExpense.toLocaleString("th-TH");
    tr.appendChild(tdExpense);

    // Growth
    const tdGrowth = document.createElement("td");
    tdGrowth.className = "growth";

    const diff = adjustedExpense - lastAdjustedExpense;
    const arrow = diff >= 0 ? "up" : "down";

    tdGrowth.innerHTML = `
      <svg class="arrow-${arrow}-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${arrow === "up" ? '<path d="M9 18v-6H5l7-7 7 7h-4v6H9z"/>' : '<path d="M15 6v6h4l-7 7-7-7h4V6h6z"/>'}
      </svg>
      <span>${Math.abs(diff).toLocaleString("th-TH")}</span>
    `;

    tr.appendChild(tdGrowth);
    tbody.appendChild(tr);

    // อัปเดต lastAdjustedExpense สำหรับปีต่อไป
    lastAdjustedExpense = adjustedExpense;
  });
})
.catch(err => console.error("โหลด CSV ไม่ได้:", err));
