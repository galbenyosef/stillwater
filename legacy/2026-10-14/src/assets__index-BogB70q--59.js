// assets__index-BogB70q- 59 — math
// Lines 60823-61144 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function dS({ chairPath: e = (e, t) => [e, t] } = {}) {
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
      return n === `stowing` ? J(r / sS.stow, 0, 1) : 0;
    },
    get stowOnWater() {
      return s;
    },
    get progress() {
      if (n === `approaching`) return J(r / d, 0, 1);
      if (h[n]) return J(r / h[n], 0, 1);
      let e = _()?.[n];
      return Array.isArray(e) ? J((i - e[0]) / (e[1] - e[0]), 0, 1) : 0;
    },
    start(f, p, m) {
      if (t) return !1;
      let h = uS(f, p, m);
      if (![`chair`, `boat`].includes(h)) return !1;
      if (h === `chair`) {
        if (((l = e({ ...p }, oS.approach)), !l?.length)) return !1;
        ((u = l
          .slice(1)
          .reduce((e, t, n) => e + Math.hypot(t.x - l[n].x, t.z - l[n].z), 0)),
          (d = Math.max(0.5, u / 0.48 + 0.4)),
          (c = {
            ...p,
            pivot: null,
            y: p.y ?? oS.approach.y,
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
      let v = J(e, 0, 0.1);
      if (
        t === `chair` &&
        [`approaching`, `aligning`, `pickup`, `putdown`].includes(n)
      ) {
        if (((r += v), n === `approaching`)) {
          let e = J(r / d, 0, 1),
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
            b = y ? J(o / y, 0, 1) : 1,
            x = g.x + (_.x - g.x) * b,
            S = g.z + (_.z - g.z) * b,
            C = Math.hypot(x - c.x, S - c.z);
          if (
            ((c.x = x),
            (c.z = S),
            (c.y =
              (g.y ?? oS.approach.y) +
              ((_.y ?? oS.approach.y) - (g.y ?? oS.approach.y)) * b),
            (c.gait += C / Qb),
            (c.walk +=
              (J(C / Math.max(v, 1e-6) / Qb, 0, 1) - c.walk) *
              (1 - Math.exp(-v * 18))),
            C > 1e-6 &&
              (c.heading += J(
                m(Math.atan2(_.x - g.x, _.z - g.z), c.heading) *
                  (1 - Math.exp(-v * 12)),
                -2.8 * v,
                2.8 * v,
              )),
            e === 1)
          ) {
            ((n = `aligning`), (r = 0), (f = c.heading), (c.walk = 0));
            let e = m(oS.approach.heading, f);
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
          let e = J(r / h.aligning, 0, 1);
          ((c.heading = f + Jb(m(oS.approach.heading, f), e)),
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
  mS = Object.freeze({
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
    { x: oS.x, z: oS.z, r: 0.36 },
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
  return t < -1.3 ? (Xy(e, t, n) ?? Nh(e, t)) : vS(e, t);
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
  if ((t < -1.3 && Zy(e, t, a)) || Mh(e, t)) return null;
  for (let r of _S) {
    let i = Math.max(0, Math.abs(e - r.x) - (r.hx ?? 0)),
      a = Math.max(0, Math.abs(t - r.z) - (r.hz ?? 0)),
      o = n && r === _S[0] ? 0.24 : (r.r ?? 0);
    if (Math.hypot(i, a) < 0.24 + o) return null;
  }
  return s;
}
