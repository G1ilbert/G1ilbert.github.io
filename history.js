// ดึงชื่อจังหวัดจาก URL เช่น ?province=ตราด
const selectedProvince = new URLSearchParams(window.location.search).get("province") || "";

// เลือกช่วงปีเอง
const startYear = 2556; // เริ่มปี
const endYear = 2567;   // สิ้นสุดปี

// ฟังก์ชันโหลด CSV เป็น Promise
function loadCSV(path) {
    return fetch(path)
        .then(res => res.text())
        .then(text => text.trim().split("\n").slice(1));
}

// โหลด expense.csv
const expensePromise = loadCSV("expense.csv").then(rows => {
    const labels = [];
    const expenses = [];
    rows.forEach(row => {
        const [year, expense] = row.split(",");
        const y = parseInt(year.trim());
        if (y >= startYear && y <= endYear) {
            labels.push(year.trim());
            expenses.push(parseFloat(expense));
        }
    });
    return { labels, expenses };
});

// โหลด province.csv ตามจังหวัด
const provincePromise = loadCSV("province.csv").then(rows => {
    const labels = [];
    const expenses = [];
    rows.forEach(row => {
        const [year, province, totalExpense] = row.split(",");
        const y = parseInt(year.trim());
        if(province && province.trim().toLowerCase() === selectedProvince.trim().toLowerCase()) {
            if (y >= startYear && y <= endYear) {
                labels.push(year.trim());
                expenses.push(parseFloat(totalExpense));
            }
        }
    });
    return { labels, expenses };
});

// เมื่อโหลดข้อมูลเสร็จ
Promise.all([expensePromise, provincePromise]).then(([expData, provData]) => {
    const allLabels = expData.labels; // ใช้ปีจาก expense.csv
    const ctx = document.getElementById("expenseGraph").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: allLabels,
            datasets: [
                {
                    label: "ค่าเฉลี่ย",
                    data: expData.expenses,
                    borderColor: "#4DA6FF",
                    backgroundColor: "rgba(0,0,255,0.2)",
                    tension: 0.5,
                    pointRadius: 3,
                    borderWidth: 2
                },
                {
                    label: selectedProvince + "",
                    data: allLabels.map(year => {
                        const idx = provData.labels.indexOf(year);
                        return idx !== -1 ? provData.expenses[idx] : null;
                    }),
                    borderColor: "#FFC04D",
                    backgroundColor: "rgba(255,0,0,0.2)",
                    tension: 0.5,
                    pointRadius: 3,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "" } },
                y: { title: { display: true, text: "" } }
            },
            plugins: {
                legend: { display: true },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
}).catch(err => console.error("โหลด CSV ไม่ได้:", err));
