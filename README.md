# Modern Data Analyst & Future Data Scientist Portfolio

A production-ready, single-page portfolio website tailored for **Data Analysts** and built to effortlessly expand into **Data Science & Machine Learning**.

Designed with modern aesthetics: deep navy/charcoal glassmorphism, electric teal and violet neon accents, an interactive Three.js 3D data-bar matrix hero scene, 3D card tilt effects, dynamic filtering, and interactive modal charts.

---

## 🚀 Features

- **Interactive 3D Hero Scene**: Lightweight Three.js holographic 3D data bar cluster and floating particle cloud with gentle sine-wave pulsing and mouse parallax reaction.
- **Performance Optimized**:
  - Automatically pauses rendering when off-screen (via `IntersectionObserver`) or when the browser tab is hidden.
  - Capped at `devicePixelRatio = 2` to prevent GPU drain.
  - Full fallback for `prefers-reduced-motion: reduce`.
  - Zero heavy charting libraries: ultra-fast, native HTML5 canvas rendering for bar, line, and donut charts.
- **Data-Driven Projects**: All projects are loaded from a single editable `PROJECTS_DATA` JavaScript array at the top of the script.
- **Interactive Detail Modal**: Clicking any project card opens a glassmorphism modal with problem statement, methodology, quantified results, and live interactive canvas charts (Bar, Line, or Donut).
- **Future-Ready Category Filters**:
  - `All Projects`
  - `Data Analytics`
  - `Machine Learning (Coming Soon)`
  - `Data Science (Coming Soon)`
- **Dark / Light Theme**: Instant toggle with smooth color transitions and persistent state in `localStorage`.
- **Complete Sections**:
  1. Hero with live telemetry KPI card
  2. About section with key stats (years exp, dashboards built, rows analyzed)
  3. Categorized Skills with animated proficiency meters (SQL, Python, Power BI, Tableau, Excel, Statistics)
  4. Projects with 3D perspective tilt
  5. Experience Timeline highlighting quantified metrics and business impact
  6. Certifications & Education
  7. Contact Form (with mailto fallback or Formspree integration) & Social links
  8. Responsive Footer & Back-to-top floating button

---

## 🛠️ Quick Start (Zero Build Required)

This website is built with vanilla HTML, CSS, and JavaScript. No Node.js build step or bundler is required.

### Option 1: Direct File Opening
Double-click `index.html` to open it directly in your browser.

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python3 -m http.server 3000
```
Then visit `http://localhost:3000`.

Using Node.js:
```bash
npx serve .
```

---

## ✏️ How to Customize

All custom settings are clearly marked with comments in `index.html`:

### 1. Personal Information (`OWNER_CONFIG`)
Search for `OWNER_CONFIG` around line 710 of `index.html`:
```javascript
const OWNER_CONFIG = {
  name: "Your Full Name",
  title: "Data Analyst",
  futureTitle: "Future Data Scientist",
  location: "San Francisco, CA",
  bioShort: "Transforming complex datasets into clear, high-impact business decisions...",
  bioAbout: "Analytical thinker with hands-on experience in exploratory data analysis...",
  education: "B.S. in Computer Science / Statistics, 2023",
  email: "your.name@example.com",
  linkedin: "https://linkedin.com/in/yourprofile",
  github: "https://github.com/yourusername",
  resumeUrl: "/assets/resume.pdf"
};
```

### 2. Projects Array (`PROJECTS_DATA`)
Search for `PROJECTS_DATA` around line 730 of `index.html`. You can add as many projects as you want:
```javascript
{
  id: "project-unique-id",
  title: "Project Title",
  category: "Data Analytics", // or "Machine Learning" / "Data Science"
  shortDescription: "One-line summary of what you built and delivered.",
  problem: "The business bottleneck or question being addressed.",
  approach: "ETL pipelines, data cleaning, modeling, or dashboard architecture.",
  toolsUsed: ["PostgreSQL", "Power BI", "Python"],
  keyInsight: "Quantified metric (e.g., Saved $140K or reduced latency by 35%).",
  chartType: "bar", // Options: "bar", "line", or "donut"
  chartData: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values: [45, 60, 75, 90],
    unit: "Sales Index"
  },
  githubLink: "https://github.com/...",
  dashboardLink: "https://public.tableau.com/...",
  thumbnail: "https://images.unsplash.com/photo-..."
}
```

### 3. Change Accent Colors
In the `<style>` block in `<head>`, look for `:root`:
```css
:root {
  /* Electric Teal (Default) */
  --accent-primary: #00f2fe;
  --accent-secondary: #4facfe;
  --accent-glow: rgba(0, 242, 254, 0.35);
  
  /* Or change to Electric Violet:
  --accent-primary: #8b5cf6;
  --accent-secondary: #a78bfa;
  --accent-glow: rgba(139, 92, 246, 0.35);
  */
}
```

---

## 🚢 Deploying to the Web

- **GitHub Pages**: Push this folder to a GitHub repository, go to `Settings > Pages`, and select `Branch: main / root`.
- **Vercel / Netlify**: Drag-and-drop the folder or connect your Git repository. It will deploy instantly with zero configuration.
