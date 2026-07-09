/* =========================================================
   DIGITAL IT MOVE — 3D scene
   A single particle field that reconfigures between named
   "formations" as the visitor scrolls through each section.
   ========================================================= */

(function () {
  "use strict";

  const canvas = document.getElementById("scene");
  const isMobile = window.innerWidth < 760;
  const COUNT = isMobile ? 2600 : 5200;
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- renderer / scene / camera ----------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 13);

  // subtle ambient depth fog for atmosphere
  scene.fog = new THREE.FogExp2(0x080b14, 0.018);

  // ---------- formation generators ----------
  // Each returns a Float32Array of length COUNT*3 (x,y,z) in a
  // shared world-space scale roughly [-9,9] on x, [-5,5] on y.

  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }
  const rnd = seededRandom(1337);

  function fmtGenesis() {
    // loose spherical nebula cloud - "attention, scattered"
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 5.5 * Math.pow(rnd(), 0.5) + rnd() * 2.5;
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 2;
    }
    return arr;
  }

  function fmtAscend() {
    // rising arc / trajectory - "growth curve"
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = rnd();
      const x = (t - 0.5) * 18;
      const baseY = Math.pow(t + 0.15, 1.6) * 6 - 2.6;
      const spread = 0.9 + t * 1.6;
      const jitterY = (rnd() - 0.5) * spread;
      const jitterZ = (rnd() - 0.5) * spread * 2.2;
      arr[i * 3] = x + (rnd() - 0.5) * 0.6;
      arr[i * 3 + 1] = baseY + jitterY;
      arr[i * 3 + 2] = jitterZ - 1.5;
    }
    return arr;
  }

  function fmtGrid() {
    // structured grid of "bars" - services / capability matrix
    const arr = new Float32Array(COUNT * 3);
    const cols = 22;
    const rows = 12;
    for (let i = 0; i < COUNT; i++) {
      const cellIndex = i % (cols * rows);
      const col = cellIndex % cols;
      const row = Math.floor(cellIndex / cols);
      const cx = (col / (cols - 1) - 0.5) * 16;
      const cz = (row / (rows - 1) - 0.5) * 8;
      const barHeight = (Math.sin(col * 0.7) * 0.5 + Math.cos(row * 0.9) * 0.5 + 1) * 2.2;
      const yInBar = rnd() * barHeight - 2.2;
      arr[i * 3] = cx + (rnd() - 0.5) * 0.15;
      arr[i * 3 + 1] = yInBar;
      arr[i * 3 + 2] = cz - 1.5 + (rnd() - 0.5) * 0.15;
    }
    return arr;
  }

  function fmtFunnel() {
    // converging funnel - "proof, work, conversion"
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = rnd();
      const y = (t - 0.5) * 11;
      const radius = 0.4 + (1 - (t + 0.5)) * 5.2;
      const theta = rnd() * Math.PI * 2;
      const rr = radius * Math.sqrt(rnd());
      arr[i * 3] = Math.cos(theta) * rr;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * rr - 2;
    }
    return arr;
  }

  function fmtPath() {
    // a stepped ascending path - "process, one route in"
    const arr = new Float32Array(COUNT * 3);
    const steps = 4;
    for (let i = 0; i < COUNT; i++) {
      const step = i % steps;
      const withinStep = rnd();
      const x = (step / (steps - 1) - 0.5) * 15 + (withinStep - 0.5) * 3;
      const y = step * 1.9 - 3 + (rnd() - 0.5) * 0.8;
      const z = (rnd() - 0.5) * 4 - 1.5;
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }

  function fmtConverge() {
    // tight coherent sphere - "one number everyone agreed on"
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 3.2 * Math.pow(rnd(), 0.33);
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    return arr;
  }

  const FORMATIONS = {
    genesis: fmtGenesis(),
    ascend: fmtAscend(),
    grid: fmtGrid(),
    funnel: fmtFunnel(),
    path: fmtPath(),
    converge: fmtConverge(),
  };

  // ---------- geometry / material ----------
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(FORMATIONS.genesis); // current rendered positions
  const startPositions = new Float32Array(FORMATIONS.genesis); // morph start
  const targetPositions = new Float32Array(FORMATIONS.genesis); // morph end
  const colorSeed = new Float32Array(COUNT); // per-particle color mix seed
  const sizeSeed = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    colorSeed[i] = rnd();
    sizeSeed[i] = rnd();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColorSeed", new THREE.BufferAttribute(colorSeed, 1));
  geometry.setAttribute("aSizeSeed", new THREE.BufferAttribute(sizeSeed, 1));

  const colorSignal = new THREE.Color(0x4c6ef5);
  const colorEmber = new THREE.Color(0xff6b4a);
  const colorPaper = new THREE.Color(0xf3f4f1);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uTime: { value: 0 },
      uColorSignal: { value: colorSignal },
      uColorEmber: { value: colorEmber },
      uColorPaper: { value: colorPaper },
      uOpacity: { value: 0.92 },
    },
    vertexShader: `
      attribute float aColorSeed;
      attribute float aSizeSeed;
      uniform float uPixelRatio;
      uniform float uTime;
      varying float vColorSeed;
      varying float vAlpha;

      void main(){
        vColorSeed = aColorSeed;
        vec3 pos = position;

        // gentle ambient drift so the field never looks static
        pos.x += sin(uTime * 0.15 + aColorSeed * 62.0) * 0.06;
        pos.y += cos(uTime * 0.18 + aColorSeed * 41.0) * 0.06;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        float dist = -mvPosition.z;
        float size = (1.4 + aSizeSeed * 2.2);
        gl_PointSize = size * uPixelRatio * (60.0 / dist);
        vAlpha = smoothstep(28.0, 6.0, dist);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColorSignal;
      uniform vec3 uColorEmber;
      uniform vec3 uColorPaper;
      uniform float uOpacity;
      varying float vColorSeed;
      varying float vAlpha;

      void main(){
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, d);
        glow = pow(glow, 1.6);

        vec3 col;
        if (vColorSeed < 0.72) {
          col = mix(uColorSignal, uColorPaper, vColorSeed / 0.72 * 0.35);
        } else if (vColorSeed < 0.92) {
          col = uColorPaper;
        } else {
          col = uColorEmber;
        }

        gl_FragColor = vec4(col, glow * uOpacity * vAlpha);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ---------- scroll-driven state ----------
  const sectionEls = Array.from(document.querySelectorAll("[data-scene]"));
  let scrollProgress = 0; // 0..1 across whole doc
  let morphT = 1; // 1 = fully arrived at target
  let mouseX = 0,
    mouseY = 0;
  let targetRotX = 0,
    targetRotY = 0;

  function getScrollFormation() {
    // Determine which section is most in view, map to its data-scene name
    const scrollY = window.scrollY + window.innerHeight * 0.5;
    let active = sectionEls[0];
    for (const el of sectionEls) {
      if (el.offsetTop <= scrollY) active = el;
    }
    return active ? active.getAttribute("data-scene") : "genesis";
  }

  function setTargetFormation(name) {
    const arr = FORMATIONS[name];
    if (!arr) return;
    startPositions.set(positions);
    targetPositions.set(arr);
    morphT = 0;
  }

  let lastFormation = "genesis";
  function updateFormationFromScroll() {
    const name = getScrollFormation();
    if (name !== lastFormation) {
      lastFormation = name;
      setTargetFormation(name);
    }
  }

  window.addEventListener("scroll", () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    scrollProgress = max > 0 ? window.scrollY / max : 0;
    updateFormationFromScroll();
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---------- resize ----------
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
  }
  window.addEventListener("resize", onResize);

  // ---------- easing ----------
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ---------- animation loop ----------
  const clock = new THREE.Clock();
  const MORPH_DURATION = REDUCED_MOTION ? 0.001 : 1.6; // seconds

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed;

    // advance morph
    if (morphT < 1) {
      morphT = Math.min(1, morphT + dt / MORPH_DURATION);
      const e = easeInOutCubic(morphT);
      for (let i = 0; i < positions.length; i++) {
        positions[i] = startPositions[i] + (targetPositions[i] - startPositions[i]) * e;
      }
      geometry.attributes.position.needsUpdate = true;
    }

    if (!REDUCED_MOTION) {
      // gentle whole-field rotation + parallax toward cursor
      targetRotY = mouseX * 0.18;
      targetRotX = mouseY * 0.1;
      points.rotation.y += (targetRotY - points.rotation.y) * 0.03;
      points.rotation.x += (-targetRotX - points.rotation.x) * 0.03;

      // slow autonomous drift
      points.rotation.y += 0.0006;

      // camera very subtle dolly with scroll for depth feel
      camera.position.z = 13 - scrollProgress * 1.6;
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.02;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }

  // kick off first formation target (genesis is already the base, so just render)
  updateFormationFromScroll();
  animate();

  // expose for main.js if needed
  window.__scene = { renderer, scene, camera };
})();
