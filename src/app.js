(() => {
  const scene = document.getElementById("scene");
  const duckLayer = document.getElementById("duckLayer");
  const splashLayer = document.getElementById("splashLayer");
  const addDuckButton = document.getElementById("addDuckButton");
  const directedAddButton = document.getElementById("directedAddButton");
  const destinationMarker = document.getElementById("destinationMarker");
  const resetButton = document.getElementById("resetButton");
  const populationButtons = [...document.querySelectorAll(".population-button")];
  const scoreboardCount = document.getElementById("scoreboardCount");
  const panelDuckCount = document.getElementById("panelDuckCount");
  const liveScoreboard = document.getElementById("liveScoreboard");
  const scoreboardPanel = document.getElementById("scoreboardPanel");
  const closeScoreboard = document.getElementById("closeScoreboard");
  const status = document.getElementById("status");

  const angrySrc = "assets/duck-angry.png";
  const sadSrc = "assets/duck-sad.png";

  const ducks = new Map();
  let nextDuckId = 1;
  let activeSwimmers = 0;
  let directedAddEnabled = false;
  let directedDestination = null;

  const waterPolygon = [
    [11.5,57.0],[20.0,53.5],[31.0,51.5],[44.0,50.7],
    [59.0,51.0],[73.0,52.0],[84.5,54.5],[91.0,58.5],
    [93.5,63.0],[92.0,67.5],[88.0,72.0],[81.5,76.5],
    [73.0,81.0],[62.0,85.0],[50.5,87.5],[39.0,86.8],
    [30.0,84.0],[22.5,80.5],[16.5,75.5],[12.5,69.5],
    [10.0,63.0]
  ];

  // Tight physical footprint used while ducks are travelling.
  // Ducks can route around the end and pass behind the pier.
  // Pier keep-out boxes tuned from the user's purple markup.
  // These represent only the timber mass that should block duck centres:
  // 1) the long front deck/fascia strip
  // 2) the top-right corner cap
  // 3) the right-side front/end face
  const pierExclusionBoxes = [
    { minX: -0.8, maxX: 30.8, minY: 66.2, maxY: 75.2 },
    { minX: 28.8, maxX: 35.6, minY: 61.4, maxY: 67.6 },
    { minX: 31.0, maxX: 35.8, minY: 67.0, maxY: 74.8 }
  ];

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function updateCounts() {
    const count = ducks.size;
    scoreboardCount.textContent = String(count);
    panelDuckCount.textContent = String(count);
  }

  function maxActiveSwimmers() {
    return Math.max(4, Math.min(10, Math.round(ducks.size * .15)));
  }

  function pctX(value) {
    return scene.clientWidth * value / 100;
  }

  function pctY(value) {
    return scene.clientHeight * value / 100;
  }

  function scaleForY(y) {
    const clamped = Math.max(51, Math.min(89, y));
    const t = (clamped - 51) / 38;
    return .45 + t * .43;
  }

  function duckBaseSize() {
    return Math.max(56, Math.min(110, scene.clientWidth * .078));
  }

  function applyDuckSize(duck) {
    const variant = Number(duck.dataset.sizeVariant || "0");
    duck.style.setProperty("--duck-size", `${Math.round(duckBaseSize() + variant * 4)}px`);
  }

  function syncDuckSizes() {
    ducks.forEach(duck => applyDuckSize(duck));
  }

  function isInFrontOfPier(x, y) {
    // Main front edge of the pier.
    if (x <= 31.0 && y >= 75.0) return true;

    // Sloping/right-end edge of the pier.
    if (x > 31.0 && x <= 36.5) {
      const t = (x - 31.0) / 5.5;
      const frontEdgeY = 69.0 + t * 6.0;
      return y >= frontEdgeY;
    }

    return false;
  }

  function setDepth(duck, y, movement = null) {
    duck.style.setProperty("--duck-scale", scaleForY(y).toFixed(3));

    const x = movement?.x ?? Number(duck.dataset.x || "0");
    let frontOfPier = isInFrontOfPier(x, y);
    let z = 100 + Math.round(y * 10);

    if (movement?.pierDepthState === "behind") {
      frontOfPier = false;
      z = Math.min(z, 870);
    } else if (movement?.pierDepthState === "front") {
      frontOfPier = true;
      z = Math.max(z, 900);
    } else if (frontOfPier) {
      z = Math.max(z, 900);
    }

    duck.style.zIndex = String(z);
  }

  function pointInPolygon(x, y, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersects =
        ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || .000001) + xi);

      if (intersects) inside = !inside;
    }

    return inside;
  }

  function pointInBox(x, y, box) {
    return (
      x >= box.minX &&
      x <= box.maxX &&
      y >= box.minY &&
      y <= box.maxY
    );
  }

  function inPier(x, y) {
    return pierExclusionBoxes.some(box => pointInBox(x, y, box));
  }

  function inWater(x, y) {
    return pointInPolygon(x, y, waterPolygon) && !inPier(x, y);
  }

  function underPierRestLineY(x) {
    // Expanded diagonal based on the marked under-pier keep-out area.
    // It begins farther left and sits higher than the v0.29 line.
    const minX = 7.5;
    const maxX = 35.5;
    const leftY = 76.8;
    const rightY = 71.5;
    const clampedX = Math.max(minX, Math.min(maxX, x));
    const t = (clampedX - minX) / (maxX - minX);
    return leftY + (rightY - leftY) * t;
  }

  function inUnderPierRestExclusion(x, y) {
    if (x < 7.5 || x > 35.5) return false;

    // A small clearance margin accounts for the duck body extending around
    // its centre anchor rather than treating the anchor as the whole sprite.
    const bodyClearance = 1.2;
    return y >= underPierRestLineY(x) - bodyClearance;
  }

  function canDuckStopAt(x, y) {
    return (
      Number.isFinite(x) &&
      Number.isFinite(y) &&
      inWater(x, y) &&
      !inUnderPierRestExclusion(x, y)
    );
  }

  function validRestingPoint(x, y) {
    return canDuckStopAt(x, y);
  }

  function nearestValidStoppingPoint(point) {
    if (canDuckStopAt(point.x, point.y)) return point;

    for (let radius = 0.6; radius <= 18; radius += 0.6) {
      const samples = Math.max(16, Math.round(radius * 7));

      for (let i = 0; i < samples; i++) {
        const angle = (i / samples) * Math.PI * 2;
        const candidate = {
          x: point.x + Math.cos(angle) * radius,
          y: point.y + Math.sin(angle) * radius
        };

        if (canDuckStopAt(candidate.x, candidate.y)) return candidate;
      }
    }

    return { x: 55, y: 70 };
  }

  function segmentClear(from, to) {
    const steps = Math.max(12, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) * 1.6));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;
      if (!inWater(x, y)) return false;
    }

    return true;
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function randomWaterPoint() {
    for (let i = 0; i < 500; i++) {
      const point = {
        x: 11 + Math.random() * 82,
        y: 51 + Math.random() * 37
      };

      if (canDuckStopAt(point.x, point.y)) return point;
    }

    return nearestValidStoppingPoint({ x: 55, y: 70 });
  }

  function distributedPoint(excludeDuck = null) {
    let best = randomWaterPoint();
    let bestDistance = -1;

    for (let attempt = 0; attempt < 35; attempt++) {
      const candidate = randomWaterPoint();
      let nearest = Infinity;

      for (const duck of ducks.values()) {
        if (duck === excludeDuck || !duck.dataset.x) continue;
        const other = { x: Number(duck.dataset.x), y: Number(duck.dataset.y) };
        nearest = Math.min(nearest, distance(candidate, other));
      }

      if (nearest > bestDistance) {
        best = candidate;
        bestDistance = nearest;
      }
    }

    return nearestValidStoppingPoint(best);
  }

  function nearbyPoint(current) {
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 7;
      const candidate = {
        x: current.x + Math.cos(angle) * radius,
        y: current.y + Math.sin(angle) * radius * .55
      };

      if (canDuckStopAt(candidate.x, candidate.y) && segmentClear(current, candidate)) {
        return candidate;
      }
    }

    return current;
  }

  function createSplash(x, y) {
    const splash = document.createElement("div");
    splash.className = "splash";
    splash.style.left = `${x - 43}px`;
    splash.style.top = `${y - 15}px`;
    splashLayer.appendChild(splash);
    splash.addEventListener("animationend", () => splash.remove(), { once: true });
  }

  function currentPosition(duck) {
    return { x: Number(duck.dataset.x), y: Number(duck.dataset.y) };
  }

  function animateMove(duck, from, to, duration) {
    const safeTo = nearestValidStoppingPoint(to);

    return new Promise(resolve => {
      const start = performance.now();
      const fromFront = isInFrontOfPier(from.x, from.y);
      const toFront = isInFrontOfPier(safeTo.x, safeTo.y);
      const crossingPier = fromFront !== toFront;
      const dx = safeTo.x - from.x;
      const dy = safeTo.y - from.y;
      const transitionLead = 0.18;

      let pierDepthState = fromFront ? "front" : "behind";
      let transitionLatched = !crossingPier;

      function frame(now) {
        if (!duck.isConnected) {
          resolve();
          return;
        }

        const raw = Math.min(1, (now - start) / duration);
        const eased = raw < .5
          ? 2 * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 2) / 2;

        const x = from.x + dx * eased;
        const y = from.y + dy * eased;

        if (crossingPier && !transitionLatched) {
          if (fromFront && !toFront) {
            // Front -> behind: look ahead and latch behind once the projected
            // anchor crosses the pier edge. It then remains behind for the
            // rest of this move.
            const projectedFront = isInFrontOfPier(
              x + dx * transitionLead,
              y + dy * transitionLead
            );

            if (!projectedFront) {
              pierDepthState = "behind";
              transitionLatched = true;
            }
          } else if (!fromFront && toFront) {
            // Behind -> front: look behind and latch front only after the
            // trailing part of the sprite has cleared the pier edge.
            const trailingFront = isInFrontOfPier(
              x - dx * transitionLead,
              y - dy * transitionLead
            );

            if (trailingFront) {
              pierDepthState = "front";
              transitionLatched = true;
            }
          }
        }

        duck.style.left = `${x}%`;
        duck.style.top = `${y}%`;
        duck.dataset.x = x.toFixed(3);
        duck.dataset.y = y.toFixed(3);
        setDepth(duck, y, {
          x,
          pierDepthState
        });

        if (raw < 1) {
          duck._moveFrame = requestAnimationFrame(frame);
        } else {
          // The completed move uses the normal stationary depth rule.
          setDepth(duck, y);
          resolve();
        }
      }

      duck._moveFrame = requestAnimationFrame(frame);
    });
  }

  function scheduleRoam(duck, delay = 1000 + Math.random() * 5000) {
    clearTimeout(duck._roamTimer);

    duck._roamTimer = setTimeout(async () => {
      if (!duck.isConnected || duck.dataset.motionState !== "floating") return;

      if (activeSwimmers >= maxActiveSwimmers()) {
        scheduleRoam(duck, 800 + Math.random() * 1800);
        return;
      }

      const from = currentPosition(duck);
      const to = nearbyPoint(from);
      const duration = Math.max(3200, Math.min(6500, 2500 + distance(from, to) * 360));

      activeSwimmers++;
      duck.dataset.motionState = "swimming";
      duck.classList.remove("floating");

      await animateMove(duck, from, to, duration);

      activeSwimmers = Math.max(0, activeSwimmers - 1);
      if (!duck.isConnected) return;

      duck.dataset.motionState = "floating";
      duck.classList.add("floating");
      scheduleRoam(duck, 1200 + Math.random() * 6500);
    }, delay);
  }

  function reactToClick(duck) {
    if (!["floating", "swimming"].includes(duck.dataset.motionState)) return;
    if (duck.dataset.reacting === "true") return;

    duck.dataset.reacting = "true";
    duck.classList.add("reacting");
    const image = duck.querySelector("img");
    image.src = sadSrc;

    setTimeout(() => {
      if (!duck.isConnected) return;
      image.src = angrySrc;
      duck.classList.remove("reacting");
      duck.dataset.reacting = "false";
    }, 900);
  }

  function makeDuck({ point, instant = false }) {
    const id = nextDuckId++;
    const duck = document.createElement("button");
    duck.type = "button";
    duck.className = "duck";
    duck.dataset.motionState = instant ? "floating" : "entering";
    duck.dataset.reacting = "false";
    duck.dataset.sizeVariant = String(id % 3);
    duck.setAttribute("aria-label", `Duck ${id}`);
    applyDuckSize(duck);
    duck.style.setProperty("--bob-duration", `${4 + (id % 7) * .27}s`);

    const image = document.createElement("img");
    image.src = angrySrc;
    image.alt = "";
    duck.appendChild(image);

    duck.addEventListener("click", () => reactToClick(duck));
    duckLayer.appendChild(duck);
    ducks.set(id, duck);

    if (instant) {
      const safePoint = nearestValidStoppingPoint(point);

      duck.style.left = `${safePoint.x}%`;
      duck.style.top = `${safePoint.y}%`;
      duck.dataset.x = safePoint.x.toFixed(3);
      duck.dataset.y = safePoint.y.toFixed(3);
      setDepth(duck, safePoint.y);
      duck.classList.add("floating");
      scheduleRoam(duck, 1000 + Math.random() * 9000);
    }

    updateCounts();
    return duck;
  }

  async function animateEntry(duck, requestedDestination = null) {
    duck.style.zIndex = "2600";

    const walkY = 66.7;
    const startX = pctX(-11);
    const startY = pctY(walkY);
    const pierEndX = pctX(31);
    const pierEndY = pctY(66.3);
    const splashX = pctX(37);
    const splashY = pctY(73.6);

    duck.style.left = `${startX}px`;
    duck.style.top = `${startY}px`;
    duck.style.opacity = "1";

    const walk = duck.animate([
      { left:`${startX}px`, top:`${startY}px`, transform:"translate(-50%,-50%) rotate(-4deg) scale(.82)" },
      { left:`${pctX(-4)}px`, top:`${pctY(66.3)}px`, transform:"translate(-50%,-50%) rotate(5deg) scale(.82)" },
      { left:`${pctX(3)}px`, top:`${pctY(66.8)}px`, transform:"translate(-50%,-50%) rotate(-5deg) scale(.82)" },
      { left:`${pctX(10)}px`, top:`${pctY(66.3)}px`, transform:"translate(-50%,-50%) rotate(5deg) scale(.82)" },
      { left:`${pctX(17)}px`, top:`${pctY(66.7)}px`, transform:"translate(-50%,-50%) rotate(-4deg) scale(.82)" },
      { left:`${pctX(23.5)}px`, top:`${pctY(66.3)}px`, transform:"translate(-50%,-50%) rotate(4deg) scale(.82)" },
      { left:`${pctX(28.5)}px`, top:`${pctY(66.6)}px`, transform:"translate(-50%,-50%) rotate(-3deg) scale(.82)" },
      { left:`${pierEndX}px`, top:`${pierEndY}px`, transform:"translate(-50%,-50%) rotate(0) scale(.82)" }
    ], { duration:4600, easing:"linear", fill:"forwards" });

    await walk.finished;
    walk.cancel();

    const jump = duck.animate([
      { left:`${pierEndX}px`, top:`${pierEndY}px`, transform:"translate(-50%,-50%) rotate(0) scale(.82)", opacity:1 },
      { left:`${pctX(33.8)}px`, top:`${pctY(64.4)}px`, transform:"translate(-50%,-50%) rotate(5deg) scale(.80)", opacity:1, offset:.38 },
      { left:`${splashX}px`, top:`${splashY}px`, transform:"translate(-50%,-50%) rotate(8deg) scale(.64)", opacity:.18 }
    ], { duration:850, easing:"cubic-bezier(.3,.05,.5,1)", fill:"forwards" });

    setTimeout(() => createSplash(splashX, splashY), 560);
    await jump.finished;
    jump.cancel();

    duck.style.opacity = "0";
    await sleep(360);

    const resurface = duck.animate([
      { left:`${splashX}px`, top:`${pctY(75.2)}px`, transform:"translate(-50%,-50%) scale(.58)", opacity:0 },
      { left:`${splashX}px`, top:`${pctY(73.6)}px`, transform:"translate(-50%,-50%) scale(.73)", opacity:1 }
    ], { duration:520, easing:"ease-out", fill:"forwards" });

    await resurface.finished;
    resurface.cancel();

    const entry = { x:37, y:73.6 };
    duck.style.left = "37%";
    duck.style.top = "73.6%";
    duck.style.opacity = "1";
    duck.dataset.x = "37";
    duck.dataset.y = "73.6";
    setDepth(duck, entry.y);

    const destination = requestedDestination
      ? nearestValidStoppingPoint(requestedDestination)
      : distributedPoint(duck);
    duck.dataset.motionState = "swimming";
    activeSwimmers++;

    await animateMove(
      duck,
      entry,
      destination,
      Math.max(4800, Math.min(9000, 3300 + distance(entry, destination) * 150))
    );

    activeSwimmers = Math.max(0, activeSwimmers - 1);
    duck.dataset.motionState = "floating";
    duck.classList.add("floating");
    scheduleRoam(duck);
  }

  function addAnimatedDuck() {
    if (directedAddEnabled && !directedDestination) {
      status.textContent = "Directed Add is on. Click a valid point in the pond first.";
      return;
    }

    const destination = directedAddEnabled
      ? { ...directedDestination }
      : null;

    const duck = makeDuck({ point:{x:37,y:73.6}, instant:false });
    animateEntry(duck, destination);

    if (directedAddEnabled) {
      status.textContent =
        `Duck sent to ${destination.x.toFixed(1)}%, ${destination.y.toFixed(1)}%. Choose another point or reuse this one.`;
    }
  }

  function setDirectedAdd(enabled) {
    directedAddEnabled = enabled;
    directedAddButton.setAttribute("aria-pressed", String(enabled));
    directedAddButton.textContent = enabled ? "Directed Add: On" : "Directed Add: Off";

    if (!enabled) {
      directedDestination = null;
      destinationMarker.hidden = true;
      destinationMarker.classList.remove("invalid");
      status.textContent = "Directed Add disabled. Add Duck will use automatic distribution.";
    } else {
      status.textContent = "Directed Add enabled. Click a destination in the pond.";
    }
  }

  function selectDirectedDestination(event) {
    if (!directedAddEnabled) return;
    if (event.target.closest("button, .duck, .scoreboard-panel")) return;

    const rect = scene.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const valid = canDuckStopAt(x, y);

    destinationMarker.hidden = false;
    destinationMarker.style.left = `${x}%`;
    destinationMarker.style.top = `${y}%`;
    destinationMarker.classList.toggle("invalid", !valid);

    if (!valid) {
      directedDestination = null;
      status.textContent =
        `That point (${x.toFixed(1)}%, ${y.toFixed(1)}%) is excluded. Choose another point.`;
      return;
    }

    directedDestination = { x, y };
    status.textContent =
      `Directed destination selected: ${x.toFixed(1)}%, ${y.toFixed(1)}%. Press Add Duck.`;
  }

  function resetPond() {
    for (const duck of ducks.values()) {
      clearTimeout(duck._roamTimer);
      if (duck._moveFrame) cancelAnimationFrame(duck._moveFrame);
      duck.getAnimations().forEach(animation => animation.cancel());
    }

    duckLayer.replaceChildren();
    splashLayer.replaceChildren();
    ducks.clear();
    nextDuckId = 1;
    activeSwimmers = 0;
    updateCounts();
    destinationMarker.hidden = true;
    directedDestination = null;
    status.textContent = directedAddEnabled
      ? "Pond reset. Directed Add is still on; choose a destination."
      : "Pond reset.";
  }

  function loadPopulation(target) {
    resetPond();

    const points = [];

    for (let i = 0; i < target; i++) {
      let best = null;
      let bestNearest = -1;

      // Population loading now generates only points that pass the exact
      // same exclusion-aware validator used by Directed Add.
      for (let attempt = 0; attempt < 120; attempt++) {
        const candidate = randomWaterPoint();

        if (!canDuckStopAt(candidate.x, candidate.y)) continue;

        const nearest = points.length
          ? Math.min(...points.map(other => distance(candidate, other)))
          : 999;

        if (nearest > bestNearest) {
          bestNearest = nearest;
          best = candidate;
        }
      }

      const safeBest = nearestValidStoppingPoint(
        best || randomWaterPoint()
      );

      if (!canDuckStopAt(safeBest.x, safeBest.y)) {
        throw new Error(
          `Population loader produced an invalid point at ${safeBest.x}, ${safeBest.y}`
        );
      }

      points.push(safeBest);

      makeDuck({
        point: safeBest,
        instant: true
      });
    }

    status.textContent =
      `${target} exclusion-checked ducks loaded. Up to ${maxActiveSwimmers()} will swim at once.`;
  }

  directedAddButton.addEventListener("click", () => setDirectedAdd(!directedAddEnabled));
  scene.addEventListener("click", selectDirectedDestination);
  addDuckButton.addEventListener("click", addAnimatedDuck);
  resetButton.addEventListener("click", resetPond);

  populationButtons.forEach(button => {
    button.addEventListener("click", () => {
      loadPopulation(Number(button.dataset.population));
    });
  });

  liveScoreboard.addEventListener("click", () => {
    scoreboardPanel.hidden = false;
  });

  closeScoreboard.addEventListener("click", () => {
    scoreboardPanel.hidden = true;
  });

  scoreboardPanel.addEventListener("click", event => {
    if (event.target === scoreboardPanel) scoreboardPanel.hidden = true;
  });

  window.addEventListener("resize", syncDuckSizes);

  updateCounts();
  syncDuckSizes();
})();
