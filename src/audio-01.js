// audio-01.js — the audio engine (procedural buffers, loops and the ambient mixer)
// Lines 57435-57676 of readable/assets__index-BogB70q-.pretty.js (cluster audio, statement-aligned).
function db(
  e,
  {
    listener: t = e,
    motorActive: n = !1,
    indoors: r = !1,
    rain: i = 0,
    millFlow: a = 1,
  } = {},
) {
  let o = Math.hypot(t.x - 1.16, t.z + 4.2),
    s = n
      ? Math.max(Math.abs(e.speed || 0), Math.abs(e.turnRate || 0) * 0.65)
      : 0,
    c = Math.sqrt(Math.min(1, s / Xf)),
    l = Math.max(0, Math.min(1, i)),
    u = Math.hypot(t.x + 3, t.z + 4.2),
    d = Math.hypot(t.x - Ky.x, t.z - Ky.z),
    f = Math.max(0, Math.min(1, ((t.y ?? 0) - (Gy - 0.4)) / 0.4));
  return {
    water:
      (0.16 +
        (0.22 * Math.sqrt(Math.max(0, Math.min(1, a)))) / (1 + (o / 5) ** 2)) *
      (r ? 0.72 : 1),
    birds: (r ? 0.16 : 0.45) * (1 - l * 0.72),
    rain: l * (r ? 0.1 : 0.34),
    roof: l * (r ? 0.4 : 0.09 / (1 + (u / 6) ** 2)),
    fire: r ? (f * 0.44) / (1 + (d / 3) ** 2) : 0,
    motor: Math.min(1, s / 0.18) * (0.12 + 0.72 * c),
    motorRate: 0.85 + 0.5 * c,
  };
}
function fb(e, t) {
  let n = 11.3,
    r = Math.ceil(e.sampleRate * n),
    i = {};
  for (let a of [`rain`, `roof`]) {
    let o = e.createBuffer(1, r, e.sampleRate),
      s = o.getChannelData(0);
    if (a === `rain`) {
      let e = 0;
      for (let t = 0; t < r; t++) {
        let n = Math.random() * 2 - 1;
        ((e += 0.12 * (n - e)), (s[t] = n * 0.32 + e * 0.55));
      }
    } else
      for (let t = 0; t < n; t += 0.024 + Math.random() * 0.1) {
        let n = Math.floor(t * e.sampleRate),
          i = Math.ceil(e.sampleRate * 0.065),
          a = 0.12 + Math.random() * 0.35,
          o = 430 + Math.random() * 1050;
        for (let t = 0; t < i; t++) {
          let i = t / e.sampleRate,
            c = Math.exp(-i * 90) * Math.min(1, i * 2500);
          s[(n + t) % r] +=
            ((Math.random() * 2 - 1) * 0.7 +
              Math.sin(i * o * Math.PI * 2) * 0.3) *
            c *
            a;
        }
      }
    let c = e.createBufferSource(),
      l = e.createBiquadFilter(),
      u = e.createGain();
    ((c.buffer = o),
      (c.loop = !0),
      (u.gain.value = 0),
      (l.type = `lowpass`),
      (l.frequency.value = a === `rain` ? 3800 : 2600),
      c.connect(l),
      l.connect(u),
      u.connect(t),
      c.start(),
      (i[a] = { source: c, gain: u }));
  }
  return i;
}
function pb(e, t) {
  let n = Math.ceil(e.sampleRate * 17.3),
    r = e.createBuffer(1, n, e.sampleRate),
    i = r.getChannelData(0),
    a = 0;
  for (let e = 0; e < n; e++) {
    let t = Math.random() * 2 - 1;
    ((a += 0.018 * (t - a)), (i[e] = a * 0.32 + t * 0.012));
  }
  for (let t = 0; t < 17.3; t += 0.12 + Math.random() * 0.65) {
    let r = Math.floor(t * e.sampleRate),
      a = 0.014 + Math.random() * 0.042,
      o = 0.12 + Math.random() * 0.26,
      s = 0;
    for (let t = 0; t < a * e.sampleRate; t++) {
      let c = t / e.sampleRate,
        l = Math.random() * 2 - 1;
      s += 0.62 * (l - s);
      let u = Math.min(1, c * 2e3) * Math.exp(-c / (a * 0.17));
      i[(r + t) % n] += s * u * o;
    }
  }
  let o = e.createBufferSource(),
    s = e.createBiquadFilter(),
    c = e.createGain();
  return (
    (o.buffer = r),
    (o.loop = !0),
    (c.gain.value = 0),
    (s.type = `lowpass`),
    (s.frequency.value = 3600),
    o.connect(s),
    s.connect(c),
    c.connect(t),
    o.start(),
    { source: o, gain: c }
  );
}
var AudioEngine = class {
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
          let n = await fetch(revisionUrlModifier(`/audio/${e}.ogg`));
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
