// keeper-walk-01.js — keeper locomotion: chair path, walk-to targets and the locomotion state
// Lines 60765-61209 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-walk, statement-aligned).
var chairSpec = Object.freeze({
    x: -3.68,
    y: 0.468714,
    z: 0.94,
    pitch: 0.02302,
    reach: 1.15,
    approach: Object.freeze({
      x: -4.2041,
      y: 0.482,
      z: 1.032,
      heading: (-80 * Math.PI) / 180,
    }),
  }),
  sS = Object.freeze({ cast: 95 / 24, reel: 94 / 24, stow: 1.2 }),
  cS = Object.freeze({
    chair: Object.freeze({
      sitting: [1, 85],
      casting: [86, 150],
      reeling: [151, 231],
      standing: [232, 332],
      ready: 86,
      water: 134,
    }),
    boat: Object.freeze({
      casting: [1, 96],
      reeling: [146, 240],
      ready: 1,
      water: 83,
    }),
  });
function lS(e) {
  if (Math.abs(e.speed ?? 0) > 0.06 || Math.abs(e.turnRate ?? 0) > 0.06)
    return !1;
  let t = e.heading + Math.PI,
    n = Math.sin(t),
    r = Math.cos(t);
  for (let [t, i] of [
    [-1.25, -0.15],
    [-2.1, -0.8],
    [-3.15, -1.78],
    [-2.8, -1.6],
  ])
    if (!insideIsland(e.x + t * r + i * n, e.z - t * n + i * r, 0.18, 0.28)) return !1;
  return !0;
}
function uS(e, t, n) {
  return e === `foot`
    ? Math.hypot(t.x - chairSpec.x, t.z - chairSpec.z) <= chairSpec.reach
      ? `chair`
      : null
    : e === `boat`
      ? Math.abs(n.speed ?? 0) > 0.06 || Math.abs(n.turnRate ?? 0) > 0.06
        ? `slow`
        : lS(n)
          ? `boat`
          : `water`
      : null;
}
function createChairPath({ chairPath: e = (e, t) => [e, t] } = {}) {
  let t = null,
    n = `off`,
    r = 0,
    i = 1,
    a = 0,
    o = !1,
    s = !1,
    c = null,
    l = [],
    u = 0,
    d = 0,
    f = 0,
    p = 0,
    m = (e, t) => Math.atan2(Math.sin(e - t), Math.cos(e - t)),
    h = { aligning: 0.8, pickup: 2.4, putdown: 2.4 },
    g = [],
    _ = () => cS[t],
    v = () => {
      ((n = `standing`), (r = 0), (i = _().standing[0]));
    },
    y = () => {
      t === `chair` ? v() : ((n = `putdown`), (r = 0), (i = _().ready));
    },
    b = () => {
      ((s =
        n === `waiting` ||
        n === `reeling` ||
        (n === `casting` && i >= _().water)),
        (n = `stowing`),
        (r = 0));
    };
  return {
    events: g,
    get setting() {
      return t;
    },
    get phase() {
      return n;
    },
    get frame() {
      return i;
    },
    get active() {
      return t !== null;
    },
    get seated() {
      return t !== null && ![`entering`, `approaching`, `aligning`].includes(n);
    },
    get transitioning() {
      return (
        [
          `approaching`,
          `aligning`,
          `pickup`,
          `sitting`,
          `standing`,
          `putdown`,
        ].includes(n) || o
      );
    },
    get fade() {
      return 0;
    },
    get chairActor() {
      return t === `chair` ? c : null;
    },
    get waiting() {
      return n === `waiting`;
    },
    get waitAge() {
      return a;
    },
    get stow() {
      return n === `stowing` ? clampValue(r / sS.stow, 0, 1) : 0;
    },
    get stowOnWater() {
      return s;
    },
    get progress() {
      if (n === `approaching`) return clampValue(r / d, 0, 1);
      if (h[n]) return clampValue(r / h[n], 0, 1);
      let e = _()?.[n];
      return Array.isArray(e) ? clampValue((i - e[0]) / (e[1] - e[0]), 0, 1) : 0;
    },
    start(f, p, m) {
      if (t) return !1;
      let h = uS(f, p, m);
      if (![`chair`, `boat`].includes(h)) return !1;
      if (h === `chair`) {
        if (((l = e({ ...p }, chairSpec.approach)), !l?.length)) return !1;
        ((u = l
          .slice(1)
          .reduce((e, t, n) => e + Math.hypot(t.x - l[n].x, t.z - l[n].z), 0)),
          (d = Math.max(0.5, u / 0.48 + 0.4)),
          (c = {
            ...p,
            pivot: null,
            y: p.y ?? chairSpec.approach.y,
            heading: p.heading ?? 0,
            walk: p.walk ?? 0,
            gait: p.gait ?? 0,
          }));
      }
      return (
        (t = h),
        (n = h === `chair` ? `approaching` : `pickup`),
        (r = a = 0),
        (i = 1),
        (o = !1),
        (s = !1),
        !0
      );
    },
    action() {
      return this.transitioning
        ? !1
        : n === `ready`
          ? ((n = `casting`), (r = 0), (i = _().casting[0]), !0)
          : n === `waiting` &&
            ((n = `reeling`),
            (r = 0),
            (i = _().reeling[0]),
            g.push(`reel`),
            !0);
    },
    leave() {
      return !t || this.transitioning
        ? !1
        : ((o = !0), n === `ready` ? y() : n !== `stowing` && b(), !0);
    },
    reset() {
      ((t = null),
        (n = `off`),
        (r = a = 0),
        (i = 1),
        (c = null),
        (o = s = !1),
        (g.length = 0));
    },
    update(e, { blocked: s = !1 } = {}) {
      if (!t || s) return;
      let v = clampValue(e, 0, 0.1);
      if (
        t === `chair` &&
        [`approaching`, `aligning`, `pickup`, `putdown`].includes(n)
      ) {
        if (((r += v), n === `approaching`)) {
          let e = clampValue(r / d, 0, 1),
            t = 0.2,
            i = (e) => t * (e ** 3 - 0.5 * e ** 4),
            a = e < t ? i(e / t) : e > 0.8 ? 0.8 - i((1 - e) / t) : e - t * 0.5,
            o = (u * a) / 0.8,
            s = 0;
          for (; s < l.length - 2; s++) {
            let e = Math.hypot(l[s + 1].x - l[s].x, l[s + 1].z - l[s].z);
            if (o <= e) break;
            o -= e;
          }
          let g = l[s],
            _ = l[s + 1] ?? g,
            y = Math.hypot(_.x - g.x, _.z - g.z),
            b = y ? clampValue(o / y, 0, 1) : 1,
            x = g.x + (_.x - g.x) * b,
            S = g.z + (_.z - g.z) * b,
            C = Math.hypot(x - c.x, S - c.z);
          if (
            ((c.x = x),
            (c.z = S),
            (c.y =
              (g.y ?? chairSpec.approach.y) +
              ((_.y ?? chairSpec.approach.y) - (g.y ?? chairSpec.approach.y)) * b),
            (c.gait += C / Qb),
            (c.walk +=
              (clampValue(C / Math.max(v, 1e-6) / Qb, 0, 1) - c.walk) *
              (1 - Math.exp(-v * 18))),
            C > 1e-6 &&
              (c.heading += clampValue(
                m(Math.atan2(_.x - g.x, _.z - g.z), c.heading) *
                  (1 - Math.exp(-v * 12)),
                -2.8 * v,
                2.8 * v,
              )),
            e === 1)
          ) {
            ((n = `aligning`), (r = 0), (f = c.heading), (c.walk = 0));
            let e = m(chairSpec.approach.heading, f);
            ((h.aligning = Kb(e)),
              Math.abs(e) > 0.12 &&
                (c.pivot = {
                  id: `chair-${++p}`,
                  stage: `turn`,
                  progress: 0,
                  angle: e,
                  startHeading: f,
                }));
          }
        } else if (n === `aligning`) {
          let e = clampValue(r / h.aligning, 0, 1);
          ((c.heading = f + Jb(m(chairSpec.approach.heading, f), e)),
            c.pivot && (c.pivot.progress = e),
            e === 1 && ((n = `pickup`), (r = 0), (c.walk = 0)));
        } else {
          if (((c.pivot = null), r < h[n])) return;
          n === `pickup`
            ? ((n = `sitting`), (i = 1), (r = 0))
            : ((t = null), (n = `off`), (i = 1), (o = !1), g.push(`left`));
        }
        return;
      }
      if (t === `boat` && [`pickup`, `putdown`].includes(n)) {
        ((r += v),
          r >= h[n] &&
            (n === `pickup`
              ? ((n = `ready`), (r = 0), g.push(`seated`))
              : ((t = null), (n = `off`), (i = 1), (o = !1), g.push(`left`))));
        return;
      }
      r += v;
      let x = _()[n];
      if (Array.isArray(x)) {
        let e = i;
        ((i = Math.min(x[1], x[0] + r * 24)),
          n === `casting` &&
            e < _().water &&
            i >= _().water &&
            g.push(`splash`),
          i >= x[1] &&
            (n === `sitting`
              ? ((n = `ready`), (r = 0), (i = _().ready), g.push(`seated`))
              : n === `casting`
                ? ((n = `waiting`), (r = a = 0))
                : n === `reeling`
                  ? b()
                  : n === `standing` && ((n = `putdown`), (r = 0))));
      } else
        n === `waiting`
          ? (a += v)
          : n === `stowing` &&
            r >= sS.stow &&
            ((n = `ready`), (r = a = 0), (i = _().ready), o && y());
    },
  };
}
var fS = 0.24,
  pS = { x: -3, y: Xb.y, z: 2.15, heading: Math.PI / 2 },
  dockSpec = Object.freeze({
    shore: Object.freeze({ x: -1.82, y: Xb.y, z: 1.78, heading: Math.PI / 2 }),
    boat: Object.freeze({ x: -0.48, z: 2.65, heading: 0 }),
  }),
  hS = Object.freeze({
    edge: Object.freeze({ x: -1.72, y: Xb.y, z: 1.98, heading: Math.PI / 2 }),
    approachSpeed: 0.62,
    duration: 5.8,
  }),
  gS = [
    { x0: -4.6, x1: -1.4, z0: 0.22, z1: 5.03, y: Xb.y },
    { x0: -4.325, x1: -1.675, z0: -0.5, z1: 0.24, y: 0.65 },
    { x0: -4.225, x1: -1.775, z0: -0.92, z1: -0.2, y: 0.81 },
    { x0: -4.125, x1: -1.875, z0: -1.3, z1: -0.62, y: 0.97 },
  ],
  _S = [
    { x: chairSpec.x, z: chairSpec.z, r: 0.36 },
    lg,
    ...[-4.55, -1.45].flatMap((e) =>
      [0.52, 2.48, 4.68].map((t) => ({ x: e, z: t, r: 0.17 })),
    ),
    { x: -4.12, z: 4.1, hx: 0.43, hz: 0.39 },
    { x: -2.9, z: 4.25, r: 0.3 },
    { x: -1.88, z: 3.6, r: 0.29 },
    { x: -4.15, z: 0.05, r: 0.14 },
    { x: -1.85, z: 0.05, r: 0.14 },
  ];
function vS(e, t) {
  let n = null;
  for (let r of gS)
    e >= r.x0 &&
      e <= r.x1 &&
      t >= r.z0 &&
      t <= r.z1 &&
      (n = Math.max(n ?? -1 / 0, r.y));
  return n;
}
function yS(e, t, n = 0.97) {
  return t < -1.3 ? (Xy(e, t, n) ?? interiorFloorHeight(e, t)) : vS(e, t);
}
function bS(
  e,
  t,
  {
    chairApproach: n = !1,
    millOpen: r = !1,
    bridgeOpen: i = !1,
    height: a = 0.97,
  } = {},
) {
  if (!Number.isFinite(e) || !Number.isFinite(t)) return null;
  let o = (e, t) =>
      t < -1.3
        ? (!r && Math.abs(e + 3) < 0.96 && t > -1.84) ||
          (!i && e > -6.65 && e < -6.12 && t > -6.65 && t < -5.25)
          ? null
          : yS(e, t, a)
        : vS(e, t),
    s = o(e, t);
  if (s === null) return null;
  for (let n = 0; n < 8; n++) {
    let r = o(
      e + Math.cos((n * Math.PI) / 4) * fS,
      t + Math.sin((n * Math.PI) / 4) * fS,
    );
    if (r === null || Math.abs(r - s) > 0.36) return null;
  }
  if ((t < -1.3 && Zy(e, t, a)) || insideBenchArea(e, t)) return null;
  for (let r of _S) {
    let i = Math.max(0, Math.abs(e - r.x) - (r.hx ?? 0)),
      a = Math.max(0, Math.abs(t - r.z) - (r.hz ?? 0)),
      o = n && r === _S[0] ? 0.24 : (r.r ?? 0);
    if (Math.hypot(i, a) < 0.24 + o) return null;
  }
  return s;
}
function xS(e, t = chairSpec.approach) {
  let n = (e, t) => bS(e, t, { chairApproach: !0 }),
    r = (e, t) => {
      let r = Math.ceil(Math.hypot(t.x - e.x, t.z - e.z) / 0.035);
      for (let i = 0; i <= r; i++) {
        let a = r ? i / r : 0;
        if (n(e.x + (t.x - e.x) * a, e.z + (t.z - e.z) * a) === null) return !1;
      }
      return !0;
    },
    i = [{ ...e }, { ...t }];
  for (let e = 0; e < 24; e++) {
    let t = (e * Math.PI) / 12,
      r = chairSpec.x + Math.cos(t) * 0.68,
      a = chairSpec.z + Math.sin(t) * 0.68,
      o = n(r, a);
    o !== null && i.push({ x: r, y: o, z: a });
  }
  let a = i.map(() => 1 / 0),
    o = [],
    s = new Set();
  for (a[0] = 0; s.size < i.length;) {
    let e = -1;
    for (let t = 0; t < i.length; t++)
      !s.has(t) && (e < 0 || a[t] < a[e]) && (e = t);
    if (e < 0 || !Number.isFinite(a[e])) return null;
    if (e === 1) {
      let e = [];
      for (let t = 1; t !== void 0; t = o[t]) e.unshift(i[t]);
      return e;
    }
    s.add(e);
    for (let t = 0; t < i.length; t++)
      if (!s.has(t) && r(i[e], i[t])) {
        let n = a[e] + Math.hypot(i[t].x - i[e].x, i[t].z - i[e].z);
        n < a[t] && ((a[t] = n), (o[t] = e));
      }
  }
  return null;
}
var SS = (e, t) => Math.atan2(Math.sin(e - t), Math.cos(e - t));
function CS(e, t, n) {
  if (e === `foot`)
    return Math.hypot(t.x - dockSpec.shore.x, t.z - dockSpec.shore.z) < 0.78 &&
      Math.hypot(n.x - dockSpec.boat.x, n.z - dockSpec.boat.z) < 0.1 &&
      Math.abs(n.speed) < 0.01
      ? `board`
      : null;
  if (e !== `boat` || Math.hypot(n.x - dockSpec.boat.x, n.z - dockSpec.boat.z) > 0.8)
    return null;
  if (Math.abs(n.speed) > 0.22) return `slow`;
  if (Math.abs(SS(n.heading, dockSpec.boat.heading)) > 0.4) return `align`;
  for (let e = 0; e <= 24; e++) {
    let t = e / 24;
    if (
      !walkableFacing(
        n.x + (dockSpec.boat.x - n.x) * t,
        n.z + (dockSpec.boat.z - n.z) * t,
        n.heading + SS(dockSpec.boat.heading, n.heading) * t,
      )
    )
      return `dock`;
  }
  return `leave`;
}
