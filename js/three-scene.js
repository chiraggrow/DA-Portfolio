const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export async function initThreeScene() {
  const container = document.getElementById("site-scene");
  if (!container || reducedMotion || navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2)) return;

  const THREE = await import(THREE_URL);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 24);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(innerWidth, innerHeight);
  container.append(renderer.domElement);
  scene.add(new THREE.AmbientLight(0x8cb8d7, 1.5));
  const keyLight = new THREE.PointLight(0x00f2fe, 55, 40);
  keyLight.position.set(8, 9, 14);
  scene.add(keyLight);

  const dataGroup = new THREE.Group();
  scene.add(dataGroup);
  const bars = [];
  const barGeometry = new THREE.BoxGeometry(0.48, 1, 0.48);
  for (let x = -3; x <= 3; x++) {
    for (let z = -2; z <= 2; z++) {
      const height = 0.7 + Math.random() * 2.6;
      const material = new THREE.MeshStandardMaterial({
        color: (x + z) % 3 ? 0x00c9da : 0x8b5cf6,
        emissive: (x + z) % 3 ? 0x003d45 : 0x241044,
        roughness: 0.48,
        metalness: 0.12,
        transparent: true,
        opacity: 0.48
      });
      const bar = new THREE.Mesh(barGeometry, material);
      bar.scale.y = height;
      bar.position.set(x * 1.05, height / 2 - 2, z * 1.05);
      bar.userData = { height, phase: Math.random() * Math.PI * 2 };
      dataGroup.add(bar);
      bars.push(bar);
    }
  }

  const nodes = [];
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x008899, emissiveIntensity: 1.1 });
  const nodeGeometry = new THREE.SphereGeometry(0.11, 8, 8);
  for (let i = 0; i < 18; i++) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, -2 - Math.random() * 5);
    scene.add(node);
    nodes.push(node.position);
  }
  const linePositions = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    linePositions.push(...nodes[i].toArray(), ...nodes[i + 1].toArray());
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  scene.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x00d9e8, transparent: true, opacity: 0.18 })));

  const particlePositions = new Float32Array(300 * 3);
  for (let i = 0; i < particlePositions.length; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 42;
    particlePositions[i + 1] = (Math.random() - 0.5) * 28;
    particlePositions[i + 2] = (Math.random() - 0.5) * 18;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  scene.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x69eafa, size: 0.055, transparent: true, opacity: 0.5 })));

  let pointerX = 0;
  let pointerY = 0;
  let scrollTarget = 0;
  let sectionVisible = true;
  let frame = 0;
  let running = true;
  const onPointer = event => {
    pointerX = event.clientX / innerWidth * 2 - 1;
    pointerY = event.clientY / innerHeight * 2 - 1;
  };
  const onScroll = () => { scrollTarget = scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1); };
  const resize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", resize);
  onScroll();

  const visibleSections = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    sectionVisible = visibleSections.size > 0;
    if (sectionVisible && !document.hidden && !frame) frame = requestAnimationFrame(render);
  }, { threshold: 0.01 });
  document.querySelectorAll("main > section").forEach(section => observer.observe(section));
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (sectionVisible && !frame) frame = requestAnimationFrame(render);
  };
  document.addEventListener("visibilitychange", onVisibility);

  const clock = new THREE.Clock();
  function render() {
    frame = 0;
    if (!running || document.hidden || !sectionVisible) return;
    const time = clock.getElapsedTime();
    dataGroup.rotation.y += (pointerX * 0.12 + dataGroup.rotation.y * -0.025);
    dataGroup.rotation.x += (-0.22 + pointerY * 0.06 - dataGroup.rotation.x) * 0.025;
    dataGroup.position.y += (-scrollTarget * 3 - dataGroup.position.y) * 0.035;
    bars.forEach(bar => {
      const height = bar.userData.height + Math.sin(time * 0.65 + bar.userData.phase) * 0.24;
      bar.scale.y = height;
      bar.position.y = height / 2 - 2;
    });
    camera.position.x += (pointerX * 0.8 - camera.position.x) * 0.018;
    camera.position.y += (-pointerY * 0.45 - camera.position.y) * 0.018;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }
  if (sectionVisible && !document.hidden) frame = requestAnimationFrame(render);

  window.addEventListener("pagehide", () => {
    running = false;
    observer.disconnect();
    cancelAnimationFrame(frame);
    renderer.dispose();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
  }, { once: true });
}
