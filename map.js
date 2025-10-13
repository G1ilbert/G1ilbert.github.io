async function loadMapAndData() {
  const mapContainer = document.getElementById('map-container');

  // โหลด SVG
  const svgResponse = await fetch('thaimap.svg');
  const svgText = await svgResponse.text();
  mapContainer.innerHTML = svgText;
  const svg = mapContainer.querySelector('svg');

  // โหลด CSV
  const csvResponse = await fetch('2567_province.csv');
  const csvText = await csvResponse.text();

  // Parse CSV
  const data = {};
  const rows = csvText.trim().split('\n');
  //rows.shift(); // skip header
  rows.forEach(row => {
    const [province, expense] = row.split(',');
    data[province.trim()] = Number(expense.trim());
  });

  // min-max
  const expenses = Object.values(data);
  const min = Math.min(...expenses);
  const max = Math.max(...expenses);

  // 10 สี ไล่จากเขียวอ่อน → เขียวเข้ม
  const colors = [
    "#e6f7eb", "#d4f4dd", "#c2f0d0", "#a8e0b0", "#8cd18f",
    "#6cc37f", "#52b66a", "#38a853", "#1f923c", "#006633"
  ];

  function getColorByBin(value) {
    const ratio = (value - min) / (max - min);
    const index = Math.floor(ratio * 10);
    return colors[Math.min(index, 9)];
  }

  // สร้าง tooltip element
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.padding = '4px 8px';
  tooltip.style.background = '#333';
  tooltip.style.color = '#fff';
  tooltip.style.borderRadius = '4px';
  tooltip.style.fontSize = '12px';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  // ใส่สี path และ event hover
  svg.querySelectorAll('path').forEach(path => {
    const provinceName = path.getAttribute('title')?.trim();
    if (provinceName && data[provinceName] !== undefined) {
      const expense = data[provinceName];
      path.setAttribute('fill', getColorByBin(expense));

      // hover event
      path.addEventListener('mouseenter', e => {
        tooltip.style.display = 'block';
        tooltip.innerText = `${provinceName}: ${expense}`;
      });
      path.addEventListener('mousemove', e => {
        tooltip.style.top = e.pageY + 10 + 'px';
        tooltip.style.left = e.pageX + 10 + 'px';
      });
      path.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    } else {
      path.setAttribute('fill', colors[0]);
    }
  });
}

loadMapAndData();
