// assets__index-BogB70q- 48 — math
// Lines 57550-57899 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var mb = class {
  constructor() {
    ((this.ctx = null),
      (this.on = !1),
      (this.ready = null),
      (this.layers = null),
      (this.volume = 1));
  }
  setVolume(e) {
    ((this.volume = Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 1),
      this.master?.gain.setTargetAtTime(
        this.on ? 0.5 * this.volume : 0,
        this.ctx.currentTime,
        0.15,
      ));
  }
  async toggle() {
    (this.ctx || this.init(), (this.on = !this.on), this.millLayer.reset());
    try {
      await this.ctx.resume();
    } catch (e) {
      throw (
        (this.on = !1),
        this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1),
        e
      );
    }
    if (
      (this.master.gain.setTargetAtTime(
        this.on ? 0.5 * this.volume : 0,
        this.ctx.currentTime,
        0.3,
      ),
      this.on)
    )
      try {
        await (this.ready ??= this.load());
      } catch (e) {
        throw (
          (this.ready = null),
          (this.on = !1),
          this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1),
          e
        );
      }
    return this.on;
  }
  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    let e = this.ctx;
    ((this.master = e.createGain()),
      (this.master.gain.value = 0),
      this.master.connect(e.destination));
    let t = e.createBuffer(1, e.sampleRate * 6, e.sampleRate),
      n = t.getChannelData(0),
      r = 0;
    for (let e = 0; e < n.length; e++) {
      let t = Math.random() * 2 - 1;
      ((r = (r + 0.018 * t) / 1.018), (n[e] = r * 3.6));
    }
    let i = e.createBufferSource();
    ((i.buffer = t), (i.loop = !0));
    let a = e.createBiquadFilter();
    ((a.type = `lowpass`), (a.frequency.value = 570));
    let o = e.createGain();
    ((o.gain.value = 0.06),
      i.connect(a),
      a.connect(o),
      o.connect(this.master),
      i.start(),
      (this.rainLayers = fb(e, this.master)),
      (this.fireLayer = pb(e, this.master)),
      (this.millLayer = ub(e, this.master)));
  }
  async load() {
    let e = [`water`, `birds`, `motor`],
      t = this.ctx,
      n = await Promise.all(
        e.map(async (e) => {
          let n = await fetch(uf(`/audio/${e}.ogg`));
          if (!n.ok) throw Error(`Could not load ${e} sound.`);
          return t.decodeAudioData(await n.arrayBuffer());
        }),
      );
    this.layers = Object.fromEntries(
      e.map((e, r) => {
        let i = t.createBufferSource(),
          a = t.createGain();
        return (
          (i.buffer = n[r]),
          (i.loop = !0),
          (a.gain.value = 0),
          i.connect(a),
          a.connect(this.master),
          i.start(),
          [e, { source: i, gain: a }]
        );
      }),
    );
  }
  update(e, t, n) {
    if (!this.on || !this.layers) return;
    let r = db(t, n),
      i = this.ctx.currentTime;
    for (let e of [`water`, `birds`, `motor`])
      this.layers[e].gain.gain.setTargetAtTime(
        r[e],
        i,
        e === `motor` ? 0.25 : e === `water` ? 1.4 : 1,
      );
    for (let e of [`rain`, `roof`])
      this.rainLayers[e].gain.gain.setTargetAtTime(r[e], i, 0.8);
    (this.fireLayer.gain.gain.setTargetAtTime(r.fire, i, 0.7),
      this.layers.motor.source.playbackRate.setTargetAtTime(
        r.motorRate,
        i,
        0.3,
      ),
      this.millLayer.update(e, { ...n, listener: n?.listener ?? t }));
  }
  pause() {
    this.ctx && this.ctx.state === `running` && this.ctx.suspend();
  }
  resume() {
    this.ctx && this.on && this.ctx.resume();
  }
};
function hb(e, t, { arrive: n = !0 } = {}) {
  let r = t.x - e.x,
    i = t.z - e.z,
    a = Math.atan2(r, i),
    o = Math.atan2(Math.sin(a - e.heading), Math.cos(a - e.heading)),
    s = Math.hypot(r, i);
  return {
    turn: J(o * 1.75, -1, 1),
    throttle:
      (n ? J((s - 0.35) / 1.5, 0, 1) : 1) *
      Math.max(0.18, 1 - Math.abs(o) / 1.85),
  };
}
function gb(
  e,
  { throttle: t = 0, turn: n = 0, brake: r = !1, cruise: i = Xf },
  a,
) {
  let o = e.turnRate || 0,
    s = n * 0.85,
    c = Math.exp(-5 * a);
  e.turnRate = s + (o - s) * c;
  let l = s * a + ((o - s) * (1 - c)) / 5,
    u = e.heading + l * 0.5;
  e.heading += l;
  let d = e.speed,
    f = r ? 0 : t * i,
    p = r ? 5.5 : 1.15,
    m = Math.exp(-p * a);
  ((e.speed = f + (d - f) * m), (e.acceleration = (e.speed - d) / a));
  let h = f * a + ((d - f) * (1 - m)) / p,
    g = ap(e.x, e.z, Math.sin(u) * h, Math.cos(u) * h, e.heading);
  return ((e.x = g.x), (e.z = g.z), g.bumped && (e.speed *= 0.86), g.bumped);
}
function _b(e) {
  let t = new Pa(
    Qf.slice(0, -1).map(([e, t]) => new U(e, 0, t)),
    !0,
    `centripetal`,
  );
  t.arcLengthDivisions = 1200;
  let n = t.getLength(),
    r = t.getSpacedPoints(900).slice(0, -1),
    i = (e) => ((e % 900) + 900) % 900,
    a = 0,
    o = 1 / 0,
    s = 0;
  return (
    r.forEach((t, n) => {
      let r = Math.hypot(t.x - e.x, t.z - e.z);
      r < o && ((o = r), (a = n));
    }),
    {
      length: n,
      get laps() {
        return Math.floor(Math.max(0, s) / 900);
      },
      target(e) {
        let t = 0,
          o = 1 / 0;
        for (let n = -8; n <= 16; n++) {
          let s = r[i(a + n)],
            c = (s.x - e.x) ** 2 + (s.z - e.z) ** 2;
          c < o && ((o = c), (t = n));
        }
        ((a = i(a + t)), (s += t));
        let c = ((1.25 + Math.abs(e.speed) * 0.65) * 900) / n,
          l = a + c,
          u = Math.floor(l),
          d = l - u,
          f = r[i(u)],
          p = r[i(u + 1)];
        return { x: f.x + (p.x - f.x) * d, z: f.z + (p.z - f.z) * d };
      },
    }
  );
}
function vb(e) {
  let t = Sv();
  ((e.userData.hullWaveUniforms = t),
    e.traverse((e) => {
      if (
        !e.isMesh ||
        ![`Ivory | satin marine paint`, `Ivory | subtle plank seams`].includes(
          e.material.name,
        )
      )
        return;
      let n = e.material,
        r = n.onBeforeCompile,
        i = n.customProgramCacheKey();
      ((n.onBeforeCompile = (e, n) => {
        (r(e, n),
          Object.assign(e.uniforms, t),
          (e.vertexShader =
            `varying vec3 vHullWetWorld;varying vec3 vHullWetLocal;varying vec3 vHullWetNormal;
` + e.vertexShader),
          (e.vertexShader = e.vertexShader.replace(
            `#include <worldpos_vertex>`,
            `#include <worldpos_vertex>
        vHullWetWorld=(modelMatrix*vec4(transformed,1.)).xyz;
        vHullWetLocal=position;vHullWetNormal=normal;`,
          )),
          (e.fragmentShader =
            `${Tv}
        varying vec3 vHullWetWorld;varying vec3 vHullWetLocal;varying vec3 vHullWetNormal;
        float hullWetAmount(){
          // Outward shell normals select the exterior, keeping the sole boards
          // and inward-facing painted hull dry even below the pond's height.
          vec3 outward=normalize(vec3(vHullWetLocal.x*2.,-.40,max(0.,vHullWetLocal.z-1.68)*5.));
          float exterior=smoothstep(.15,.60,dot(normalize(vHullWetNormal),outward));
          float wash=boatWave(vHullWetWorld.xz).x;
          return exterior*(1.-smoothstep(${q - 0.008}+wash,${q + 0.046}+wash,vHullWetWorld.y));
        }
      ` + e.fragmentShader),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <map_fragment>`,
            `#include <map_fragment>
        diffuseColor.rgb*=mix(vec3(1.),vec3(.81,.88,.86),hullWetAmount());`,
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <roughnessmap_fragment>`,
            `#include <roughnessmap_fragment>
        roughnessFactor=mix(roughnessFactor,min(roughnessFactor,.23),hullWetAmount());`,
          )));
      }),
        (n.customProgramCacheKey = () => i + `-hull-wet-edge-v2`));
    }));
}
var yb = Object.freeze({ x: -0.2, y: -0.32, z: 0.79 }),
  bb = Math.hypot(0.335, 0.071),
  xb = Object.freeze({
    pivot: Object.freeze({ x: 0, y: 0.73, z: 1.964 }),
    axis: Object.freeze({ x: 0, y: 0.335 / bb, z: -0.071 / bb }),
    grip: Object.freeze({ x: 0.24, y: 0.842, z: 1.36 }),
    maxAngle: 0.35,
    extension: 0.1,
  });
function Sb(e = 0) {
  return -Math.max(-1, Math.min(1, e / 0.85)) * xb.maxAngle;
}
function Cb(e, t, n = new U()) {
  let { pivot: r, axis: i } = xb,
    a = Math.cos(t),
    o = Math.sin(t),
    s = e.x - r.x,
    c = e.y - r.y,
    l = e.z - r.z,
    u = i.y * c + i.z * l;
  return n.set(
    r.x + a * s + o * (i.y * l - i.z * c),
    r.y + a * c + o * i.z * s + (1 - a) * u * i.y,
    r.z + a * l - o * i.y * s + (1 - a) * u * i.z,
  );
}
function wb(e, t = new U()) {
  return (t.copy(xb.grip), (t.z -= xb.extension), Cb(t, e, t));
}
function Tb(e, t, n, r) {
  return (
    (e === `Charcoal | cast engine housing` ||
      e === `Rubber | grips and seals`) &&
    t > 0.11 &&
    t < 0.28 &&
    n > 0.8 &&
    n < 0.88 &&
    r > 1.3 &&
    r < 1.89
  );
}
function Eb(e, t) {
  if (!/^(Charcoal|Rubber|Steel|Teal \| outboard)/.test(t)) return null;
  let n = e.attributes.position,
    r = e.index,
    i = Int32Array.from({ length: n.count }, (e, t) => t),
    a = new Map(),
    o = (e) => {
      for (; i[e] !== e;) ((i[e] = i[i[e]]), (e = i[e]));
      return e;
    },
    s = (e, t) => {
      i[o(e)] = o(t);
    };
  for (let e = 0; e < n.count; e++) {
    let t = [n.getX(e), n.getY(e), n.getZ(e)]
      .map((e) => Math.round(e * 1e6))
      .join(`,`);
    a.has(t) ? s(e, a.get(t)) : a.set(t, e);
  }
  for (let e = 0; e < r.count; e += 3)
    (s(r.getX(e), r.getX(e + 1)), s(r.getX(e), r.getX(e + 2)));
  let c = new Map();
  for (let e = 0; e < n.count; e++) {
    let t = o(e),
      r = c.get(t);
    (r ||
      ((r = { ids: [], minY: 1 / 0, maxY: -1 / 0, minZ: 1 / 0, maxZ: -1 / 0 }),
      c.set(t, r)),
      r.ids.push(e),
      (r.minY = Math.min(r.minY, n.getY(e))),
      (r.maxY = Math.max(r.maxY, n.getY(e))),
      (r.minZ = Math.min(r.minZ, n.getZ(e))),
      (r.maxZ = Math.max(r.maxZ, n.getZ(e))));
  }
  let l = new Float32Array(n.count);
  for (let e of c.values()) {
    let { ids: r, minY: i, maxY: a, minZ: o, maxZ: s } = e,
      c = r[0],
      u = Tb(t, n.getX(c), n.getY(c), n.getZ(c)),
      d = t.startsWith(`Rubber`) && a < 0.784 && s > 1.8,
      f =
        u ||
        t === `Teal | outboard cowling` ||
        (t.startsWith(`Charcoal`) && (s > 1.98 || (i > 0.8 && o > 1.78))) ||
        (t.startsWith(`Rubber`) && i > 0.783 && o > 1.8) ||
        (t.startsWith(`Steel`) && ((i > 0.8 && o > 1.9) || (a < 0 && o > 2.3)));
    for (let e of r) {
      let t = Math.max(0, Math.min(1, (n.getY(e) - 0.4) / 0.36));
      l[e] = d ? t * t * (3 - 2 * t) : Number(f);
    }
  }
  return l;
}
