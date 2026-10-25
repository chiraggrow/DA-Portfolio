export function initTheme() {
  const button = document.getElementById("theme-toggle-btn");
  const saved = localStorage.getItem("portfolio-theme");
  document.documentElement.dataset.theme = saved === "light" ? "light" : "dark";

  button?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
    window.dispatchEvent(new CustomEvent("portfolio:themechange", { detail: next }));
  });
}

export function initMobileNavigation() {
  const button = document.getElementById("mobile-menu-toggle");
  const links = document.getElementById("nav-links");
  if (!button || !links) return;

  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    links.classList.toggle("open", open);
  });
  links.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    links.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  }));
}

export function initScrollUI() {
  const progress = document.querySelector(".site-progress");
  const backToTop = document.getElementById("back-to-top-btn");
  let queued = false;
  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
    backToTop?.classList.toggle("visible", window.scrollY > 400);
    queued = false;
  };
  window.addEventListener("scroll", () => {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
}
