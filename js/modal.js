import { drawProjectChart } from "./charts.js";

export function initModal(projects) {
  const backdrop = document.getElementById("project-detail-modal");
  const closeButton = document.getElementById("modal-close-button");
  if (!backdrop || !closeButton) return { openProjectModal: () => {} };
  let previousFocus = null;

  const close = () => {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    previousFocus?.focus();
  };

  const openProjectModal = projectId => {
    const project = projects.find(item => item.id === projectId);
    if (!project) return;
    previousFocus = document.activeElement;
    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };
    setText("modal-project-title", project.title);
    setText("modal-category-badge", project.category);
    setText("modal-problem-text", project.problem);
    setText("modal-approach-text", project.approach);
    setText("modal-insight-text", project.keyInsight);
    setText("modal-chart-name", `${project.title} - Sample Telemetry`);
    setText("modal-chart-desc", `Distribution of ${project.chartData.unit}`);
    setText("modal-chart-type-badge", `${project.chartType.toUpperCase()} CHART`);
    document.getElementById("modal-chart-canvas").setAttribute("aria-label", `${project.title}: ${project.chartData.unit} ${project.chartType} chart`);

    const tools = document.getElementById("modal-tools-list");
    tools.replaceChildren(...project.toolsUsed.map(tool => {
      const chip = document.createElement("span");
      chip.className = "tool-chip";
      chip.textContent = tool;
      return chip;
    }));
    for (const [id, url] of [["modal-github-link", project.githubLink], ["modal-dashboard-link", project.dashboardLink]]) {
      const link = document.getElementById(id);
      link.href = url;
      link.hidden = !url || url === "#";
    }

    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
    requestAnimationFrame(() => drawProjectChart(project.chartType, project.chartData));
  };

  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", event => { if (event.target === backdrop) close(); });
  document.addEventListener("keydown", event => {
    if (!backdrop.classList.contains("open")) return;
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
      const focusable = [...backdrop.querySelectorAll('a[href]:not([hidden]), button:not([hidden]), [tabindex="0"]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  return { openProjectModal };
}
