const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealObserver;

export function attachTilt(element, maxTiltDeg = 10) {
  if (reducedMotion || !window.matchMedia("(hover: hover)").matches) return;
  element.addEventListener("pointermove", event => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--tilt-x", `${(-y * maxTiltDeg).toFixed(2)}deg`);
    element.style.setProperty("--tilt-y", `${(x * maxTiltDeg).toFixed(2)}deg`);
    element.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
    element.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
    element.classList.add("is-tilting");
  });
  element.addEventListener("pointerleave", () => {
    element.classList.remove("is-tilting");
    element.style.removeProperty("--tilt-x");
    element.style.removeProperty("--tilt-y");
  });
}

export function initScrollReveals() {
  const targets = document.querySelectorAll(".stat-card, .timeline-item, .project-card, .cert-card");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach(target => target.classList.add("revealed"));
    return;
  }
  revealObserver ??= new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  targets.forEach(target => {
    if (!target.classList.contains("revealed")) revealObserver.observe(target);
  });
}

export function initCursor() {
  const cursor = document.querySelector(".cursor-dot");
  if (!cursor || reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  let frame = 0;
  window.addEventListener("pointermove", event => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      cursor.style.opacity = "0.7";
    });
  }, { passive: true });
}

export function initStatsCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const animate = element => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const start = performance.now();
    const duration = 900;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = `${Math.round(target * (1 - (1 - progress) ** 3))}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach(element => { element.textContent = `${element.dataset.count}${element.dataset.suffix || ""}`; });
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      animate(entry.target);
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.4 });
  counters.forEach(element => observer.observe(element));
}
