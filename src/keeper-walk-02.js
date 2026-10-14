// keeper-walk-02.js — keeper locomotion: chair path, walk-to targets and the locomotion state
// Lines 61210-61592 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-walk, statement-aligned).
function createPlayerState() {
  let e = {
      ...pS,
      walk: 0,
      gait: ex,
      speed: 0,
      turn: 0,
      look: 0,
      stride: 1,
      pivot: null,
    },
    t = createFishingState(e),
    n = `foot`,
    r = 0,
    i = 0,
    a = null,
    o = 0,
    s = !1,
    c = 0;
  function l() {
    ((r = i = e.speed = e.walk = e.turn = e.look = 0),
      (e.stride = 1),
      (e.pivot = null),
      (o = 0));
  }
  return {
    state: e,
    get mode() {
      return n;
    },
    get transitioning() {
      return a !== null || t.transitioning;
    },
    get swimming() {
      return t.active;
    },
    get swimPhase() {
      return t.phase;
    },
    get boarding() {
      return a?.action === `board` ? a : null;
    },
    get leaving() {
      return a?.action === `leave` ? a : null;
    },
    get fade() {
      return 0;
    },
    reset({ aboard: r = !1 } = {}) {
      (t.reset(),
        (n = r ? `boat` : `foot`),
        (a = null),
        (s = !1),
        Object.assign(e, pS, { gait: ex }),
        l());
    },
    place(t) {
      (l(), Object.assign(e, t), (s = !0));
    },
    interact(r) {
      if (a) return !1;
      if (t.active) return t.leave(r);
      let i = CS(n, e, r);
      if (!i && Wx(n, e) === `swim`) {
        let n = xS(e, keeperMotionSpec.landing);
        return n ? (l(), t.start(n)) : !1;
      }
      if (i !== `board` && i !== `leave`) return !1;
      if (i === `board`) {
        let t = xS(e, hS.edge);
        if (!t) return !1;
        (l(),
          (a = {
            action: i,
            phase: `approach`,
            time: 0,
            progress: 0,
            path: t,
            index: 1,
          }));
      } else {
        (l(), Object.assign(e, hS.edge, { heading: -Math.PI / 2, gait: ex }));
        let t = { x: r.x, z: r.z, heading: r.heading };
        a = {
          action: i,
          phase: `moor`,
          time: 0,
          progress: 0,
          start: t,
          mooring: { ...t },
          duration: Math.max(
            1.2,
            Math.hypot(r.x - dockSpec.boat.x, r.z - dockSpec.boat.z) / 0.35,
          ),
        };
      }
      return !0;
    },
    update(
      u,
      {
        x: d = 0,
        z: f = 0,
        angle: p = 0,
        target: m = null,
        blocked: h = !1,
        brake: g = !1,
        boat: _ = null,
        millOpen: v = !1,
        bridgeOpen: y = !1,
      } = {},
    ) {
      let b = clampValue(u, 0, 0.1),
        x = null;
      if (t.active)
        return (
          (x = t.update(b, {
            x: d,
            z: f,
            angle: p,
            target: m,
            blocked: h,
            brake: g,
            boat: _,
          })),
          x && (n = x),
          x
        );
      if (a) {
        if (h) return null;
        if (a.action === `board`) {
          let t = a;
          if (t.phase === `approach`) {
            let n = t.path[t.index],
              r = n.x - e.x,
              i = n.z - e.z,
              a = Math.hypot(r, i),
              o = Math.min(
                hS.approachSpeed,
                Math.sqrt(1.8 * a),
                e.speed + b * 0.9,
              ),
              s = Math.min(a, o * b);
            (a > 1e-7 &&
              ((e.x += (r / a) * s),
              (e.z += (i / a) * s),
              (e.heading += clampValue(
                SS(Math.atan2(r, i), e.heading),
                -b * 2.8,
                b * 2.8,
              ))),
              (e.y = bS(e.x, e.z) ?? e.y),
              (e.speed = o),
              (e.walk = o / hS.approachSpeed),
              (e.gait += s / Qb),
              a - s < 0.001 &&
                ((e.x = n.x),
                (e.z = n.z),
                ++t.index >= t.path.length &&
                  (l(),
                  (t.phase = `align`),
                  (t.time = 0),
                  (t.heading = e.heading),
                  (t.angle = SS(hS.edge.heading, t.heading)),
                  (t.alignDuration = Kb(t.angle)),
                  Math.abs(t.angle) > 0.12 &&
                    (e.pivot = {
                      id: ++c,
                      stage: `turn`,
                      progress: 0,
                      angle: t.angle,
                      startHeading: t.heading,
                    }))));
          } else if (t.phase === `align`) {
            t.time += b;
            let n = clampValue(t.time / t.alignDuration, 0, 1);
            ((e.heading = t.heading + Jb(t.angle, n)),
              e.pivot && (e.pivot.progress = n),
              n === 1 && ((t.phase = `step`), (t.time = 0)));
          } else if (
            ((t.time += b),
            (t.progress = clampValue(t.time / hS.duration, 0, 1)),
            t.progress === 1)
          )
            return ((n = `boat`), (a = null), (e.pivot = null), `boat`);
          return null;
        }
        let t = a;
        if (((t.time += b), t.phase === `moor`)) {
          let e = clampValue(t.time / t.duration, 0, 1),
            n = e * e * (3 - 2 * e);
          for (let e of [`x`, `z`])
            t.mooring[e] = t.start[e] + (dockSpec.boat[e] - t.start[e]) * n;
          ((t.mooring.heading =
            t.start.heading + SS(dockSpec.boat.heading, t.start.heading) * n),
            e === 1 && ((t.phase = `step`), (t.time = 0)));
        } else if (
          ((t.progress = clampValue(t.time / hS.duration, 0, 1)), t.progress === 1)
        )
          return ((n = `foot`), (a = null), l(), `foot`);
        return null;
      }
      if (n !== `foot`) return null;
      if (h) return (l(), null);
      bS(e.x, e.z) !== null && (s = !1);
      let S = (t, n) =>
        bS(t, n, { chairApproach: s, millOpen: v, bridgeOpen: y, height: e.y });
      for (o += b; o + 1e-9 >= 1 / 120;) {
        let t = 1 / 120;
        o -= t;
        let n = d * Math.cos(p) - f * Math.sin(p),
          a = -d * Math.sin(p) - f * Math.cos(p);
        if (m) {
          ((n = m.x - e.x), (a = m.z - e.z));
          let t = Math.hypot(n, a);
          if (t < 0.04) n = a = 0;
          else {
            let e = Math.max(0, t - 0.025),
              r = Math.min(
                1,
                Math.sqrt(3.6 * e) / Zb,
                m.precise ? (2 * e) / Zb : 1,
              );
            ((n = (n / t) * r), (a = (a / t) * r));
          }
        }
        let s = Math.hypot(n, a);
        s > 1 && ((n /= s), (a /= s));
        let l = s > 0.001 ? SS(Math.atan2(n, a), e.heading) : 0;
        if (
          (e.pivot?.progress === 1 && (e.pivot = null),
          !e.pivot &&
            e.walk < 0.025 &&
            e.speed < 0.04 &&
            s > 0.001 &&
            Math.abs(l) > 0.12 &&
            (e.pivot = {
              id: ++c,
              stage: `turn`,
              age: 0,
              progress: 0,
              angle: l,
              startHeading: e.heading,
            }),
          e.pivot)
        ) {
          let r = e.pivot;
          if (e.pivot?.stage === `turn`) {
            let i = r.progress;
            if (
              (r.settleAge === void 0
                ? ((r.age += t),
                  (r.progress = Math.min(1, r.age / Kb(r.angle))))
                : ((r.settleAge += t),
                  (r.fade = 1 - Ub(r.settleAge / 0.12)),
                  (r.progress = 0.5),
                  r.fade === 0 &&
                    ((r.angle /= 2), (r.progress = 1), delete r.settleAge)),
              Gb(r.angle) === 4 && i < 0.5 && r.progress >= 0.5)
            ) {
              let e = r.startHeading + r.angle / 2,
                t = s > 0.001 ? Math.atan2(n, a) : e;
              Math.abs(SS(t, e)) + 0.1 <
                Math.abs(SS(t, r.startHeading + r.angle)) &&
                ((r.progress = 0.5), (r.settleAge = 0));
            }
            let o = r.startHeading + Jb(r.angle, r.progress);
            ((e.turn = (o - e.heading) / t), (e.heading = o));
            let c =
              r.settleAge === void 0
                ? clampValue(r.angle - Jb(r.angle, r.progress), -0.8, 0.8)
                : 0;
            ((e.look += (c - e.look) * (1 - Math.exp(-0.058333333333333334))),
              (e.speed = e.walk = 0),
              (e.gait = ex));
            continue;
          }
        }
        let u = clampValue(l * 8, -2.8, 2.8),
          h = u * t;
        ((e.heading += h),
          (e.turn += (u - e.turn) * (1 - Math.exp(-0.08333333333333333))),
          (e.look +=
            (clampValue(l, -0.8, 0.8) - e.look) *
            (1 - Math.exp(-0.058333333333333334))));
        let g = 0.8 + 0.2 * Math.max(0, Math.cos(l)),
          _ = Math.min(1, s) * g;
        ((n = Math.sin(e.heading) * _), (a = Math.cos(e.heading) * _));
        let v = r * Math.cos(h) + i * Math.sin(h);
        ((i = i * Math.cos(h) - r * Math.sin(h)), (r = v));
        let y = s > 0.001 ? 10 : 14,
          b = Math.exp(-0.008333333333333333 * y),
          x = r,
          C = i;
        ((r = n * Zb + (r - n * Zb) * b), (i = a * Zb + (i - a * Zb) * b));
        let w = n * Zb * t + ((x - n * Zb) * (1 - b)) / y,
          T = a * Zb * t + ((C - a * Zb) * (1 - b)) / y,
          E = e.x,
          D = e.z;
        S(e.x + w, e.z + T) === null
          ? (S(e.x + w, e.z) === null ? (r = 0) : (e.x += w),
            S(e.x, e.z + T) === null ? (i = 0) : (e.z += T))
          : ((e.x += w), (e.z += T));
        let O = Math.hypot(e.x - E, e.z - D);
        ((e.stride = 1 / (1 + Math.abs(e.turn) * 0.3)),
          (e.speed = O / t),
          (e.gait += O / (Qb * e.stride)));
        let k = clampValue(e.speed / (Zb * g), 0, 1);
        ((e.walk += (k - e.walk) * (1 - Math.exp(-0.1))),
          s === 0 &&
            e.speed < 0.002 &&
            ((r = i = 0),
            e.walk < 0.01 &&
              ((e.walk = 0),
              (e.gait =
                (Math.round((e.gait / $b - 0.25) * 2) * 0.5 + 0.25) * $b))),
          (e.y += (S(e.x, e.z) - e.y) * (1 - Math.exp(-0.2))));
      }
      return x;
    },
  };
}
var TS = (e, t, n) => (
    (n = Math.max(0, Math.min(1, (n - e) / (t - e)))),
    n * n * (3 - 2 * n)
  ),
  ES = (e) => ({
    position: e.position.clone(),
    quaternion: e.quaternion.clone(),
    scale: e.scale.clone(),
  }),
  DS = (e, t) => {
    (e.position.copy(t.position),
      e.quaternion.copy(t.quaternion),
      e.scale.copy(t.scale));
  },
  OS = (e) => {
    let t = { position: new U(), quaternion: new H(), scale: new U() };
    return (e.matrixWorld.decompose(t.position, t.quaternion, t.scale), t);
  };
function kS(e, t) {
  (e.parent.updateWorldMatrix(!0, !1),
    new W()
      .copy(e.parent.matrixWorld)
      .invert()
      .multiply(t)
      .decompose(e.position, e.quaternion, e.scale),
    e.updateWorldMatrix(!1, !0));
}
function AS(e, t, n) {
  let r = new H()
    .setFromUnitVectors(t.normalize(), n.normalize())
    .multiply(e.getWorldQuaternion(new H()));
  (e.quaternion.copy(e.parent.getWorldQuaternion(new H()).invert().multiply(r)),
    e.updateWorldMatrix(!1, !0));
}
function jS(e, t, n, r, i, a, o = 0) {
  let s = e.getWorldPosition(new U()),
    c = t.getWorldPosition(new U()),
    l = n.getWorldPosition(new U()),
    u = s.distanceTo(c),
    d = c.distanceTo(l),
    f = r.clone().sub(s),
    p = Math.min(u + d - 1e-5, Math.max(Math.abs(u - d) + 1e-5, f.length()));
  f.normalize();
  let m = c.clone().sub(s);
  (a && m.lerp(a, o),
    m.addScaledVector(f, -m.dot(f)),
    m.lengthSq() < 1e-8 && m.set(0, 0, 1).addScaledVector(f, -f.z),
    m.normalize());
  let h = (u * u - d * d + p * p) / (2 * p),
    g = s
      .clone()
      .addScaledVector(f, h)
      .addScaledVector(m, Math.sqrt(Math.max(0, u * u - h * h)));
  AS(e, c.clone().sub(s), g.clone().sub(s));
  let _ = t.getWorldPosition(new U());
  (AS(t, n.getWorldPosition(new U()).sub(_), r.clone().sub(_)),
    n.quaternion.copy(
      n.parent.getWorldQuaternion(new H()).invert().multiply(i),
    ),
    n.updateWorldMatrix(!1, !0));
}
