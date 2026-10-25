import { attachTilt } from "./animations.js";

// Project content is maintained in ../data/projects.json.
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);

export function renderProjects(projects, filter = "all", search = "", onOpen) {
  const container = document.getElementById("projects-container");
  const status = document.getElementById("project-search-status");
  if (!container) return;

  if (filter === "Machine Learning" || filter === "Data Science") {
    container.innerHTML = `<article class="project-card-coming-soon project-coming-soon-full">
      <div class="coming-soon-icon" aria-hidden="true">✦</div>
      <h3 class="coming-soon-title">Data Science &amp; ML Pipeline (In Active Development)</h3>
      <p class="coming-soon-description">Currently training and tuning XGBoost customer churn classifiers and NLP sentiment extraction models. Live interactive demos and notebook repositories arriving soon.</p>
      <div class="hero-tags"><span class="tag-badge">Scikit-Learn</span><span class="tag-badge">XGBoost</span><span class="tag-badge">Feature Engineering</span><span class="tag-badge">FastAPI</span></div>
    </article>`;
    if (status) status.textContent = "";
    return;
  }

  const term = search.trim().toLocaleLowerCase();
  const filtered = projects.filter(project => (filter === "all" || project.category === filter)
    && (!term || [project.title, project.category, project.shortDescription, ...project.toolsUsed].join(" ").toLocaleLowerCase().includes(term)));

  container.innerHTML = filtered.map(project => `<article class="project-card" data-project-id="${escapeHTML(project.id)}" tabindex="0" role="button" aria-label="View details for ${escapeHTML(project.title)}">
    <div class="project-thumb">
      <img src="${escapeHTML(project.thumbnail)}" alt="${escapeHTML(project.thumbnailAlt || project.title)}" loading="lazy" decoding="async" width="600" height="340">
      <span class="project-badge-cat">${escapeHTML(project.category)}</span>
    </div>
    <div class="project-body">
      <h3 class="project-title">${escapeHTML(project.title)}</h3>
      <p class="project-desc">${escapeHTML(project.shortDescription)}</p>
      <div class="project-insight-box"><strong>Key Impact:</strong> ${escapeHTML(project.keyInsight)}</div>
      <div class="project-tools">${project.toolsUsed.map(tool => `<span class="tool-chip">${escapeHTML(tool)}</span>`).join("")}</div>
      <div class="project-card-footer"><span class="project-btn-detail">Explore Analytics &amp; Chart <span aria-hidden="true">→</span></span></div>
    </div>
  </article>`).join("");

  if (status) status.textContent = filtered.length ? `${filtered.length} project${filtered.length === 1 ? "" : "s"} shown` : "No projects match your search.";
  container.querySelectorAll(".project-card").forEach(card => {
    attachTilt(card, 7);
    const open = () => onOpen(card.dataset.projectId);
    card.addEventListener("click", open);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}
