import { OWNER_CONFIG } from "./data.js";

export function populateOwnerInfo() {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText("nav-owner-name", OWNER_CONFIG.name);
    setText("hero-owner-name", OWNER_CONFIG.name);
    setText("hero-owner-title", OWNER_CONFIG.title);
    setText("hero-bio-short", OWNER_CONFIG.bioShort);
    setText("about-bio-text", OWNER_CONFIG.bioAbout);
    setText("about-role", OWNER_CONFIG.title);
    setText("about-location", OWNER_CONFIG.location);
    setText("about-education", OWNER_CONFIG.education);
    setText("footer-owner-name", OWNER_CONFIG.name);
    setText("contact-email-display", OWNER_CONFIG.email);
    setText("contact-linkedin-display", OWNER_CONFIG.linkedin.replace("https://", ""));
    setText("contact-github-display", OWNER_CONFIG.github.replace("https://", ""));

    const resumeBtn = document.getElementById("resume-download-btn");
    if (resumeBtn) resumeBtn.href = OWNER_CONFIG.resumeUrl;

    const emailLink = document.getElementById("contact-email-link");
    if (emailLink) emailLink.href = `mailto:${OWNER_CONFIG.email}`;

    const liLink = document.getElementById("contact-linkedin-link");
    if (liLink) liLink.href = OWNER_CONFIG.linkedin;

    const ghLink = document.getElementById("contact-github-link");
    if (ghLink) ghLink.href = OWNER_CONFIG.github;

    const footGh = document.getElementById("footer-gh-link");
    if (footGh) footGh.href = OWNER_CONFIG.github;
    const footLi = document.getElementById("footer-li-link");
    if (footLi) footLi.href = OWNER_CONFIG.linkedin;
    const footMail = document.getElementById("footer-mail-link");
    if (footMail) footMail.href = `mailto:${OWNER_CONFIG.email}`;
}
