Promise.all([
  fetch("expense.csv").then(res => res.text()),
  fetch("predictions.csv").then(res => res.text())
  
])
.then(([expenseCsv, predCsv]) => {
  const expenseData = {};
  expenseCsv.trim().split("\n").slice(1).forEach(row => {
    const [year, expense] = row.split(",");
    expenseData[parseInt(year)] = Math.round(parseFloat(expense)); // ปัด expense
  });

  const predData = predCsv.trim().split("\n").slice(1).map(row => {
    const [year, expense] = row.split(",");
    return { year: parseInt(year), expense: Math.round(parseFloat(expense)) }; // ปัด expense
  });

  const tbody = document.getElementById("expense-table");

  predData.forEach(item => {
    const tr = document.createElement("tr");

    // Year
    const tdYear = document.createElement("td");
    tdYear.textContent = item.year;
    tr.appendChild(tdYear);

    // Expense (จำนวนเต็ม)
    const tdExpense = document.createElement("td");
    tdExpense.textContent = item.expense.toLocaleString("th-TH");
    tr.appendChild(tdExpense);

    // Growth
    const tdGrowth = document.createElement("td");
    tdGrowth.className = "growth";

    const prevExpense = expenseData[item.year - 1] || 0;
    const diff = item.expense - prevExpense;
    const arrow = diff >= 0 ? "up" : "down";

    tdGrowth.innerHTML = `
      <svg class="arrow-${arrow}-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${arrow === "up" ? '<path d="M9 18v-6H5l7-7 7 7h-4v6H9z"/>' : '<path d="M15 6v6h4l-7 7-7-7h4V6h6z"/>'}
      </svg>
      <span>${Math.abs(diff).toLocaleString("th-TH")}</span>
    `;

    tr.appendChild(tdGrowth);
    tbody.appendChild(tr);

    // อัปเดต expenseData สำหรับปีต่อไป
    expenseData[item.year] = item.expense;
  });
})
.catch(err => console.error("โหลด CSV ไม่ได้:", err));

