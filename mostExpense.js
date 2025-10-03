let provincesData = [];
let descending = true; // เริ่มต้นเรียงจากมากไปน้อย

function renderProvinces() {
  const tbody = document.getElementById("province-table");
  tbody.innerHTML = ""; // เคลียร์ก่อน render ใหม่

  const dataToShow = [...provincesData];
  dataToShow.sort((a, b) => descending ? b.expense - a.expense : a.expense - b.expense);
  const top10 = dataToShow.slice(0, 10);

  top10.forEach(item => {
    const tr = document.createElement("tr");
    const tdProvince = document.createElement("td");
    tdProvince.textContent = item.province;
    const tdExpense = document.createElement("td");
    tdExpense.textContent = item.expense.toLocaleString("th-TH");
    tr.appendChild(tdProvince);
    tr.appendChild(tdExpense);
    tbody.appendChild(tr);
  });
}

// โหลด CSV
fetch("2567_province.csv")
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n"); // ไม่ข้าม header
    provincesData = rows.map(row => {
      const parts = row.split(",");
      return { province: parts[0], expense: parseInt(parts[1]) }; // ใช้ index 1 = จังหวัด, 2 = total expense
    });
    renderProvinces();
  })
  .catch(err => console.error("โหลด 2567_province.csv ไม่ได้:", err));

// สลับเรียงเมื่อกดปุ่ม
document.getElementById("toggle-sort").addEventListener("click", () => {
  descending = !descending;
  document.getElementById("toggle-sort").textContent = descending ? "Descending" : "Ascending";
  renderProvinces();
});
