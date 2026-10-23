/*! Kanji sharks: copyright (c) 2026 michikusa404 (MIT). Animation adapted from stackedlol/ascii-sharks, commit c521e24a787e6d4cc460d4cf2b9815f25e4fe453. See THIRD_PARTY_NOTICES.md. */
window.__ModuleLoader__.load({ id: 'dsh-ascii-whales', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_react = require("react");

// src/settings.mjs
var defaults = Object.freeze({ species: "humpback", enabled: true, inConversation: false, colorfulShimmer: false, eyeColor: "primary", count: 3, bodySwing: 0.8, turnAgility: 0.7, tailFrequency: 0.8, speed: 0.65, size: 1.2, opacity: 1, glass: true, blur: 14, gridScale: 1, gridOpacity: 0.05, glassOpacity: 0.45, fishCount: 170, wake: 1, color: "#4d6bfe", glyphMode: "ascii", fontSource: "bundled", asciiFont: "", hanziFont: "" });
var ranges = Object.freeze({ count: [1, 20, 1], speed: [0.1, 10, 0.1], bodySwing: [0, 3, 0.1], turnAgility: [0.1, 3, 0.1], tailFrequency: [0.1, 5, 0.1], size: [0.1, 10, 0.1], opacity: [0, 1, 0.05], gridScale: [0.1, 10, 0.1], gridOpacity: [0, 1, 0.01], fishCount: [0, 1e3, 10], wake: [0, 10, 0.1], blur: [0, 64, 1], glassOpacity: [0, 1, 0.05] });
var storageKey = "dsh-ascii-whales:v1";
var fractionalSteps = ["speed", "size", "gridScale", "wake", "bodySwing", "turnAgility", "tailFrequency"];
var inputStep = (key, value) => fractionalSteps.includes(key) && value < 1 ? 0.05 : ranges[key][2];
function normalize(value) {
  const result = { ...defaults };
  if (!value || typeof value !== "object") return result;
  if (value.species === "humpback" || value.species === "orca") result.species = value.species;
  if (typeof value.enabled === "boolean") result.enabled = value.enabled;
  if (typeof value.inConversation === "boolean") result.inConversation = value.inConversation;
  if (typeof value.colorfulShimmer === "boolean") result.colorfulShimmer = value.colorfulShimmer;
  if (value.eyeColor === "primary" || value.eyeColor === "black" || value.eyeColor === "white") result.eyeColor = value.eyeColor;
  if (typeof value.glass === "boolean") result.glass = value.glass;
  if (value.glyphMode === "ascii" || value.glyphMode === "hanzi" || value.glyphMode === "kanji") result.glyphMode = value.glyphMode;
  if (value.fontSource === "bundled" || value.fontSource === "local") result.fontSource = value.fontSource;
  for (const key of ["asciiFont", "hanziFont"]) {
    if (typeof value[key] === "string" && /^[\p{L}\p{N} ._()\-]{0,100}$/u.test(value[key])) result[key] = value[key];
  }
  if (typeof value.color === "string" && /^#[\da-f]{6}$/i.test(value.color)) result.color = value.color.toLowerCase();
  for (const [key, [min, max]] of Object.entries(ranges)) {
    if (typeof value[key] === "number" && Number.isFinite(value[key])) {
      result[key] = Math.min(max, Math.max(min, value[key]));
    }
  }
  result.count = Math.round(result.count);
  result.fishCount = Math.round(result.fishCount);
  return result;
}
function readSettings(storage) {
  try {
    return normalize(JSON.parse(storage.getItem(storageKey)));
  } catch {
    return { ...defaults };
  }
}

// vendor/ascii-sharks/cells.ts
function cellSize(scale, square) {
  const cw = Math.max(1, Math.round(8 * scale));
  const ch = Math.round(cw * 1.45);
  const side = Math.max(4, Math.round(Math.sqrt(cw * ch)));
  return square ? [side, side] : [cw, ch];
}

// vendor/ascii-sharks/math.ts
var TAU = Math.PI * 2;
var clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
var rand = (lo, hi) => lo + Math.random() * (hi - lo);
var randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));
function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
function angleDiff(a, b) {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}
function hash3(x, y, z) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ h >>> 13, 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
var K1 = 1 / 260;
var K2 = 1 / 310;
var K3 = 1 / 190;
var CURRENT_SCALE = 3400;
function current(x, y, t, out) {
  const a = x * K1 + t * 0.07;
  const b = y * K2 - t * 0.05;
  const c = (x + y) * K3 + t * 0.11;
  out.x = (-K2 * Math.sin(a) * Math.sin(b) + 0.5 * K3 * Math.cos(c)) * CURRENT_SCALE;
  out.y = (-K1 * Math.cos(a) * Math.cos(b) - 0.5 * K3 * Math.cos(c)) * CURRENT_SCALE;
  return out;
}

// vendor/ascii-sharks/species.ts
var SPECIES = [
  {
    name: "sardine",
    cruise: 36,
    maxSpeed: 64,
    minSpeed: 18,
    weight: 3,
    schoolSize: [18, 28],
    spacing: [1.8, 1.1],
    align: 1.6,
    cohesion: 1.6,
    jitter: 40,
    mill: 70,
    verticalDrag: 0.5
  },
  {
    name: "anchovy",
    cruise: 46,
    maxSpeed: 78,
    minSpeed: 22,
    weight: 3,
    schoolSize: [20, 32],
    spacing: [1.5, 1],
    align: 3.2,
    cohesion: 0.45,
    jitter: 30,
    mill: 0,
    verticalDrag: 1.4
  },
  {
    name: "silverside",
    cruise: 40,
    maxSpeed: 70,
    minSpeed: 20,
    weight: 3,
    schoolSize: [12, 20],
    spacing: [2, 1.1],
    align: 2.4,
    cohesion: 1.1,
    jitter: 35,
    mill: 0,
    verticalDrag: 1.6
  },
  {
    name: "mackerel",
    cruise: 32,
    maxSpeed: 60,
    minSpeed: 16,
    weight: 2,
    schoolSize: [5, 9],
    spacing: [2.6, 1.3],
    align: 2,
    cohesion: 0.9,
    jitter: 25,
    mill: 0,
    verticalDrag: 2
  },
  {
    name: "goby",
    cruise: 26,
    maxSpeed: 56,
    minSpeed: 10,
    weight: 1,
    schoolSize: [8, 12],
    spacing: [1.4, 1.1],
    align: 0.35,
    cohesion: 1.4,
    jitter: 110,
    mill: 0,
    verticalDrag: 0.3
  }
];
var TOTAL_WEIGHT = SPECIES.reduce((sum, s) => sum + s.weight, 0);
function pickSpecies() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < SPECIES.length; i++) {
    r -= SPECIES[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

// vendor/ascii-sharks/world.ts
var SHARK_NODES = 20;
var DEFAULT_SHARKS = [
  { kind: "classic", size: 1 },
  { kind: "classic", size: 0.7 },
  { kind: "classic", size: 0.84 },
  { kind: "classic", size: 0.77 }
];
var FISH_SEPARATION_K = 420;
var FISH_ALIGN_K = 1.4;
var FISH_COHESION_K = 1;
var FISH_FLEE_K = 1100;
var BLIND_COS = -0.6;
var World = class {
  /** fishCount overrides the area-based population (the sidebar wants a single small school). */
  constructor(sharkSpecs = DEFAULT_SHARKS, fishCount) {
    this.sharkSpecs = sharkSpecs;
    this.fishCount = fishCount;
  }
  turnAgility = 1;
  tailFrequency = 1;
  width = 0;
  height = 0;
  time = 0;
  fish = [];
  sharks = [];
  events = [];
  pointer = { x: 0, y: 0, active: false };
  /** Fish neighbourhood radius; the spatial hash bucket size matches it. */
  perception = 60;
  /** Per-species personal space in px (x, y). */
  sepX = [];
  sepY = [];
  foreignSep = 40;
  bucketCols = 0;
  bucketRows = 0;
  bucketHead = new Int32Array(0);
  bucketCount = new Uint16Array(0);
  bucketNext = new Int32Array(0);
  lastSpawn = 0;
  tmp = { x: 0, y: 0 };
  resize(width, height, cellW, cellH) {
    const first = this.width === 0;
    this.width = width;
    this.height = height;
    this.sepX = SPECIES.map((sp) => sp.spacing[0] * cellW);
    this.sepY = SPECIES.map((sp) => sp.spacing[1] * cellH);
    this.perception = Math.max(cellH * 3, cellW * 5.5);
    this.foreignSep = cellW * 3;
    if (first || this.fish.length === 0) {
      this.seed();
      return;
    }
    for (const f of this.fish) {
      f.x = clamp(f.x, 0, width);
      f.y = clamp(f.y, 0, height);
    }
  }
  seed() {
    const { width: W, height: H } = this;
    const minSide = Math.min(W, H);
    const baseLength = clamp(minSide * 0.44, 170, 430);
    const sharkCount = this.sharkSpecs.length;
    this.sharks = [];
    for (let i = 0; i < sharkCount; i++) {
      const { kind, size } = this.sharkSpecs[i];
      const length = baseLength * size;
      const orbitRadius = minSide * rand(0.28, 0.4);
      const a = i / sharkCount * TAU + rand(-0.4, 0.4);
      const orbitDir = i % 2 === 0 ? 1 : -1;
      const x = W / 2 + Math.cos(a) * orbitRadius * (W / minSide) * 0.9;
      const y = H / 2 + Math.sin(a) * orbitRadius;
      const heading = a + orbitDir * Math.PI / 2;
      const nodes = new Float32Array(SHARK_NODES * 2);
      const seg = length / (SHARK_NODES - 1);
      for (let n = 0; n < SHARK_NODES; n++) {
        nodes[n * 2] = x - Math.cos(heading) * seg * n;
        nodes[n * 2 + 1] = y - Math.sin(heading) * seg * n;
      }
      this.sharks.push({
        id: i + 1,
        kind,
        length,
        nodes,
        heading,
        speed: 30,
        phase: rand(0, TAU),
        turn: 0,
        hunger: rand(0.25, 0.75),
        wander: 0,
        orbitDir,
        orbitRadius,
        target: null,
        retargetAt: 0,
        depth: size
      });
    }
    this.sharks.sort((a, b) => a.length - b.length);
    const total = this.fishCount ?? clamp(Math.round(W * H / 4400), 85, 340);
    this.fish = [];
    while (this.fish.length < total) {
      const species = pickSpecies();
      const sp = SPECIES[species];
      const size = Math.min(randInt(sp.schoolSize[0], sp.schoolSize[1]), total - this.fish.length);
      const millDir = Math.random() < 0.5 ? 1 : -1;
      const cx = rand(W * 0.06, W * 0.94);
      const cy = rand(H * 0.08, H * 0.92);
      const dir = (Math.random() < 0.5 ? 0 : Math.PI) + rand(-0.5, 0.5);
      for (let k = 0; k < size; k++) {
        this.fish.push({
          x: cx + rand(-1, 1) * this.sepX[species] * Math.sqrt(size),
          y: cy + rand(-1, 1) * this.sepY[species] * Math.sqrt(size) * 0.6,
          vx: Math.cos(dir) * sp.cruise,
          vy: Math.sin(dir) * sp.cruise,
          species,
          alarm: 0,
          alive: true,
          respawnAt: 0,
          phase: rand(0, TAU),
          turn: 0,
          depth: rand(0.55, 1),
          millDir
        });
      }
    }
    this.bucketNext = new Int32Array(this.fish.length);
  }
  splash(x, y) {
    this.events.push({ kind: "splash", x, y });
    const r = 240;
    for (const f of this.fish) {
      if (!f.alive) continue;
      const dx = f.x - x;
      const dy = f.y - y;
      const d = Math.hypot(dx, dy);
      if (d > r || d < 1e-3) continue;
      const k = (1 - d / r) * 260;
      f.vx += dx / d * k;
      f.vy += dy / d * k;
      f.alarm = 1;
    }
  }
  step(dt, beatDt = dt) {
    this.time += dt;
    this.rebuildHash();
    this.stepFish(dt);
    this.stepSharks(dt, beatDt);
    this.respawn();
  }
  rebuildHash() {
    const size = this.perception;
    const pad = 2;
    this.bucketCols = Math.ceil(this.width / size) + pad * 2;
    this.bucketRows = Math.ceil(this.height / size) + pad * 2;
    const n = this.bucketCols * this.bucketRows;
    if (this.bucketHead.length !== n) {
      this.bucketHead = new Int32Array(n);
      this.bucketCount = new Uint16Array(n);
    }
    this.bucketHead.fill(-1);
    this.bucketCount.fill(0);
    if (this.bucketNext.length !== this.fish.length) {
      this.bucketNext = new Int32Array(this.fish.length);
    }
    for (let i = 0; i < this.fish.length; i++) {
      const f = this.fish[i];
      if (!f.alive) continue;
      const b = this.bucketOf(f.x, f.y);
      this.bucketNext[i] = this.bucketHead[b];
      this.bucketHead[b] = i;
      this.bucketCount[b]++;
    }
  }
  bucketOf(x, y) {
    const size = this.perception;
    const c = clamp(Math.floor(x / size) + 2, 0, this.bucketCols - 1);
    const r = clamp(Math.floor(y / size) + 2, 0, this.bucketRows - 1);
    return r * this.bucketCols + c;
  }
  stepFish(dt) {
    const { fish, sharks, pointer, width: W, height: H, time } = this;
    const R = this.perception;
    const R2 = R * R;
    const foreignSep = this.foreignSep;
    const size = this.perception;
    const cols = this.bucketCols;
    const rows = this.bucketRows;
    const head = this.bucketHead;
    const next = this.bucketNext;
    const cur = this.tmp;
    const calmDecay = Math.exp(-dt * 0.7);
    const contagion = Math.min(1, dt * 6);
    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      if (!f.alive) continue;
      const sp = SPECIES[f.species];
      const spread = 1 + 1.8 * f.alarm;
      const sepX = this.sepX[f.species] * spread;
      const sepY = this.sepY[f.species] * spread;
      const speed = Math.hypot(f.vx, f.vy) || 1;
      const hx = f.vx / speed;
      const hy = f.vy / speed;
      let ax = 0;
      let ay = 0;
      let sx = 0;
      let sy = 0;
      let avx = 0;
      let avy = 0;
      let cx = 0;
      let cy = 0;
      let n = 0;
      let neighbourAlarm = 0;
      const bc = clamp(Math.floor(f.x / size) + 2, 0, cols - 1);
      const br = clamp(Math.floor(f.y / size) + 2, 0, rows - 1);
      for (let r = Math.max(0, br - 1); r <= Math.min(rows - 1, br + 1); r++) {
        for (let c = Math.max(0, bc - 1); c <= Math.min(cols - 1, bc + 1); c++) {
          let j = head[r * cols + c];
          while (j !== -1) {
            if (j !== i) {
              const o = fish[j];
              const dx = o.x - f.x;
              const dy = o.y - f.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < R2 && d2 > 1e-6) {
                const d = Math.sqrt(d2);
                if ((dx * hx + dy * hy) / d > BLIND_COS) {
                  const qx = dx / sepX;
                  const qy = dy / sepY;
                  const q2 = qx * qx + qy * qy;
                  if (q2 < 1) {
                    const q = Math.sqrt(q2) || 1e-3;
                    const k = (1 - q) / q;
                    sx -= qx * k;
                    sy -= qy * k;
                  }
                  if (o.species === f.species) {
                    avx += o.vx;
                    avy += o.vy;
                    cx += dx;
                    cy += dy;
                    n++;
                  } else if (d < foreignSep) {
                    const k = (1 - d / foreignSep) / d * 0.6;
                    sx -= dx * k;
                    sy -= dy * k;
                  }
                  if (o.alarm > neighbourAlarm) neighbourAlarm = o.alarm;
                }
              }
            }
            j = next[j];
          }
        }
      }
      ax += sx * FISH_SEPARATION_K;
      ay += sy * FISH_SEPARATION_K;
      if (n > 0) {
        const alignK = FISH_ALIGN_K * sp.align;
        const cohesionK = FISH_COHESION_K * sp.cohesion * (1 - 0.8 * f.alarm);
        ax += (avx / n - f.vx) * alignK + cx / n * cohesionK;
        ay += (avy / n - f.vy) * alignK + cy / n * cohesionK;
        if (sp.mill > 0) {
          const cl = Math.hypot(cx, cy) || 1;
          ax += -cy / cl * f.millDir * sp.mill * (1 - f.alarm);
          ay += cx / cl * f.millDir * sp.mill * (1 - f.alarm);
        }
      }
      let fear = 0;
      for (const sh of sharks) {
        const fearR = sh.length * 0.6 + 60;
        let best = Infinity;
        let bx = 0;
        let by = 0;
        for (let k = 0; k <= 12; k += 3) {
          const nx = sh.nodes[k * 2];
          const ny = sh.nodes[k * 2 + 1];
          const d2 = (f.x - nx) ** 2 + (f.y - ny) ** 2;
          if (d2 < best) {
            best = d2;
            bx = nx;
            by = ny;
          }
        }
        const d = Math.sqrt(best);
        if (d >= fearR || d < 1e-3) continue;
        let w = 1 - d / fearR;
        w *= w;
        const awayX = (f.x - bx) / d;
        const awayY = (f.y - by) / d;
        const shx = Math.cos(sh.heading);
        const shy = Math.sin(sh.heading);
        const side = shx * (f.y - sh.nodes[1]) - shy * (f.x - sh.nodes[0]) >= 0 ? 1 : -1;
        ax += (awayX * 0.7 - shy * side * 0.9) * FISH_FLEE_K * w;
        ay += (awayY * 0.7 + shx * side * 0.9) * FISH_FLEE_K * w;
        fear = Math.max(fear, Math.sqrt(w));
      }
      if (pointer.active) {
        const pr = 130;
        const dx = f.x - pointer.x;
        const dy = f.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < pr && d > 1e-3) {
          const w = (1 - d / pr) ** 2;
          ax += dx / d * FISH_FLEE_K * w;
          ay += dy / d * FISH_FLEE_K * w;
          fear = Math.max(fear, Math.sqrt(w) * 0.8);
        }
      }
      let alarm = Math.max(f.alarm * calmDecay, fear);
      const relayed = neighbourAlarm * 0.86;
      if (relayed > alarm) alarm += (relayed - alarm) * contagion;
      f.alarm = alarm;
      const m = 36;
      if (f.x < m) ax += (m - f.x) * 7;
      else if (f.x > W - m) ax -= (f.x - (W - m)) * 7;
      if (f.y < m) ay += (m - f.y) * 7;
      else if (f.y > H - m) ay -= (f.y - (H - m)) * 7;
      current(f.x, f.y, time, cur);
      ax += cur.x * 0.5 + (Math.random() - 0.5) * sp.jitter;
      ay += cur.y * 0.5 + (Math.random() - 0.5) * sp.jitter;
      ay -= f.vy * sp.verticalDrag * (1 - 0.7 * f.alarm);
      const preferred = sp.cruise * (1 + 1.3 * f.alarm);
      ax += (preferred - speed) * hx * 1.6;
      ay += (preferred - speed) * hy * 1.6;
      const before = Math.atan2(f.vy, f.vx);
      f.vx += ax * dt;
      f.vy += ay * dt;
      const maxSpeed = sp.maxSpeed * (1 + 1.8 * f.alarm);
      const s = Math.hypot(f.vx, f.vy);
      if (s > maxSpeed) {
        f.vx *= maxSpeed / s;
        f.vy *= maxSpeed / s;
      } else if (s < sp.minSpeed && s > 1e-3) {
        f.vx *= sp.minSpeed / s;
        f.vy *= sp.minSpeed / s;
      }
      f.turn += (angleDiff(before, Math.atan2(f.vy, f.vx)) / dt - f.turn) * Math.min(1, dt * 8);
      f.phase += dt * (7 + Math.hypot(f.vx, f.vy) * 0.12);
      f.x = clamp(f.x + f.vx * dt, -60, W + 60);
      f.y = clamp(f.y + f.vy * dt, -60, H + 60);
    }
  }
  stepSharks(dt, beatDt) {
    const { sharks, width: W, height: H, time } = this;
    const minSide = Math.min(W, H);
    const cxW = W / 2;
    const cyW = H / 2;
    for (const sh of sharks) {
      const L = sh.length;
      const nodes = sh.nodes;
      const hx = nodes[0];
      const hy = nodes[1];
      sh.hunger = Math.min(1, sh.hunger + dt * 0.03);
      let dx = Math.cos(sh.heading);
      let dy = Math.sin(sh.heading);
      sh.wander = clamp(sh.wander + (Math.random() - 0.5) * dt * 3.2, -1.1, 1.1);
      dx += Math.cos(sh.heading + sh.wander) * 0.45;
      dy += Math.sin(sh.heading + sh.wander) * 0.45;
      if (time >= sh.retargetAt) {
        sh.target = this.findPrey(sh);
        sh.retargetAt = time + 0.45;
      }
      const t = sh.target;
      let hunting = false;
      let closing = 0;
      if (t && t.alive && sh.hunger > 0.3) {
        const tx = t.x + t.vx * 0.35 - hx;
        const ty = t.y + t.vy * 0.35 - hy;
        const d = Math.hypot(tx, ty) || 1;
        const w = 1.4 + 2.6 * sh.hunger;
        dx += tx / d * w;
        dy += ty / d * w;
        hunting = true;
        closing = clamp(1 - d / (L * 0.9), 0, 1);
      } else {
        const rx = (hx - cxW) / (W / minSide);
        const ry = hy - cyW;
        const r = Math.hypot(rx, ry) || 1;
        const radius = sh.orbitRadius * (1 + 0.15 * Math.sin(time * 0.05 + sh.id));
        const radial = clamp((radius - r) / radius, -1, 1);
        dx += (-ry / r * sh.orbitDir + rx / r * radial * 0.9) * 0.55;
        dy += (rx / r * sh.orbitDir + ry / r * radial * 0.9) * 0.55;
      }
      for (const other of sharks) {
        if (other === sh) continue;
        for (let k = 0; k < SHARK_NODES; k += 4) {
          const ox = hx - other.nodes[k * 2];
          const oy = hy - other.nodes[k * 2 + 1];
          const d = Math.hypot(ox, oy);
          const range = (L + other.length) * 0.45;
          if (d < range && d > 1e-3) {
            const w = (1 - d / range) * 3;
            dx += ox / d * w;
            dy += oy / d * w;
          }
        }
      }
      const ex = (hx - cxW) / (W * 0.3);
      const ey = (hy - cyW) / (H * 0.16);
      const e2 = ex * ex + ey * ey;
      if (e2 < 1) {
        const e = Math.sqrt(e2) || 1e-3;
        const w = (1 - e) * (hunting ? 1 : 2.5);
        dx += ex / e * w;
        dy += ey / e * w;
      }
      const over = Math.max(-hx, hx - W, -hy, hy - H);
      if (over > -L * 0.05) {
        const w = clamp((over + L * 0.05) / (L * 0.35), 0, 1) * 3.5;
        const toX = cxW - hx;
        const toY = cyW - hy;
        const d = Math.hypot(toX, toY) || 1;
        dx += toX / d * w;
        dy += toY / d * w;
      }
      const desired = Math.atan2(dy, dx);
      const agility = Math.min(hunting ? 1.7 + closing : 0.8, sh.speed / (L * 0.22));
      const maxTurn = agility * this.turnAgility * dt;
      const turned = clamp(angleDiff(sh.heading, desired), -maxTurn, maxTurn);
      sh.heading += turned;
      sh.turn += (turned / dt - sh.turn) * Math.min(1, dt * 3);
      const cruise = 30 + L * 0.04;
      const targetSpeed = hunting ? cruise * (1.45 + closing * 1.5) : cruise;
      sh.speed += (targetSpeed - sh.speed) * Math.min(1, dt * 1.1);
      sh.phase += beatDt * this.tailFrequency * (2 + (30 + L * 0.04) / 24);
      nodes[0] += Math.cos(sh.heading) * sh.speed * dt;
      nodes[1] += Math.sin(sh.heading) * sh.speed * dt;
      const seg = L / (SHARK_NODES - 1);
      const maxBend = 0.16 * this.turnAgility;
      let prevAngle = sh.heading + Math.PI;
      for (let k = 1; k < SHARK_NODES; k++) {
        const px = nodes[(k - 1) * 2];
        const py = nodes[(k - 1) * 2 + 1];
        let angle = Math.atan2(nodes[k * 2 + 1] - py, nodes[k * 2] - px);
        angle = prevAngle + clamp(angleDiff(prevAngle, angle), -maxBend, maxBend);
        nodes[k * 2] = px + Math.cos(angle) * seg;
        nodes[k * 2 + 1] = py + Math.sin(angle) * seg;
        prevAngle = angle;
      }
      if (sh.hunger > 0.15) {
        const mouthR = L * 0.05 + 8;
        const mx = nodes[0];
        const my = nodes[1];
        for (const f of this.fish) {
          if (!f.alive) continue;
          if ((f.x - mx) ** 2 + (f.y - my) ** 2 < mouthR * mouthR) {
            f.alive = false;
            f.respawnAt = time + rand(3, 8);
            sh.hunger = Math.max(0, sh.hunger - 0.16);
            this.events.push({ kind: "eat", x: f.x, y: f.y });
          }
        }
      }
    }
  }
  /**
   * Pick prey in the shark's forward cone, preferring close fish in sparse
   * buckets (stragglers) over fish buried in a dense school.
   */
  findPrey(sh) {
    const range = sh.length * 0.9 + 160;
    const hx = sh.nodes[0];
    const hy = sh.nodes[1];
    const fx = Math.cos(sh.heading);
    const fy = Math.sin(sh.heading);
    let best = null;
    let bestScore = Infinity;
    let currentScore = Infinity;
    for (const f of this.fish) {
      if (!f.alive) continue;
      const dx = f.x - hx;
      const dy = f.y - hy;
      const d = Math.hypot(dx, dy);
      if (d > range || d < 1e-3) continue;
      const cos = (dx * fx + dy * fy) / d;
      if (cos < 0.2) continue;
      const crowd = this.bucketCount[this.bucketOf(f.x, f.y)];
      const score = d * (1 + (1 - cos) * 0.8) * (1 + crowd * 0.07);
      if (score < bestScore) {
        bestScore = score;
        best = f;
      }
      if (f === sh.target) currentScore = score;
    }
    if (sh.target && currentScore < bestScore * 1.3) return sh.target;
    return best;
  }
  respawn() {
    const { time, width: W, height: H } = this;
    const due = [];
    for (const f of this.fish) if (!f.alive && f.respawnAt <= time) due.push(f);
    if (due.length === 0) return;
    if (due.length < 6 && time - this.lastSpawn < 9) return;
    this.lastSpawn = time;
    const side = randInt(0, 3);
    const along = rand(0.15, 0.85);
    const x = side === 0 ? -20 : side === 1 ? W + 20 : along * W;
    const y = side === 2 ? -20 : side === 3 ? H + 20 : along * H;
    const inward = Math.atan2(H / 2 - y, W / 2 - x) + rand(-0.5, 0.5);
    const species = pickSpecies();
    const sp = SPECIES[species];
    const millDir = Math.random() < 0.5 ? 1 : -1;
    for (const f of due.slice(0, sp.schoolSize[1])) {
      f.alive = true;
      f.species = species;
      f.alarm = 0;
      f.turn = 0;
      f.millDir = millDir;
      f.x = x + rand(-1, 1) * this.perception;
      f.y = y + rand(-1, 1) * this.perception;
      f.vx = Math.cos(inward) * sp.cruise * 1.4;
      f.vy = Math.sin(inward) * sp.cruise * 1.4;
    }
  }
};

// vendor/ascii-sharks/whales.ts
var humpback = {
  halfWidth: (s) => {
    if (s < 0.12) return 0.115 * Math.pow(Math.sin(s / 0.12 * Math.PI / 2), 0.45);
    if (s < 0.35) return 0.115 + 0.02 * Math.sin((s - 0.12) / 0.23 * Math.PI);
    if (s < 0.87) return 0.018 + 0.097 * Math.pow(1 - (s - 0.35) / 0.52, 1.1);
    return 0.018 * (1 - (s - 0.87) / 0.13);
  },
  pectoral: [0.25, 0.36, 0.41, 0.32],
  falcate: false,
  pelvic: [0, 0, 0, 0],
  caudal: 0.22,
  dorsal: [0.6, 0.65],
  secondDorsal: [0, 0],
  eye: [0.1, 0.13],
  gills: [0, 0],
  tint: [0.45, 0.65, 1.3]
};
var orca = {
  ...humpback,
  halfWidth: (s) => {
    if (s < 0.14) return 0.15 * Math.pow(Math.sin(s / 0.14 * Math.PI / 2), 0.35);
    if (s < 0.38) return 0.15 + 0.012 * Math.sin((s - 0.14) / 0.24 * Math.PI);
    if (s < 0.88) return 0.018 + 0.132 * Math.pow(1 - (s - 0.38) / 0.5, 1.3);
    return 0.018 * (1 - (s - 0.88) / 0.12);
  },
  pectoral: [0.25, 0.47, 0.43, 0.23],
  dorsal: [0.43, 0.55]
};
function orcaPatch(s, across) {
  return ((s - 0.205) / 0.067) ** 2 + ((across - 0.75) / 0.22) ** 2 < 1 || ((s - 0.68) / 0.12) ** 2 + ((across - 0.88) / 0.26) ** 2 < 1;
}
function orcaFlipper(s, distance, reach) {
  const t = distance / reach;
  return t >= 0 && t <= 1 && ((s - (0.31 + 0.1 * t)) / 0.085) ** 2 + ((t - 0.48) / 0.52) ** 2 <= 1;
}
function humpbackFlipper(s, distance, reach) {
  const t = distance / reach;
  if (t < 0 || t > 1) return false;
  const center = 0.29 + 0.12 * t - 0.04 * Math.sin(Math.PI * t);
  const root = 1 - 0.2 * Math.exp(-(((t - 0.43) / 0.14) ** 2));
  const width = 0.05 * (1 - 0.5 * t) * Math.sqrt(1 - t ** 6) * root;
  return Math.abs(s - center) <= width;
}
function whaleFlukes(s, across) {
  const t = across / 0.22;
  if (t < 0 || t > 1) return false;
  const front = 0.86 + 0.12 * t ** 1.7;
  const back = 0.945 + 0.035 * t + 0.028 * Math.sin(Math.PI * t);
  return s >= front && s <= back;
}

// vendor/ascii-sharks/renderer.ts
var ALPHA_LEVELS = 6;
var FISH_ALPHAS = [0.28, 0.42, 0.58, 0.74, 0.9];
var DOT_RGB = [
  [77, 107, 254],
  [65, 91, 218],
  [110, 148, 255],
  [160, 186, 255],
  [88, 141, 255]
];
var DOT_BASE_ALPHA = [1, 1, 1, 1, 1];
var WAKE = DOT_RGB.length - 1;
var COLORFUL_ACCENTS = ["#e0892c", "#e03a32", "#b44ae0", "#33c8cc", "#3cb54a", "#3150e8", "#d9c14a"];
var GLYPHS = {
  ascii: { skin: ":;t%SX8#@", fin: "%;tS:", ridge: "@8%", edgeHeavy: ":;", edgeLight: ".',`", mark: "#%@", eye: "o", fish: "-" },
  hanzi: { skin: "\u6C34\u5DDD\u6C50\u6C99\u6D6A\u6D77\u6F6E\u9CB8\u6DF1", fin: "\u9CCD", ridge: "\u9CCD", edgeHeavy: "\u4E3F\u4E28", edgeLight: "\u4E36\u4E00", mark: "\u9CB8\u6D77\u6F6E", eye: "\u76EE", fish: "\u9C7C\u9CA4\u9CAD\u9CB1" }
};
var FLAG_BODY = 1;
var FLAG_EDGE = 2;
var FLAG_FIN = 3;
var FLAG_RIDGE = 4;
var FLAG_EYE = 5;
var FLAG_MARK = 6;
var FLAG_WHITE = 7;
var SUBSAMPLES = [0.25, 0.3, 0.75, 0.3, 0.25, 0.72, 0.75, 0.72];
function classicHalfWidth(s) {
  if (s < 0.13) return 0.09 * Math.pow(Math.sin(s / 0.13 * Math.PI / 2), 0.95);
  if (s < 0.3) return 0.09 + 0.016 * smoothstep(0.13, 0.3, s);
  if (s < 0.84) return 0.019 + 0.087 * Math.pow(1 - (s - 0.3) / 0.54, 1.25);
  const k = (s - 0.84) / 0.16;
  return 0.019 * (1 - k) + 0.012 * Math.sin(k * Math.PI);
}
var SHAPES = {
  // DSH adaptation: rounded whale head, broad back, long flippers and paired tail flukes.
  whale: humpback,
  orca,
  classic: {
    halfWidth: classicHalfWidth,
    pectoral: [0.15, 0.43, 0.55, 0.26],
    falcate: true,
    pelvic: [0.57, 0.65, 0.69, 0.085],
    caudal: 0.085,
    dorsal: [0.33, 0.47],
    secondDorsal: [0.71, 0.76],
    eye: [0.1, 0.14],
    gills: [0.19, 0.29],
    tint: [0.92, 0.97, 1.05]
  },
  // Slim neck under a wide, swept-back cephalofoil (drawn in sampleShark),
  // tall first dorsal, long upper tail lobe. Bronze-olive grey.
  hammerhead: {
    halfWidth: (s) => {
      if (s < 0.06) return 0.045;
      if (s < 0.3) return 0.045 + 0.061 * smoothstep(0.06, 0.3, s);
      return classicHalfWidth(s) * 0.92;
    },
    head: { span: 0.17, sweep: 0.035, depth: 0.09, notch: 0 },
    pectoral: [0.17, 0.4, 0.5, 0.22],
    falcate: true,
    pelvic: [0.56, 0.63, 0.67, 0.075],
    caudal: 0.11,
    dorsal: [0.28, 0.44],
    secondDorsal: [0.7, 0.74],
    eye: null,
    gills: [0.16, 0.26],
    tint: [0.96, 0.98, 0.9]
  },
  // Blunt, square snout on a heavy body; barred back. Warm grey-brown.
  tiger: {
    halfWidth: (s) => {
      if (s < 0.13) return 0.1 * Math.pow(Math.sin(s / 0.13 * Math.PI / 2), 0.45);
      if (s < 0.3) return 0.1 + 0.014 * smoothstep(0.13, 0.3, s);
      if (s < 0.84) return 0.019 + 0.095 * Math.pow(1 - (s - 0.3) / 0.54, 1.2);
      const k = (s - 0.84) / 0.16;
      return 0.019 * (1 - k) + 0.012 * Math.sin(k * Math.PI);
    },
    pectoral: [0.15, 0.42, 0.53, 0.25],
    falcate: true,
    pelvic: [0.57, 0.65, 0.69, 0.085],
    caudal: 0.095,
    dorsal: [0.33, 0.46],
    secondDorsal: [0.71, 0.75],
    eye: [0.08, 0.12],
    gills: [0.19, 0.28],
    tint: [1.02, 0.95, 0.84]
  },
  // Short rounded head, body done by half-length, then a long ribbon of a
  // tail fin. Broad rounded pectorals, spotted sandy skin.
  zebra: {
    halfWidth: (s) => {
      if (s < 0.1) return 0.075 * Math.pow(Math.sin(s / 0.1 * Math.PI / 2), 0.7);
      if (s < 0.28) return 0.075 + 0.025 * smoothstep(0.1, 0.28, s);
      if (s < 0.55) return 0.022 + 0.078 * Math.pow(1 - (s - 0.28) / 0.27, 1.1);
      const k = (s - 0.55) / 0.45;
      return 0.022 * (1 - k * k) + 0.012 * Math.sin(k * Math.PI);
    },
    pectoral: [0.12, 0.3, 0.36, 0.19],
    falcate: false,
    pelvic: [0.42, 0.48, 0.51, 0.065],
    caudal: 0,
    dorsal: [0.36, 0.44],
    secondDorsal: [0.49, 0.53],
    eye: [0.06, 0.09],
    gills: [0.13, 0.2],
    tint: [1.08, 0.97, 0.74]
  },
  // Great hammerhead: a broader, nearly straight-edged cephalofoil with a notch at the centre,
  // a towering sickle first dorsal (drawn long and bright from above), and a cooler slate skin.
  greathammer: {
    halfWidth: (s) => {
      if (s < 0.05) return 0.04;
      if (s < 0.3) return 0.04 + 0.07 * smoothstep(0.05, 0.3, s);
      return classicHalfWidth(s) * 0.95;
    },
    head: { span: 0.21, sweep: 6e-3, depth: 0.085, notch: 0.014 },
    pectoral: [0.16, 0.38, 0.49, 0.24],
    falcate: true,
    pelvic: [0.55, 0.62, 0.67, 0.085],
    caudal: 0.13,
    dorsal: [0.24, 0.45],
    secondDorsal: [0.68, 0.74],
    eye: null,
    gills: [0.15, 0.25],
    tint: [0.86, 0.93, 1.02]
  },
  // Shortfin mako: a long conical snout, a torpedo body that narrows hard to the tail stalk,
  // and a tall crescent tail. Metallic indigo back.
  mako: {
    halfWidth: (s) => {
      if (s < 0.17) return 0.088 * Math.pow(Math.sin(s / 0.17 * Math.PI / 2), 1.5);
      if (s < 0.32) return 0.088 + 0.012 * smoothstep(0.17, 0.32, s);
      if (s < 0.86) return 0.014 + 0.086 * Math.pow(1 - (s - 0.32) / 0.54, 1.45);
      const k = (s - 0.86) / 0.14;
      return 0.014 * (1 - k) + 0.01 * Math.sin(k * Math.PI);
    },
    pectoral: [0.18, 0.4, 0.5, 0.21],
    falcate: true,
    pelvic: [0.58, 0.64, 0.68, 0.06],
    caudal: 0.13,
    dorsal: [0.34, 0.45],
    secondDorsal: [0.76, 0.79],
    eye: [0.11, 0.15],
    gills: [0.2, 0.3],
    tint: [0.78, 0.9, 1.2]
  },
  // Thresher: a compact body over the front half, then the upper tail lobe as a long whip
  // that's as long as the shark itself. Big eyes, long sickle pectorals, bronze-violet skin.
  thresher: {
    halfWidth: (s) => {
      if (s < 0.08) return 0.07 * Math.pow(Math.sin(s / 0.08 * Math.PI / 2), 0.75);
      if (s < 0.2) return 0.07 + 0.02 * smoothstep(0.08, 0.2, s);
      if (s < 0.48) return 0.012 + 0.078 * Math.pow(1 - (s - 0.2) / 0.28, 1.3);
      const k = (s - 0.48) / 0.52;
      return 0.012 * (1 - k) + 6e-3 * Math.sin(k * Math.PI * 0.9) + 2e-3;
    },
    pectoral: [0.12, 0.27, 0.36, 0.2],
    falcate: true,
    pelvic: [0.37, 0.41, 0.44, 0.045],
    caudal: 0,
    dorsal: [0.24, 0.32],
    secondDorsal: [0.45, 0.47],
    eye: [0.05, 0.1],
    gills: [0.11, 0.18],
    tint: [1, 0.9, 1.08]
  },
  // Nurse shark: a blunt, broad head, a heavy flattened body with both dorsals set far back,
  // rounded paddle pectorals, and a long low tail with no lower lobe. Tawny brown.
  nurse: {
    halfWidth: (s) => {
      if (s < 0.08) return 0.085 * Math.pow(Math.sin(s / 0.08 * Math.PI / 2), 0.4);
      if (s < 0.3) return 0.085 + 0.02 * smoothstep(0.08, 0.3, s);
      if (s < 0.72) return 0.022 + 0.083 * Math.pow(1 - (s - 0.3) / 0.42, 1.1);
      const k = (s - 0.72) / 0.28;
      return 0.022 * (1 - k * k) + 0.014 * Math.sin(k * Math.PI);
    },
    pectoral: [0.16, 0.34, 0.4, 0.17],
    falcate: false,
    pelvic: [0.45, 0.52, 0.55, 0.075],
    caudal: 0,
    dorsal: [0.5, 0.58],
    secondDorsal: [0.63, 0.69],
    eye: [0.05, 0.075],
    gills: [0.14, 0.22],
    tint: [1.1, 0.96, 0.76]
  }
};
var KINDS = Object.keys(SHAPES);
function inTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}
function paintGrid(g, W, H, cw, ch, dpr, dark = true, opacity = 0.05) {
  if (opacity === 0) return;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.strokeStyle = dark ? `rgba(140,165,255,${opacity})` : `rgba(77,107,254,${opacity})`;
  g.lineWidth = 1;
  g.beginPath();
  for (let c = 0; c <= Math.ceil(W / cw); c++) {
    const x = Math.round(c * cw * dpr) + 0.5;
    g.moveTo(x, 0);
    g.lineTo(x, H * dpr);
  }
  for (let r = 0; r <= Math.ceil(H / ch); r++) {
    const y = Math.round(r * ch * dpr) + 0.5;
    g.moveTo(0, y);
    g.lineTo(W * dpr, y);
  }
  g.stroke();
}
var AsciiRenderer = class {
  constructor(canvas, dark = false, gridScale = 1, gridOpacity = 0.05, wake = 1, glyphMode = "ascii") {
    this.canvas = canvas;
    this.dark = dark;
    this.gridScale = gridScale;
    this.gridOpacity = gridOpacity;
    this.wake = wake;
    this.glyphMode = glyphMode;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
    this.bg = document.createElement("canvas");
    this.setTheme(dark);
  }
  bodySwing = 1;
  ctx;
  bg;
  dpr = 1;
  width = 0;
  height = 0;
  cw = 12;
  ch = 18;
  cols = 0;
  rows = 0;
  fontFamily = "ui-monospace, Menlo, monospace";
  rgb = [77, 107, 254];
  eyeColor = "";
  accents = [];
  dotKind = new Uint8Array(0);
  // 0 none, 1 blue, 2 green, 3 red, 4 pale
  dotPhase = new Float32Array(0);
  dotFreq = new Float32Array(0);
  energy = new Float32Array(0);
  energyTmp = new Float32Array(0);
  heat = new Float32Array(0);
  bucketOf = new Uint8Array(0);
  bucketOrder = new Int32Array(0);
  bucketCounts = new Int32Array(DOT_RGB.length * ALPHA_LEVELS + 1);
  dotStyles = [];
  sharkFlag = new Uint8Array(0);
  sharkShade = new Float32Array(0);
  sharkKey = new Uint32Array(0);
  sharkDepth = new Float32Array(0);
  sharkKind = new Uint8Array(0);
  sharkGlyph = new Uint16Array(0);
  /** Cells darkened by a shark's shadow on the seabed. */
  sharkShadow = new Uint8Array(0);
  spine = new Float32Array(SHARK_NODES * 2);
  arc = new Float32Array(SHARK_NODES);
  arcTotal = 1;
  shape = SHAPES.classic;
  sharkId = 0;
  finTipLeft = 0;
  finTipRight = 0;
  // Scratch outputs of sampleShark(), to avoid allocating per sample.
  hitFlag = 0;
  hitShade = 0;
  hitS = 0;
  hitV = 0;
  hitDist = 0;
  /** Cells holding a fish this frame (frame stamp); dots skip them. */
  fishStamp = new Uint32Array(0);
  frameId = 0;
  /** Fish cells bucketed by brightness, so each bucket is one fillStyle. */
  fishBuckets = FISH_ALPHAS.map(() => []);
  fishStyles = FISH_ALPHAS.map((a) => `rgba(230,238,255,${a})`);
  get cellWidth() {
    return this.cw;
  }
  get cellHeight() {
    return this.ch;
  }
  setFontFamily(family) {
    if (family) this.fontFamily = family;
  }
  setTheme(dark, gridOpacity = this.gridOpacity, wake = this.wake, color, colorfulShimmer = false, eyeColor = "primary") {
    this.dark = dark;
    this.gridOpacity = gridOpacity;
    this.wake = wake;
    if (color) this.rgb = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
    this.eyeColor = eyeColor === "primary" ? "" : eyeColor === "black" ? "#000000" : "#ffffff";
    const fish = this.rgb.map((c) => Math.round(dark ? c * 0.6 + 102 : c * 0.7));
    this.fishStyles = FISH_ALPHAS.map((a) => `rgba(${fish.join(",")},${a})`);
    this.accents = colorfulShimmer ? COLORFUL_ACCENTS : [0, 0.2, 0.6, -0.1, 0.35, -0.2, 0.5].map((lift) => `rgb(${this.rgb.map((c) => Math.round(lift >= 0 ? c + (255 - c) * lift : c * (1 + lift))).join(",")})`);
    this.dotStyles = [];
    for (let c = 0; c < DOT_RGB.length; c++) for (let l = 0; l < ALPHA_LEVELS; l++) {
      const a = DOT_BASE_ALPHA[c] * (l + 1) / ALPHA_LEVELS;
      this.dotStyles.push(`rgba(${fish.join(",")},${a.toFixed(3)})`);
    }
    this.paintBackground();
  }
  bodyColor(level) {
    const light = clamp((level - 120) / (level < 120 ? 120 : 135), -1, 1);
    return `rgb(${this.rgb.map((c) => Math.round(light < 0 ? c * (1 + light) : c + (255 - c) * light)).join(",")})`;
  }
  resize(width, height, dpr) {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    [this.cw, this.ch] = cellSize(this.gridScale, this.glyphMode === "hanzi");
    this.cols = Math.ceil(width / this.cw);
    this.rows = Math.ceil(height / this.ch);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.bg.width = this.canvas.width;
    this.bg.height = this.canvas.height;
    const n = this.cols * this.rows;
    this.dotKind = new Uint8Array(n);
    this.dotPhase = new Float32Array(n);
    this.dotFreq = new Float32Array(n);
    this.energy = new Float32Array(n);
    this.energyTmp = new Float32Array(n);
    this.heat = new Float32Array(n);
    this.bucketOf = new Uint8Array(n);
    this.bucketOrder = new Int32Array(n);
    this.sharkFlag = new Uint8Array(n);
    this.sharkShade = new Float32Array(n);
    this.sharkKey = new Uint32Array(n);
    this.sharkDepth = new Float32Array(n);
    this.sharkKind = new Uint8Array(n);
    this.sharkGlyph = new Uint16Array(n);
    this.sharkShadow = new Uint8Array(n);
    this.fishStamp = new Uint32Array(n);
    for (let i = 0; i < n; i++) {
      const col = i % this.cols;
      const row = i / this.cols | 0;
      this.dotKind[i] = 0;
      this.dotPhase[i] = hash3(col, row, 23) * Math.PI * 2;
      this.dotFreq[i] = 0.3 + hash3(col, row, 37) * 1.1;
    }
    this.paintBackground();
  }
  paintBackground() {
    const g = this.bg.getContext("2d");
    if (!g) return;
    const { width: W, height: H, dpr, cw, ch } = this;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    paintGrid(g, W, H, cw, ch, dpr, this.dark, this.gridOpacity);
  }
  render(world, dt) {
    const { ctx, dpr, cols, ch } = this;
    if (cols === 0) return;
    const t = world.time;
    this.consumeEvents(world);
    this.rasterizeSharks(world.sharks, t);
    this.depositWake(world);
    this.diffuse(dt);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.markFish(world);
    this.drawDots(t);
    ctx.font = `${this.glyphMode === "hanzi" ? 400 : 600} ${Math.round(ch * 0.74)}px ${this.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    this.drawHeat();
    this.drawFish();
    this.drawSharks(t);
  }
  // ── simulation → field ──────────────────────────────────────────────
  cellIndex(x, y) {
    const c = Math.floor(x / this.cw);
    const r = Math.floor(y / this.ch);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
    return r * this.cols + c;
  }
  stamp(field, x, y, radius, amount) {
    const c0 = Math.floor(x / this.cw);
    const r0 = Math.floor(y / this.ch);
    for (let r = r0 - radius; r <= r0 + radius; r++) {
      for (let c = c0 - radius; c <= c0 + radius; c++) {
        if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) continue;
        const d = Math.hypot(c - c0, (r - r0) * 1.4);
        if (d > radius + 0.5) continue;
        const i = r * this.cols + c;
        field[i] = Math.min(1.6, field[i] + amount * (1 - d / (radius + 1)));
      }
    }
  }
  consumeEvents(world) {
    for (const e of world.events) {
      if (e.kind === "eat") {
        this.stamp(this.heat, e.x, e.y, 2, 1);
        this.stamp(this.energy, e.x, e.y, 3, 0.9);
      } else {
        this.stamp(this.energy, e.x, e.y, 6, 1.4);
      }
    }
    world.events.length = 0;
  }
  depositWake(world) {
    const { energy } = this;
    for (const f of world.fish) {
      if (!f.alive) continue;
      const i = this.cellIndex(f.x, f.y);
      if (i >= 0) energy[i] = Math.min(1.6, energy[i] + 0.012 + f.alarm * 0.03);
    }
    for (const sh of world.sharks) {
      for (let k = SHARK_NODES - 6; k < SHARK_NODES; k++) {
        const i = this.cellIndex(sh.nodes[k * 2], sh.nodes[k * 2 + 1]);
        if (i >= 0) energy[i] = Math.min(1.6, energy[i] + 0.05 + sh.speed * 12e-4);
      }
    }
    if (world.pointer.active) {
      this.stamp(energy, world.pointer.x, world.pointer.y, 1, 0.08);
    }
  }
  /** Blur + decay so wakes spread out like ripples and fade. */
  diffuse(dt) {
    const { cols, rows, energy, energyTmp: tmp, heat } = this;
    const decay = Math.exp(-dt * 1.5);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const l = c > 0 ? energy[i - 1] : energy[i];
        const rt = c < cols - 1 ? energy[i + 1] : energy[i];
        const u = r > 0 ? energy[i - cols] : energy[i];
        const d = r < rows - 1 ? energy[i + cols] : energy[i];
        tmp[i] = (energy[i] * 4 + l + rt + u + d) * 0.125 * decay;
      }
    }
    this.energy = tmp;
    this.energyTmp = energy;
    const heatDecay = Math.exp(-dt * 2.2);
    for (let i = 0; i < heat.length; i++) heat[i] *= heatDecay;
  }
  // ── sharks ──────────────────────────────────────────────────────────
  /**
   * Classify one point against the current shark (spine/arc already built).
   * Body coordinates: s along the spine (0 snout → 1 tail), v across it.
   * Writes hit* fields and returns whether the point is on the shark.
   */
  sampleShark(px, py, L) {
    const { spine, arc } = this;
    const N = SHARK_NODES;
    let best = Infinity;
    let bestS = 0;
    let bestSign = 1;
    let bestNx = 0;
    let bestNy = 0;
    for (let k = 0; k < N - 1; k++) {
      const ax = spine[k * 2];
      const ay = spine[k * 2 + 1];
      const sx = spine[(k + 1) * 2] - ax;
      const sy = spine[(k + 1) * 2 + 1] - ay;
      const len2 = sx * sx + sy * sy || 1;
      const u2 = clamp(((px - ax) * sx + (py - ay) * sy) / len2, 0, 1);
      const qx = ax + sx * u2;
      const qy = ay + sy * u2;
      const d2 = (px - qx) ** 2 + (py - qy) ** 2;
      if (d2 < best) {
        best = d2;
        const len = Math.sqrt(len2);
        bestS = (arc[k] + u2 * len) / this.arcTotal;
        bestSign = sx * (py - ay) - sy * (px - ax) >= 0 ? 1 : -1;
        bestNx = -sy / len * bestSign;
        bestNy = sx / len * bestSign;
      }
    }
    const a = Math.sqrt(best);
    const s = bestS;
    const u = s * L;
    const shape = this.shape;
    const w = shape.halfWidth(s) * L;
    this.hitDist = a;
    this.hitS = s;
    this.hitV = a * bestSign;
    const head = this.shape.head;
    if (head && u < L * (head.sweep + head.depth + head.notch)) {
      const span = L * head.span;
      const r = a / span;
      const front = L * head.sweep * r * r + L * head.notch * Math.max(0, 1 - r / 0.14);
      const depth = L * head.depth * (1 - 0.2 * r * r * r * r);
      if (r <= 1 && u >= front && u <= front + depth) {
        this.hitFlag = r > 0.84 ? FLAG_EYE : FLAG_BODY;
        this.hitShade = r > 0.84 ? 0 : 0.62 - 0.2 * r + (u < front + L * 0.012 ? 0.1 : 0);
        return true;
      }
    }
    if (a <= w && (shape !== humpback && shape !== orca || s <= 0.945)) {
      const across = a / (w || 1);
      const facing = (bestNx * -0.6 + bestNy * -0.8) * across;
      let shade = 0.58 - across * across * 0.42 + facing * 0.26;
      let flag = FLAG_BODY;
      if (s > shape.dorsal[0] && s < shape.dorsal[1] && across < 0.3) {
        flag = FLAG_RIDGE;
        shade = 1;
      } else if (s > shape.secondDorsal[0] && s < shape.secondDorsal[1] && across < 0.4) {
        shade = Math.max(shade, 0.82);
      } else if (shape.eye && s > shape.eye[0] && s < shape.eye[1] && across > 0.6) {
        flag = FLAG_EYE;
        shade = 0;
      } else if (shape === orca && orcaPatch(s, across)) {
        flag = FLAG_WHITE;
      } else if (s > shape.gills[0] && s < shape.gills[1] && across > 0.58) {
        if (Math.floor((s - shape.gills[0]) / (shape.gills[1] - shape.gills[0]) * 5) % 2 === 0) shade *= 0.45;
      } else if (s < 0.05) {
        shade = Math.max(shade, 0.7);
      } else if (shape === SHAPES.zebra && s > 0.08 && s < 0.55 && (across < 0.1 || Math.abs(across - 0.6) < 0.08)) {
        shade = Math.max(shade, 0.8);
      } else if (this.marked(s, a * bestSign, L, across)) {
        flag = FLAG_MARK;
      }
      this.hitFlag = flag;
      this.hitShade = shade;
      return true;
    }
    const tip = bestSign > 0 ? this.finTipRight : this.finTipLeft;
    const [p0, p1, p2] = shape.pectoral;
    if ((shape === humpback ? humpbackFlipper(s, a, tip) : shape === orca ? orcaFlipper(s, a, tip) : inTriangle(u, a, L * p0, 0, L * p1, 0, L * p2, tip)) && // Falcate (sickle) fins get a concave trailing edge.
    !(shape.falcate && inTriangle(u, a, L * p1, 0, L * (p1 + (p2 - p1) * 0.33), tip * 0.55, L * p2, tip))) {
      this.hitFlag = this.marked(s, a * bestSign, L, 0) ? FLAG_MARK : FLAG_FIN;
      this.hitShade = 0.38 + 0.22 * (1 - clamp(a / tip, 0, 1));
      return true;
    }
    const [v0, v1, v2, vr] = shape.pelvic;
    if (vr > 0 && inTriangle(u, a, L * v0, 0, L * v1, 0, L * v2, L * vr) || // Forked caudal fin.
    (shape === humpback || shape === orca ? whaleFlukes(s, a / L) : shape.caudal > 0 && inTriangle(u, a, L * 0.86, 0, L * 0.95, 0, L, L * shape.caudal))) {
      this.hitFlag = FLAG_FIN;
      this.hitShade = 0.36;
      return true;
    }
    return false;
  }
  /** Whether a body point (s along, v across) falls on a dark marking. */
  marked(s, v, L, across) {
    if (this.shape === SHAPES.tiger) {
      if (s < 0.2 || s > 0.9 || across > 0.85) return false;
      const wobble = 0.35 * Math.sin(v / L * 25 + s * 5);
      const bar = Math.sin(s * Math.PI * 2 * 9 + wobble);
      return bar > 0.65 - 0.5 * smoothstep(0.2, 0.42, s) + 0.4 * smoothstep(0.8, 0.9, s);
    }
    if (this.shape === SHAPES.zebra) {
      if (s < 0.07) return false;
      const gu = s * L / (L * 0.06);
      const gv = v / (L * 0.045);
      const cu = Math.floor(gu);
      const cv = Math.floor(gv);
      const jx = hash3(cu, cv, this.sharkId) * 0.5 + 0.25;
      const jy = hash3(cu, cv, this.sharkId + 11) * 0.5 + 0.25;
      return (gu - cu - jx) ** 2 + (gv - cv - jy) ** 2 < 0.08;
    }
    return false;
  }
  /**
   * Build a smooth, undulating render spine from the sim spine, then
   * supersample every cell in the shark's bounding box against the shape.
   * Fully covered cells become solid skin; partial cells become edge glyphs.
   */
  rasterizeSharks(sharks, t) {
    const { sharkFlag, sharkShade, sharkKey, sharkDepth, sharkKind, sharkShadow, spine, arc, cw, ch, cols, rows } = this;
    sharkFlag.fill(0);
    sharkShadow.fill(0);
    this.sharkGlyph.fill(0);
    for (const sh of sharks) {
      const L = sh.length;
      const N = SHARK_NODES;
      const n = sh.nodes;
      const swim = clamp(sh.speed / 60, 0.4, 1.4);
      this.shape = SHAPES[sh.kind];
      this.sharkId = sh.id;
      const kindIndex = KINDS.indexOf(sh.kind);
      const secretCells = this.glyphMode === "hanzi" && (sh.kind === "whale" || sh.kind === "orca") && sh.id === 1 ? [-1, -1, -1, -1] : null;
      const secretDistances = [Infinity, Infinity, Infinity, Infinity];
      for (let k = 0; k < N; k++) {
        const s = k / (N - 1);
        const a = Math.max(0, k - 1);
        const b = Math.min(N - 1, k + 1);
        let tx = n[a * 2] - n[b * 2];
        let ty = n[a * 2 + 1] - n[b * 2 + 1];
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl;
        ty /= tl;
        const amp = L * 0.05 * (0.1 + 0.9 * Math.pow(s, 1.8)) * swim * this.bodySwing;
        const off = amp * Math.sin(sh.phase - s * 5.2);
        spine[k * 2] = n[k * 2] - ty * off;
        spine[k * 2 + 1] = n[k * 2 + 1] + tx * off;
      }
      arc[0] = 0;
      for (let k = 1; k < N; k++) {
        arc[k] = arc[k - 1] + Math.hypot(spine[k * 2] - spine[(k - 1) * 2], spine[k * 2 + 1] - spine[(k - 1) * 2 + 1]);
      }
      this.arcTotal = arc[N - 1] || 1;
      const bank = clamp(sh.turn * 0.45, -0.35, 0.35);
      const flex = 1 + 0.06 * Math.sin(sh.phase * 0.5);
      const reachFin = this.shape.pectoral[3];
      this.finTipRight = L * reachFin * flex * (1 - bank);
      this.finTipLeft = L * reachFin * flex * (1 + bank);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let k = 0; k < N; k++) {
        minX = Math.min(minX, spine[k * 2]);
        maxX = Math.max(maxX, spine[k * 2]);
        minY = Math.min(minY, spine[k * 2 + 1]);
        maxY = Math.max(maxY, spine[k * 2 + 1]);
      }
      const reach = Math.max(L * 0.36, this.finTipLeft, this.finTipRight);
      const c0 = Math.max(0, Math.floor((minX - reach) / cw));
      const c1 = Math.min(cols - 1, Math.floor((maxX + reach) / cw));
      const r0 = Math.max(0, Math.floor((minY - reach) / ch));
      const r1 = Math.min(rows - 1, Math.floor((maxY + reach) / ch));
      if (c0 > c1 || r0 > r1) continue;
      const skipBeyond = reach + Math.hypot(cw, ch);
      const shadowDc = Math.round(L * 0.035 / cw) + 1;
      const shadowDr = Math.round(L * 0.02 / ch) + 1;
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const x = c * cw;
          const y = r * ch;
          const centerHit = this.sampleShark(x + cw / 2, y + ch / 2, L);
          if (!centerHit && this.hitDist > skipBeyond) continue;
          const flag = this.hitFlag;
          const shade = this.hitShade;
          const s = this.hitS;
          const v = this.hitV;
          let hits = centerHit ? 1 : 0;
          for (let k = 0; k < SUBSAMPLES.length; k += 2) {
            if (this.sampleShark(x + SUBSAMPLES[k] * cw, y + SUBSAMPLES[k + 1] * ch, L)) hits++;
          }
          if (hits === 0) continue;
          const coverage = hits / 5;
          const i = r * cols + c;
          const key = hash3(Math.round(s * 52), Math.round(v / (cw * 0.9)), sh.id) * 4294967295 >>> 0;
          sharkKey[i] = key;
          sharkDepth[i] = sh.depth;
          sharkKind[i] = kindIndex;
          if (centerHit && coverage >= 0.6) {
            sharkFlag[i] = flag;
            if (this.glyphMode === "hanzi" && (sh.kind === "whale" || sh.kind === "orca")) {
              const glyph = flag === FLAG_EYE ? "\u76EE" : flag === FLAG_FIN ? s >= 0.84 ? "\u5C3E" : "\u9CCD" : flag === FLAG_RIDGE ? "\u9CCD" : s < 0.1 ? "\u543B" : s < 0.6 && Math.abs(v) < this.shape.halfWidth(s) * L * 0.32 ? "\u80CC" : "";
              this.sharkGlyph[i] = glyph ? glyph.charCodeAt(0) : 0;
              if (secretCells && !glyph && flag === FLAG_BODY && v > 0 && s >= 0.28 && s < 0.64) {
                const slot = Math.min(3, Math.floor((s - 0.28) / 0.09));
                const distance = ((s - (0.325 + slot * 0.09)) * L) ** 2 + (v - this.shape.halfWidth(s) * L * 0.6) ** 2;
                if (distance < secretDistances[slot]) {
                  secretDistances[slot] = distance;
                  secretCells[slot] = i;
                }
              }
            } else this.sharkGlyph[i] = 0;
            const flicker = (hash3(c, r, Math.floor(t * 6)) - 0.5) * 0.06;
            sharkShade[i] = clamp(shade + flicker, 0, 1);
            const sc = c + shadowDc;
            const sr = r + shadowDr;
            if (sc < cols && sr < rows) sharkShadow[sr * cols + sc] = 1;
          } else {
            sharkFlag[i] = FLAG_EDGE;
            this.sharkGlyph[i] = 0;
            sharkShade[i] = coverage;
          }
        }
      }
      if (secretCells?.every((i) => i >= 0)) {
        for (let k = 0; k < 4; k++) this.sharkGlyph[secretCells[k]] = "\u6DF1\u5EA6\u6C42\u7D22".charCodeAt(k);
      }
    }
  }
  drawSharks(t) {
    const { ctx, cols, rows, cw, ch, sharkFlag, sharkShade, sharkKey, sharkDepth, sharkKind } = this;
    const glyphs = GLYPHS[this.glyphMode];
    const n = cols * rows;
    for (let i = 0; i < n; i++) {
      const flag = sharkFlag[i];
      if (!flag) continue;
      const col = i % cols;
      const row = i / cols | 0;
      const x = col * cw;
      const y = row * ch;
      const key = sharkKey[i];
      const shade = sharkShade[i];
      const dim = 0.7 + 0.3 * sharkDepth[i];
      const [tr, tg, tb] = SHAPES[KINDS[sharkKind[i]]].tint;
      const tick = Math.floor(t * 2.4 + key % 997 / 97);
      const roll = hash3(key, tick, 7);
      if (flag === FLAG_EDGE) {
        const set = shade >= 0.5 ? glyphs.edgeHeavy : glyphs.edgeLight;
        const g = (70 + shade * 80) * dim;
        ctx.fillStyle = roll < 0.07 ? this.accents[key % this.accents.length] : this.bodyColor(g);
        ctx.fillText(set[(key >>> 8) % set.length], x + cw / 2, y + ch / 2 + 1, Math.max(1, cw - 1));
        continue;
      }
      let level;
      let glyph;
      if (flag === FLAG_RIDGE) {
        level = 226;
        glyph = glyphs.ridge[(key >>> 8) % glyphs.ridge.length];
      } else if (flag === FLAG_EYE) {
        level = 46 + shade * 160;
        glyph = glyphs.eye;
      } else if (flag === FLAG_MARK) {
        level = 24 + shade * 22;
        glyph = glyphs.mark[(key >>> 8) % glyphs.mark.length];
      } else if (flag === FLAG_FIN) {
        level = 40 + shade * 120;
        glyph = glyphs.fin[(key >>> 8) % glyphs.fin.length];
      } else {
        level = 46 + shade * 160;
        const jitter = (key >>> 4) % 3 - 1;
        glyph = glyphs.skin[clamp(Math.floor((1 - shade) * (glyphs.skin.length - 0.01)) + jitter, 0, glyphs.skin.length - 1)];
      }
      level *= dim;
      if (this.sharkGlyph[i]) glyph = String.fromCharCode(this.sharkGlyph[i]);
      ctx.fillStyle = flag === FLAG_WHITE ? "#f5f5f0" : flag === FLAG_EYE && this.eyeColor ? this.eyeColor : this.bodyColor(level);
      ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);
      let color;
      if (flag === FLAG_WHITE) color = "#181818";
      else if (flag === FLAG_EYE && this.eyeColor) color = this.eyeColor === "#000000" ? "#ffffff" : "#181818";
      else if (flag === FLAG_EYE) color = shade > 0.55 ? "#181818" : "#eeeeee";
      else if (flag === FLAG_MARK) color = `rgb(${Math.round(70 * tr)},${Math.round(70 * tg)},${Math.round(70 * tb)})`;
      else if (roll < 0.09) color = this.accents[key % this.accents.length];
      else if (roll < 0.13) color = "#ffffff";
      else color = shade > 0.55 ? "#181818" : "#eeeeee";
      ctx.fillStyle = color;
      ctx.fillText(glyph, x + cw / 2, y + ch / 2 + 1, Math.max(1, cw - 1));
    }
  }
  // ── fish, dots, heat ────────────────────────────────────────────────
  /**
   * Snap each fish to a cell and bucket it by brightness: far fish are dim,
   * near fish brighter, and turning or panicking fish glint. Nearer fish
   * claim a cell first when two land in the same one.
   */
  markFish(world) {
    const { fishStamp, fishBuckets, sharkFlag } = this;
    const frame = ++this.frameId;
    for (const bucket of fishBuckets) bucket.length = 0;
    for (let pass = 0; pass < 2; pass++) {
      for (const f of world.fish) {
        if (!f.alive || (f.depth > 0.78 ? 0 : 1) !== pass) continue;
        const i = this.cellIndex(f.x, f.y);
        if (i < 0 || fishStamp[i] === frame || sharkFlag[i]) continue;
        fishStamp[i] = frame;
        const glint = clamp(Math.abs(f.turn) / 3.5, 0, 1);
        const v = 0.3 + 0.4 * (f.depth - 0.55) / 0.45 + 0.3 * Math.max(glint, f.alarm);
        fishBuckets[clamp(Math.floor(v * FISH_ALPHAS.length), 0, FISH_ALPHAS.length - 1)].push(i);
      }
    }
  }
  drawFish() {
    const { ctx, cw, ch, cols, fishBuckets } = this;
    const glyphs = GLYPHS[this.glyphMode].fish;
    for (let b = 0; b < fishBuckets.length; b++) {
      const bucket = fishBuckets[b];
      if (!bucket.length) continue;
      ctx.fillStyle = this.fishStyles[b];
      for (const i of bucket) {
        ctx.fillText(glyphs[i % glyphs.length], i % cols * cw + cw / 2, (i / cols | 0) * ch + ch / 2 + 1, Math.max(1, cw - 1));
      }
    }
  }
  drawHeat() {
    const { ctx, heat, cols, cw, ch } = this;
    for (let i = 0; i < heat.length; i++) {
      const h = heat[i];
      if (h < 0.08) continue;
      const col = i % cols;
      const row = i / cols | 0;
      ctx.fillStyle = `rgba(${this.rgb.join(",")},${Math.min(1, h * 1.6).toFixed(2)})`;
      ctx.fillText(h > 0.6 ? "*" : "\xB7", col * cw + cw / 2, row * ch + ch / 2 + 1, Math.max(1, cw - 1));
    }
  }
  /**
   * Every cell's dot twinkles on its own clock, is modulated by slow
   * caustic light bands, and flares cyan where the wake field is strong.
   * Dots are bucketed by colour/alpha so each bucket is one fillStyle.
   */
  drawDots(t) {
    const { ctx, cols, rows, cw, ch, dotKind, dotPhase, dotFreq, energy, sharkFlag, sharkShadow, fishStamp, frameId } = this;
    const { bucketOf, bucketOrder, bucketCounts } = this;
    const n = cols * rows;
    const SKIP = bucketCounts.length - 1;
    bucketCounts.fill(0);
    for (let i = 0; i < n; i++) {
      const e = energy[i] * this.wake;
      const kind = dotKind[i];
      if (sharkFlag[i] || fishStamp[i] === frameId || kind === 0 && e < 0.45) {
        bucketOf[i] = SKIP;
        continue;
      }
      let bucket;
      if (e > 0.45) {
        const level = clamp(Math.floor((e - 0.45) * 5), 0, ALPHA_LEVELS - 1);
        bucket = WAKE * ALPHA_LEVELS + level;
      } else {
        const col = i % cols;
        const row = i / cols | 0;
        const twinkle = 0.5 + 0.5 * Math.sin(t * dotFreq[i] + dotPhase[i]);
        const caustic = 0.85 + 0.15 * Math.sin(col * 0.11 + t * 0.35) * Math.sin(row * 0.17 - t * 0.27);
        let v = clamp((0.55 + 0.45 * twinkle) * caustic + e * 2, 0, 1);
        if (sharkShadow[i]) v *= 0.2;
        bucket = (kind - 1) * ALPHA_LEVELS + clamp(Math.floor(v * ALPHA_LEVELS), 0, ALPHA_LEVELS - 1);
      }
      bucketOf[i] = bucket;
      bucketCounts[bucket]++;
    }
    const starts = new Int32Array(bucketCounts.length);
    for (let b = 1; b < bucketCounts.length; b++) starts[b] = starts[b - 1] + bucketCounts[b - 1];
    const cursor = starts.slice();
    for (let i = 0; i < n; i++) {
      const b = bucketOf[i];
      if (b !== SKIP) bucketOrder[cursor[b]++] = i;
    }
    const small = Math.max(2, Math.round(cw * 0.19));
    const large = small + 1;
    for (let b = 0; b < SKIP; b++) {
      const count = bucketCounts[b];
      if (!count) continue;
      ctx.fillStyle = this.dotStyles[b];
      const size = b >= WAKE * ALPHA_LEVELS ? large : small;
      const start = starts[b];
      for (let k = start; k < start + count; k++) {
        const i = bucketOrder[k];
        const col = i % cols;
        const row = i / cols | 0;
        ctx.fillRect(Math.round(col * cw + cw * 0.66 - size / 2), Math.round(row * ch + ch * 0.64 - size / 2), size, size);
      }
    }
  }
};

// vendor/ascii-kanji-sharks/glyphs.js
var SKIN_POOL = "\u4E36\u30CE\u4E00\u4E8C\u5C0F\u5DDD\u6C34\u6C37\u6C38\u6C50\u6CF3\u6CE2\u6D77\u6D6A\u6F6E\u6FE4\u9BE8";
var PART = {
  eye: "\u76EE",
  fin: "\u9C2D",
  tail: "\u5C3E",
  scale: "\u9C57",
  name: "\u9BE8"
};
var STROKE = { flat: "\u4E00", upright: "\u4E28", down: "\u4E36", up: "\u30CE" };
var WAKE2 = ["\u3001", "\u301C", "\u6C35"];
var EAT = "\u55B0";
var SPARK = "\u4E36";
var SFX = { chomp: "\u30AC\u30D6\u30C3", splash: "\u30B6\u30D0\u30C3" };
var fontCss = (px, family) => `400 ${px}px ${family}`;
function measureInk(chars, family) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.font = fontCss(size * 0.9, family);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#fff";
  return [...chars].map((ch) => {
    g.clearRect(0, 0, size, size);
    g.fillText(ch, size / 2, size / 2);
    const data = g.getImageData(0, 0, size, size).data;
    let sum = 0;
    for (let i = 3; i < data.length; i += 4) sum += data[i];
    return { ch, ink: sum / (255 * size * size) };
  });
}
var InkRamp = class {
  constructor(family, chars = SKIN_POOL) {
    const measured = measureInk(chars, family).sort((a, b) => a.ink - b.ink);
    const lo = measured[0].ink;
    const hi = measured[measured.length - 1].ink || 1;
    this.entries = measured.map((m) => ({ ch: m.ch, tone: (m.ink - lo) / (hi - lo || 1) }));
    this.table = [];
    const steps = 64;
    for (let i = 0; i < steps; i++) {
      const tone = i / (steps - 1);
      let best = this.entries[0];
      for (const e of this.entries) if (Math.abs(e.tone - tone) < Math.abs(best.tone - tone)) best = e;
      this.table.push(best.ch);
    }
  }
  pick(tone) {
    const i = Math.round(Math.min(1, Math.max(0, tone)) * (this.table.length - 1));
    return this.table[i];
  }
};
var GlyphAtlas = class {
  constructor(family) {
    this.family = family;
    this.tiles = /* @__PURE__ */ new Map();
    this.px = 0;
  }
  setCell(cellPx) {
    if (cellPx === this.px) return;
    this.px = cellPx;
    this.tiles.clear();
    const g = document.createElement("canvas").getContext("2d");
    g.font = fontCss(Math.round(cellPx * 0.86), this.family);
    const m = g.measureText("\u56FD");
    this.baseline = cellPx / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  }
  get(glyph, color) {
    const key = glyph + color;
    let tile = this.tiles.get(key);
    if (tile) return tile;
    if (this.tiles.size > 6e3) this.tiles.clear();
    const px = this.px;
    tile = document.createElement("canvas");
    tile.width = tile.height = px;
    const g = tile.getContext("2d");
    g.font = fontCss(Math.round(px * 0.86), this.family);
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    g.fillStyle = color;
    g.fillText(glyph, px / 2, this.baseline);
    this.tiles.set(key, tile);
    return tile;
  }
};

// vendor/ascii-kanji-sharks/util.js
var TAU2 = Math.PI * 2;
var clamp2 = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
function hash(x, y, z) {
  let h = Math.imul(x | 0, 668265261) ^ Math.imul(y | 0, 374761393) ^ Math.imul(z | 0, 2654435761);
  h = Math.imul(h ^ h >>> 15, 2246822507);
  h = Math.imul(h ^ h >>> 13, 3266489909);
  return ((h ^ h >>> 16) >>> 0) / 4294967296;
}

// vendor/ascii-kanji-sharks/painter.js
var FISH_GLYPHS = ["\u9C2F", "\u9C0A", "\u9BF5", "\u9BD6", "\u9C2F"];
function palette(from, to, steps) {
  const out = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const c = from.map((v, k) => Math.round(v + (to[k] - v) * t));
    out.push(`rgb(${c[0]},${c[1]},${c[2]})`);
  }
  return out;
}
var THEMES = {
  night: {
    bg: "#03070d",
    vignette: "rgba(0,0,0,0.6)",
    grid: "rgba(120,160,220,0.05)",
    skin: palette([34, 48, 70], [230, 240, 252], 16),
    fill: palette([12, 20, 33], [40, 56, 80], 8),
    fish: palette([48, 64, 88], [176, 196, 222], 8),
    wake: palette([16, 52, 78], [110, 216, 250], 8),
    red: "#ff5b3a",
    eye: "#ffc861",
    glint: "#ffffff"
  },
  paper: {
    bg: "#f1e9d6",
    vignette: "rgba(110,80,40,0.2)",
    grid: "rgba(196,72,52,0.14)",
    skin: palette([196, 188, 172], [16, 15, 14], 16),
    fill: palette([228, 219, 200], [200, 189, 169], 8),
    fish: palette([176, 168, 152], [48, 45, 42], 8),
    wake: palette([206, 206, 196], [64, 100, 140], 8),
    red: "#c4302a",
    eye: "#c4302a",
    glint: "#2f4a8a"
  }
};
var NONE = 0;
var BODY = 1;
var DORSAL = 4;
var PECTORAL = 5;
var TAIL = 7;
var LAYER_WAKE = 1;
var LAYER_FISH = 2;
var LAYER_SHARK = 3;
var SUBSAMPLES2 = [-0.28, -0.28, 0.28, -0.28, -0.28, 0.28, 0.28, 0.28];
var LIGHT_X = -0.6;
var LIGHT_Y = -0.8;
var at = (list, tone) => list[Math.round(clamp2(tone, 0, 1) * (list.length - 1))];
var Painter = class {
  constructor(canvas, gridScale = 1) {
    this.shape = humpback;
    this.gridScale = gridScale;
    this.bodySwing = 1;
    this.cell = cellSize(gridScale, true)[0];
    this.wake = 1;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true });
    this.bg = document.createElement("canvas");
    this.setFontFamily(getComputedStyle(canvas).fontFamily);
    this.theme = THEMES.paper;
    this.cols = 0;
    this.rows = 0;
    this.frame = 0;
    this.touched = [];
    this.fx = [];
    this.spine = new Float32Array(SHARK_NODES * 2);
    this.arc = new Float32Array(SHARK_NODES);
    this.arcTotal = 1;
    this.finLeft = 0;
    this.finRight = 0;
    this.hitS = 0;
    this.hitD = 0;
    this.hitSide = 1;
    this.hitTx = 1;
    this.hitTy = 0;
  }
  setFontFamily(family) {
    this.atlas = new GlyphAtlas(family);
    this.ramp = new InkRamp(family);
    if (this.dpr) this.atlas.setCell(Math.round(this.cell * this.dpr));
  }
  get cellWidth() {
    return this.cell;
  }
  get cellHeight() {
    return this.cell;
  }
  setTheme(dark, gridOpacity = 0.05, wake = 1, color = "#4d6bfe", eyeColor = "primary") {
    this.wake = wake;
    const rgb = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
    this.theme = {
      ...THEMES[dark ? "night" : "paper"],
      grid: `rgba(128,128,128,${gridOpacity})`,
      eye: eyeColor === "primary" ? color : eyeColor === "black" ? "#ffffff" : "#181818",
      eyeFill: eyeColor === "primary" ? null : eyeColor === "black" ? "#000000" : "#ffffff",
      skin: palette(rgb.map((v) => v * 0.45), rgb.map((v) => v + (255 - v) * 0.35), 16),
      fill: Array(8).fill(null),
      fish: palette(rgb.map((v) => v * 0.6), rgb, 8),
      wake: palette(rgb.map((v) => v * 0.6), rgb, 8)
    };
    this.paintBackground();
  }
  resize(width, height, dpr) {
    const cell = cellSize(this.gridScale, true)[0];
    this.width = width;
    this.height = height;
    this.cell = cell;
    this.dpr = dpr;
    this.cols = Math.ceil(width / cell);
    this.rows = Math.ceil(height / cell);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.bg.width = this.canvas.width;
    this.bg.height = this.canvas.height;
    this.atlas.setCell(Math.round(cell * dpr));
    const n = this.cols * this.rows;
    this.layer = new Uint8Array(n);
    this.depth = new Float32Array(n);
    this.stamp = new Uint32Array(n);
    this.glyph = new Array(n).fill("");
    this.color = new Array(n).fill("");
    this.fill = new Array(n).fill(null);
    this.alpha = new Float32Array(n);
    this.energy = new Float32Array(n);
    this.energyNext = new Float32Array(n);
    this.touched.length = 0;
    this.fx.length = 0;
    this.paintBackground();
  }
  paintBackground() {
    const g = this.bg.getContext("2d");
    if (!g || !this.cols) return;
    const { theme, cell, dpr } = this;
    const W = this.bg.width;
    const H = this.bg.height;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W, H);
    g.strokeStyle = theme.grid;
    g.lineWidth = 1;
    g.beginPath();
    for (let c = 0; c <= this.cols; c++) {
      const x = Math.round(c * cell * dpr) + 0.5;
      g.moveTo(x, 0);
      g.lineTo(x, H);
    }
    for (let r = 0; r <= this.rows; r++) {
      const y = Math.round(r * cell * dpr) + 0.5;
      g.moveTo(0, y);
      g.lineTo(W, y);
    }
    g.stroke();
  }
  render(ocean, dt) {
    if (!this.cols) return;
    this.frame++;
    this.touched.length = 0;
    this.consumeEvents(ocean);
    this.depositWake(ocean, dt);
    for (const sh of ocean.sharks) this.rasterShark(sh, ocean.time);
    this.placeFish(ocean);
    this.placeWake();
    this.draw(ocean.time, dt);
  }
  // ── cells ───────────────────────────────────────────────────────────
  cellAt(x, y) {
    const c = Math.floor(x / this.cell);
    const r = Math.floor(y / this.cell);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
    return r * this.cols + c;
  }
  /** Claim a cell; higher layers win, and within a layer the nearer thing wins. */
  put(i, layer, depth, glyph, color, fill = null) {
    if (this.stamp[i] !== this.frame) {
      this.stamp[i] = this.frame;
      this.layer[i] = 0;
      this.touched.push(i);
    } else if (layer < this.layer[i] || layer === this.layer[i] && depth < this.depth[i]) {
      return;
    }
    this.layer[i] = layer;
    this.depth[i] = depth;
    this.glyph[i] = glyph;
    this.color[i] = color;
    this.fill[i] = fill;
  }
  // ── sharks ──────────────────────────────────────────────────────────
  /** Which part of the current shark (if any) the point lands on. */
  classify(px, py, L) {
    const { spine, arc } = this;
    let best = Infinity;
    let bestS = 0;
    for (let k = 0; k < SHARK_NODES - 1; k++) {
      const ax = spine[k * 2];
      const ay = spine[k * 2 + 1];
      const sx = spine[k * 2 + 2] - ax;
      const sy = spine[k * 2 + 3] - ay;
      const len2 = sx * sx + sy * sy || 1;
      const t = clamp2(((px - ax) * sx + (py - ay) * sy) / len2, 0, 1);
      const d2 = (px - ax - sx * t) ** 2 + (py - ay - sy * t) ** 2;
      if (d2 < best) {
        best = d2;
        const len = Math.sqrt(len2);
        bestS = (arc[k] + t * len) / this.arcTotal;
        this.hitSide = sx * (py - ay) - sy * (px - ax) >= 0 ? 1 : -1;
        this.hitTx = sx / len;
        this.hitTy = sy / len;
      }
    }
    const d = Math.sqrt(best);
    const s = bestS;
    const w = this.shape.halfWidth(s) * L;
    this.hitS = s;
    this.hitD = d;
    if (d <= w && s <= 0.945) {
      const across = d / (w || 1);
      if (s > this.shape.dorsal[0] && s < this.shape.dorsal[1] && across < 0.3) return DORSAL;
      return BODY;
    }
    const reach = this.hitSide > 0 ? this.finRight : this.finLeft;
    if (this.shape === orca ? orcaFlipper(s, d, reach) : humpbackFlipper(s, d, reach)) return PECTORAL;
    if (whaleFlukes(s, d / L)) return TAIL;
    return NONE;
  }
  /** The render spine: the sim spine plus a travelling wave that grows toward the tail. */
  buildSpine(sh) {
    this.shape = sh.kind === "orca" ? orca : humpback;
    const { spine, arc } = this;
    const n = sh.nodes;
    const L = sh.length;
    const beat = clamp2(sh.speed / 60, 0.4, 1.4);
    for (let k = 0; k < SHARK_NODES; k++) {
      const s = k / (SHARK_NODES - 1);
      const a = Math.max(0, k - 1);
      const b = Math.min(SHARK_NODES - 1, k + 1);
      let tx = n[a * 2] - n[b * 2];
      let ty = n[a * 2 + 1] - n[b * 2 + 1];
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const off = L * 0.05 * (0.1 + 0.9 * Math.pow(s, 1.8)) * beat * this.bodySwing * Math.sin(sh.phase - s * 5.2);
      spine[k * 2] = n[k * 2] - ty * off;
      spine[k * 2 + 1] = n[k * 2 + 1] + tx * off;
    }
    arc[0] = 0;
    for (let k = 1; k < SHARK_NODES; k++) {
      arc[k] = arc[k - 1] + Math.hypot(spine[k * 2] - spine[k * 2 - 2], spine[k * 2 + 1] - spine[k * 2 - 1]);
    }
    this.arcTotal = arc[SHARK_NODES - 1] || 1;
    const bank = clamp2(sh.turn * 0.45, -0.35, 0.35);
    const flex = 1 + 0.06 * Math.sin(sh.phase * 0.5);
    this.finRight = L * this.shape.pectoral[3] * flex * (1 - bank);
    this.finLeft = L * this.shape.pectoral[3] * flex * (1 + bank);
  }
  /** One eye per side, each exactly one cell, set on the head after the body is drawn. */
  placeEyes(sh) {
    const { spine, arc } = this;
    const s = 0.1;
    const target = s * this.arcTotal;
    let k = 0;
    while (k < SHARK_NODES - 2 && arc[k + 1] < target) k++;
    const seg = arc[k + 1] - arc[k] || 1;
    const t = (target - arc[k]) / seg;
    const tx = (spine[k * 2 + 2] - spine[k * 2]) / seg;
    const ty = (spine[k * 2 + 3] - spine[k * 2 + 1]) / seg;
    const x = spine[k * 2] + (spine[k * 2 + 2] - spine[k * 2]) * t;
    const y = spine[k * 2 + 1] + (spine[k * 2 + 3] - spine[k * 2 + 1]) * t;
    const off = this.shape.halfWidth(s) * sh.length * 0.62;
    for (const side of [-1, 1]) {
      const i = this.cellAt(x - ty * off * side, y + tx * off * side);
      if (i >= 0 && this.stamp[i] === this.frame && this.layer[i] === LAYER_SHARK) {
        this.put(i, LAYER_SHARK, sh.depth, PART.eye, this.theme.eye, this.theme.eyeFill ?? this.fill[i]);
      }
    }
  }
  rasterShark(sh, time) {
    const { cell, cols, rows, spine, theme, ramp } = this;
    const L = sh.length;
    this.buildSpine(sh);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let k = 0; k < SHARK_NODES; k++) {
      minX = Math.min(minX, spine[k * 2]);
      maxX = Math.max(maxX, spine[k * 2]);
      minY = Math.min(minY, spine[k * 2 + 1]);
      maxY = Math.max(maxY, spine[k * 2 + 1]);
    }
    const reach = Math.max(L * 0.3, this.finLeft, this.finRight);
    const c0 = Math.max(0, Math.floor((minX - reach) / cell));
    const c1 = Math.min(cols - 1, Math.floor((maxX + reach) / cell));
    const r0 = Math.max(0, Math.floor((minY - reach) / cell));
    const r1 = Math.min(rows - 1, Math.floor((maxY + reach) / cell));
    const skip = reach + cell;
    const dim = 0.6 + 0.4 * sh.depth;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const x = (c + 0.5) * cell;
        const y = (r + 0.5) * cell;
        const part = this.classify(x, y, L);
        if (part === NONE && this.hitD > skip) continue;
        const s = this.hitS;
        const d = this.hitD;
        const side = this.hitSide;
        const tx = this.hitTx;
        const ty = this.hitTy;
        let hits = part === NONE ? 0 : 1;
        for (let k = 0; k < SUBSAMPLES2.length; k += 2) {
          if (this.classify(x + SUBSAMPLES2[k] * cell, y + SUBSAMPLES2[k + 1] * cell, L) !== NONE) hits++;
        }
        if (hits === 0) continue;
        const coverage = hits / 5;
        const i = r * cols + c;
        const key = Math.floor(hash(Math.round(s * L / cell), Math.round(side * d / cell), sh.id) * 1e9);
        if (part === NONE || coverage < 0.6) {
          this.put(i, LAYER_SHARK, sh.depth, this.stroke(tx, ty), at(theme.skin, (0.2 + 0.3 * coverage) * dim));
          continue;
        }
        let glyph;
        let tone;
        let color = null;
        if (part === BODY) {
          const across = d / (this.shape.halfWidth(s) * L || 1);
          const facing = (-ty * side * LIGHT_X + tx * side * LIGHT_Y) * across;
          tone = 1 - 0.95 * Math.pow(across, 1.6) + 0.18 * facing + (key % 7 - 3) * 0.02;
          glyph = ramp.pick(tone);
          if (tone > 0.55 && key % 23 === 0) glyph = PART.name;
          if (tone > 0.45 && hash(key, Math.floor(time * 2.5), 3) < 0.025) color = theme.glint;
        } else if (part === DORSAL) {
          glyph = PART.fin;
          tone = 1;
        } else if (part === PECTORAL) {
          glyph = PART.fin;
          const finReach = side > 0 ? this.finRight : this.finLeft;
          tone = 0.42 + 0.25 * (1 - clamp2(d / finReach, 0, 1));
        } else {
          glyph = PART.tail;
          tone = 0.55;
        }
        color ??= at(theme.skin, tone * dim);
        const patch = this.shape === orca && part === BODY && orcaPatch(s, d / (this.shape.halfWidth(s) * L || 1));
        this.put(i, LAYER_SHARK, sh.depth, glyph, patch ? "#181818" : color, patch ? "#f5f5f0" : at(theme.fill, tone * dim));
      }
    }
    this.placeEyes(sh);
  }
  /** One brush stroke along the outline's on-screen direction. */
  stroke(tx, ty) {
    let a = Math.atan2(ty, tx);
    if (a < 0) a += Math.PI;
    const deg = a * 180 / Math.PI;
    if (deg < 22.5 || deg >= 157.5) return STROKE.flat;
    if (deg < 67.5) return STROKE.down;
    if (deg < 112.5) return STROKE.upright;
    return STROKE.up;
  }
  // ── fish & water ────────────────────────────────────────────────────
  placeFish(ocean) {
    const { theme } = this;
    for (const f of ocean.fish) {
      if (!f.alive) continue;
      const i = this.cellAt(f.x, f.y);
      if (i < 0) continue;
      const tone = 0.2 + 0.6 * ((f.depth - 0.5) / 0.5) + 0.35 * f.alarm;
      this.put(i, LAYER_FISH, f.depth, FISH_GLYPHS[f.species], at(theme.fish, tone));
    }
  }
  depositWake(ocean, dt) {
    const { energy } = this;
    const u = this.cell;
    for (const f of ocean.fish) {
      if (!f.alive) continue;
      const i = this.cellAt(f.x, f.y);
      if (i >= 0) energy[i] = Math.min(1.5, energy[i] + 8e-3 + f.alarm * 0.025);
    }
    for (const sh of ocean.sharks) {
      for (let k = SHARK_NODES - 5; k < SHARK_NODES; k++) {
        const i = this.cellAt(sh.nodes[k * 2], sh.nodes[k * 2 + 1]);
        if (i >= 0) energy[i] = Math.min(1.5, energy[i] + 0.05 + sh.speed / u * 4e-3);
      }
    }
    if (ocean.pointer.active) this.splashEnergy(ocean.pointer.x, ocean.pointer.y, 1, 0.06);
    const { cols, rows, energyNext: next } = this;
    const fade = Math.exp(-dt * 1.4);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const e = energy[i];
        const l = c > 0 ? energy[i - 1] : e;
        const rt = c < cols - 1 ? energy[i + 1] : e;
        const up = r > 0 ? energy[i - cols] : e;
        const dn = r < rows - 1 ? energy[i + cols] : e;
        next[i] = (e * 4 + l + rt + up + dn) * 0.125 * fade;
      }
    }
    this.energyNext = energy;
    this.energy = next;
  }
  splashEnergy(x, y, radius, amount) {
    const c0 = Math.floor(x / this.cell);
    const r0 = Math.floor(y / this.cell);
    for (let r = r0 - radius; r <= r0 + radius; r++) {
      for (let c = c0 - radius; c <= c0 + radius; c++) {
        if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) continue;
        const d = Math.hypot(c - c0, r - r0);
        if (d > radius + 0.5) continue;
        const i = r * this.cols + c;
        this.energy[i] = Math.min(1.5, this.energy[i] + amount * (1 - d / (radius + 1)));
      }
    }
  }
  placeWake() {
    const { energy, theme } = this;
    for (let i = 0; i < energy.length; i++) {
      const e = energy[i] * this.wake;
      if (e < 0.3) continue;
      if (this.stamp[i] === this.frame) continue;
      const glyph = e > 0.95 ? WAKE2[2] : e > 0.6 ? WAKE2[1] : WAKE2[0];
      this.put(i, LAYER_WAKE, 0, glyph, at(theme.wake, (e - 0.3) / 0.9));
    }
  }
  // ── effects ─────────────────────────────────────────────────────────
  consumeEvents(ocean) {
    const { cell } = this;
    const cols = Math.floor(this.width / cell);
    const rows = Math.floor(this.height / cell);
    for (const e of ocean.events) {
      const col = Math.floor(e.x / cell);
      const row = Math.floor(e.y / cell);
      if (e.kind === "eat") {
        this.addFx(col, row, EAT, 0, 0.9);
        for (const [dc, dr] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) this.addFx(col + dc, row + dr, SPARK, 0.04, 0.45);
        this.splashEnergy(e.x, e.y, 2, 0.8);
        const text = [...SFX.chomp];
        const start = clamp2(col + 1, 0, cols - text.length);
        const r = clamp2(row - 1, 0, rows - 1);
        text.forEach((ch, k) => this.addFx(start + k, r, ch, k * 0.06, 1.2));
      } else if (e.kind === "splash") {
        const text = [...SFX.splash];
        const start = clamp2(col - 1, 0, cols - text.length);
        const r = clamp2(row - 2, 0, rows - 1);
        text.forEach((ch, k) => this.addFx(start + k, r, ch, k * 0.06, 1));
        this.splashEnergy(e.x, e.y, 5, 1.4);
      }
    }
    ocean.events.length = 0;
  }
  addFx(col, row, glyph, delay, life) {
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return;
    this.fx.push({ col, row, glyph, age: -delay, life });
  }
  // ── output ──────────────────────────────────────────────────────────
  draw(time, dt) {
    const { ctx, atlas, cell, dpr, cols, touched } = this;
    const px = atlas.px;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.bg, 0, 0);
    for (const i of touched) {
      const x = Math.round(i % cols * cell * dpr);
      const y = Math.round((i / cols | 0) * cell * dpr);
      const fill = this.fill[i];
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fillRect(x + 1, y + 1, px - 1, px - 1);
      }
      ctx.drawImage(atlas.get(this.glyph[i], this.color[i]), x, y);
    }
    const red = this.theme.red;
    let live = 0;
    for (const f of this.fx) {
      f.age += dt;
      if (f.age >= f.life) continue;
      this.fx[live++] = f;
      if (f.age < 0) continue;
      const x = Math.round(f.col * cell * dpr);
      const y = Math.round(f.row * cell * dpr);
      ctx.globalAlpha = 1 - (f.age / f.life) ** 2;
      ctx.clearRect(x, y, px, px);
      ctx.drawImage(atlas.get(f.glyph, red), x, y);
    }
    this.fx.length = live;
    ctx.globalAlpha = 1;
  }
};

// vendor/ascii-sharks/engine.ts
var STEP = 1 / 60;
var MAX_STEPS = 4;
var OceanEngine = class {
  constructor(canvas, sharks, speed = 1, dark = false, gridScale = 1, gridOpacity = 0.05, fishCount, wake = 1, color = "#4d6bfe", glyphMode = "ascii", colorfulShimmer = false, eyeColor = "primary", bodySwing = 1, turnAgility = 1, tailFrequency = 1) {
    this.canvas = canvas;
    this.speed = speed;
    this.world = new World(sharks, fishCount);
    this.renderer = glyphMode === "kanji" ? new Painter(canvas, gridScale) : new AsciiRenderer(canvas, dark, gridScale, gridOpacity, wake, glyphMode);
    if (this.renderer instanceof AsciiRenderer) this.renderer.setTheme(dark, gridOpacity, wake, color, colorfulShimmer, eyeColor);
    else this.renderer.setTheme(dark, gridOpacity, wake, color, eyeColor);
    this.renderer.bodySwing = bodySwing;
    this.world.turnAgility = turnAgility;
    this.world.tailFrequency = tailFrequency;
    this.renderer.setFontFamily(getComputedStyle(canvas).fontFamily);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersectionObserver.observe(canvas);
    this.reducedMotion.addEventListener("change", this.onMotionPreference);
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this.onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", this.onPointerLeave);
    window.addEventListener("blur", this.onPointerLeave);
    document.addEventListener("visibilitychange", this.scheduleVisibility);
    this.resize();
    document.fonts?.load(`${glyphMode !== "ascii" ? 400 : 600} 16px ${getComputedStyle(canvas).fontFamily}`, glyphMode !== "ascii" ? "\u9CB8\u76EE\u9CCD\u5C3E\u9BAB\u9C13\u9C2D\u9C2F\u9C0A\u9BF5\u9BD6" : "S8@").then(() => {
      if (this.disposed) return;
      this.renderer.setFontFamily(getComputedStyle(canvas).fontFamily);
      if (this.reducedMotion.matches) this.drawStill();
    }).catch(() => {
    });
    this.schedule();
  }
  world;
  renderer;
  raf = 0;
  last = 0;
  acc = 0;
  visible = true;
  reducedMotion;
  resizeObserver;
  intersectionObserver;
  disposed = false;
  // Runtime profile: defaults match the original loop (uncapped, DPR ≤ 2).
  maxFps = Infinity;
  maxDpr = 2;
  paused = false;
  lastRender = 0;
  renderDt = 0;
  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.reducedMotion.removeEventListener("change", this.onMotionPreference);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerDown);
    document.documentElement.removeEventListener("pointerleave", this.onPointerLeave);
    window.removeEventListener("blur", this.onPointerLeave);
    document.removeEventListener("visibilitychange", this.scheduleVisibility);
  }
  setAppearance(speed, dark, gridOpacity = 0.05, wake = 1, color = "#4d6bfe", colorfulShimmer = false, eyeColor = "primary", bodySwing = 1, turnAgility = 1, tailFrequency = 1) {
    this.speed = speed;
    this.renderer.bodySwing = bodySwing;
    this.world.turnAgility = turnAgility;
    this.world.tailFrequency = tailFrequency;
    if (this.renderer instanceof AsciiRenderer) this.renderer.setTheme(dark, gridOpacity, wake, color, colorfulShimmer, eyeColor);
    else this.renderer.setTheme(dark, gridOpacity, wake, color, eyeColor);
    if (this.reducedMotion.matches) this.drawStill();
  }
  /** Ambient callers lower paint rate and backing-store density; omitted fields restore defaults. */
  setProfile({ maxFps = Infinity, maxDpr = 2 } = {}) {
    const dprChanged = maxDpr !== this.maxDpr;
    this.maxFps = maxFps;
    this.maxDpr = maxDpr;
    if (dprChanged) this.resize();
  }
  /** Keeps the current frame on screen and stops scheduling until resume(). */
  pause() {
    if (this.paused) return;
    this.paused = true;
    cancelAnimationFrame(this.raf);
  }
  resume() {
    if (!this.paused) return;
    this.paused = false;
    this.schedule();
  }
  scheduleVisibility = () => this.schedule();
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    this.renderer.resize(rect.width, rect.height, dpr);
    this.world.resize(rect.width, rect.height, this.renderer.cellWidth, this.renderer.cellHeight);
    if (this.reducedMotion.matches) this.drawStill();
  }
  schedule() {
    cancelAnimationFrame(this.raf);
    if (this.disposed || this.paused || !this.visible || document.hidden || this.reducedMotion.matches) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }
  frame = (now) => {
    const dt = Math.min(0.1, (now - this.last) / 1e3);
    this.last = now;
    this.acc += dt * this.speed;
    let steps = 0;
    const maxSteps = Math.ceil(MAX_STEPS * Math.max(1, this.speed));
    while (this.acc >= STEP && steps < maxSteps) {
      this.world.step(STEP, STEP * 0.65 / this.speed);
      this.acc -= STEP;
      steps++;
    }
    if (steps === maxSteps) this.acc = 0;
    this.renderDt += dt * this.speed;
    if (!Number.isFinite(this.maxFps)) {
      this.render(this.renderDt);
      this.renderDt = 0;
    } else {
      const interval = 1e3 / this.maxFps;
      if (now - this.lastRender >= interval) {
        this.lastRender = now - (now - this.lastRender) % interval;
        this.render(this.renderDt);
        this.renderDt = 0;
      }
    }
    this.raf = requestAnimationFrame(this.frame);
  };
  render(dt) {
    this.renderer.render(this.world, dt);
  }
  /** Reduced motion: let the ecosystem settle, then show a single frame. */
  drawStill() {
    if (this.world.time < 4) {
      for (let i = 0; i < 240; i++) this.world.step(STEP, STEP * 0.65 / this.speed);
    }
    this.render(STEP);
  }
  onMotionPreference = () => {
    if (this.reducedMotion.matches) {
      cancelAnimationFrame(this.raf);
      this.drawStill();
    } else {
      this.schedule();
    }
  };
  toLocal(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    return { x, y, inside };
  }
  onPointerMove = (e) => {
    const { x, y, inside } = this.toLocal(e);
    const p = this.world.pointer;
    p.x = x;
    p.y = y;
    p.active = inside && e.pointerType !== "touch";
  };
  onPointerDown = (e) => {
    const { x, y, inside } = this.toLocal(e);
    if (inside && !this.reducedMotion.matches) this.world.splash(x, y);
  };
  onPointerLeave = () => {
    this.world.pointer.active = false;
  };
};

// assets/fonts/whales-mono.woff
var whales_mono_default = "data:font/woff;base64,d09GRk9UVE8AADXQAA4AAAAAW5wAAbMzAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAAEYAAALYUAAE7Yx0EUzUdERUYAADHoAAAAFgAAABYAEQA2R1BPUwAAMgAAAAAgAAAAIER2THVHU1VCAAAyIAAAAnkAAAQ8q4iNp09TLzIAAAGkAAAATQAAAGBXxGSqY21hcAAAA7wAAACMAAAAtg01DB5nYXNwAAA0nAAAAAgAAAAIAAAAEGhlYWQAAAFEAAAANgAAADYm9v8paGhlYQAAAXwAAAAgAAAAJP93BSFobXR4AAA0pAAAASIAAAF8ofGjhW1heHAAAAGcAAAABgAAAAYAvFAAbmFtZQAAAfQAAAHHAAAEOmcUkUJwb3N0AAAESAAAABYAAAAg/58AM3ByZXAAADXIAAAABwAAAAdoBoyFAAEAAAABszPQ17vXXw889QADA+gAAAAA5ViqVwAAAADm/l48+Tb/XgJSAyIAAAAGAAIAAAAAAAB4nGNgZGBgfvvvJgMDU8RPMwY2piDmFwyogAkAjw0FmQAAUAAAvAAAeJxjYGGKYIpgYGVgYOoC0gwM3hCaMY7BiNEBKMrIwMkAA8wMSCAsyNmH4QCDAsN25rf/bjIwsDgwdgGFGUFyTGJMx4CUAgMbAOTOCyEAAAB4nJ1S3S4DURD+tosQFImIuNq4IqEtERJ3SIiE+KlU4sq23dZK68j+EJ7ApafwEOIJPIcL3sCl78yejV2SSqQ5Pd+Zme+b2ZkBMIZn2LD6hgA88STYwhRfCS6giBeD7Yy9L4P7MYNXgwcwiTeDB/GIT4OHcG49GDyMivVu8EgGj1qzhWmDi1i11w0ez+SawLh9jS0oXOMOAXy0cYEIDpZR4VkhOqHF473Dfx+heA8Zq3BJS0PeG4h5X9AWMMLBnKhEVA2xjjJ/bXJ1RIw6SmQpdGm9oULAl4eOxKQZFtFixBVRyTDncUq2yzhPMuyLX+GY7zZVO/QFqIleSIb2Olgif41fUsmxU+4mLSEtXZ4kl84doyn8BfJrmfoW5Duv6A3wITVsmo65wvYlYod8nzGKeFvYAf91b13x7/OOaNH+M6nZpYLCPe+/6/k7fy/9nzOp98xXlsn7kmnbTMNBlahFdCvaei+SiA7vhuhoxSYtsdSqO+DI5D1h72KP9wGr8GRC38p7OYXv7uenqY+TqSyfN63G5Wa5xHor6jJ1hxUnG6i9Ou8GjgRH7IbzqzfKVJjuYT5PSTa9/U9WVXruc36KEc0vhkiwnwB4nC2NOw6CUBREj0qoLViAO5BWKlyEjTZa+gOj4v+zF1fgH4HGnT2HF29yZpK5yQxQBWrCk1asO1ys15U4NGkR0qXPkB0nUmP0beAT0KbHgBH7f+qC+YrcFKWqz1Pqi4DyQqsdYvUseJBz48yGLXOeTFgxZsmUiJQXb2ZcOZBwJGNNof27tj4/xZ4lS3icY2BmAIP/cxiMgBQjAxoAACqUAdIAAHiczXtnWFXH1vA5HAbHFvVst4kJGhQLKGLvGrvGFhGMsVMUAVFBQTBRo4nGwrIQTUQssWDvDXvsem1ce++xERGFWNbGOfi+a/Y+BwE1937Pc+/7fD/OmT1ttVlrzVqzZ5tNzk4ms9lc+JvQwMHBUZ0jhkbIalVthEmLKWLSYp20WIs20nlqEbNrVj1RT3uYtY258pLFtrp+tcHqyqeVMPUjAKZCJsX0mcndVM1Uz9TM1M7U1dTbNMA0xDTCNMY0yRRvSjQtNq0xJZv2ms6Y/jQXMlcw1zf7moPMseZp5oXmHeYz5rvmTCfmVMqpmlMrpyCnSU4JTuudDjhddUpz+h9LUUsZSzVLK0tvyxDLJMs8yybLYcttS6ZzYedKzs2dfZxDnMc6/+K82Xmf8xnnB86vWUFWljVmvmwgi2VT2SK2lZ1hz1xcXFxdvF1aufRyiXaZ7bLaZYOLrUCBAsXDvAdH9B/czbfjd8HDI7wHDI0YEjE0WC+jY416dOjwYKNlYMSI4cZDWIzREhU20iiDY4KH6k/BYSGh0frT0DA7IB3y0BFDhkvIspSQ9VKHLJ90yPqDhCwfJGS91CHLJwOyfNIhy4fQbyNDg4f6G4X34LCQwDwt/6rDP2R4cGB08PD3DHhPz4eb3tdF6hSVv/5OY2BU/7Cw6LDBA4L11qDhgf2DBwcPjPYPCjSARQYPD4sY4J+neE9H8LARgYNzt79t6B8xOGJornrwyP6DA4f4DxsRHBUdFjE0d9s7g/SGXM2OSXlnv9Oat5vWKSiYljNkqP97H/VBUYMDo0JzYSL+37cSslkX0nBdF3Ka7L93htIvL8z3jco7Indvfv5z1T/Q+u7sD7a8pyevjhht+SXjmJ1LtfM25YHr6Hp3/rvU5aPrfRjeBaeTnGtkrvqHmnPjzN2ew7jeaFfBD4By2Iej8t6GdxvfQZ2PkfxLm7/xAwA+1JyXo3cGvVd27yMrn5vI1/Yu4Fx975tqqFTuWbkm5KInN5jo/C1vSfwAJR8m4r09eeaSF+sfPDTa317qbTW969eo0Soi8lvd9t1q1ahVx61baLBbu+CwqGg3n+ERg4L7R7u1GBEdGjE8yi00OjoyqlFIWHToiCDv/hFDYiSkwSFybLWBEQSSuoxN303u+n7BQ8KqBUUMHmCi3bx8aVNLbp5kMnUsbipR0DxZMfWXzeb5JU3FTKaiJtNnZpOTyeRmMg03mQqbTM4mU3GTqanJ9JHJ1NxkKmg29TGZ+plMTUymL0wmi8kUajJvqm4qZzIVMJn6mkzMZCpiMpU1m8qYTP4mChhMLibTaJNpjwwlnCl8OGquSKHBTvNfTsOckp1eWBpbvrMstNxzLuM8zvkCC2QXXL52meByzuVNgdYFJhX4vcBLDgVdCgYWvFGoU6EFhesU/qnwxSIVi4wvcqQoL/pj0RsfNfloV7G6xaYVdy7eu/jO4mklapUYUWJviUxrlHW3Ul7ZqLwuGV7yqVpFvVCqR6kTH5s/Dvj41icVP5lc2lS6UekLn3b+9MCnbz7z/+y2a0XXuDLOZZqWuVrWr+y4sj+UXVP2weeffd718/GfX3Qr4NbdbX65WuVGlrtQ/tPy0e4e7tMqsAo3K31WOarypsoplTUPT48Ij52eXp4dPOdXKVOlUZWeVWKrzKhyserHVRO8VK9WXsO9VnmlVFOrrfAu7N3Pe6334+qu1TtUj6/+Rw3vGstrqjVH19xQ802txrVW1MLaA2sn1j5Tp3qdsXUL121Wd3rdzHrt642vd6l+u/rbGrg3CG+wt2HDhrsaDWusNI5uvLPJqqZuTRO/KPrFuuZKC+cWx1o8bDmz5YmWr1q5terQanGrf7Se3Hq5VuYj7YdFMdgELbgd3SDWukg7qFxZBCoqwHZgE4aDqBRUUl30y+rFhDcwJfWKcFOviu1M1ABGIACd8Wt0wo7obL2MxdAfS3piSeXFZQI0FhjWgodnABUOj7qdFE6JXNHuz9t5FK5wwOL1TouawEUoDSsmdquAHdl9YFdhwyDoysEnZFBT4LXEIer4mqEzIX9xDZJDoBP19Q9rFMcJ/Sh01uais3kdlrTg4VEqloU/05diEy6UeDbKvWe3jsCrQ89UwIaEsdHvfz4Cfgx29VhQlaPyM4vEut6PRGkiogVUEe4gvuUgRj4R5bEFcJ07Fy0GXcySs/GEQnLVhsjtDlgYrYAjCehIURhLiu4EQ/YUs6WqoMWwA/RcGFIagahLIOu0bywKOyBiF5JXZ4J6F4tb7oKqdQNGzUxckWUXhodl6cSEXnZmeMbot3XSJU6LtoMW7RviOo0ApBFJxeWAHQyPytLChF5+w1AH6Mxs3fSJo5A1i8EFGQjIrCQwXI8u1R8pu3D/KPU6HNi6+ihXvptenz2gWRqh/4XKSkzZg+WBTarQq0Nj4F7w9SO7KPemPgT+T9jWY35djiVnscFYtfZDUYbE0BQqO0T5I5rFJ1hT55zo3k/M74k178PiOJVI3+cgfT/DqVQKKmVd6posxR4mZDvu0eu51gN/pOmXc4munqQ5hmE9u6hku3Ax6rYYvd+uLa9jzRtoNUcRAFxJCuMJ958A1uegDTSw2gYS2yF9SPeaQsjuyWjioth4Nl3Ue+CJle2cZPXSuXjLwWCWcpdhB3GQkS0xAZo7w5/wJBMeVPtenKIhp3IzkRrrWLw8q6+lOgYZOHYix5XILZjwSL0J7IlWheibyJDbpVQFmLutLnPX6urPkN3L6NMmvoWRgkVwJBaxpBCtRWTfTIbhNvorbQciG6kuwqmHbIHlNSvCT6ZFKoJfQBrNwR9o9cdXxdLiC1rrL6AqTRHjaa1/SBOlaQz1Oqs1ofctwFb03Gr3nQfAH8DueiCoLlr1bpCjDnOR4TBazZukD5GE5aZDmnNZBplPZXj2B6ArASlT+Z4g0YsR1Fpc3COHMIzdA1LU5GBoyaFVYLABk8gWzjhDfBuTVZD8kZ16Zb4kfxbMhFlT+Sp39og8SZOBWIJl7jpEEsH2/4IhUVZzUd/lpNTIlgGDuNInDAuy6gRy/lbxOasf3+8KYGs7gwtJ38PRxXqSGBxCTqIYFldenHRwuVByeQOWx/zcnM8VzXTd/w77sAmXQze3nkOe8vTi/cfgLlH3SfUbwiuH/5tETDhLB3ZF8t+WQ9vAAV9Abm94GK04Da0W/Actmzc8uQ5YjMC4+J4UDXdwUXhN2BI4zOHQ9g3/BH4JknvObsrR+jP7HivUfUCKxAlbzfogyG0Ll5M9scIAjqUHrguXbrmr/+DmwBtBj9+/f8KFdQJLENXTquTYuJbqME/80c4oKTX2stvlfLtd9sptj4dIPBPkDKll1eDhY8DGZI8D7PY4mEGNwB66PQbuhYfUM9jeM4CANX7oRXPemmWStseCYwj1pySsYKnfH5MJVrQl0Z+WpNd0G2wjasjx1mXaDiUyg8a7Azukfc4O2T5n8vmS3TSUjX1tq1hnradc5M62nqyvtkrvyMG4RZtv2WJHWAIXyCWivzKEtS1qDFvhKyY+o1pRkUh/SH/Uh63Ey7cgaHMpZsHxBKSYFNQuhgFaHSYIovhEJNMfJus1DLTVye0Hd2rxlp3kQ+LtPuQNDXlFflCXdYxd1qTvIoucIM0b+6h+GuJT627ygMFYSFmJMWPVq3B849L9XBk55+vNESeBL4BF08lS4BEbBiwWfvgFlpHy9CagZVvfFJVIOz6CBm1jK3AsNoHN3r1mzTHgKbC6PzTnonEoKzfCpzfU5FD9mu9T4IseqcqOXhCZBFs4bP5t0eEEUqUVDEIYNOnbq46+cGNftozROr3EBrHWi+giXLAQ/ozFlG3411iVPM6d53ZXUu+53KpbQNfgYT2pHs9EIVqfGOn1lO9kgDDjFlvhd2jAZeARL1VlWxPocRLQTEOd9p64AfwKbO8EwomU2uzfsYkdNT59SfZC0j85Vqrr4xu/YXEykZlsTJt+IT7AG0CvFHjF4dWelFvAj8C2kMROHKl/JBbzviSK6cZSUTiTJhLgxpnkgLzyc7WGxP0zFiLOXGi7nT5WvQyHNq84RNvtjAZMGS1J1z1xIbli8WzY7103UfxBzNZzt3vNO+4kCL6CuNrTBPwdXG0/cQX4Ddjr4KrHW67c7mKRl9b9+JH4iKxrogzJ8DBxWBBunlr3kouiv7DR/QYM9QPeDHrvmfCQa3LfWE2L3LLSK1GRsHuCh4OrL54JM1YFrjwRCt5Rf726I/m0XPOdA2Y2spt9h7TraWaK/gpb0J/UuLC0+w4Mg6hMY0IWCxlsWrB4C3DySHpjK2Bu0OsbqMAhRrcJqKqbDQEU9Z5ditnwFM8/GxurK6uUXgEsoDzF30U9FavA48uA5cgVRDElXbgAm9KQKa+GHe26vhWRXgqqk+BqEeVV/yyPHwO/APvWLdvHoQ0DWtWGwDvCkCXfb+ai+Hi2xPvmVxTLkTyT1SbQ5zBkcsjceeQ68Muwr2tcRR5XsYdvc4d765pBC0qRWyEMwEIyekO5aLTTw71dO/8pFWRNsNR+cZYZPU/oV9TvhrAAbw1+ERGdCdFMfamlHafh47RztFVhEhYhBgspGZikZRobNUVu0s+I3tmBqjZBl5mSKloakhWnDHl1lyrzmImA/wo8USVNG2cAfIhFRSEd4EMCqKRiUQOkkiHoSYzLRhWbyASB8oXjx8kB0eKQhT43wI6R7pqCl46RI0jl7LkDiXN1LPaINZ8lUZ51iNKN3b7PsLr41vChg/AouT0cSe6basPFDCK32Vv5aXNJ7WbRfArF7ExJxQLtawJl7nZImAmdXbdIKbfCkmgI4mAja/N3ENH1fq0MslGW+TITWUlXZc8aooVJWh4zOL9o9TrgayExAlrQsqaxl46OJavXAl8Nc6Ogqd6hT6HAGbDEwIMULHeDoJCRHfmYfw5d2w14LwgJH+nDlRuTrzGPHMwZpN+X0Uk4kUKFknRPXXaIIYXB3f07yR2fhNWBUDeXRqXTj/vdEQXJIC+0gM5hES24snUyreZaYdIhG17td7KbmdKz7R8rLeYZmgG/IO37ojJF5XKTr0oWbibrlhb+1LBweKk2gr4nyLdI/7JTes0bsNPuX5z6dmqk24FQY7CsxEHUn8zlsR+eFFXs5Eex1d0ODTlH1u4BZ7EEoDcB9G6DJSgi5srjFuAXOrgjV65N+YMplwRJDuNsndQvoMdhYo4rD+l/32Fy5Fdhlw/tYjIQ6ePT9B3sybk86w1tLaGHrOZMuSYhTqnDlCeDT/qtl77UA9qIEiCICuF9VpQgqvg5OLRq9UFqiGKiJE5Wm0Kfo7reosuuo1d18/cFwWkA7+FrBFhkX4+eVk2z4sA/q9FqHbtKSlfbULqGRhoANzYlE9noJCMHeMpolVgbCAr9ri2f8Jz0V9dE2nc/sdvZJ8aCZeKrTIqDi2IQFqWwjRasDNw9CukcHvhvEbVW8aoLhs6FZA7rVqw6JVPYzYN+6UPbEMVsjzrcppXkohy0agnEn/c+f6w9mKePXDAGQjmEhH37JfBWMHDNuL1cFJrIZlW+3piyHu5wF2bsT+ajFQYZe+msEE29IToJ9pAoFjPy53qrLChoNjYpKusaRiULQfuGMO/vgQWM7Sej1n2ta6z1OqlFHywsLGhRtmKcvu1tXJHCleipNZgyUsoItNVMyM1CpDBlB9Tr14cS9q9gyCZ4QMjP2rFl0E852TrTnkGXdJOOw0pxlxKJsUR3JVKfLhKSIqUuSpOnEaUpV5J1fYa3KK1PmaedoikFacpHwI7hVnZMbGUy5nomZxeVs/1sxVlnPMxqUrQnDjM/rbje4XBXOdEeCYk83teMwnr6kzGmHy6lFJCSFylAUUi0k9Ee/ZWikR3FHIc/vRNr3qz9ZqGduQql3ewa7FqRdJpjsHaHkYZSgGpzY6Kc5qbX0M8WzzYBG+XPfhg26ocQ4O3eOnrzBa2X5QKpYC9jhc7T+BN4h8FLZmtnrM5+AnhC3Mmd0+2krCjekdPVhseU3uvnGN96obuoTYpUG7xyjkIei/Io26x6CtR018NrwFfBsu8XRnLRVbxgP26YtB32UfIgZqtDYNic2GUcu+JLNnUymzVwRgD0kDFRnxpNck5T+HMsEmul1K94uZdKhsNp56TwqbSBlKOH2uHh5EHr05M77TDYVm4fnImBOQn0ZJ2TCjgOldwRsI0c4Izk3/dh4VMcy1/ZfZC2KOKtRMPbojqxURdq1Bwt3DmqE9icm8k7yb1dhE1BQJvyl8FDGgdyEeDWtTKIhvZsCkf8hZbYZ2ixapWxZHk9itpNYqsBf13XU9MH36TUWkqp2pWkrXvhMmH6qOZ5UZ4wVYAGzb8n54GUIc08sG7teRkvbQ6Hjhza9YnsLHcHBhXYQXmqdR32BQN54aY+4a2Bfwk9V4y/yEUJmiiK32hAFmZPJyuhkyaTBZt06jZHslCJ3THOi3QB0r72Oa35KVuAFB3eoOeB6KTiQNxNRrTbrgi49AU5Thez1kAqwj7iyAMyMggWceBWK5NA0H7V57uwcL4ImzM8YBeuJ7B+Ng/S+4ls/pbty3dL6e3sCXU41OnTm7xsWwha+2MKFyXHs19FwYd1yTANQbrgUjTjZ7RmyaR9cyTSg3pqmpkOSNESVqiRJtwkgO6RYQP5PCx7+Nht4MdhxZCEQJLhr2xYRvsLwpUES5ISX4EYR4oV8Ehwijl4HLqoDaHXUbjK4eah/TfkrrHjG2jIoVavXo3zJKat8GMLtiLRfSxZmngGv8Cm6EfRPbONtqdLlEOJqqJldREIYohDD2LRpB9xEvlVUCGvplQhZfhLtyEveHkBsAyH1K9P1V1FQXLK0m174BJxxWrc1Gl2hRoNQTAOzbf1ShnOlb/qDv26vfTVoszLljJdAM1PVZ50gf6r4ATl5ZvXHdN9fBgQaZ36D+lCI8Q9VfmrJfiukVye37mDxHMbdvYDSg+a+oa3dOT/JGQzCdvlraD3Zg1ShTdU9AQh49IKD6siSfoM7F++biMfJcr6flUfeGeIWDU2mez8B7asUkpLJKoxGK7gV4AkaQyojlyQpKcKF/Um7PGREU9Dv+6NZE7ebx/c5HB/z57rOg3jz2HiOTN+cg/r3CMfM179CyioQStBsXa85A7cHTo2B0F1YT3V7C/gLdFNnbhgyiJYwuHesuQDwOdC4qTZE7hwFp3Z+Q7qaPg+ftwsjhb8ik2dxOK/nRYDw0nlIv27OyxjTIoVG6BPnT/anFXO4AJQ/5C28AlTjrWhh27hYSRB5Q6ls9CeKWcyDC9yCaefNWO91L9uWrAeqUQSdV+ipJ2KBQkLNy3k2xazo6vWroHjHE73210LeB3o0Wd8I35jEvt5+8IFm4GvgYUjYSiHwePGho3kvYezOn1H9QMPXQ5nX5x6dM6K1e68vNvmD/Ibe8erf8LBXXCOw66odR3lUfiuhKRlsJvDsYBt3jLT7Bsw/kt+ZyKbvnzB/DUS+vxvJfShsaOGAJfUd2DLpMPYDotjIJzDoOiRA4APgJELpqzg9Saz+Fbrg17YXa1Xa0J+9J6yCI+Ceo9mBcAN9juVi+Ac6ym1fyyjREy0ERNlX0faumRn1XNqGu3ycofXmcDSx4/SctruWHDPePURHN4LtzlcCdpPSdQQiPxx9Cg++zZD6anPMfEjsCgRy2hbS1y8YM4q4BvhtwgYwME/akQw8HAYmfjTcl6P5Pflrv5/GPpyFl1PnTxtRfe7de+h202S1D6J6PheefT1wG97A+CBMHTUmFgef3Llhj3A18HCMT9H8euz2JiTAesa6WlpYfimunFeVewfX6WRop5VAyFi+dRtfOrWFUu3At8BS6MggEPgsMh+Dq1JuWTFhrhE+N8lpRkN6l0pldJbHl9JI2WBk0wsoQZyf6QRbWoFUQZHJmxQ7Hz8/lkrVrzX+u7zu63vST8wXn0Fu7fBGQ6/D97Q7TeiaducZUvl4p4I2OglT84DBso3F72XDd/2PXkAv2+HDISeHNruDnglc8/JZP/hEDsX1nBY/tvctTLl+G00RHIIjx0dLu2/Jdl/AETNgw0UBSYt2wZ8GyQNgzAK8aJGBRiyPH3yFLoSZZVvotu9undJlge0z9Xq0LmHzCBqHvK/BTwZVs5LXMgndhwa0gt4GMQm/pTEG49niR23hZHrVDTKk/Y90t/ZYLEuxyi0jGujJsOKyLgAHhcUMTwIeD8YngTbOCQvW75DR4yn81o9nv7vm722P6U9Vn9r9z64AC/nGP6XZPjKZIfpLxqmGwAZv49h/Hg5j/XTxP+w+ePpd+yfhPJ/5wA0j3NYgiLsWN0JbMSjxCJ5AcMHvOsB7PZP1q+cyWX/xEVuB0Ac/Bc8gETyjgvQUf23fUBWsbceYBGOxkt5XMD+D7sASfK7PoBo/v/ACeDp93iBrKD/Ay9gnGVv0JZa8JHWi9aPYWn8hdUAZmuf3Ut9SPVPcZY8R/9I0rngqdkW+bqTJRkXqJo0u6fMRoVtroeqtTGqbQxjXZBufnPA1cXJMlsO7Ud96cxGxZtTnqrW16hSoW2mak+j2tM+86m8yOjK71uw0gFK2qYyCooSmJiNc/R3XThQDGSueJYmeTBXXu3tLDHd1WXq38567WnMYhdzZtnWvz72d3PeKPqU1yX+TTwJIoHZponEXH0Jsk8mnyGSBv1oi2hwvpuXBs3zoDw6N4bjbDlRJqWShuxh+pSs4flp+MCcBEpd54kEPeMVc2RXQm5wby4aLNmFMC7NjHv/stgq4zhVvnl4CpB+CPhBmOT5nGJKC2x/Dqm8As3pPHLAIOB+1O8hd4cZnt0oUn6kQ6mZjmte4ep0qy0AXVa80Jqhs7JWuNRU0Vhd0RRYbRiwAlI4+RzlCTzofqrxbA7x7OqvB0/BPdkKKZtX3COMTY0ZNFEUg0bN9DC8LYPqAyPKT+PKC3Cj+S+mbRwK1fV2wW40o7yK44041TiXz2DC2Z52ljNnn6Qs7DD9DmFlS/ZJ4+yBOpigUusuyuVt+Fo2VLY3VDYk9ElGCHaKfmZ90wX9KC3zU3aIovha1brSsGfMRoXSI/uSXHM/ObETE1RqFUWnPA3KDq2NmGbMytBn5YZt642+ysZoCdbXAEuF4mNrLcH62qHIpo1aawnF14Diq0P5Hcv5ZGCJZyFYzmr7HCsrPWyfa43y8KGE4hURmJtmENdyE6OsFFdEx/y806MWieZRsVbxDCuJT7CQVgAri1LodBqLKyexBQar+qnQ6bmrDq/nt/Zu3A53yAEVrn2HEmr5osW72ljxMUfKjX+5uXnrbXmyvz4QunH4ZsyI1kG8Tf/oblCJ20YlqJT5zjw1GwvBda6sA4yxHyXFMGg8WxSa1YFrg8SwvExdtEG+BdRpjvJ4ivypBw62StMizhqCmillsB2LM+2A4akWAtuKnGkxRlWuUI+tWJC5y4FBoiCzLdbtRBsLLEhwZutuVOvYkdSs9ueF1IupVsMWlR22r4FCKKaMXHyCZdED/MmyyUstu8CytlMtlWUnUO0iyxpj1PoAW3JKYovuwLIpxgFvlnUG2LAWLHubUZtNtZYsW6a51VhWn9wLYhWpOcuAwW9X5DoG/qdWZCn8R+Ao6dosEZxn2WxL3zUyB19vPEnNSqHlNBaj7T3nMTbnUekd8Ka05NEiaUtcdWQ9v5lDW507+ouwqg7aikvatmy9JY898tIWJWnTdsF/Bk7yfwaOsnTcmzQprNweaVd+F5X8PpVfVTUNvR574Trrm5mubLky+RtQn5I2frka27NXMrIOF+3lFQQldA21UNCdmMYoAlyGXuwWsLmPWSNgayhwpy0yXHzF5HsJWa0KbJCs1qKZn9j7FY9/OSL0PSPIcMZ4yaOvSOHFGlClqgw6DcLeT+qXklSs9feDQh2D5qepkgjJEdYGdlZ4qfozUTGMMGZvRi95fKqjlwNxFuQZYEvJW5fu2VM6ErNt+uuVFtt04aRvMA9oM826pXuN7N2GE8maaVQjgT3DLbm3H6m5FseRd64VE+ViKImh/pFYwYKjRT31MrCT2JLGqEzI3VaUY8cdYHAUlneA0rgdVnkdFthmfwC2nGTVLaciVlAy3pkZn91AIlVSP4hWS4k1AJDfp4R7Dg7L7aTf56KVO7qPzq+dhm1jzFsrvoIT/0NGrKSOymcycuFGv5U9js7fq3W/iy1jzde1ThbylyvVx+jKHgtXdm4380IrQxkm3mWCisdUbU2t1OlFg9r0Zn8Kq94DdfVx1ahqnE20lwaIX8WaN2mLLH+ASrpp11W77q427G5umjz3XW7YXaJud2sNqxmU12bCDZsZnc9maAXQJS1HUyMNTRVOWRnmP7Ualj/tWor738ZBOZ2a1GHh6MH92Rm6sH5Ekxm55mxBjj+qmgyi0MRsxmS3V+bzWh/LeTdVoy1Inrv2eQsUK6BiwQcSZ2GK19yxQiC6A7rTOronU6c7Pcq3RaKqcAukZRUVKSWqmEwaSQ08B8pNCWWehFIV3ZKxIiCNw4qBWFFQgw4B3YV7MmmoINjCPVBQVVTQIZR4hWvQTPGn9WX6IiR90DxECfWBTmsLYH4QvRz+wSmPVlIhrd+R6rM4zGQPZ+08DGkcbjI4uHjNYalbcnxNItUK3SnoNHHwYlA/KpqyQCUDhJmmP4akKGjAoSoDt/3N5BWEvPgpzuaL0snUehAB1L3/sryHksbgVlLSYwKTCkhgMrwgaonMyB9LMXe/TAg54aW4lmg4DIvDpYo3pHFQdafvw/EcJrDq4/t1haocGjHoEh3pJ6/UyPG6/DKzKmSaKQooYtEiSYKQyYSMGLIqMJQlVV9QYay0Y7RGo7G4lPcLe8Asy4rGjOwKOgSZbct3F+5Y4DYWsOATfKDeB5aEicbFhIIkqha2grJthlZQr4NwzpmmXyibQXPIDuY45hTPGZMYg0tlHtMXnf8+ZQuVyvhI11f9sqSunEsph5udN/EQ19BZa/ZiBbpQJiwTj2Jw4zIg5Q5nGDzauPLFFJk7vGKKVn7KwBXwSG9H1uiyfiFIZimeTKYe92BzBLTn0JpGQu2DHa7+wGEiazyuewd5SaQ1g/YDImrrd2blDPFxnOpIOOwyhpf1YrSMlxBrdX3tQzR9Rj9LptLvTWdQc+4NUWkjdvI0vA6nBgpTs37BrUTapyz7V3qoSB56fWY5Nau2mMaya9GfkTZQuG/OPoPO+JgkmH3GbvUOWrRe2RlGA05k2h4jypcFljCqz+zVHTmbVQ7Z2U8I6pJMpU/2k7wUa8qHCFz7AQJFChEnUhzE/bu0GMcStkaZFlsjeC/GD+Cz+bwuYrH5UBb1uogO+E0RI9HRqxl6lUY/fHQx9cKfjiyaCq2xSk96zO6aFS2nzLE3pDoaEuwNj4wGgnIAAynPsFCeEeBIAubkUuU5UpUTdFVWQl+UJ1WeaT99oKzgYDfm50dNNexNQ9+BqGcufwcve7WRxhd1QNN59WBZq+2wgkQABtjh9SVDy6GyLVY6lMfgEt6eXShxtjgxT8XSU+2nBo6jA6VWZkXmKibZTy8ocjvSlX3TnZo+tzd9r+M9mMODvwNfaK5zitnynCLRcU6RSCKwHVFdnVNk9oUB6G/gWlnenQB3A5JMKVtt/SBDCRX+GEitNe3o1r2T7NnRrXRkYnq6l3XDCM122SO1n41qhESYnDvdy75liG+Pke5lzzKqw/Ie09gkK8E4UD+NkYCG6e9rBxonPLNFgnH8IqcslP4t2tXlqAXbHnTIO1HKO9Hh4EKJn7Y6gFADgJwr5oh5TB8egiHE6E6dgnDtuVmkZrWxUObnrma1wepkEMVYdhv0lp5b2yxcmE3+gVhl786gXuEtJx/CAM90ZCSlwFyq+j6iSLXKEVE/SPGUe2msRigGCJI8o2DtkB/z9aVFy9YPDGSz1BSa9JIIHQdv+dYt600JOwrJyOsLusDeXMjLb6I8LpvrULhEqSOJDmHOMWjXFSrdE/vlKNSbH0iBE/DXPKPlXPErowF4RoV0Q4GUHuWfv+WiH1GZIgaqRIeuSMSDv+RB73/xMs9KCzI9ESwJL2EQrsglkystNVkSh3NoufOdyK3HBTp0edT4ntH4SRzTgeqMnfCgFTnp4CreMEswVkSp8XZNfDBEqsprUmWlBgkz1AGVhsUT3ESDAx+SKykMc8u1DkOl/mnHDqpiDs6TEp7jOAi06x4OzA3ODizOWCJd9wh3iD2Kv44VPZ52eYpHYq1vdulpQUHlxJtER1rw69u0oGC+tGC+KHVHysVWTt7xziOWBEE+oXScYUXK2qzhA1RX5qOL3PX1Rho1weaUP4C338G+kGnRaIOYSvsT7QnZvwraJMRntFuILbQzINIegdNYnG1i3g1O9MjEJHRW+iDl7Y7NTQYXIik/sE8lsK0GMKLtveCyz2RqFmOjV/oJyAtSE3nr2eJvUazPjYK49I81ixeZFtEV1KxI3EYy+IyyTPlQjmUVFzNYdnERz8Twciq8pGeMp1acIe8TZUeKbYY01ohtcg+dmuUvsTpcSSa5EpSuhCJE22Z0IQ9Cf1TRfQaIYiyrjbil6g3SxVT6wJYXSipfx1B52sz8DrGDB40tTm+iLU+Z8+KFY7kTpILN0RVMCS338h3XpB/8S9eUyxDyuaasHjrIl+/orBxQntyQy3LaNrR9WF09dIi5Fhic47Q0I2L8f/SFb+5/AJ/Owiv2mvpdKas10LGSb33k0w+hC8W7WkFV3+8C7b6pnMPp/g0m3cEqK4kmaS60H8rpuiv2PcwIOSFL0laZbf1ee1jiktRptARTmdYXe+laY+uLvdkUCjv7it66Xmh9Bamlhr+pmEULjFm07CJLVM/n0bK/PyB9R6I9HMjjzbSicarhc+TbDN2pyg8lQuzbob4TOpzk38Uj2d8fUnO9qMilKxSQzNQKTVKVWsJEKakeZOh4KOj4Zj87csQIRfQmCk2UuMxMB+oEI6AxXnFUxZ4eaVatyHOlRi3ipxN2Ytfnwo19wA8BeD4F/hwmpR+Ul8GneGZQphaPFtgm33soPjJAiJfvPsLlu4+Z6W7APWiOn7wQNiPdnQbXkHVf4IOI9wkU4+rfr8zJvUH88GT6E+ubJFd2VFmUvdBQbtEB2zMlIC1+6uMj8nXLxMovgKdD3LMjkqifZO0pTHl2NKdPWUS916h3A7BZhGWmmKVfY8TEPNtmE9GMtR81xbcv8K4w9Zkn8PIQX9lP1qY98zBq3XL6hMno9AP5+dvkt4GZ49VQynNLNiORzcSZbNbPbIdMUeOa5pUY1V7ARKMW55meUztKfZn61Vr9HZJ7zjskX5iVTpi5J0z17CoFGZ9eXop1mlHTxepBfb7yVtuUf7RJ5NgIm7yrVKJUTNarWPOb/q6snUW0SlK13fpnL6Tu8XKJsYV+oCLm2y4zWwuKibQWetxkYbbdDjOYITqyOsJPHtTgMu1PGkI2YGthNwQSga3iXxZNvh2TNzYfAcuhT1eCQTByMxzX3495b3cntXEIxq5Y8nbtuTZnbzyekTbrsG8KKjess+9jwWtN7rU6n3JLWRGPJceqW2DTqoU7uBLis0wUxW6zfsUtfCZ+64lVRSv9EzfhIpwnyXvf7UaEDyBV8PPxpfUzXsPJ1aSZcV6MmtNh6tPDEvkED6ky4dSw79QMLMVnYOGLN5HTaljhlCj0k/iKTxTFR/UirY6BnzbFn+ULcAxrTMoeXmPKIEYAxy6LmjcYeHPoVOt7UYyPFkX31L4OfME5NRRGHp51m/9yd+XhdcDXw3zfH+vy8fUjfcMcl5RNacfTZqRZbRHo5P48a9hfyiVbGApVflvwj9PbHhMV9WFfZewsb5ZjHcrDb8pL5FKIXVoHEluiPnR/JjrpHx4ISwN5qfsnUV193QHkvdk3shD7c1eNtZpGKKOfKwH3cx8o6KmTtJMJYiIjG/XN8wLT/jrTDWbK1VQWhRvrKXXVe5u+nhkwJf1IzgtR++tRJWAfQKPro/X392Owp+hu9zG2T19oKS+UqbZPcYz6gsTpCsd/27wG+GEY74km3cQNcBM95Qp1IuvYqXsar/I0upPd05B5phumK4n0gWnp8jMuC/i7gze3K+abac8tSw+8701zI9GEtRkzpUsvaWpTc3FLPiDdIwesHQmZyCzDf71lnVTZCXgmsX40h9a8lD/NJ5a4q4flhQ026yf9Htr5gBhcen7xeRxwfnys1XbiHvJ70+9jgfv+8m+6rCq9a9gaaE7qbTh+BLAQRY4FOx+tLy8Rd/YBUZCDKHS8623QX6+8O6aTY8wJOSbblaJE2oSU7m5abYqv6pIUSmX3kk2Oena6WKqGwIgNcJorn9WA04s3bJDOdHEItJOGFRJioLIPyelfZPTHyH4x3earKotO3YYTDnI6/fsk5x1jSz5PuGIMXIv+PVpy90v/53IRC11qeR5XnW53Hl0vWOdd3JeK7JLPrRMXldOLtNZfqMPOsj4jAscF6Mvc7ArgACIo4QWWxs/ICkvAQXfjlmmDYT5k7N/C2IWQzJXLAXAy4WUCOvNGwCYNYHHTmLJh0dilw+eFyltVXeR3ZmXlByZbvzoDfCtsWb5wN586mRHSxD5rIjcDT4V9qYDBhKxnLSwt6hH+L0GUoQdxhCbORKcK8uPsPbA34ehSLqrhtyphGAqjN8MpDmmrr2wCvhLmDpYXaoUlvMlA+31Zixc61YrRstFsTUBrdyxKnBSZhU7KXPxulJoKx5I2rOVKw7VB+t6o9KyLTmzbnjWXZ1zhwmkOi/tmjH/scC4+wtpMmZ1xavdhuEHoupzUjwGLQOt24Mah04p+W7tzZW6FtgP8oBoRUPhqO3kHd7HmryqzQ7ePWw1rOWxZumy7ZH5JNPTnEDQ8vHMwnyAyVGVuSwjbAPs57EnacGAjxzKiLYuNDf3euAZnHHlPlgefk/Md21HvrzFLYrL6xy6KtR5F/se1p1hIWY9za6rXaNQ1hp/OvnXB+OTF0u2IqLeDHnqxfaOXBs7qzPGjn9lYtLa+JYrPlR+Dyo+7+kENJkqNbUlbiDMHt392Qdcw4ieIdZsfvmvcZRLEBDZbfH61Jn48itfRFquwa83qg7NoSFvWbsnIJbCT4wJBuVvPsCEdJhA2X3YtcmEE9Dac0CszwkvLYXl1RN5IEL7Gx1a+TK++0q8sAHZl8gsB0VWvvj2tu6L5Wq7kvfGgX0rIc7dBhrRntQDLWdrcAxybu/4gLAxf0zYtXht7tWOktjxJ1U+bX9Nej68dG36AfcPXX3g8+vmR9Vo6Tn2ibNRU/JFsdf85GsXlJ/k+owYPlZviDzOHbOBKZPimYfP7yqt+3VvJj6rSacTReatXAv8NZk7aEMTXDUgas824wfc/D83pmoclnaJ7EkMaxrEnIo7RJiDK4AP9s5J3PePP0h1Ok39K7+bopbvDv/ctFcnT3aGlTWiue7Z6BD5F92y6K1HWNH+vN8E95LnyuyRl9f78jhTO/60DlGxOxjFm7ISjLbhFm6yiCqwZhQ76J4Kj5mmrE7DBPBdRL6FA2baT+kQUKQhFCv9VCHnh9PgiRV79UqSo9qTkK/V/AcaHK/MAAAAAAQAAAAwAAAAAAAAAAgABAAEANQABAAAAAQAAAAoAHAAeAAFERkxUAAgABAAAAAD//wAAAAAAAHicVVJLa1NhED335tHqIhTRIiISKpRSRIKE4kK00SpqXUgMPuKraWprbV7EGKRuNGp9a63vV9X6rk8C9zZ0IS5c+StcuXblNp578lkqH3dmvvlmzsyZubAALMQBTMLu2bIjgVAmVcphEdrpb0MgltwcRmRTPEHZG0tSJmKenYj3UgL1OvyMtGB7mreAufl4Dwzk8lmEB4upNNozw0MpRDL5dAZduRPZItaZSDBW0bo3SULSQjM72cpeopR97NHVm+e3EFSEhZXzfB3kMi+i/lMRpf+yFrOmhS5soC/Iz2ZOGzuwWMvCRlO/gZ6Y83fO+b3sbmwz93+V/si/Hbvo88vHz/6GELG76R/EKMYwjl/4bUWtk1bVrtgu0ZvRgqVI0RqBQ46eHkE/0Rxi+JGW1YhrJYqPNwdH5B2gLPALsspRvhR4huTzMofpOc7j2ccUv4DcV3Caq8l+PXrY1U7s5WuZx8V+xrs8+6i9+x7pMg5Sz/AcIkYNSUoXuynL/Gts+j38w7Sq3F0LlpFvJ9ZgLStU+FLlcXGWGFV2cE7axWlT4wzzTuG8uhsTcpPmEeYmI8K4aBhfknZxxXR51XR1jbrElwvCuCwMbx6thmkUN03mLWU6mJAu44bpYVyZ18VoCVZxNt6+4mTaz7kVubcKcSfwEFOYZvc1fMV3/MAjw66Kp7Qc1bhPK6+pvSF6jee1tMtsn2IfmwlMGl7PTHfPpWdw13R1x0z/nvQMXoqvgxfSZbwVbxevtJUHmv8TMZnSDG6LT2MSy7mTDs7ik+nlo3KmKb/gvXI+KOedcrx9fqY1SyvEfzFLRgX+RyW+jWqLLjuoYfYvBcywvwAAAAABAAH//wAPeJxtUD1Lw1AUPWZoFwcXQVwMJWrpEGqJJQGHIlpU/AgOooNSHBwEdamLdHRxSRUnwUHQgoM/QNxEQXT1JyiOgtAlvtuLJ404yeHc7/Pefa+njZK1in7MI0euoEbvMXJoa3AxyXyZrKCAPHwMYJA+x04RcwhgY5wzRSpniC1UqbOpL3UVi8xdhFT0kaOYZeaRLmc89n2ygENc4QJnaOAcTbRwgtN/aw6gjnmNyybqfKTUHfXkWaY10H1tdSuWuRdLM3jDO5nAJ0OMYIOoc8tjYptoEE18mnW9+w7lUa71Sdd0ykTp2b++rjd/ceJ347JWZCJ+MEd6aaJkG96a2iHzJVkZ0z3N67DaeiDZzgvf3os23xlggf9RxRI2kcHtD0Mvj1AAALgB/4WwBI0A";

// assets/fonts/whales-serif.woff
var whales_serif_default = "data:font/woff;base64,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";

// src/background.mjs
var HERO_PROFILE = Object.freeze({ maxFps: Infinity, maxDpr: 2 });
var AMBIENT_PROFILE = Object.freeze({ maxFps: 24, maxDpr: 1 });
var AMBIENT_OPACITY = 0.35;
var IDLE_MS = 3e4;
var ACTIVITY_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "scroll"];
var styles = `
@font-face{font-family:"Whales Mono";src:url("${whales_mono_default}") format("woff");font-style:normal;font-weight:600;font-display:swap}
@font-face{font-family:"Whales Hanzi";src:url("${whales_serif_default}") format("woff");font-style:normal;font-weight:400;font-display:swap}
.dsh-whales-scene > [data-conversation-scroll]{position:relative;z-index:1}
.dsh-whales-scene[data-whales-glass] [data-composer-card]{
  isolation:isolate;background:transparent;--dsw-specific-input-major:transparent;
  border-color:rgba(128,128,128,.20);box-shadow:0 12px 36px #0000000d,inset 0 1px 0 #ffffff80;
}
/* The filter lives on a pseudo-element so inline fixed menus retain their viewport anchor. */
.dsh-whales-scene[data-whales-glass] [data-composer-card]::before{
  content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;border-radius:inherit;
  background:rgba(255,255,255,var(--whales-glass-opacity));backdrop-filter:blur(var(--whales-blur));
  -webkit-backdrop-filter:blur(var(--whales-blur));
}
.dsh-whales-scene[data-whales-dark][data-whales-glass] [data-composer-card]::before{background:rgba(24,24,24,var(--whales-glass-opacity))}
.dsh-whales-scene[data-whales-dark][data-whales-glass] [data-composer-card]{border-color:#ffffff30;box-shadow:0 12px 36px #0003,inset 0 1px 0 #ffffff12}
@supports not (backdrop-filter:blur(1px)){
  .dsh-whales-scene[data-whales-glass] [data-composer-card]::before{background:rgba(255,255,255,.92)}
  .dsh-whales-scene[data-whales-dark][data-whales-glass] [data-composer-card]::before{background:rgba(24,24,24,.92)}
}`;
function mountBackgrounds(getSettings) {
  let disposed = false, queued = false;
  const canvas = document.createElement("canvas");
  canvas.className = "dsh-whales-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;";
  let host = null, hostPosition = "";
  let engine, population = "", appearance = "";
  let idleTimer = 0, lastActive = 0, sleeping = false;
  const onActivity = () => {
    lastActive = Date.now();
    if (sleeping) {
      sleeping = false;
      engine?.resume();
    }
  };
  function setIdleWatch(on) {
    if (on === Boolean(idleTimer)) return;
    if (on) {
      for (const type of ACTIVITY_EVENTS) window.addEventListener(type, onActivity, { capture: true, passive: true });
      lastActive = Date.now();
      idleTimer = setInterval(() => {
        if (!sleeping && Date.now() - lastActive >= IDLE_MS) {
          sleeping = true;
          engine?.pause();
        }
      }, 1e3);
    } else {
      for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, onActivity, { capture: true });
      clearInterval(idleTimer);
      idleTimer = 0;
      if (sleeping) {
        sleeping = false;
        engine?.resume();
      }
    }
  }
  const phaseObserver = new MutationObserver(() => update());
  function update() {
    if (!host) {
      setIdleWatch(false);
      engine?.pause();
      return;
    }
    const settings = getSettings();
    const phase = host.dataset.contentPhase;
    const mode = !settings.enabled ? "off" : phase === "hero" ? "hero" : settings.inConversation ? "ambient" : "off";
    const active = mode !== "off";
    const dark = getComputedStyle(host).colorScheme.includes("dark");
    canvas.hidden = !active;
    canvas.style.opacity = String(mode === "ambient" ? Math.min(settings.opacity, AMBIENT_OPACITY) : settings.opacity);
    const hanzi = settings.glyphMode !== "ascii";
    const localFont = settings.fontSource === "local" ? (hanzi ? settings.hanziFont : settings.asciiFont).trim() : "";
    const fallback = hanzi ? '"Whales Hanzi", serif' : '"Whales Mono", monospace';
    const fontFamily = localFont ? `${JSON.stringify(localFont)}, ${fallback}` : fallback;
    canvas.style.fontFamily = fontFamily;
    canvas.style.fontWeight = hanzi ? "400" : "600";
    host.toggleAttribute("data-whales-glass", active && settings.glass);
    host.toggleAttribute("data-whales-dark", dark);
    host.style.setProperty("--whales-blur", `${settings.blur}px`);
    host.style.setProperty("--whales-glass-opacity", String(settings.glassOpacity));
    const nextPopulation = `${settings.species}/${settings.count}/${settings.size}/${settings.gridScale}/${settings.fishCount}/${settings.glyphMode}/${fontFamily}`;
    const nextAppearance = `${settings.bodySwing}/${settings.turnAgility}/${settings.tailFrequency}/${settings.speed}/${dark}/${settings.gridOpacity}/${settings.wake}/${settings.color}/${settings.colorfulShimmer}/${settings.eyeColor}`;
    if (engine && (!active || nextPopulation !== population)) {
      engine.destroy();
      engine = void 0;
    }
    setIdleWatch(mode === "ambient");
    if (!active) return;
    if (!engine) {
      const whales = Array.from({ length: settings.count }, (_, i) => ({ kind: settings.species === "orca" ? "orca" : "whale", size: settings.size * [1, 0.7, 0.84, 0.77, 0.65, 0.9][i % 6] }));
      engine = new OceanEngine(canvas, whales, settings.speed, dark, settings.gridScale, settings.gridOpacity, settings.fishCount, settings.wake, settings.color, settings.glyphMode, settings.colorfulShimmer, settings.eyeColor, settings.bodySwing, settings.turnAgility, settings.tailFrequency);
      population = nextPopulation;
      appearance = nextAppearance;
    } else if (appearance !== nextAppearance) {
      engine.setAppearance(settings.speed, dark, settings.gridOpacity, settings.wake, settings.color, settings.colorfulShimmer, settings.eyeColor, settings.bodySwing, settings.turnAgility, settings.tailFrequency);
      appearance = nextAppearance;
    }
    engine.setProfile(mode === "ambient" ? AMBIENT_PROFILE : HERO_PROFILE);
    if (sleeping) engine.pause();
    else engine.resume();
  }
  function adopt(scene) {
    host = scene;
    hostPosition = scene.style.position;
    if (getComputedStyle(scene).position === "static") scene.style.position = "relative";
    scene.prepend(canvas);
    scene.classList.add("dsh-whales-scene");
    phaseObserver.observe(scene, { attributes: true, attributeFilter: ["data-content-phase"] });
    update();
  }
  function detach() {
    if (!host) return;
    phaseObserver.disconnect();
    host.style.position = hostPosition;
    host.style.removeProperty("--whales-blur");
    host.style.removeProperty("--whales-glass-opacity");
    host.classList.remove("dsh-whales-scene");
    host.removeAttribute("data-whales-glass");
    host.removeAttribute("data-whales-dark");
    host = null;
  }
  function scan() {
    queued = false;
    if (disposed) return;
    if (host && !host.isConnected) detach();
    if (host) return;
    const next = document.querySelector("[data-conversation-content]");
    if (next) adopt(next);
    else {
      canvas.remove();
      update();
    }
  }
  const observer = new MutationObserver(() => {
    if (!queued) {
      queued = true;
      queueMicrotask(scan);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const theme = new MutationObserver(() => update());
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class", "data-ds-theme-source"] });
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.append(style);
  scan();
  return {
    update,
    /** Current single engine; exposed for lifecycle tests. */
    get engine() {
      return engine;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
      theme.disconnect();
      setIdleWatch(false);
      detach();
      engine?.destroy();
      engine = void 0;
      canvas.remove();
      style.remove();
    }
  };
}

// src/client.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var en = {
  title: "ASCII Whales",
  description: "Let whales drift through the quiet, and thoughts rise to the surface.",
  enabled: "Show ocean",
  inConversation: "Show in conversations",
  inConversationHint: "Runs behind messages at a lower frame rate and opacity, and pauses after 30 seconds without input.",
  count: "Whale count",
  speed: "Swimming speed",
  bodySwing: "Body swing amplitude",
  turnAgility: "Turning agility",
  tailFrequency: "Tail-beat frequency",
  size: "Whale size",
  opacity: "Opacity",
  species: "Whale species",
  humpback: "Humpback",
  orca: "Orca",
  eyeColor: "Eye background",
  primary: "Follow main color",
  black: "Black",
  white: "White",
  colorfulShimmer: "Colorful shimmer",
  shimmerHint: "ASCII / Hanzi only. Off: shades of your selected color. On: original seven-color accents.",
  glass: "Frosted-glass composer",
  blur: "Glass blur (px)",
  gridScale: "Cell size (\xD7)",
  gridOpacity: "Grid opacity",
  glassOpacity: "Glass opacity",
  fishCount: "Small fish count",
  wake: "Wake intensity",
  color: "Ocean color",
  glyphMode: "Character style",
  ascii: "ASCII",
  hanzi: "Hanzi",
  kanji: "Kanji",
  fontSource: "Font",
  bundled: "Bundled default",
  local: "Local custom",
  asciiFont: "English font name",
  hanziFont: "Chinese font name",
  fontHint: "Defaults: Geist Mono 600 / Source Han Serif. Local names use fonts installed on this device; blank or unavailable names fall back to the bundled font.",
  scanFonts: "Scan local fonts",
  scanning: "Scanning\u2026",
  chooseAscii: "Choose English font",
  chooseHanzi: "Choose Chinese font",
  fontUnsupported: "This browser cannot list local fonts. You can still type an installed font name.",
  fontDenied: "Font access was not granted. Allow it in browser permissions or enter a name manually.",
  fontScanFailed: "Could not scan fonts. Try again or enter a name manually.",
  fontScanDone: "Font families found:",
  blue: "DeepSeek blue",
  cyan: "Cyan",
  purple: "Violet",
  pink: "Rose",
  orange: "Amber",
  green: "Mint",
  note: "Let the sea take shape in letters or Hanzi: \u76EE for eyes, \u9CCD for fins, \u5C3E for tails. Choose a color for whales, fish and wakes. Set grid, fish or wake to 0 to hide them. Saved in this browser; reduced motion is respected.",
  reset: "Restore defaults",
  error: "Could not save preferences. Changes apply until this page closes."
};
var zh = {
  title: "ASCII \u9CB8\u9C7C",
  description: "\u8BA9\u9CB8\u7FA4\u6E38\u8FC7\u7559\u767D\uFF0C\u8BA9\u601D\u7EEA\u6162\u6162\u6D6E\u51FA\u6C34\u9762\u3002",
  enabled: "\u663E\u793A\u6D77\u6D0B",
  inConversation: "\u5BF9\u8BDD\u4E2D\u663E\u793A",
  inConversationHint: "\u5728\u6D88\u606F\u80CC\u540E\u4EE5\u8F83\u4F4E\u5E27\u7387\u548C\u900F\u660E\u5EA6\u8FD0\u884C\uFF0C30 \u79D2\u65E0\u64CD\u4F5C\u540E\u9759\u6B62\u3002",
  count: "\u9CB8\u9C7C\u6570\u91CF",
  speed: "\u6E38\u52A8\u901F\u5EA6",
  bodySwing: "\u8EAB\u4F53\u6446\u52A8\u5E45\u5EA6",
  turnAgility: "\u8F6C\u5F2F\u7075\u6D3B\u5EA6",
  tailFrequency: "\u6446\u5C3E\u9891\u7387",
  size: "\u9CB8\u9C7C\u5927\u5C0F",
  opacity: "\u900F\u660E\u5EA6",
  species: "\u9CB8\u9C7C\u79CD\u7C7B",
  humpback: "\u5EA7\u5934\u9CB8",
  orca: "\u864E\u9CB8",
  eyeColor: "\u773C\u775B\u5E95\u8272",
  primary: "\u8DDF\u968F\u4E3B\u8272",
  black: "\u9ED1\u8272",
  white: "\u767D\u8272",
  colorfulShimmer: "\u5F69\u8272\u95EA\u70C1",
  shimmerHint: "\u9002\u7528\u4E8E ASCII / \u6C49\u5B57\u3002\u5173\u95ED\u65F6\u4F7F\u7528\u4E3B\u8272\u6DF1\u6D45\uFF0C\u5F00\u542F\u540E\u4F7F\u7528\u539F\u7248\u4E03\u8272\u70B9\u7F00\u3002",
  glass: "\u6BDB\u73BB\u7483\u8F93\u5165\u6846",
  blur: "\u73BB\u7483\u6A21\u7CCA\uFF08px\uFF09",
  gridScale: "\u5B57\u7B26\u6805\u683C\uFF08\u500D\uFF09",
  gridOpacity: "\u5E95\u7EB9\u7F51\u683C\u900F\u660E\u5EA6",
  glassOpacity: "\u73BB\u7483\u4E0D\u900F\u660E\u5EA6",
  fishCount: "\u5C0F\u9C7C\u6570\u91CF",
  wake: "\u5C3E\u8FF9\u5F3A\u5EA6",
  color: "\u6D77\u6D0B\u989C\u8272",
  glyphMode: "\u5B57\u7B26\u98CE\u683C",
  ascii: "ASCII",
  hanzi: "\u6C49\u5B57",
  kanji: "Kanji",
  fontSource: "\u5B57\u4F53",
  bundled: "\u5185\u7F6E\u9ED8\u8BA4",
  local: "\u672C\u673A\u81EA\u5B9A\u4E49",
  asciiFont: "\u82F1\u6587\u5B57\u4F53\u540D\u79F0",
  hanziFont: "\u4E2D\u6587\u5B57\u4F53\u540D\u79F0",
  fontHint: "\u9ED8\u8BA4\uFF1AGeist Mono 600 / \u601D\u6E90\u5B8B\u4F53\u3002\u672C\u673A\u5B57\u4F53\u586B\u5199\u5DF2\u5B89\u88C5\u7684\u540D\u79F0\uFF0C\u7559\u7A7A\u6216\u672A\u5B89\u88C5\u65F6\u56DE\u9000\u5230\u5185\u7F6E\u5B57\u4F53\u3002",
  scanFonts: "\u626B\u63CF\u672C\u673A\u5B57\u4F53",
  scanning: "\u626B\u63CF\u4E2D\u2026",
  chooseAscii: "\u9009\u62E9\u82F1\u6587\u5B57\u4F53",
  chooseHanzi: "\u9009\u62E9\u4E2D\u6587\u5B57\u4F53",
  fontUnsupported: "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5217\u51FA\u672C\u673A\u5B57\u4F53\uFF0C\u4ECD\u53EF\u624B\u52A8\u8F93\u5165\u5DF2\u5B89\u88C5\u7684\u5B57\u4F53\u540D\u79F0\u3002",
  fontDenied: "\u672A\u83B7\u5F97\u5B57\u4F53\u8BBF\u95EE\u6743\u9650\uFF0C\u53EF\u5728\u6D4F\u89C8\u5668\u6743\u9650\u8BBE\u7F6E\u4E2D\u5141\u8BB8\uFF0C\u6216\u624B\u52A8\u8F93\u5165\u5B57\u4F53\u540D\u79F0\u3002",
  fontScanFailed: "\u626B\u63CF\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u6216\u624B\u52A8\u8F93\u5165\u5B57\u4F53\u540D\u79F0\u3002",
  fontScanDone: "\u5DF2\u627E\u5230\u5B57\u4F53\u5BB6\u65CF\uFF1A",
  blue: "DeepSeek \u84DD",
  cyan: "\u6D77\u6C34\u9752",
  purple: "\u9E22\u5C3E\u7D2B",
  pink: "\u73AB\u7470\u7C89",
  orange: "\u7425\u73C0\u6A59",
  green: "\u8584\u8377\u7EFF",
  note: "\u8BA9\u5B57\u6210\u6D77\uFF1A\u76EE\u843D\u5728\u773C\uFF0C\u9CCD\u8212\u5C55\uFF0C\u5C3E\u968F\u6CE2\u3002\u4E3A\u9CB8\u7FA4\u3001\u6E38\u9C7C\u548C\u5C3E\u8FF9\u9009\u4E00\u79CD\u989C\u8272\uFF1B\u7F51\u683C\u3001\u5C0F\u9C7C\u3001\u5C3E\u8FF9\u8BBE\u4E3A 0 \u53EF\u9690\u85CF\u3002\u504F\u597D\u4FDD\u5B58\u5728\u5F53\u524D\u6D4F\u89C8\u5668\uFF0C\u5E76\u9075\u5FAA\u7CFB\u7EDF\u51CF\u5C11\u52A8\u6001\u6548\u679C\u8BBE\u7F6E\u3002",
  reset: "\u6062\u590D\u9ED8\u8BA4",
  error: "\u504F\u597D\u4FDD\u5B58\u5931\u8D25\uFF0C\u672C\u6B21\u66F4\u6539\u4EC5\u5728\u5F53\u524D\u9875\u9762\u6709\u6548\u3002"
};
var inject = ["slots", "locale"];
function apply(ctx) {
  let settings = { ...defaults };
  try {
    settings = readSettings(window.localStorage);
  } catch {
  }
  const backgrounds = mountBackgrounds(() => settings);
  ctx.effect(() => () => backgrounds.dispose());
  ctx.effect(() => ctx.locale.register("ascii-whales", { en, zh }));
  const t = ctx.locale.bind("ascii-whales");
  let localFonts = [];
  function Settings() {
    const [value, setValue] = (0, import_react.useState)(settings);
    const [error, setError] = (0, import_react.useState)(false);
    const [fontList, setFontList] = (0, import_react.useState)(localFonts);
    const [fontMenu, setFontMenu] = (0, import_react.useState)(null);
    const [scanning, setScanning] = (0, import_react.useState)(false);
    const [fontMessage, setFontMessage] = (0, import_react.useState)("");
    async function scanFonts() {
      if (!window.queryLocalFonts) {
        setFontMessage(t("fontUnsupported"));
        return;
      }
      setScanning(true);
      setFontMessage("");
      try {
        const fonts = await window.queryLocalFonts();
        localFonts = [...new Set(fonts.map((font) => font.family).filter((name) => normalize({ asciiFont: name }).asciiFont === name && name.length > 0))].sort((a, b) => a.localeCompare(b));
        setFontList(localFonts);
        setFontMessage(`${t("fontScanDone")} ${localFonts.length}`);
      } catch (error2) {
        setFontMessage(t(error2 instanceof DOMException && error2.name === "NotAllowedError" ? "fontDenied" : "fontScanFailed"));
      } finally {
        setScanning(false);
      }
    }
    function save(next) {
      settings = normalize(next);
      setValue(settings);
      backgrounds.update();
      try {
        localStorage.setItem(storageKey, JSON.stringify(settings));
        setError(false);
      } catch {
        setError(true);
      }
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-whales-settings", style: { display: "grid", gap: 20, maxWidth: 640 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { margin: "0 0 8px", fontSize: 20 }, children: t("title") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "var(--dsw-fg-muted)" }, children: t("description") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "setCard setCardOpen", style: { padding: 20, display: "grid", gap: 22 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("enabled") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Switch, { label: t("enabled"), checked: value.enabled, onChange: (enabled) => save({ ...value, enabled }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("inConversation") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Switch, { label: t("inConversation"), checked: value.inConversation, disabled: !value.enabled, onChange: (inConversation) => save({ ...value, inConversation }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { margin: 0, fontSize: 12, color: "var(--dsw-fg-muted)" }, children: t("inConversationHint") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("glass") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Switch, { label: t("glass"), checked: value.glass, onChange: (glass) => save({ ...value, glass }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("species") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "group", "aria-label": t("species"), style: { display: "flex", gap: 8 }, children: ["humpback", "orca"].map((species) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { "aria-pressed": value.species === species, variant: value.species === species ? "primary" : void 0, onClick: () => save({ ...value, species }), children: t(species) }, species)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("glyphMode") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "group", "aria-label": t("glyphMode"), style: { display: "flex", gap: 8 }, children: ["ascii", "hanzi", "kanji"].map((glyphMode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { "aria-pressed": value.glyphMode === glyphMode, variant: value.glyphMode === glyphMode ? "primary" : void 0, onClick: () => save({ ...value, glyphMode }), children: t(glyphMode) }, glyphMode)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("fontSource") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "group", "aria-label": t("fontSource"), style: { display: "flex", gap: 8 }, children: ["bundled", "local"].map((fontSource) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { "aria-pressed": value.fontSource === fontSource, variant: value.fontSource === fontSource ? "primary" : void 0, onClick: () => save({ ...value, fontSource }), children: t(fontSource) }, fontSource)) })
          ] }),
          value.fontSource === "local" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "toolbar", disabled: scanning, onClick: scanFonts, children: t(scanning ? "scanning" : "scanFonts") }) }),
            fontMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", style: { margin: 0, fontSize: 12 }, children: fontMessage }),
            ["asciiFont", "hanziFont"].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(key) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 4, maxWidth: "65%" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Input, { "aria-label": t(key), value: value[key], maxLength: 100, placeholder: key === "asciiFont" ? "Consolas" : "\u65B9\u6B63\u5C4F\u663E\u96C5\u5B8B\u7B80\u4F53", style: { width: 200, maxWidth: "100%" }, onChange: (event) => save({ ...value, [key]: event.target.value }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Menu, { open: fontMenu === key, portal: true, align: "end", selectedId: value[key], items: fontList.map((name) => ({ id: name, label: name })), onClose: () => setFontMenu(null), onSelect: (name) => {
                  save({ ...value, [key]: name });
                  setFontMenu(null);
                }, anchor: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "toolbar", "aria-label": t(key === "asciiFont" ? "chooseAscii" : "chooseHanzi"), "aria-haspopup": "menu", "aria-expanded": fontMenu === key, disabled: !fontList.length, onClick: () => setFontMenu(fontMenu === key ? null : key), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronDownOutlineMedium, { "aria-hidden": "true" }) }) })
              ] })
            ] }, key))
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { margin: 0, fontSize: 12, color: "var(--dsw-fg-muted)", lineHeight: 1.6 }, children: t("fontHint") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("eyeColor") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "group", "aria-label": t("eyeColor"), style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: ["primary", "black", "white"].map((eyeColor) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { "aria-pressed": value.eyeColor === eyeColor, variant: value.eyeColor === eyeColor ? "primary" : void 0, onClick: () => save({ ...value, eyeColor }), children: t(eyeColor) }, eyeColor)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("colorfulShimmer") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Switch, { label: t("colorfulShimmer"), disabled: value.glyphMode === "kanji", checked: value.colorfulShimmer, onChange: (colorfulShimmer) => save({ ...value, colorfulShimmer }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { margin: 0, fontSize: 12, color: "var(--dsw-fg-muted)" }, children: t("shimmerHint") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "grid", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("color") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: value.color }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Input, { type: "color", "aria-label": t("color"), value: value.color, style: { width: 48, height: 28, cursor: "pointer" }, onChange: (event) => save({ ...value, color: event.target.value }) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "group", "aria-label": t("color"), style: { display: "flex", gap: 12 }, children: [["blue", "#4d6bfe"], ["cyan", "#06b6d4"], ["purple", "#a855f7"], ["pink", "#ec4899"], ["orange", "#f59e0b"], ["green", "#10b981"]].map(([name, color]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { "aria-label": t(name), title: t(name), "aria-pressed": value.color === color, onClick: () => save({ ...value, color }), style: { background: color, width: 28, height: 28, padding: 0, borderRadius: "50%", border: "2px solid var(--dsw-alias-bg-layer-1)", outline: value.color === color ? "2px solid var(--dsw-alias-label-primary)" : "1px solid transparent" } }, name)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px 24px" }, children: Object.keys(ranges).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(key) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Input, { "aria-label": t(key), type: "number", min: ranges[key][0], max: ranges[key][1], step: inputStep(key, value[key]), value: value[key], style: { width: 80 }, onChange: (event) => {
            let next = event.target.valueAsNumber;
            if (fractionalSteps.includes(key) && value[key] === 1 && next === 0.9 && !(event.nativeEvent instanceof InputEvent)) next = 0.95;
            if (event.target.value !== "" && Number.isFinite(next)) save({ ...value, [key]: next });
          } })
        ] }, key)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { margin: 0, fontSize: 13, color: "var(--dsw-fg-muted)", lineHeight: 1.6 }, children: t("note") }),
      error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "alert", children: t("error") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "primary", onClick: () => save({ ...defaults }), children: t("reset") }) })
    ] });
  }
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "ascii-whales",
    order: 57,
    locale: "ascii-whales",
    label: () => t("title")
  }, Settings));
}
return module.exports; } });
