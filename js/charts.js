export function drawProjectChart(chartType, data) {
    const canvas = document.getElementById("modal-chart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-dpi canvas size
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const primaryColor = isDark ? "#00f2fe" : "#0284c7";
    const secondaryColor = isDark ? "#8b5cf6" : "#6366f1";
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

    if (chartType === "bar") {
      // Draw Bar Chart
      const padding = { top: 25, bottom: 35, left: 40, right: 20 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      const maxVal = Math.max(...data.values) * 1.15;
      const barWidth = chartW / data.labels.length * 0.55;

      // Draw horizontal grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = textColor;
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "right";
        const labelVal = Math.round(maxVal - (maxVal / 4) * i);
        ctx.fillText(labelVal, padding.left - 8, y + 4);
      }

      // Draw Bars
      data.values.forEach((val, idx) => {
        const barH = (val / maxVal) * chartH;
        const x = padding.left + (idx * (chartW / data.labels.length)) + (chartW / data.labels.length - barWidth) / 2;
        const y = padding.top + chartH - barH;

        // Gradient bar fill
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, primaryColor);
        grad.addColorStop(1, secondaryColor);
        ctx.fillStyle = grad;

        // Rounded bar top
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barH);
        ctx.fill();

        // Value above bar
        ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(val, x + barWidth / 2, y - 6);

        // X-axis label
        ctx.fillStyle = textColor;
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(data.labels[idx], x + barWidth / 2, height - 12);
      });

    } else if (chartType === "line") {
      // Draw Line Chart
      const padding = { top: 25, bottom: 35, left: 40, right: 25 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      const maxVal = Math.max(...data.values) * 1.2;
      const stepX = chartW / (data.labels.length - 1);

      // Grid
      ctx.strokeStyle = gridColor;
      for (let i = 0; i <= 3; i++) {
        const y = padding.top + (chartH / 3) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }

      // Line Points
      const points = data.values.map((v, i) => ({
        x: padding.left + i * stepX,
        y: padding.top + chartH - (v / maxVal) * chartH
      }));

      // Area under line
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      areaGrad.addColorStop(0, isDark ? "rgba(0, 242, 254, 0.3)" : "rgba(2, 132, 199, 0.2)");
      areaGrad.addColorStop(1, "transparent");
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      points.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.stroke();

      // Points & Labels
      points.forEach((pt, i) => {
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(data.values[i], pt.x, pt.y - 10);

        ctx.fillStyle = textColor;
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(data.labels[i], pt.x, height - 12);
      });

    } else {
      // Draw Donut Chart
      const centerX = width / 2;
      const centerY = height / 2 - 10;
      const outerR = Math.min(centerX, centerY) * 0.78;
      const innerR = outerR * 0.55;
      const total = data.values.reduce((a, b) => a + b, 0);

      let startAngle = -Math.PI / 2;
      const colors = [primaryColor, secondaryColor, "#10b981", "#f59e0b", "#ec4899"];

      data.values.forEach((val, i) => {
        const sliceAngle = (val / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerR, startAngle, startAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerR, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        startAngle += sliceAngle;
      });

      // Center Text
      ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
      ctx.font = "bold 15px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("100%", centerX, centerY + 5);

      // Legend
      const legendY = height - 15;
      const itemSpacing = width / data.labels.length;
      data.labels.forEach((lbl, i) => {
        const x = i * itemSpacing + itemSpacing / 2;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(x - 25, legendY - 3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${lbl} (${data.values[i]}%)`, x - 17, legendY);
      });
    }
}
