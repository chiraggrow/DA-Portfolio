import { SKILLS_DATA } from "./data.js";

export function renderSkills(category = "all") {
  const container = document.getElementById("skills-container");
  if (!container) return;
  const skills = category === "all" ? SKILLS_DATA : SKILLS_DATA.filter(skill => skill.category === category);
  container.replaceChildren(...skills.map(skill => {
    const card = document.createElement("article");
    card.className = "skill-card";
    const info = document.createElement("div");
    info.className = "skill-info";
    const name = document.createElement("span");
    name.className = "skill-name";
    name.textContent = skill.name;
    if (skill.tag) {
      const badge = document.createElement("span");
      badge.className = "badge-pill skill-tag";
      badge.textContent = skill.tag;
      name.append(badge);
    }
    const level = document.createElement("span");
    level.className = "skill-level-text";
    level.textContent = `${skill.level}%`;
    info.append(name, level);
    const track = document.createElement("div");
    track.className = "skill-bar-bg";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `${skill.name} proficiency`);
    track.setAttribute("aria-valuenow", String(skill.level));
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    const fill = document.createElement("div");
    fill.className = "skill-bar-fill";
    fill.style.width = `${skill.level}%`;
    track.append(fill);
    card.append(info, track);
    return card;
  }));
}

export function initFilters({ renderProjects }) {
  const skillTabs = document.querySelectorAll("#skill-tabs .tab-btn");
  skillTabs.forEach(button => button.addEventListener("click", () => {
    skillTabs.forEach(tab => tab.classList.toggle("active", tab === button));
    renderSkills(button.dataset.category || "all");
  }));

  const chips = document.querySelectorAll("#project-filters .filter-chip");
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(item => item.classList.toggle("active", item === chip));
    renderProjects(chip.dataset.filter || "all");
  }));
  document.getElementById("project-search-input")?.addEventListener("input", event => {
    renderProjects(document.querySelector("#project-filters .filter-chip.active")?.dataset.filter || "all", event.currentTarget.value);
  });
}
