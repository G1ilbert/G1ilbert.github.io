fetch("forecast_expense.csv")
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split("\n").slice(1);
    const labels = [];
    const expenses = [];

    rows.forEach(row => {
      const [year, month, totalexpense] = row.split(",");
      labels.push(`${month}/${year}`);
      expenses.push(parseFloat(totalexpense));
    });

    const minExpense = Math.min(...expenses);
    const maxExpense = Math.max(...expenses);

    const ctx = document.getElementById("expenseChart").getContext("2d");
    const colors = getChartColors();

    window.expenseChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Forecast Expense",
          data: expenses,
          borderColor: colors.textColorMuted,
          backgroundColor: colors.bgColor,
          tension: 0.5,
          pointRadius: 3,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: colors.textColorMuted, font: { size: 14 } },
            grid: { color: colors.borderColor } // <-- สีเส้น grid แกน X
          },
          y: {
            ticks: { color: colors.textColorMuted, font: { size: 14 } },
            grid: { color: colors.borderColor }, // <-- สีเส้น grid แกน Y
            min: Math.floor(minExpense * 0.95), // ลองเล็กน้อยใต้ min
            max: Math.ceil(maxExpense * 1.05),  // ลองเล็กน้อยเหนือ max
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.bgColorLight,
            titleColor: colors.textColor,
            bodyColor: colors.textColorLight,
          }
        }
      }
    });
  });
