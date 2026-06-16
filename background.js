(function () {
  const canvas = document.getElementById("orbit-bg");
  const ctx = canvas.getContext("2d");

  const BG_COLOR = "#100d0b";
  const DOT_COLOR = "rgba(230, 237, 243, 0.5)";

  // Each orbit: radius (px), angular speed (radians/frame), starting phase (radians), dot size (px)
  const orbits = [
    { radius: 60, speed: 0.022, phase: 0, size: 2.5 },
    { radius: 95, speed: -0.015, phase: 1.4, size: 2 },
    { radius: 130, speed: 0.009, phase: 3.1, size: 3 },
    { radius: 170, speed: -0.0065, phase: 4.7, size: 1.8 },
  ];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let offsetX = 0;
  let offsetY = 0;
  const PARALLAX_STRENGTH = 0.03; // fraction of cursor distance-from-center used as target offset
  const PARALLAX_EASE = 0.05; // lerp factor per frame toward target offset

  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  let width = 0;
  let height = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function drawDot(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = DOT_COLOR;
    ctx.shadowColor = DOT_COLOR;
    ctx.shadowBlur = 5;
    ctx.fill();
  }

  const TRAIL_FADE_ALPHA = 0.32;

  function renderFrame() {
    // Paint a low-alpha rect over the previous frame instead of clearing,
    // which leaves short fading trails behind each dot. Shadow must be off
    // here, otherwise drawDot's leftover glow tints the whole rect grey.
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(16, 13, 11, ${TRAIL_FADE_ALPHA})`;
    ctx.fillRect(0, 0, width, height);

    const baseCx = width / 2;
    const baseCy = height / 2;

    const targetOffsetX = (mouseX - baseCx) * PARALLAX_STRENGTH;
    const targetOffsetY = (mouseY - baseCy) * PARALLAX_STRENGTH;
    offsetX += (targetOffsetX - offsetX) * PARALLAX_EASE;
    offsetY += (targetOffsetY - offsetY) * PARALLAX_EASE;

    const cx = baseCx + offsetX;
    const cy = baseCy + offsetY;

    for (const orbit of orbits) {
      orbit.phase += orbit.speed;
      const x = cx + orbit.radius * Math.cos(orbit.phase);
      const y = cy + orbit.radius * Math.sin(orbit.phase);
      drawDot(x, y, orbit.size);
    }
  }

  function tick() {
    renderFrame();
    requestAnimationFrame(tick);
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.addEventListener("resize", resize);
  resize();
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);

  if (prefersReducedMotion) {
    // Draw the dots once at their initial phase, no animation loop,
    // no mousemove listener.
    const cx = width / 2;
    const cy = height / 2;
    for (const orbit of orbits) {
      const x = cx + orbit.radius * Math.cos(orbit.phase);
      const y = cy + orbit.radius * Math.sin(orbit.phase);
      drawDot(x, y, orbit.size);
    }
  } else {
    window.addEventListener("mousemove", handleMouseMove);
    tick();
  }
})();
