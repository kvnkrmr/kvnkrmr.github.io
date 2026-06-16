(function () {
  const canvas = document.getElementById("orbit-bg");
  const ctx = canvas.getContext("2d");

  const BG_COLOR = "#100d0b";
  const DOT_COLOR = "rgba(230, 237, 243, 0.5)";
  const TRAIL_FADE_ALPHA = 0.32;

  // --- Simulation tunables -------------------------------------------------
  const BODY_COUNT = 6;
  const G = 60;            // gravitational constant (tuning scalar)
  const BODY_MASS = 1;     // mass of each simulated body
  const CURSOR_MASS = 40;  // mass of the cursor gravity well (heavier than a body)
  const EPSILON = 24;      // force-softening distance (px); caps force at close range
  const DT = 0.35;         // integration timestep per frame
  const ESCAPE_MARGIN = 1.5; // body counts as escaped past this multiple of half-viewport
  const DOT_SIZE = 2.4;    // radius of each body's dot (equal mass -> equal size)
  const SPAWN_SPREAD = 0.18; // central seeding region as a fraction of viewport size
  const SPAWN_SPEED = 6;     // magnitude scale for random initial velocities

  let width = 0;
  let height = 0;

  // Cursor gravity well: active only while the pointer is over the window.
  let cursorActive = false;
  let cursorX = 0;
  let cursorY = 0;

  // Array of bodies, each { x, y, vx, vy }.
  let bodies = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  // Seed all bodies in a central region with small random velocities, then
  // remove net momentum so the whole cloud doesn't drift off-screen as a group.
  function seedBodies() {
    const cx = width / 2;
    const cy = height / 2;
    const spreadX = width * SPAWN_SPREAD;
    const spreadY = height * SPAWN_SPREAD;

    bodies = [];
    for (let i = 0; i < BODY_COUNT; i++) {
      bodies.push({
        x: cx + (Math.random() - 0.5) * 2 * spreadX,
        y: cy + (Math.random() - 0.5) * 2 * spreadY,
        vx: (Math.random() - 0.5) * 2 * SPAWN_SPEED,
        vy: (Math.random() - 0.5) * 2 * SPAWN_SPEED,
      });
    }

    let meanVx = 0;
    let meanVy = 0;
    for (const b of bodies) {
      meanVx += b.vx;
      meanVy += b.vy;
    }
    meanVx /= bodies.length;
    meanVy /= bodies.length;
    for (const b of bodies) {
      b.vx -= meanVx;
      b.vy -= meanVy;
    }
  }

  // One physics step: accumulate softened gravitational accelerations from every
  // other body (and the cursor well, if active), then integrate (semi-implicit Euler).
  function stepSimulation() {
    const ax = new Array(bodies.length).fill(0);
    const ay = new Array(bodies.length).fill(0);

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const dx = bodies[j].x - bodies[i].x;
        const dy = bodies[j].y - bodies[i].y;
        const distSq = dx * dx + dy * dy + EPSILON * EPSILON;
        const dist = Math.sqrt(distSq);
        // a = G * m / (r^2 + eps^2), split into x/y components via (dx/dist).
        const fOverDist = (G * BODY_MASS) / (distSq * dist);
        ax[i] += fOverDist * dx * BODY_MASS;
        ay[i] += fOverDist * dy * BODY_MASS;
        ax[j] -= fOverDist * dx * BODY_MASS;
        ay[j] -= fOverDist * dy * BODY_MASS;
      }
    }

    if (cursorActive) {
      for (let i = 0; i < bodies.length; i++) {
        const dx = cursorX - bodies[i].x;
        const dy = cursorY - bodies[i].y;
        const distSq = dx * dx + dy * dy + EPSILON * EPSILON;
        const dist = Math.sqrt(distSq);
        const fOverDist = (G * CURSOR_MASS) / (distSq * dist);
        ax[i] += fOverDist * dx;
        ay[i] += fOverDist * dy;
      }
    }

    for (let i = 0; i < bodies.length; i++) {
      bodies[i].vx += ax[i] * DT;
      bodies[i].vy += ay[i] * DT;
      bodies[i].x += bodies[i].vx * DT;
      bodies[i].y += bodies[i].vy * DT;
    }
  }

  function isEscaped(b) {
    return (
      Math.abs(b.x - width / 2) > width * ESCAPE_MARGIN ||
      Math.abs(b.y - height / 2) > height * ESCAPE_MARGIN
    );
  }

  function onScreenCount() {
    let n = 0;
    for (const b of bodies) {
      if (!isEscaped(b)) n++;
    }
    return n;
  }

  function drawDot(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = DOT_COLOR;
    ctx.shadowColor = DOT_COLOR;
    ctx.shadowBlur = 5;
    ctx.fill();
  }

  function renderFrame() {
    // Paint a low-alpha rect over the previous frame instead of clearing,
    // which leaves short fading trails behind each dot. Shadow must be off
    // here, otherwise drawDot's leftover glow tints the whole rect grey.
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(16, 13, 11, ${TRAIL_FADE_ALPHA})`;
    ctx.fillRect(0, 0, width, height);

    stepSimulation();

    // Re-seed the whole system once all but one body have escaped.
    if (onScreenCount() <= 1) {
      seedBodies();
    }

    for (const b of bodies) {
      drawDot(b.x, b.y, DOT_SIZE);
    }
  }

  function tick() {
    renderFrame();
    requestAnimationFrame(tick);
  }

  function handleMouseMove(event) {
    cursorActive = true;
    cursorX = event.clientX;
    cursorY = event.clientY;
  }

  function handleMouseLeave() {
    cursorActive = false;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.addEventListener("resize", resize);
  resize();
  seedBodies();
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);

  if (prefersReducedMotion) {
    // Draw the seeded configuration once, no animation loop, no cursor well.
    for (const b of bodies) {
      drawDot(b.x, b.y, DOT_SIZE);
    }
  } else {
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    tick();
  }
})();
