const stripTrack = document.getElementById("icon-strip-track");
const batsLayer = document.getElementById("bats-layer");
const fogLayer = document.getElementById("fog-layer");
const backgroundBatsLayer = document.getElementById("background-bats-layer");
const batTransition = document.getElementById("bat-transition");
const transitionBatsBack = document.getElementById("transition-bats-back");
const transitionBatsMid = document.getElementById("transition-bats-mid");
const transitionBatsFront = document.getElementById("transition-bats-front");
const hero = document.querySelector(".hero");
const countdown = document.getElementById("countdown");
const particlesLayer = document.getElementById("particles-layer");

const batVariants = ["bat-wing-1", "bat-wing-2", "bat-wing-3"];
const logoSrc = "batmanlogo1.png";
let transitionTimer = null;

function createSvgUse(symbolId, className = "") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  if (className) svg.setAttribute("class", className);
  use.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${symbolId}`);
  use.setAttribute("href", `#${symbolId}`);
  svg.setAttribute("viewBox", symbolId === "bat-emblem" ? "0 0 100 60" : "0 0 120 64");
  svg.appendChild(use);

  return svg;
}

function buildIconStrip() {
  if (!stripTrack) return;

  const createStripItems = () => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 36; i += 1) {
      const badge = document.createElement("span");
      const logo = document.createElement("img");

      badge.className = "icon-badge";
      logo.src = logoSrc;
      logo.alt = "";
      badge.appendChild(logo);
      fragment.appendChild(badge);
    }

    return fragment;
  };

  stripTrack.appendChild(createStripItems());
  stripTrack.appendChild(createStripItems());
}

function buildFog() {
  if (!fogLayer) return;

  fogLayer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 20; i += 1) {
    const fog = document.createElement("span");
    const size = 240 + Math.random() * 460;
    const top = 10 + Math.random() * 78;
    const left = -18 + Math.random() * 116;
    const duration = 26 + Math.random() * 34;
    const delay = Math.random() * -24;
    const opacity = (0.12 + Math.random() * 0.2).toFixed(2);

    fog.className = "fog";
    fog.style.width = `${size}px`;
    fog.style.height = `${size * (0.2 + Math.random() * 0.18)}px`;
    fog.style.top = `${top}%`;
    fog.style.left = `${left}%`;
    fog.style.animationDuration = `${duration}s`;
    fog.style.animationDelay = `${delay}s`;
    fog.style.setProperty("--fog-opacity", opacity);

    fragment.appendChild(fog);
  }

  fogLayer.appendChild(fragment);
}

function buildBackgroundBats() {
  if (!backgroundBatsLayer) return;

  backgroundBatsLayer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const placements = [
    { width: 340, top: 6, left: -3, duration: 52, delay: -14, opacity: 0.055, scale: 1.04, blur: "6px", driftX: "12px", driftY: "-8px" },
    { width: 190, top: 14, left: 83, duration: 44, delay: -10, opacity: 0.072, scale: 0.94, blur: "3.8px", driftX: "-10px", driftY: "6px" },
    { width: 260, top: 34, left: 2, duration: 48, delay: -20, opacity: 0.065, scale: 0.98, blur: "4.8px", driftX: "9px", driftY: "-5px" },
    { width: 150, top: 41, left: 86, duration: 38, delay: -16, opacity: 0.09, scale: 0.9, blur: "2.4px", driftX: "-8px", driftY: "7px" },
    { width: 230, top: 62, left: 70, duration: 46, delay: -22, opacity: 0.07, scale: 0.96, blur: "4.2px", driftX: "8px", driftY: "-6px" },
    { width: 170, top: 70, left: 14, duration: 40, delay: -8, opacity: 0.082, scale: 0.88, blur: "2.8px", driftX: "-6px", driftY: "5px" },
    { width: 280, top: 78, left: 42, duration: 54, delay: -26, opacity: 0.05, scale: 1.02, blur: "6.5px", driftX: "10px", driftY: "-4px" },
    { width: 210, top: 22, left: 18, duration: 58, delay: -30, opacity: 0.058, scale: 0.93, blur: "5.2px", driftX: "-7px", driftY: "4px" },
    { width: 130, top: 58, left: 4, duration: 36, delay: -11, opacity: 0.095, scale: 0.86, blur: "2px", driftX: "6px", driftY: "-5px" },
    { width: 240, top: 82, left: 82, duration: 50, delay: -19, opacity: 0.052, scale: 1, blur: "5.8px", driftX: "-9px", driftY: "-3px" }
  ];

  placements.forEach((placement) => {
    const bat = document.createElement("span");
    const img = document.createElement("img");

    bat.className = "background-bat";
    bat.style.width = `${placement.width}px`;
    bat.style.top = `${placement.top}%`;
    bat.style.left = `${placement.left}%`;
    bat.style.animationDuration = `${placement.duration}s`;
    bat.style.animationDelay = `${placement.delay}s`;
    bat.style.setProperty("--bg-bat-opacity", String(placement.opacity));
    bat.style.setProperty("--bg-bat-scale", String(placement.scale));
    bat.style.setProperty("--bg-bat-blur", placement.blur);
    bat.style.setProperty("--bg-bat-drift-x", placement.driftX);
    bat.style.setProperty("--bg-bat-drift-y", placement.driftY);

    img.src = logoSrc;
    img.alt = "";
    bat.appendChild(img);
    fragment.appendChild(bat);
  });

  backgroundBatsLayer.appendChild(fragment);
}

function buildParticles() {
  if (!particlesLayer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 30; i += 1) {
    const particle = document.createElement("span");
    const size = `${1 + Math.random() * 3.5}px`;
    const left = `${Math.random() * 100}%`;
    const top = `${42 + Math.random() * 52}%`;
    const duration = `${7 + Math.random() * 9}s`;
    const delay = `${Math.random() * -8}s`;
    const opacity = (0.18 + Math.random() * 0.44).toFixed(2);
    const drift = `${-18 + Math.random() * 36}px`;

    particle.className = "particle";
    particle.style.left = left;
    particle.style.top = top;
    particle.style.animationDuration = duration;
    particle.style.animationDelay = delay;
    particle.style.setProperty("--particle-size", size);
    particle.style.setProperty("--particle-opacity", opacity);
    particle.style.setProperty("--particle-drift-x", drift);

    fragment.appendChild(particle);
  }

  particlesLayer.appendChild(fragment);
}

function clearTransitionBats() {
  [transitionBatsBack, transitionBatsMid, transitionBatsFront].forEach((layer) => {
    if (layer) layer.innerHTML = "";
  });
}

function createTransitionBat(depth, variant, index) {
  const bat = document.createElement("span");
  const inner = document.createElement("span");
  const symbolId = batVariants[(index + Math.floor(Math.random() * batVariants.length)) % batVariants.length];
  const direction = Math.random() > 0.24 ? 1 : -1;

  let width;
  let durationMin;
  let durationMax;
  let delayMax;
  let opacityMin;
  let opacityMax;
  let blur;

  if (depth === "front") {
    width = 180 + Math.random() * 260;
    durationMin = 620;
    durationMax = variant === "lite" ? 820 : 980;
    delayMax = variant === "lite" ? 120 : 220;
    opacityMin = 0.78;
    opacityMax = 0.98;
    blur = `${3 + Math.random() * 5}px`;
  } else if (depth === "mid") {
    width = 76 + Math.random() * 150;
    durationMin = 760;
    durationMax = variant === "lite" ? 940 : 1120;
    delayMax = variant === "lite" ? 180 : 300;
    opacityMin = 0.5;
    opacityMax = 0.82;
    blur = "0px";
  } else {
    width = 30 + Math.random() * 82;
    durationMin = 900;
    durationMax = variant === "lite" ? 1100 : 1260;
    delayMax = variant === "lite" ? 180 : 320;
    opacityMin = 0.22;
    opacityMax = 0.46;
    blur = "0px";
  }

  const startY = 6 + Math.random() * 92;
  const arcShiftY = -22 + Math.random() * 30;
  const endShiftY = -34 + Math.random() * 54;
  const startX = direction === 1 ? `${-26 - Math.random() * 22}vw` : `${102 + Math.random() * 14}vw`;
  const arcX = `${18 + Math.random() * 60}vw`;
  const endX = direction === 1 ? `${104 + Math.random() * 18}vw` : `${-24 - Math.random() * 18}vw`;
  const arcY = `${startY + arcShiftY}vh`;
  const endY = `${startY + endShiftY}vh`;
  const rotateStart = `${-28 + Math.random() * 56}deg`;
  const rotateMid = `${-18 + Math.random() * 36}deg`;
  const rotateEnd = `${-24 + Math.random() * 52}deg`;
  const batScale = (0.86 + Math.random() * 0.64).toFixed(2);
  const batScaleEnd = (Number(batScale) * (1.04 + Math.random() * 0.14)).toFixed(2);
  const batOpacity = (opacityMin + Math.random() * (opacityMax - opacityMin)).toFixed(2);
  const travelDuration = durationMin + Math.random() * (durationMax - durationMin);
  const flutterDuration = 120 + Math.random() * 120;
  const flutterRotate = `${-5 + Math.random() * 10}deg`;

  bat.className = `transition-bat transition-bat--${depth}`;
  bat.style.width = `${width}px`;
  bat.style.animationDelay = `${Math.random() * delayMax}ms`;
  bat.style.setProperty("--start-x", startX);
  bat.style.setProperty("--start-y", `${startY}vh`);
  bat.style.setProperty("--arc-x", arcX);
  bat.style.setProperty("--arc-y", arcY);
  bat.style.setProperty("--end-x", endX);
  bat.style.setProperty("--end-y", endY);
  bat.style.setProperty("--bat-scale", batScale);
  bat.style.setProperty("--bat-scale-end", batScaleEnd);
  bat.style.setProperty("--bat-opacity", batOpacity);
  bat.style.setProperty("--rotate-start", rotateStart);
  bat.style.setProperty("--rotate-mid", rotateMid);
  bat.style.setProperty("--rotate-end", rotateEnd);
  bat.style.setProperty("--travel-duration", `${travelDuration}ms`);
  bat.style.setProperty("--lens-blur", blur);

  inner.className = "transition-bat__inner";
  inner.style.setProperty("--flutter-rotate", flutterRotate);
  inner.style.setProperty("--flutter-duration", `${flutterDuration}ms`);
  inner.appendChild(createSvgUse(symbolId));
  bat.appendChild(inner);

  return bat;
}

function buildTransitionBats(variant = "full") {
  const layers = {
    back: transitionBatsBack,
    mid: transitionBatsMid,
    front: transitionBatsFront
  };

  if (!layers.back || !layers.mid || !layers.front) return;

  clearTransitionBats();

  const counts = variant === "lite"
    ? { back: 12, mid: 10, front: 5 }
    : { back: 24, mid: 22, front: 12 };

  Object.entries(counts).forEach(([depth, count]) => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      fragment.appendChild(createTransitionBat(depth, variant, i));
    }

    layers[depth].appendChild(fragment);
  });
}

function setupTransitionLinks() {
  const links = document.querySelectorAll("a[href]");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href === "#" || !batTransition || batTransition.classList.contains("is-active")) {
        return;
      }

      event.preventDefault();
      const isSectionJump = href.startsWith("#");
      const variant = isSectionJump ? "lite" : "full";
      const switchDelay = isSectionJump ? 360 : 760;
      const clearDelay = isSectionJump ? 920 : 1400;

      clearTimeout(transitionTimer);
      buildTransitionBats(variant);
      batTransition.classList.remove("bat-transition--lite", "bat-transition--full");
      batTransition.classList.add("is-active", variant === "lite" ? "bat-transition--lite" : "bat-transition--full");

      transitionTimer = window.setTimeout(() => {
        if (isSectionJump) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }

          window.setTimeout(() => {
            batTransition.classList.remove("is-active", "bat-transition--lite", "bat-transition--full");
            clearTransitionBats();
          }, clearDelay - switchDelay);
        } else {
          window.location.href = href;
        }
      }, switchDelay);
    });
  });
}

function startCountdown() {
  if (!countdown) return;

  const releaseDate = countdown.dataset.releaseDate;
  if (!releaseDate) return;

  const target = new Date(releaseDate).getTime();
  const daysEl = countdown.querySelector('[data-unit="days"]');
  const hoursEl = countdown.querySelector('[data-unit="hours"]');
  const minutesEl = countdown.querySelector('[data-unit="minutes"]');
  const secondsEl = countdown.querySelector('[data-unit="seconds"]');

  const update = () => {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(3, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  update();
  window.setInterval(update, 1000);
}

function bindPointerAtmosphere() {
  if (!hero) return;

  hero.addEventListener("pointermove", (event) => {
    const { clientX, clientY } = event;
    const x = clientX / window.innerWidth - 0.5;
    const y = clientY / window.innerHeight - 0.5;

    hero.style.setProperty("--moon-shift-x", `${x * 18}px`);
    hero.style.setProperty("--moon-shift-y", `${y * 14}px`);
    hero.style.setProperty("--title-shift-x", `${x * 14}px`);
    hero.style.setProperty("--title-shift-y", `${y * 10}px`);
    hero.style.setProperty("--character-shift-x", `${x * 10}px`);
    hero.style.setProperty("--character-shift-y", `${y * 12}px`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--moon-shift-x", "0px");
    hero.style.setProperty("--moon-shift-y", "0px");
    hero.style.setProperty("--title-shift-x", "0px");
    hero.style.setProperty("--title-shift-y", "0px");
    hero.style.setProperty("--character-shift-x", "0px");
    hero.style.setProperty("--character-shift-y", "0px");
  });
}

function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

buildIconStrip();
buildFog();
buildBackgroundBats();
buildParticles();
setupTransitionLinks();
startCountdown();
bindPointerAtmosphere();
setupRevealOnScroll();
