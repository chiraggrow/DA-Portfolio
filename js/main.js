import { OWNER_CONFIG, CERTIFICATIONS_DATA } from "./data.js";
import { populateOwnerInfo } from "./utils.js";
import { initTheme, initMobileNavigation, initScrollUI } from "./navigation.js";
import { renderSkills, initFilters } from "./filters.js";
import { renderProjects } from "./projects.js";
import { initModal } from "./modal.js";
import { initCursor, initScrollReveals, initStatsCounters, attachTilt } from "./animations.js";

function renderCertifications() {
  const container = document.getElementById("cert-edu-container");
  if (!container) return;
  container.innerHTML = CERTIFICATIONS_DATA.map(cert => `<article class="cert-card">
    <div class="cert-icon" aria-hidden="true">✦</div>
    <div><h3 class="cert-title">${cert.title}</h3><div class="cert-issuer">${cert.issuer} · ${cert.year}</div>
    <a href="${cert.link}" class="btn-sm btn-secondary credential-link" target="_blank" rel="noopener noreferrer">Verify Credential ↗</a></div>
  </article>`).join("");
}

function initContactForm() {
  const form = document.getElementById("portfolio-contact-form");
  const status = document.getElementById("form-status-msg");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "");
    const email = String(fields.get("email") || "");
    const subject = String(fields.get("subject") || "");
    const message = String(fields.get("message") || "");
    const mailto = `mailto:${OWNER_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    status.className = "form-status success";
    status.textContent = `Thank you, ${name}! Your email client will open with this message drafted to ${OWNER_CONFIG.email}.`;
    window.location.href = mailto;
    form.reset();
  });
}

async function loadProjects() {
  const response = await fetch("./data/projects.json");
  if (!response.ok) throw new Error(`Projects could not be loaded (${response.status}).`);
  const projects = await response.json();
  if (!Array.isArray(projects)) throw new TypeError("The projects data must be a JSON array.");
  return projects;
}

async function initializePortfolio() {
  populateOwnerInfo();
  initTheme();
  initMobileNavigation();
  initScrollUI();
  renderSkills();
  renderCertifications();
  initContactForm();
  initCursor();
  initStatsCounters();
  document.querySelectorAll("#hero-tilt-card").forEach(card => attachTilt(card, 11));
  initScrollReveals();

  const loader = document.getElementById("page-loader");
  try {
    const projects = await loadProjects();
    const modal = initModal(projects);
    const render = (filter = "all", search = "") => {
      renderProjects(projects, filter, search, modal.openProjectModal);
      initScrollReveals();
    };
    render();
    initFilters({ renderProjects: render });
    initScrollReveals();
  } catch (error) {
    const container = document.getElementById("projects-container");
    if (container) container.textContent = "Projects are temporarily unavailable. Please refresh the page to try again.";
    console.error("Portfolio initialization failed:", error);
  } finally {
    loader?.classList.add("is-hidden");
    loader?.setAttribute("aria-hidden", "true");
  }

  const hero = document.getElementById("hero");
  if (hero && "IntersectionObserver" in window) {
    const sceneLoader = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      sceneLoader.disconnect();
      import("./three-scene.js").then(({ initThreeScene }) => initThreeScene())
        .catch(error => console.error("The optional 3D scene could not be loaded:", error));
    }, { rootMargin: "100px" });
    sceneLoader.observe(hero);
  }
}

document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
