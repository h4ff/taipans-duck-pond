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
  const duckTypeButton = document.getElementById("duckTypeButton");
  const featherToneButton = document.getElementById("featherToneButton");
  const buildVariantButton = document.getElementById("buildVariantButton");
  const load60Button = document.getElementById("load60Button");
  const resetButton = document.getElementById("resetButton");

  const scoreboardCount = document.getElementById("scoreboardCount");
  const panelDuckCount = document.getElementById("panelDuckCount");
  const liveScoreboard = document.getElementById("liveScoreboard");
  const scoreboardPanel = document.getElementById("scoreboardPanel");
  const closeScoreboard = document.getElementById("closeScoreboard");
  const status = document.getElementById("status");

  const WALK_FRAME_ROOT = "assets/duck/walk";
  const HAT_ASSETS = {
    walk: "assets/duck/hat/walk-hat.png",
    swim: {
      left: "assets/duck/hat/swim-hat-left.png",
      right: "assets/duck/hat/swim-hat-right.png"
    }
  };

  function walkFrameSrc(duckType, featherTone, frameNumber) {
    const safeType = DUCK_TYPES.includes(duckType) ? duckType : "standard";
    const safeTone = FEATHER_TONES[featherTone] ? featherTone : "white";
    const safeFrame = Math.max(1, Math.min(3, frameNumber));
    return `${WALK_FRAME_ROOT}/${safeType}/${safeTone}/walk-${String(safeFrame).padStart(2, "0")}.png`;
  }

  const SWIM_ASSETS = {
    bodyRoot: "assets/duck/swim/body",
    wingRoot: "assets/duck/swim/wing",
    sadFaceRoot: "assets/duck/swim/face",
    faces: {
      neutral: "assets/duck/swim/face/face-neutral.png",
      sad: "assets/duck/swim/face/face-sad-white.png",
      surprised: "assets/duck/swim/face/face-surprised.png",
      angry: "assets/duck/swim/face/face-angry.png"
    },
    blinks: {
      neutral: "assets/duck/swim/face/face-neutral-blink.png",
      sadRoot: "assets/duck/swim/face"
    },
    wakes: {
      standard: "assets/effects/wake/wake-standard.png",
      golden: "assets/effects/wake/wake-golden.png",
      diamond: "assets/effects/wake/wake-diamond.png"
    }
  };

  function swimBodySrc(duckType, featherTone) {
    const safeType = DUCK_TYPES.includes(duckType) ? duckType : "standard";
    const safeTone = FEATHER_TONES[featherTone] ? featherTone : "white";
    return `${SWIM_ASSETS.bodyRoot}/body-${safeType}-${safeTone}.png`;
  }

  function swimWingSrc(which, featherTone) {
    const safeTone = FEATHER_TONES[featherTone] ? featherTone : "white";
    return `${SWIM_ASSETS.wingRoot}/wing-${which}-${safeTone}.png`;
  }

  function swimHatSrc(facing) {
    return facing === "right" ? HAT_ASSETS.swim.right : HAT_ASSETS.swim.left;
  }

  const DUCK_TYPES = ["standard", "golden", "diamond"];
  let selectedDuckType = "standard";
  const FEATHER_TONES = {
    white: { label: "White" },
    yellow: { label: "Yellow" },
    lightBrown: { label: "Light Brown" },
    darkBrown: { label: "Dark Brown" }
  };
  const FEATHER_TONE_KEYS = ["white", "yellow", "lightBrown", "darkBrown"];
  let selectedFeatherTone = "white";

  const BUILD_VARIANTS = {
    standard: { label: "Standard", scaleX: 1.00, scaleY: 1.00 },
    short: { label: "Short", scaleX: .95, scaleY: .90 },
    beanpole: { label: "Tall & Skinny", scaleX: .82, scaleY: 1.25 },
    stocky: { label: "Stocky", scaleX: 1.12, scaleY: .97 },
    big: { label: "Big", scaleX: 1.16, scaleY: 1.08 }
  };
  const BUILD_VARIANT_KEYS = ["standard", "short", "beanpole", "stocky", "big"];
  let selectedBuildVariant = "standard";

  function swimFaceSrc(faceName, featherTone) {
    const safeTone = FEATHER_TONES[featherTone] ? featherTone : "white";
    if (faceName === "sad") {
      return `${SWIM_ASSETS.sadFaceRoot}/face-sad-${safeTone}.png`;
    }
    return SWIM_ASSETS.faces[faceName] || SWIM_ASSETS.faces.neutral;
  }

  function swimBlinkSrc(faceName, featherTone) {
    const safeTone = FEATHER_TONES[featherTone] ? featherTone : "white";
    if (faceName === "sad") {
      return `${SWIM_ASSETS.blinks.sadRoot}/face-sad-blink-${safeTone}.png`;
    }
    return SWIM_ASSETS.blinks.neutral;
  }


  function splashFrameSrc(duckType, frameNumber) {
    const safeType = DUCK_TYPES.includes(duckType) ? duckType : "standard";
    return `assets/effects/splash/${safeType}/splash-${String(frameNumber).padStart(2, "0")}.png`;
  }

  const ducks = new Map();
  let nextDuckId = 1;
  let activeSwimmers = 0;
  const collisionPairs = new Map();
  let nextGlobalCollisionReactionAt = 0;
  let nextGlobalIdleWingAt = 0;

  function randomCollisionGap() {
    return 8000 + Math.random() * 7000;
  }

  function randomDuckCollisionCooldown() {
    return 18000 + Math.random() * 12000;
  }
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
    const variant = BUILD_VARIANTS[duck.dataset.buildVariant] || BUILD_VARIANTS.standard;
    // Keep the underlying sprite canvas constant. Build is a deliberate
    // caricature layer applied separately from pond-perspective scaling.
    duck.style.setProperty("--duck-size", "130px");
    duck.style.setProperty("--build-scale-x", variant.scaleX.toFixed(3));
    duck.style.setProperty("--build-scale-y", variant.scaleY.toFixed(3));
  }

  function setDepth(duck, y) {
    duck.style.setProperty("--duck-scale", scaleForY(y).toFixed(3));

    // Swimming ducks sort against one another by Y, but remain below the
    // permanent pier layer (z-index 2200). Entry ducks are explicitly raised
    // above the pier while waddling and jumping.
    const z = 100 + Math.round(y * 10);
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

  function canDuckTravelAt(x, y) {
    return inWater(x, y) && !inUnderPierRestExclusion(x, y);
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

      // Do not let swimming routes cut underneath or in front of the pier.
      // They must pass around its right-hand end.
      if (!canDuckTravelAt(x, y)) return false;
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
    // v0.46: ducks make committed swims rather than tiny local hops.
    // The vertical range is still compressed slightly to suit the pond perspective.
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 9 + Math.random() * 13;
      const candidate = {
        x: current.x + Math.cos(angle) * radius,
        y: current.y + Math.sin(angle) * radius * .64
      };

      if (canDuckStopAt(candidate.x, candidate.y) && segmentClear(current, candidate)) {
        return candidate;
      }
    }

    // If the duck is boxed in near an edge, fall back to the older shorter move.
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 7;
      const candidate = {
        x: current.x + Math.cos(angle) * radius,
        y: current.y + Math.sin(angle) * radius * .58
      };
      if (canDuckStopAt(candidate.x, candidate.y) && segmentClear(current, candidate)) {
        return candidate;
      }
    }

    return current;
  }

  async function createSplashAnimation(xPct, yPct, duckType = "standard") {
    const splash = document.createElement("div");
    splash.className = "splash-sprite";

    const image = document.createElement("img");
    image.alt = "";
    splash.appendChild(image);

    setWorldPosition(splash, xPct, yPct);
    splashLayer.appendChild(splash);

    const timings = [90, 105, 130, 175];
    for (let i = 1; i <= 4; i++) {
      image.src = splashFrameSrc(duckType, i);
      await sleep(timings[i - 1]);
    }

    splash.remove();
  }

  function createResurfaceEffect(xPct, yPct, duckType = "standard") {
    const ripple = document.createElement("div");
    ripple.className = "resurface-sprite";

    const image = document.createElement("img");
    image.src = splashFrameSrc(duckType, 1);
    image.alt = "";
    ripple.appendChild(image);

    setWorldPosition(ripple, xPct, yPct);
    splashLayer.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }

  function currentPosition(duck) {
    return {
      x: Number(duck.dataset.x),
      y: Number(duck.dataset.y)
    };
  }

  function setFacingForMovement(duck, dx) {
    // Dead-zone prevents twitching when a duck is moving almost vertically.
    if (Math.abs(dx) < .45) return;
    const stack = duck.querySelector(".swim-stack");
    if (!stack) return;

    const nextFacing = dx > 0 ? "right" : "left";
    if (duck.dataset.facing === nextFacing) return;

    stack.style.setProperty("--facing-scale", nextFacing === "right" ? "-1" : "1");
    stack.style.setProperty("--hat-counter-scale", nextFacing === "right" ? "-1" : "1");

    const hat = duck.querySelector(".swim-hat");
    if (hat) hat.src = swimHatSrc(nextFacing);

    duck.dataset.facing = nextFacing;
  }

  function curvedControlPoint(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / length;
    const ny = dx / length;
    const direction = Math.random() < .5 ? -1 : 1;

    // Deliberately larger bend than v0.45 so the curve is actually visible.
    // Try successively smaller arcs if the wide curve would leave the water.
    const preferredBend = Math.min(7.2, Math.max(2.0, length * (.26 + Math.random() * .10)));

    for (const factor of [1, .78, .58, .38, .18]) {
      const bend = preferredBend * factor;
      const control = {
        x: (from.x + to.x) / 2 + nx * bend * direction,
        y: (from.y + to.y) / 2 + ny * bend * direction * .66
      };

      let valid = true;
      for (let i = 1; i < 16; i++) {
        const point = quadraticPoint(from, control, to, i / 16);
        if (!canDuckTravelAt(point.x, point.y)) {
          valid = false;
          break;
        }
      }
      if (valid) return control;
    }

    return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  }

  function quadraticPoint(from, control, to, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * from.x + 2 * mt * t * control.x + t * t * to.x,
      y: mt * mt * from.y + 2 * mt * t * control.y + t * t * to.y
    };
  }

  function quadraticTangent(from, control, to, t) {
    return {
      x: 2 * (1 - t) * (control.x - from.x) + 2 * t * (to.x - control.x),
      y: 2 * (1 - t) * (control.y - from.y) + 2 * t * (to.y - control.y)
    };
  }

  function swimProgress(t) {
    // A visible accelerate -> cruise -> decelerate profile.
    // 20% of the time is spent accelerating, 60% cruising, 20% slowing.
    const ramp = .20;
    const totalArea = .80;

    if (t < ramp) {
      return (0.5 * t * t / ramp) / totalArea;
    }

    if (t <= 1 - ramp) {
      return (0.5 * ramp + (t - ramp)) / totalArea;
    }

    const u = t - (1 - ramp);
    return (0.5 * ramp + (1 - 2 * ramp) + u - 0.5 * u * u / ramp) / totalArea;
  }

  function animateMove(duck, from, to, duration) {
    const safeTo = nearestValidStoppingPoint(to);
    const control = curvedControlPoint(from, safeTo);

    return new Promise(resolve => {
      const started = performance.now();
      const initialTangent = quadraticTangent(from, control, safeTo, 0);
      setFacingForMovement(duck, initialTangent.x);

      const chord = { x: safeTo.x - from.x, y: safeTo.y - from.y };
      const cross = chord.x * (control.y - from.y) - chord.y * (control.x - from.x);
      const stack = duck.querySelector(".swim-stack");
      const baseLean = Math.abs(cross) < .25 ? 0 : (cross > 0 ? 2.8 : -2.8);
      if (stack) {
        stack.style.setProperty("--swim-tilt", `${baseLean}deg`);
      }

      function frame(now) {
        if (!duck.isConnected) {
          resolve();
          return;
        }

        const raw = Math.min(1, (now - started) / duration);
        const progress = swimProgress(raw);
        const point = quadraticPoint(from, control, safeTo, progress);
        const tangent = quadraticTangent(from, control, safeTo, progress);

        setFacingForMovement(duck, tangent.x);

        // Ease the turn lean back to level during the final 20% of the swim.
        // This removes the visible snap/jolt that occurred when the duck stopped.
        if (stack) {
          const settleStart = .80;
          let tiltFactor = 1;
          if (raw > settleStart) {
            const u = Math.min(1, (raw - settleStart) / (1 - settleStart));
            const smooth = u * u * (3 - 2 * u);
            tiltFactor = 1 - smooth;
          }
          stack.style.setProperty("--swim-tilt", `${(baseLean * tiltFactor).toFixed(3)}deg`);
        }

        setWorldPosition(duck, point.x, point.y);
        duck.dataset.x = point.x.toFixed(3);
        duck.dataset.y = point.y.toFixed(3);
        setDepth(duck, point.y);
        checkDuckCollisions(duck);

        if (raw < 1) {
          duck._moveFrame = requestAnimationFrame(frame);
        } else {
          if (stack) stack.style.setProperty("--swim-tilt", "0deg");
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
      const pace = Number(duck.dataset.swimPace || "1");
      const duration = Math.max(
        4600,
        Math.min(10500, (3000 + distance(from, to) * 350) / pace)
      );

      activeSwimmers++;
      duck.dataset.motionState = "swimming";
      duck.classList.remove("floating");

      await animateRoute(duck, from, to, duration);

      activeSwimmers = Math.max(0, activeSwimmers - 1);
      if (!duck.isConnected) return;

      duck.dataset.motionState = "floating";
      duck.classList.add("floating");
      scheduleRoam(duck, 3200 + Math.random() * 9000);
    }, delay);
  }


  function updateFeatherToneButton() {
    const tone = FEATHER_TONES[selectedFeatherTone] || FEATHER_TONES.white;
    featherToneButton.textContent = `Feather: ${tone.label}`;
  }

  function updateBuildVariantButton() {
    const variant = BUILD_VARIANTS[selectedBuildVariant] || BUILD_VARIANTS.standard;
    buildVariantButton.textContent = `Build: ${variant.label}`;
  }

  function setDuckFace(duck, faceName) {
    const face = duck.querySelector(".swim-face");
    if (!face) return;

    if (!["neutral", "sad"].includes(faceName)) {
      cancelBlink(duck, false);
      cancelIdleWingFlick(duck);
    } else if (duck.dataset.blinking === "true") {
      cancelBlink(duck, false);
    }

    face.src = swimFaceSrc(faceName, duck.dataset.featherTone);
    duck.dataset.face = faceName;
  }

  function chooseIdleFace(duck, forceChange = false) {
    const current = duck.dataset.idleFace || "neutral";
    let next = Math.random() < .68 ? "neutral" : "sad";

    if (forceChange && next === current) {
      next = current === "neutral" ? "sad" : "neutral";
    }

    duck.dataset.idleFace = next;
    return next;
  }

  function restoreIdleFace(duck) {
    if (!duck.isConnected || duck.dataset.reacting === "true") return;
    setDuckFace(duck, duck.dataset.idleFace || "neutral");
  }

  function randomBlinkGap() {
    return 6500 + Math.random() * 10500;
  }

  function cancelBlink(duck, restore = false) {
    clearTimeout(duck._blinkReturnTimer);
    clearTimeout(duck._doubleBlinkTimer);
    clearTimeout(duck._doubleBlinkReturnTimer);
    duck._blinkReturnTimer = null;
    duck._doubleBlinkTimer = null;
    duck._doubleBlinkReturnTimer = null;
    duck.dataset.blinking = "false";

    if (restore && duck.isConnected &&
        duck.dataset.reacting !== "true" &&
        duck.dataset.collisionEscaping !== "true") {
      const idleFace = duck.dataset.idleFace || "neutral";
      const face = duck.querySelector(".swim-face");
      if (face) {
        face.src = swimFaceSrc(idleFace, duck.dataset.featherTone);
        duck.dataset.face = idleFace;
      }
    }
  }

  function canBlink(duck) {
    return duck.isConnected &&
      ["floating", "swimming"].includes(duck.dataset.motionState) &&
      duck.dataset.reacting !== "true" &&
      duck.dataset.collisionEscaping !== "true" &&
      !duck.classList.contains("collision-bump") &&
      !duck.classList.contains("reacting") &&
      ["neutral", "sad"].includes(duck.dataset.face || "neutral");
  }

  function showBlinkFrame(duck) {
    if (!canBlink(duck)) return false;
    const face = duck.querySelector(".swim-face");
    if (!face) return false;

    const idleFace = duck.dataset.idleFace === "sad" ? "sad" : "neutral";
    face.src = swimBlinkSrc(idleFace, duck.dataset.featherTone);
    duck.dataset.blinking = "true";
    return true;
  }

  function finishBlinkFrame(duck) {
    if (!duck.isConnected) return;
    duck.dataset.blinking = "false";

    if (!canBlink(duck)) return;

    const idleFace = duck.dataset.idleFace || "neutral";
    const face = duck.querySelector(".swim-face");
    if (face) {
      face.src = swimFaceSrc(idleFace, duck.dataset.featherTone);
      duck.dataset.face = idleFace;
    }
  }

  function playBlink(duck) {
    if (!showBlinkFrame(duck)) return;

    const doubleBlink = Math.random() < .14;
    duck._blinkReturnTimer = setTimeout(() => {
      finishBlinkFrame(duck);

      if (!doubleBlink || !canBlink(duck)) return;

      duck._doubleBlinkTimer = setTimeout(() => {
        if (!showBlinkFrame(duck)) return;

        duck._doubleBlinkReturnTimer = setTimeout(() => {
          finishBlinkFrame(duck);
        }, 95 + Math.random() * 45);
      }, 85 + Math.random() * 65);
    }, 100 + Math.random() * 55);
  }

  function scheduleBlink(duck, delay = randomBlinkGap()) {
    clearTimeout(duck._blinkTimer);
    duck._blinkTimer = setTimeout(() => {
      if (!duck.isConnected) return;

      if (canBlink(duck)) {
        playBlink(duck);
        scheduleBlink(duck, randomBlinkGap());
      } else {
        scheduleBlink(duck, 1800 + Math.random() * 3200);
      }
    }, delay);
  }

  function randomIdleWingGap() {
    return 30000 + Math.random() * 48000;
  }

  function cancelIdleWingFlick(duck) {
    clearTimeout(duck._idleWingEndTimer);
    duck._idleWingEndTimer = null;
    duck.classList.remove("idle-wing-front-flick", "idle-wing-back-flick");
  }

  function canIdleWingFlick(duck) {
    return duck.isConnected &&
      duck.dataset.motionState === "floating" &&
      duck.dataset.reacting !== "true" &&
      duck.dataset.collisionEscaping !== "true" &&
      duck.dataset.blinking !== "true" &&
      !duck.classList.contains("collision-bump") &&
      !duck.classList.contains("reacting") &&
      ["neutral", "sad"].includes(duck.dataset.face || "neutral");
  }

  function playIdleWingFlick(duck) {
    if (!canIdleWingFlick(duck)) return false;

    cancelIdleWingFlick(duck);
    const backWing = Math.random() < .28;
    duck.classList.add(backWing ? "idle-wing-back-flick" : "idle-wing-front-flick");
    duck._idleWingEndTimer = setTimeout(() => {
      if (!duck.isConnected) return;
      cancelIdleWingFlick(duck);
    }, backWing ? 620 : 560);
    return true;
  }

  function scheduleIdleWingFlick(duck, delay = randomIdleWingGap()) {
    clearTimeout(duck._idleWingTimer);
    duck._idleWingTimer = setTimeout(() => {
      if (!duck.isConnected) return;

      const now = performance.now();
      if (canIdleWingFlick(duck) && now >= nextGlobalIdleWingAt) {
        if (playIdleWingFlick(duck)) {
          nextGlobalIdleWingAt = now + 1100 + Math.random() * 1300;
        }
        scheduleIdleWingFlick(duck, randomIdleWingGap());
      } else {
        const globalWait = Math.max(0, nextGlobalIdleWingAt - now);
        scheduleIdleWingFlick(duck, globalWait + 4500 + Math.random() * 8500);
      }
    }, delay);
  }

  function scheduleIdleLife(duck) {
    scheduleBlink(duck, 1800 + Math.random() * 8500);
    scheduleIdleWingFlick(duck, 12000 + Math.random() * 30000);
  }

  function scheduleMoodShift(duck, delay = 8000 + Math.random() * 10000) {
    clearTimeout(duck._moodTimer);
    duck._moodTimer = setTimeout(() => {
      if (!duck.isConnected) return;

      if (["floating", "swimming"].includes(duck.dataset.motionState) &&
          duck.dataset.reacting !== "true" &&
          duck.dataset.blinking !== "true") {
        // Most ducks look neutral, but some remain sad and moods can change
        // occasionally so the pond does not feel like a wall of identical faces.
        const forceChange = Math.random() < .42;
        const face = chooseIdleFace(duck, forceChange);
        setDuckFace(duck, face);
      }

      scheduleMoodShift(duck, 9000 + Math.random() * 13000);
    }, delay);
  }

  function collisionPairKey(a, b) {
    const aId = Number(a.dataset.duckId);
    const bId = Number(b.dataset.duckId);
    return aId < bId ? `${aId}:${bId}` : `${bId}:${aId}`;
  }

  function ducksAreTouching(a, b) {
    const ap = currentPosition(a);
    const bp = currentPosition(b);
    if (![ap.x, ap.y, bp.x, bp.y].every(Number.isFinite)) return false;

    // Elliptical hit area: ducks are visually wider than they are tall.
    const nx = (ap.x - bp.x) / 3.7;
    const ny = (ap.y - bp.y) / 2.8;
    return nx * nx + ny * ny < 1;
  }

  function collisionEscapePoint(duck, sourceDuck) {
    const from = currentPosition(duck);
    const source = currentPosition(sourceDuck);
    let dx = from.x - source.x;
    let dy = from.y - source.y;
    let length = Math.hypot(dx, dy);

    if (length < .1) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      length = 1;
    }

    dx /= length;
    dy /= length;

    for (const distanceAway of [10, 8, 6]) {
      for (const angleOffset of [0, .28, -.28, .5, -.5]) {
        const c = Math.cos(angleOffset);
        const s = Math.sin(angleOffset);
        const rx = dx * c - dy * s;
        const ry = dx * s + dy * c;
        const candidate = {
          x: from.x + rx * distanceAway,
          y: from.y + ry * distanceAway * .62
        };
        if (canDuckStopAt(candidate.x, candidate.y) && segmentClear(from, candidate)) {
          return candidate;
        }
      }
    }

    return nearbyPoint(from);
  }

  async function startCollisionEscape(duck, sourceDuck) {
    if (!duck.isConnected || duck.dataset.motionState !== "floating") return;
    if (duck.dataset.collisionEscaping === "true") return;

    duck.dataset.collisionEscaping = "true";
    clearTimeout(duck._roamTimer);

    // The duck that actually scoots away should look startled, not angry.
    setDuckFace(duck, "surprised");

    const from = currentPosition(duck);
    const to = collisionEscapePoint(duck, sourceDuck);
    const distanceAway = distance(from, to);

    if (distanceAway < .5) {
      duck.dataset.collisionEscaping = "false";
    duck.dataset.nextCollisionReactionAt = String(performance.now() + 2500 + Math.random() * 6500);
      restoreIdleFace(duck);
      scheduleRoam(duck, 1800 + Math.random() * 2500);
      return;
    }

    duck.dataset.motionState = "swimming";
    duck.classList.remove("floating");
    activeSwimmers++;

    await animateRoute(duck, from, to, Math.max(1900, Math.min(3200, 1250 + distanceAway * 160)));

    activeSwimmers = Math.max(0, activeSwimmers - 1);
    if (!duck.isConnected) return;

    duck.dataset.motionState = "floating";
    duck.dataset.collisionEscaping = "false";
    duck.classList.add("floating");
    restoreIdleFace(duck);
    scheduleRoam(duck, 3600 + Math.random() * 5500);
  }

  function triggerCollisionReaction(a, b) {
    const now = performance.now();
    const key = collisionPairKey(a, b);
    const lastPair = collisionPairs.get(key) || 0;
    const aReadyAt = Number(a.dataset.nextCollisionReactionAt || 0);
    const bReadyAt = Number(b.dataset.nextCollisionReactionAt || 0);

    // A crowded pond should have occasional character moments, not constant
    // pinball reactions. Gate collisions globally, per-duck and per-pair.
    if (now < nextGlobalCollisionReactionAt) return;
    if (now < aReadyAt || now < bReadyAt) return;
    if (now - lastPair < 30000) return;

    // Even when two sprites touch, most encounters are ignored visually.
    if (Math.random() > .28) return;

    collisionPairs.set(key, now);
    nextGlobalCollisionReactionAt = now + randomCollisionGap();
    a.dataset.nextCollisionReactionAt = String(now + randomDuckCollisionCooldown());
    b.dataset.nextCollisionReactionAt = String(now + randomDuckCollisionCooldown());

    // Prefer a stationary duck as the one that scoots away. If both are
    // stationary, choose randomly. If both are already moving, just shudder.
    let escapee = null;
    if (a.dataset.motionState === "floating" && b.dataset.motionState === "floating") {
      escapee = Math.random() < .5 ? a : b;
    } else if (a.dataset.motionState === "floating") {
      escapee = a;
    } else if (b.dataset.motionState === "floating") {
      escapee = b;
    }
    const source = escapee === a ? b : escapee === b ? a : null;

    a.dataset.reacting = "true";
    b.dataset.reacting = "true";
    a.classList.add("collision-bump");
    b.classList.add("collision-bump");

    // The duck that will retreat is shocked; the other gets annoyed.
    if (escapee) {
      setDuckFace(escapee, "surprised");
      setDuckFace(source, "angry");
    } else {
      setDuckFace(a, "angry");
      setDuckFace(b, Math.random() < .55 ? "angry" : "surprised");
    }

    setTimeout(() => {
      for (const duck of [a, b]) {
        if (!duck.isConnected) continue;
        duck.classList.remove("collision-bump");
        duck.dataset.reacting = "false";
        // Keep the escapee shocked until its scoot is complete.
        if (duck !== escapee || duck.dataset.collisionEscaping !== "true") {
          restoreIdleFace(duck);
        }
      }
    }, 720);

    if (escapee && source) {
      setTimeout(() => startCollisionEscape(escapee, source), 220);
    }
  }

  function checkDuckCollisions(duck) {
    if (!duck.isConnected || !["floating", "swimming"].includes(duck.dataset.motionState)) return;

    const now = performance.now();
    if (now - Number(duck._lastCollisionCheck || 0) < 110) return;
    duck._lastCollisionCheck = now;

    for (const other of ducks.values()) {
      if (other === duck || !other.isConnected) continue;
      if (!["floating", "swimming"].includes(other.dataset.motionState)) continue;
      if (ducksAreTouching(duck, other)) {
        triggerCollisionReaction(duck, other);
        break;
      }
    }
  }

  function buildEntryVisual(duck, frameIndex = 1) {
    const visual = duck.querySelector(".duck-visual");
    visual.replaceChildren();

    const image = document.createElement("img");
    image.className = "entry-frame";
    image.src = walkFrameSrc(duck.dataset.duckType, duck.dataset.featherTone, frameIndex);
    image.alt = "";

    const hat = document.createElement("img");
    hat.className = "entry-hat";
    hat.src = HAT_ASSETS.walk;
    hat.alt = "";

    visual.append(image, hat);
  }

  function setWalkFrame(duck, frameNumber) {
    const image = duck.querySelector(".entry-frame");
    if (!image) return;
    image.src = walkFrameSrc(duck.dataset.duckType, duck.dataset.featherTone, frameNumber);
    duck.dataset.walkFrame = String(frameNumber);
  }

  function buildSwimVisual(duck, faceName = "sad") {
    const visual = duck.querySelector(".duck-visual");
    visual.replaceChildren();

    const stack = document.createElement("span");
    stack.className = "swim-stack";
    const facingRight = duck.dataset.facing === "right";
    stack.style.setProperty(
      "--facing-scale",
      facingRight ? "-1" : "1"
    );
    stack.style.setProperty(
      "--hat-counter-scale",
      facingRight ? "-1" : "1"
    );

    const wake = document.createElement("img");
    wake.className = "swim-layer swim-wake";
    wake.src = SWIM_ASSETS.wakes[duck.dataset.duckType] || SWIM_ASSETS.wakes.standard;
    wake.alt = "";

    const wingBack = document.createElement("img");
    wingBack.className = "swim-layer swim-wing-back";
    wingBack.src = swimWingSrc("back", duck.dataset.featherTone);
    wingBack.alt = "";

    const body = document.createElement("img");
    body.className = "swim-layer swim-body";
    body.src = swimBodySrc(duck.dataset.duckType, duck.dataset.featherTone);
    body.alt = "";

    const face = document.createElement("img");
    face.className = "swim-layer swim-face";
    face.src = swimFaceSrc(faceName, duck.dataset.featherTone);
    face.alt = "";

    const wingFront = document.createElement("img");
    wingFront.className = "swim-layer swim-wing-front";
    wingFront.src = swimWingSrc("front", duck.dataset.featherTone);
    wingFront.alt = "";

    const hat = document.createElement("img");
    hat.className = "swim-layer swim-hat";
    hat.src = swimHatSrc(duck.dataset.facing);
    hat.alt = "";

    stack.append(wingBack, body, wake, face, wingFront, hat);
    visual.appendChild(stack);

    duck.dataset.face = faceName;
  }

  function reactToClick(duck) {
    if (!["floating", "swimming"].includes(duck.dataset.motionState)) return;
    if (duck.dataset.reacting === "true") return;

    const angry = Math.random() < 0.5;
    duck.dataset.reacting = "true";
    duck.classList.add("reacting");
    duck.classList.toggle("reaction-angry", angry);
    duck.classList.toggle("reaction-surprised", !angry);
    setDuckFace(duck, angry ? "angry" : "surprised");

    setTimeout(() => {
      if (!duck.isConnected) return;
      duck.classList.remove("reacting", "reaction-angry", "reaction-surprised");
      duck.dataset.reacting = "false";

      // iOS Safari can briefly retain the composited reaction frame if the
      // transform animation ends and the face image source is swapped in the
      // same rendering tick. Restore the idle face on the next painted frame
      // so the stack returns to its normal transform before the image changes.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (duck.isConnected && duck.dataset.reacting !== "true") {
            restoreIdleFace(duck);
          }
        });
      });
    }, angry ? 900 : 820);
  }

  function makeDuck({ point, instant = false, duckType = selectedDuckType, featherTone = selectedFeatherTone, buildVariant = selectedBuildVariant }) {
    const id = nextDuckId++;
    const duck = document.createElement("button");
    duck.type = "button";
    duck.className = "duck";
    duck.dataset.motionState = instant ? "floating" : "entering";
    duck.dataset.reacting = "false";
    duck.dataset.duckId = String(id);
    duck.dataset.buildVariant = BUILD_VARIANTS[buildVariant] ? buildVariant : "standard";
    duck.dataset.duckType = DUCK_TYPES.includes(duckType) ? duckType : "standard";
    duck.dataset.featherTone = FEATHER_TONES[featherTone] ? featherTone : "white";
    duck.dataset.facing = "left";
    duck.dataset.collisionEscaping = "false";
    duck.dataset.blinking = "false";
    chooseIdleFace(duck);
    duck.dataset.swimPace = (0.88 + (id % 5) * 0.06).toFixed(2);
    duck.setAttribute(
      "aria-label",
      `Duck ${id}, ${duck.dataset.duckType} duck`
    );

    applyDuckSize(duck);
    duck.style.setProperty("--bob-duration", `${4 + (id % 7) * .27}s`);

    const visual = document.createElement("span");
    visual.className = "duck-visual";
    duck.appendChild(visual);

    if (instant) {
      buildSwimVisual(duck, duck.dataset.idleFace || "neutral");
    } else {
      buildEntryVisual(duck, 1);
    }

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
      scheduleMoodShift(duck);
      scheduleRoam(duck, 1000 + Math.random() * 9000);
      scheduleIdleLife(duck);
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
      { at:0,    x:-11, y:72.75, rotation:-2, scale:.82, opacity:1 },
      { at:.16,  x:-4,  y:72.58, rotation:2,  scale:.82, opacity:1 },
      { at:.33,  x:3,   y:72.75, rotation:-2, scale:.82, opacity:1 },
      { at:.50,  x:10,  y:72.58, rotation:2,  scale:.82, opacity:1 },
      { at:.67,  x:17,  y:72.75, rotation:-2, scale:.82, opacity:1 },
      { at:.82,  x:23.5,y:72.58, rotation:2,  scale:.82, opacity:1 },
      { at:.94,  x:28.5,y:72.70, rotation:-1, scale:.82, opacity:1 },
      { at:1,    x:31,  y:72.45, rotation:0,  scale:.82, opacity:1 }
    ];

    // Requested walk cycle: 1 -> 2 -> 3 -> 2 -> 1, repeating.
    // Explicitly finish on frame 2 before the pre-jump squash.
    const walkCycle = [1, 2, 3, 2, 1];
    let walkIndex = 0;
    setWalkFrame(duck, walkCycle[walkIndex]);

    duck._walkTimer = setInterval(() => {
      if (!duck.isConnected) return;
      walkIndex = (walkIndex + 1) % walkCycle.length;
      setWalkFrame(duck, walkCycle[walkIndex]);
    }, 175);

    await animateEntrySegment(duck, walkFrames, 4600, t => t, "feet");
    clearInterval(duck._walkTimer);
    duck._walkTimer = null;
    setWalkFrame(duck, 2);

    // Brief anticipation squash at the pier edge.
    duck.classList.add("prejump");
    await sleep(300);
    duck.classList.remove("prejump");

    const jumpFrames = [
      { at:0,   x:31,   y:72.45, rotation:0, scale:.82, opacity:1 },
      { at:.38, x:33.8, y:65.5,  rotation:5, scale:.80, opacity:1 },
      { at:1,   x:37,   y:73.6,  rotation:8, scale:.64, opacity:0 }
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

        setWorldPosition(duck, x, y);
        setEntryVisual(duck, rotation, scale);

        if (!splashCreated && raw >= .68) {
          splashCreated = true;
          duck.style.opacity = "0";
          createSplashAnimation(37, 73.6, duck.dataset.duckType);
        } else if (!splashCreated) {
          duck.style.opacity = "1";
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
    await sleep(460);

    // The swimming sprite replaces the walking sprite while the duck is
    // underwater. The small first splash cell acts as the resurfacing ring.
    duck.classList.remove("entrying");
    clearEntryVisual(duck);
    buildSwimVisual(duck, duck.dataset.idleFace || "neutral");

    const entry = { x: 37, y: 73.6 };
    setWorldPosition(duck, entry.x, entry.y);
    duck.dataset.x = entry.x.toFixed(3);
    duck.dataset.y = entry.y.toFixed(3);
    setDepth(duck, entry.y);

    createResurfaceEffect(entry.x, entry.y, duck.dataset.duckType);

    const appearStarted = performance.now();
    await new Promise(resolve => {
      function appearFrame(now) {
        if (!duck.isConnected) {
          resolve();
          return;
        }

        const raw = Math.min(1, (now - appearStarted) / 520);
        const eased = 1 - Math.pow(1 - raw, 3);
        const y = 74.6 + (entry.y - 74.6) * eased;

        setWorldPosition(duck, entry.x, y);
        duck.style.opacity = String(eased);
        setDepth(duck, y);

        if (raw < 1) {
          duck._entryFrame = requestAnimationFrame(appearFrame);
        } else {
          resolve();
        }
      }

      duck._entryFrame = requestAnimationFrame(appearFrame);
    });

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
      Math.max(4800, Math.min(9000, (3300 + distance(entry, destination) * 150) / Number(duck.dataset.swimPace || "1")))
    );

    activeSwimmers = Math.max(0, activeSwimmers - 1);
    duck.dataset.motionState = "floating";
    duck.classList.add("floating");
    scheduleMoodShift(duck);
    scheduleRoam(duck);
    scheduleIdleLife(duck);
  }

  function addAnimatedDuck() {
    const duck = makeDuck({
      point:{x:37,y:73.6},
      instant:false,
      duckType:selectedDuckType,
      featherTone:selectedFeatherTone,
      buildVariant:selectedBuildVariant
    });
    animateEntry(duck, null);
  }

  function resetPond() {
    for (const duck of ducks.values()) {
      clearTimeout(duck._roamTimer);
      clearTimeout(duck._moodTimer);
      clearTimeout(duck._blinkTimer);
      clearTimeout(duck._blinkReturnTimer);
      clearTimeout(duck._doubleBlinkTimer);
      clearTimeout(duck._doubleBlinkReturnTimer);
      clearTimeout(duck._idleWingTimer);
      clearTimeout(duck._idleWingEndTimer);
      if (duck._walkTimer) clearInterval(duck._walkTimer);
      if (duck._moveFrame) cancelAnimationFrame(duck._moveFrame);
      if (duck._entryFrame) cancelAnimationFrame(duck._entryFrame);
      duck.getAnimations().forEach(animation => animation.cancel());
    }

    duckLayer.replaceChildren();
    splashLayer.replaceChildren();
    ducks.clear();
    nextDuckId = 1;
    activeSwimmers = 0;
    collisionPairs.clear();
    nextGlobalCollisionReactionAt = performance.now() + 3000 + Math.random() * 4000;
    nextGlobalIdleWingAt = 0;
    updateCounts();

    destinationMarker.hidden = true;
    status.textContent = "Pond reset.";
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

      // Fixed stress-test distribution: 55 standard, 4 golden, 1 diamond.
      let loadDuckType = "standard";
      if (i >= target - 1) loadDuckType = "diamond";
      else if (i >= target - 5) loadDuckType = "golden";

      // Feather tone and build are mixed for testing and will eventually come from player data.
      const featherTone = FEATHER_TONE_KEYS[Math.floor(Math.random() * FEATHER_TONE_KEYS.length)];

      // For the 60-duck stress test, exaggeration is deliberately uncommon:
      // one beanpole, a handful of broader ducks, some short ducks, mostly standard.
      let buildVariant = "standard";
      if (i === 0) buildVariant = "beanpole";
      else if (i < 7) buildVariant = "stocky";
      else if (i < 10) buildVariant = "big";
      else if (i < 18) buildVariant = "short";

      makeDuck({ point: safeBest, instant: true, duckType: loadDuckType, featherTone, buildVariant });
    }

    status.textContent =
      `Loaded 60 ducks: 55 standard, 4 golden, 1 diamond, with mixed feather tones and builds.`;
  }

  function updateDuckTypeButton() {
    const label = selectedDuckType.charAt(0).toUpperCase() + selectedDuckType.slice(1);
    duckTypeButton.textContent = `Duck Type: ${label}`;
  }

  featherToneButton.addEventListener("click", () => {
    const index = FEATHER_TONE_KEYS.indexOf(selectedFeatherTone);
    selectedFeatherTone = FEATHER_TONE_KEYS[(index + 1) % FEATHER_TONE_KEYS.length];
    updateFeatherToneButton();
    status.textContent = `New ducks will use ${FEATHER_TONES[selectedFeatherTone].label.toLowerCase()} feathers.`;
  });

  buildVariantButton.addEventListener("click", () => {
    const index = BUILD_VARIANT_KEYS.indexOf(selectedBuildVariant);
    selectedBuildVariant = BUILD_VARIANT_KEYS[(index + 1) % BUILD_VARIANT_KEYS.length];
    updateBuildVariantButton();
    status.textContent = `New ducks will use the ${BUILD_VARIANTS[selectedBuildVariant].label.toLowerCase()} build.`;
  });

  duckTypeButton.addEventListener("click", () => {
    const index = DUCK_TYPES.indexOf(selectedDuckType);
    selectedDuckType = DUCK_TYPES[(index + 1) % DUCK_TYPES.length];
    updateDuckTypeButton();
    status.textContent =
      `New ducks will be ${selectedDuckType}.`;
  });

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
  updateDuckTypeButton();
  updateFeatherToneButton();
  updateBuildVariantButton();

  window.addEventListener("load", applyWorldScale, { once: true });
})();
