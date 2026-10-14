// sluice-state-01.js — the sluice gate state tables (foot spots, gate target, spill grid)
// Lines 49346-49501 of readable/assets__index-BogB70q-.pretty.js (cluster sluice-state, statement-aligned).
var cg = Object.freeze({ x: -1.85, y: 1.35, z: 0.16 }),
  lg = Object.freeze({ x: -1.85, z: 0.185, hx: 0.209, hz: 0.095 }),
  ug = 0.4,
  dg = 4.31,
  fg = og(sluiceSpec.flows[1].points, sluiceSpec.flows[1].speed),
  pg = og(sluiceSpec.flows[2].points, sluiceSpec.flows[2].speed),
  mg = og(sluiceSpec.flows[3].points, sluiceSpec.flows[3].speed),
  hg = fg.duration - pg.times[1] + pg.duration + mg.duration,
  gg = 1 / 120,
  _g = 1201,
  vg = (e) => Math.max(0, Math.min(1, e));
function yg(e) {
  return vg((sluiceSpec.gate.bottom - ug + ug * vg(e) - dg) / (sluiceSpec.basin.water - dg));
}
function bg(e, t, n) {
  return t !== `foot` ||
    e.y > 1.2 ||
    e.z < 0.15 ||
    e.z > 1.1 ||
    Math.hypot(e.x - cg.x, e.z - cg.z) > 0.95
    ? null
    : n.target
      ? `close-sluice`
      : `open-sluice`;
}
function xg() {
  let e = {
      time: 0,
      target: 1,
      gate: 1,
      gateFlow: 1,
      flow: 1,
      speed: 1,
      angle: 0,
    },
    t = Array.from({ length: _g }, () => ({
      time: 0,
      gate: 1,
      speed: 1,
      angle: 0,
    })),
    n = 0;
  function r(r, i) {
    if (r <= 0) return i === `angle` ? r * waterwheelSpec.angularSpeed : 1;
    if (r >= e.time) return e[i];
    let a = Math.max(0, n - _g + 1),
      o = Math.max(a, Math.min(n, r / gg)),
      s = Math.floor(o),
      c = Math.min(n, s + 1),
      l = o - s;
    return t[s % _g][i] * (1 - l) + t[c % _g][i] * l;
  }
  let i = {
    state: e,
    toggle() {
      return ((e.target = 1 - e.target), e.target);
    },
    gateAt: (e) => r(e, `gate`),
    angleAt: (e) => r(e, `angle`),
    speedAt: (e) => r(e, `speed`) * waterwheelSpec.angularSpeed,
    flowAt: (e) => yg(r(e - hg, `gate`)),
    supplyAt: (e) => yg(r(e, `gate`)),
    timeAtAngle(e, t, n) {
      for (let i = 0; i < 18; i++) {
        let i = (t + n) / 2;
        r(i, `angle`) < e ? (t = i) : (n = i);
      }
      return (t + n) / 2;
    },
    update(r) {
      let a = Math.floor((r + 1e-9) / gg);
      for (; n < a;) {
        let r = e.speed;
        (n++,
          (e.time = n * gg),
          (e.gate +=
            Math.sign(e.target - e.gate) *
            Math.min(Math.abs(e.target - e.gate), gg / 2.8)),
          (e.gateFlow = yg(e.gate)),
          (e.flow = i.flowAt(e.time)));
        let a = Math.sqrt(e.flow),
          o = a > e.speed ? 3.5 : 4;
        ((e.speed = a + (e.speed - a) * Math.exp(-0.008333333333333333 / o)),
          !e.flow && e.speed < 0.002 && (e.speed = 0),
          (e.angle += (r + e.speed) * 0.5 * waterwheelSpec.angularSpeed * gg),
          Object.assign(t[n % _g], {
            time: e.time,
            gate: e.gate,
            speed: e.speed,
            angle: e.angle,
          }));
      }
      return e;
    },
  };
  return i;
}
function Sg(e, t, n, r) {
  let i = [];
  for (let a = 0; a < e.length; a++) {
    let o = e[a],
      s = e[(a + 1) % e.length],
      c = o.p[t] - n,
      l = s.p[t] - n,
      u = r ? c <= 0 : c >= 0,
      d = r ? l <= 0 : l >= 0;
    if ((u && i.push(o), u !== d)) {
      let e = c / (c - l),
        t = {};
      for (let n of Object.keys(o))
        t[n] = o[n].map((t, r) => t + (s[n][r] - t) * e);
      i.push(t);
    }
  }
  return i;
}
function Cg(e, t) {
  let n = e,
    r = [];
  for (let e = 0; e < 3; e++)
    for (let [i, a] of [
      [t.min[e], !0],
      [t.max[e], !1],
    ]) {
      if (!n.length) break;
      let t = Sg(n, e, i, a);
      (t.length >= 3 && r.push(t), (n = Sg(n, e, i, !a)));
    }
  return r;
}
function wg(e, t) {
  let n = [e];
  for (let e of t) n = n.flatMap((t) => Cg(t, e));
  return n;
}
var Tg = {
    crest: 4.42,
    points: [
      [-0.2, 4.42, -7.48],
      [-0.2, 4.41, -7.25],
      [1.8, 4.2, -7.25],
      [1.98, 4.1, -7.25],
      [2.12, 3.05, -7.25],
      [2.18, 1.6, -7.25],
      [2.22, 0.205, -7.25],
    ],
  },
  Eg = [
    [-1.85, 1.43, 0.17],
    [-1.85, 2.65, 0.17],
    [0.65, 2.65, -1.45],
    [0.65, 4.78, -4.38],
    [0.65, 5.38, -8.2],
    [0.13, 5.38, -8.2],
  ],
  Dg = { min: [-0.37, Tg.crest, -7.51], max: [-0.03, 4.66, -7.06] };
