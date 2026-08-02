(() => {
  "use strict";

  const WORLD_WIDTH = 1672;
  const WORLD_HEIGHT = 941;

  const sceneFrame = document.getElementById("sceneFrame");
  const scene = document.getElementById("scene");
  const worldStage = document.getElementById("worldStage");
  const world = document.getElementById("world");
  const duckLayer = document.getElementById("duckLayer");
  const splashLayer = document.getElementById("splashLayer");
  const destinationMarker = document.getElementById("destinationMarker");

  const addDuckButton = document.getElementById("addDuckButton");
  const directedAddButton = document.getElementById("directedAddButton");
  const load60Button = document.getElementById("load60Button");
  const resetButton = document.getElementById("resetButton");

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
  let worldScale = 1;
  let portraitPanInitialised = false;

  const waterPolygon = [
    [11.5,57.0],[20.0,53.5],[31.0,51.5],[44.0,50.7],
    [59.0,51.0],[73.0,52.0],[84.5,54.5],[91.0,58.5],
    [93.5,63.0],[92.0,67.5],[88.0,72.0],[81.5,76.5],
    [73.0,81.0],[62.0,85.0],[50.5,87.5],[39.0,86.8],
    [30.0,84.0],[22.5,80.5],[16.5,75.5],[12.5,69.5],
    [10.0,63.0]
  ];

  const pierExclusionBoxes = [
    { minX: -0.8, maxX: 30.8, minY: 66.2, maxY: 75.2 },
    { minX: 28.8, maxX: 35.6, minY: 61.4, maxY: 67.6 },
    { minX: 31.0, maxX: 35.8, minY: 67.0, maxY: 74.8 }
  ];

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const pctToWorldX = value => WORLD_WIDTH * value / 100;
  const pctToWorldY = value => WORLD_HEIGHT * value / 100;

  function portraitZoomEnabled() {
    return window.matchMedia(
      "(max-width: 720px) and (orientation: portrait)"
    ).matches;
  }

  function applyWorldScale() {
    const previousScrollable = Math.max(
      0,
      worldStage.offsetWidth - scene.clientWidth
    );
    const previousRatio = previousScrollable > 0
      ? scene.scrollLeft / previousScrollable
      : 0;

    const fitScale = scene.clientWidth / WORLD_WIDTH;
    const zoom = portraitZoomEnabled() ? 1.45 : 1;
    worldScale = fitScale * zoom;

    const renderedWidth = Math.round(WORLD_WIDTH * worldScale);
    const renderedHeight = Math.round(WORLD_HEIGHT * worldScale);

    worldStage.style.width = `${renderedWidth}px`;
    worldStage.style.height = `${renderedHeight}px`;
    scene.style.height = `${renderedHeight}px`;

    world.style.left = "0";
    world.style.top = "0";
    world.style.transform = `scale(${worldScale})`;

    requestAnimationFrame(() => {
      const maxScroll = Math.max(0, renderedWidth - scene.clientWidth);

      if (portraitZoomEnabled()) {
        if (!portraitPanInitialised) {
          // Begin at the pier/entry side. The user can swipe right across
          // the rest of the pond.
          scene.scrollLeft = 0;
          portraitPanInitialised = true;
        } else {
          scene.scrollLeft = Math.max(
            0,
            Math.min(maxScroll, previousRatio * maxScroll)
          );
        }
      } else {
        scene.scrollLeft = 0;
        portraitPanInitialised = false;
      }
    });
  }

  function setWorldPosition(element, xPct, yPct) {
    element.style.left = `${pctToWorldX(xPct)}px`;
    element.style.top = `${pctToWorldY(yPct)}px`;
  }

  function updateCounts() {
    const count = ducks.size;
    scoreboardCount.textContent = String(count);
    panelDuckCount.textContent = String(count);
  }

  function maxActiveSwimmers() {
    return Math.max(4, Math.min(10, Math.round(ducks.size * .15)));
  }

  function scaleForY(y) {
    const clamped = Math.max(51, Math.min(89, y));
    const t = (clamped - 51) / 38;
    return .45 + t * .43;
  }

  function applyDuckSize(duck) {
    const variant = Number(duck.dataset.sizeVariant || "0");
    duck.style.setProperty("--duck-size", `${124 + variant * 6}px`);
  }

  function isInFrontOfPier(x, y) {
    if (x <= 31.0 && y >= 75.0) return true;

    if (x > 31.0 && x <= 36.5) {
      const t = (x - 31.0) / 5.5;
      const frontEdgeY = 69.0 + t * 6.0;
      return y >= frontEdgeY;
    }

    if (x > 36.5 && x <= 42.0) {
      return y >= 75.0;
    }

    return false;
  }

  function setDepth(duck, y, pierOverride = null) {
    duck.style.setProperty("--duck-scale", scaleForY(y).toFixed(3));

    let z = 100 + Math.round(y * 10);

    if (pierOverride === "behind") {
      z = Math.min(z, 870);
    } else if (pierOverride === "front") {
      z = Math.max(z, 900);
    } else {
      const x = Number(duck.dataset.x || "0");
      if (isInFrontOfPier(x, y)) z = Math.max(z, 900);
    }

    duck.style.zIndex = String(z);
  }

  function pointOnSegment(x, y, x1, y1, x2, y2, tolerance = .12) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq === 0) return Math.hypot(x - x1, y - y1) <= tolerance;

    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq));
    const px = x1 + t * dx;
    const py = y1 + t * dy;
    return Math.hypot(x - px, y - py) <= tolerance;
  }

  function pointInPolygonInclusive(x, y, polygon) {
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (pointOnSegment(x, y, polygon[j][0], polygon[j][1], polygon[i][0], polygon[i][1])) {
        return true;
      }
    }

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
    return pointInPolygonInclusive(x, y, waterPolygon) && !inPier(x, y);
  }

  function underPierRestLineY(x) {
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

  function nearestValidStoppingPoint(point) {
    if (canDuckStopAt(point.x, point.y)) return point;

    for (let radius = .6; radius <= 18; radius += .6) {
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
    const steps = Math.max(
      12,
      Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) * 1.6)
    );

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

  const PIER_REAR_WAYPOINT = { x: 38.4, y: 66.0 };
  const PIER_FRONT_WAYPOINT = { x: 39.5, y: 79.0 };

  function routeIsClear(points) {
    for (let i = 0; i < points.length - 1; i++) {
      if (!segmentClear(points[i], points[i + 1])) return false;
    }
    return true;
  }

  function planRoute(from, to) {
    const safeTo = nearestValidStoppingPoint(to);

    if (segmentClear(from, safeTo)) return [safeTo];

    const destinationPrefersFront = safeTo.y >= 75.0;
    const candidates = destinationPrefersFront
      ? [
          [PIER_FRONT_WAYPOINT, safeTo],
          [PIER_REAR_WAYPOINT, PIER_FRONT_WAYPOINT, safeTo],
          [PIER_REAR_WAYPOINT, safeTo]
        ]
      : [
          [PIER_REAR_WAYPOINT, safeTo],
          [PIER_FRONT_WAYPOINT, PIER_REAR_WAYPOINT, safeTo],
          [PIER_FRONT_WAYPOINT, safeTo]
        ];

    for (const route of candidates) {
      if (
        route.every(point => canDuckStopAt(point.x, point.y)) &&
        routeIsClear([from, ...route])
      ) {
        return route;
      }
    }

    // Keep the endpoint safe even if a route cannot be found. This fallback
    // should be rare and remains visible through Directed Add testing.
    return [safeTo];
  }

  async function animateRoute(duck, from, to, duration) {
    const route = planRoute(from, to);
    const legs = [];
    let current = from;
    let totalDistance = 0;

    for (const point of route) {
      const legDistance = Math.max(.01, distance(current, point));
      legs.push({ from: current, to: point, distance: legDistance });
      totalDistance += legDistance;
      current = point;
    }

    for (const leg of legs) {
      const legDuration = Math.max(
        500,
        duration * (leg.distance / totalDistance)
      );
      await animateMove(duck, leg.from, leg.to, legDuration);
    }
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

    for (let attempt = 0; attempt < 45; attempt++) {
      const candidate = randomWaterPoint();
      let nearest = Infinity;

      for (const duck of ducks.values()) {
        if (duck === excludeDuck || !duck.dataset.x) continue;
        const other = {
          x: Number(duck.dataset.x),
          y: Number(duck.dataset.y)
        };
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

  function createSplash(xPct, yPct) {
    const splash = document.createElement("div");
    splash.className = "splash";
    setWorldPosition(splash, xPct, yPct);
    splashLayer.appendChild(splash);
    splash.addEventListener("animationend", () => splash.remove(), { once: true });
  }

  function currentPosition(duck) {
    return {
      x: Number(duck.dataset.x),
      y: Number(duck.dataset.y)
    };
  }

  function pierInfluence(x, y) {
    return x >= -2 && x <= 40 && y >= 59 && y <= 83;
  }

  function animateMove(duck, from, to, duration) {
    const safeTo = nearestValidStoppingPoint(to);

    return new Promise(resolve => {
      const started = performance.now();
      const dx = safeTo.x - from.x;
      const dy = safeTo.y - from.y;
      const fromFront = isInFrontOfPier(from.x, from.y);
      const toFront = isInFrontOfPier(safeTo.x, safeTo.y);
      const crossingPier = fromFront !== toFront;
      const look = .18;

      let crossingState = crossingPier ? (fromFront ? "front" : "behind") : null;
      let transitionLatched = false;

      function frame(now) {
        if (!duck.isConnected) {
          resolve();
          return;
        }

        const raw = Math.min(1, (now - started) / duration);
        const eased = raw < .5
          ? 2 * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 2) / 2;

        const x = from.x + dx * eased;
        const y = from.y + dy * eased;

        if (crossingPier && !transitionLatched) {
          if (fromFront && !toFront) {
            const projectedFront = isInFrontOfPier(
              x + dx * look,
              y + dy * look
            );
            if (!projectedFront) {
              crossingState = "behind";
              transitionLatched = true;
            }
          } else if (!fromFront && toFront) {
            const trailingFront = isInFrontOfPier(
              x - dx * look,
              y - dy * look
            );
            if (trailingFront) {
              crossingState = "front";
              transitionLatched = true;
            }
          }
        }

        setWorldPosition(duck, x, y);
        duck.dataset.x = x.toFixed(3);
        duck.dataset.y = y.toFixed(3);

        const override =
          crossingPier && pierInfluence(x, y)
            ? crossingState
            : null;

        setDepth(duck, y, override);

        if (raw < 1) {
          duck._moveFrame = requestAnimationFrame(frame);
        } else {
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
      const duration = Math.max(
        3200,
        Math.min(6500, 2500 + distance(from, to) * 360)
      );

      activeSwimmers++;
      duck.dataset.motionState = "swimming";
      duck.classList.remove("floating");

      await animateRoute(duck, from, to, duration);

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

    const visual = document.createElement("span");
    visual.className = "duck-visual";

    const image = document.createElement("img");
    image.src = angrySrc;
    image.alt = "";

    visual.appendChild(image);
    duck.appendChild(visual);

    duck.addEventListener("click", () => reactToClick(duck));
    duckLayer.appendChild(duck);
    ducks.set(id, duck);

    if (instant) {
      const safePoint = nearestValidStoppingPoint(point);
      setWorldPosition(duck, safePoint.x, safePoint.y);
      duck.dataset.x = safePoint.x.toFixed(3);
      duck.dataset.y = safePoint.y.toFixed(3);
      setDepth(duck, safePoint.y);
      duck.classList.add("floating");
      scheduleRoam(duck, 1000 + Math.random() * 9000);
    }

    updateCounts();
    return duck;
  }

  function setEntryVisual(duck, rotation, scale) {
    duck.style.setProperty("--entry-rotation", `${rotation}deg`);
    duck.style.setProperty("--entry-scale", String(scale));
  }

  function clearEntryVisual(duck) {
    duck.style.removeProperty("--entry-rotation");
    duck.style.removeProperty("--entry-scale");
  }

  function animateEntrySegment(
    duck,
    keyframes,
    duration,
    easing = t => t,
    anchor = "centre"
  ) {
    return new Promise(resolve => {
      const started = performance.now();

      function frame(now) {
        if (!duck.isConnected) {
          resolve();
          return;
        }

        const raw = Math.min(1, (now - started) / duration);
        const t = easing(raw);

        let left = keyframes[0];
        let right = keyframes[keyframes.length - 1];

        for (let i = 0; i < keyframes.length - 1; i++) {
          if (t >= keyframes[i].at && t <= keyframes[i + 1].at) {
            left = keyframes[i];
            right = keyframes[i + 1];
            break;
          }
        }

        const span = Math.max(.0001, right.at - left.at);
        const local = Math.max(0, Math.min(1, (t - left.at) / span));
        const x = left.x + (right.x - left.x) * local;
        const y = left.y + (right.y - left.y) * local;
        const rotation = left.rotation + (right.rotation - left.rotation) * local;
        const scale = left.scale + (right.scale - left.scale) * local;
        const opacity = left.opacity + (right.opacity - left.opacity) * local;

        setWorldPosition(duck, x, y);
        duck.style.opacity = String(opacity);

        if (anchor === "feet") {
          setEntryVisual(duck, rotation, scale);
        } else {
          duck.style.transform =
            `translate(-50%,-50%) rotate(${rotation}deg) scale(${scale})`;
        }

        if (raw < 1) {
          duck._entryFrame = requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }

      duck._entryFrame = requestAnimationFrame(frame);
    });
  }

  async function animateEntry(duck, requestedDestination = null) {
    duck.classList.add("entrying");
    duck.style.zIndex = "2600";
    duck.style.opacity = "1";

    const walkFrames = [
      { at:0,    x:-11, y:72.75, rotation:-4, scale:.82, opacity:1 },
      { at:.16,  x:-4,  y:72.55, rotation:5,  scale:.82, opacity:1 },
      { at:.33,  x:3,   y:72.75, rotation:-5, scale:.82, opacity:1 },
      { at:.50,  x:10,  y:72.55, rotation:5,  scale:.82, opacity:1 },
      { at:.67,  x:17,  y:72.75, rotation:-4, scale:.82, opacity:1 },
      { at:.82,  x:23.5,y:72.55, rotation:4,  scale:.82, opacity:1 },
      { at:.94,  x:28.5,y:72.70, rotation:-3, scale:.82, opacity:1 },
      { at:1,    x:31,  y:72.45, rotation:0,  scale:.82, opacity:1 }
    ];

    await animateEntrySegment(duck, walkFrames, 4600, t => t, "feet");

    const jumpFrames = [
      { at:0,   x:31,   y:72.45, rotation:0, scale:.82, opacity:1 },
      { at:.38, x:33.8, y:65.5,  rotation:5, scale:.80, opacity:1 },
      { at:1,   x:37,   y:73.6,  rotation:8, scale:.64, opacity:.18 }
    ];

    let splashCreated = false;
    const jumpStarted = performance.now();

    await new Promise(resolve => {
      function frame(now) {
        if (!duck.isConnected) {
          resolve();
          return;
        }

        const raw = Math.min(1, (now - jumpStarted) / 850);
        const eased = raw * raw * (3 - 2 * raw);

        let left = jumpFrames[0];
        let right = jumpFrames[jumpFrames.length - 1];

        for (let i = 0; i < jumpFrames.length - 1; i++) {
          if (eased >= jumpFrames[i].at && eased <= jumpFrames[i + 1].at) {
            left = jumpFrames[i];
            right = jumpFrames[i + 1];
            break;
          }
        }

        const span = Math.max(.0001, right.at - left.at);
        const local = Math.max(0, Math.min(1, (eased - left.at) / span));
        const x = left.x + (right.x - left.x) * local;
        const y = left.y + (right.y - left.y) * local;
        const rotation = left.rotation + (right.rotation - left.rotation) * local;
        const scale = left.scale + (right.scale - left.scale) * local;
        const opacity = left.opacity + (right.opacity - left.opacity) * local;

        setWorldPosition(duck, x, y);
        duck.style.opacity = String(opacity);
        setEntryVisual(duck, rotation, scale);

        if (!splashCreated && raw >= .66) {
          splashCreated = true;
          createSplash(37, 73.6);
        }

        if (raw < 1) {
          duck._entryFrame = requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }

      duck._entryFrame = requestAnimationFrame(frame);
    });

    duck.style.opacity = "0";
    await sleep(360);

    duck.classList.remove("entrying");
    clearEntryVisual(duck);

    await animateEntrySegment(
      duck,
      [
        { at:0, x:37, y:75.2, rotation:0, scale:.58, opacity:0 },
        { at:1, x:37, y:73.6, rotation:0, scale:.73, opacity:1 }
      ],
      520,
      t => 1 - Math.pow(1 - t, 3),
      "centre"
    );

    duck.style.transform = "";
    const entry = { x:37, y:73.6 };
    setWorldPosition(duck, entry.x, entry.y);
    duck.style.opacity = "1";
    duck.dataset.x = entry.x.toFixed(3);
    duck.dataset.y = entry.y.toFixed(3);
    setDepth(duck, entry.y);

    const destination = requestedDestination
      ? nearestValidStoppingPoint(requestedDestination)
      : distributedPoint(duck);

    duck.dataset.motionState = "swimming";
    activeSwimmers++;

    await animateRoute(
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
        `Duck sent to ${destination.x.toFixed(1)}%, ${destination.y.toFixed(1)}%.`;
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
      status.textContent = "Directed Add disabled.";
    } else {
      status.textContent = "Directed Add enabled. Click a destination in the pond.";
    }
  }

  function selectDirectedDestination(event) {
    if (!directedAddEnabled) return;
    if (event.target.closest("button, .duck")) return;

    const rect = world.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const valid = canDuckStopAt(x, y);

    destinationMarker.hidden = false;
    setWorldPosition(destinationMarker, x, y);
    destinationMarker.classList.toggle("invalid", !valid);

    if (!valid) {
      directedDestination = null;
      status.textContent =
        `That point (${x.toFixed(1)}%, ${y.toFixed(1)}%) is excluded.`;
      return;
    }

    directedDestination = { x, y };
    status.textContent =
      `Destination selected: ${x.toFixed(1)}%, ${y.toFixed(1)}%. Press Add Duck.`;
  }

  function resetPond() {
    for (const duck of ducks.values()) {
      clearTimeout(duck._roamTimer);
      if (duck._moveFrame) cancelAnimationFrame(duck._moveFrame);
      if (duck._entryFrame) cancelAnimationFrame(duck._entryFrame);
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
      ? "Pond reset. Choose a directed destination."
      : "Pond reset.";
  }

  function loadPopulation(target = 60) {
    resetPond();
    const points = [];

    for (let i = 0; i < target; i++) {
      let best = null;
      let bestNearest = -1;

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

      const safeBest = nearestValidStoppingPoint(best || randomWaterPoint());
      points.push(safeBest);
      makeDuck({ point: safeBest, instant: true });
    }

    status.textContent =
      `60 exclusion-checked ducks loaded. Up to ${maxActiveSwimmers()} will swim at once.`;
  }

  directedAddButton.addEventListener("click", () => {
    setDirectedAdd(!directedAddEnabled);
  });

  world.addEventListener("click", selectDirectedDestination);
  addDuckButton.addEventListener("click", addAnimatedDuck);
  load60Button.addEventListener("click", () => loadPopulation(60));
  resetButton.addEventListener("click", resetPond);

  liveScoreboard.addEventListener("click", () => {
    scoreboardPanel.hidden = false;
  });

  closeScoreboard.addEventListener("click", () => {
    scoreboardPanel.hidden = true;
  });

  let resizeFrame = null;
  function handleViewportChange() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      applyWorldScale();
    });
  }

  window.addEventListener("resize", handleViewportChange);
  window.addEventListener("orientationchange", handleViewportChange);


  applyWorldScale();
  updateCounts();

  window.addEventListener("load", applyWorldScale, { once: true });
})();
