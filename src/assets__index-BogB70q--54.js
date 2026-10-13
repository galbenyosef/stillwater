// assets__index-BogB70q- 54 — clone
// Lines 59086-59536 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Dx(e, t, { reducedMotion: n = !1, period: r = 1.43 } = {}) {
  let i = (t) => e.getObjectByName(t),
    a = [
      `pelvis`,
      `spine_01`,
      `spine_02`,
      `neck_01`,
      `head`,
      ...[`l`, `r`].flatMap((e) => [`thigh_${e}`, `calf_${e}`, `foot_${e}`]),
    ].map((e) => ({ bone: i(e), position: new U(), rotation: new H() })),
    o = [`l`, `r`].map((e) => ({
      side: e,
      upper: i(`thigh_${e}`),
      lower: i(`calf_${e}`),
      foot: i(`foot_${e}`),
      anchor: null,
      contact: !1,
      landingEnd: null,
      current: null,
      currentRotation: null,
      anchorRotation: null,
      anchorAxis: null,
      release: null,
    })),
    s = !1,
    c = null,
    l = null,
    u = 0,
    d = null,
    f = !0,
    p = null;
  function m(e, t, n) {
    let r = new H()
      .setFromAxisAngle(t, n)
      .multiply(e.getWorldQuaternion(new H()));
    (e.quaternion.copy(
      e.parent.getWorldQuaternion(new H()).invert().multiply(r),
    ),
      e.updateWorldMatrix(!1, !0));
  }
  function h(t, n = 0.16) {
    let r = 0;
    for (let { f: e, target: n } of t) {
      let t = e.upper.getWorldPosition(new U()),
        i = e.lower.getWorldPosition(new U()),
        a = e.foot.getWorldPosition(new U()),
        o = t.distanceTo(i) + i.distanceTo(a) - 0.002,
        s = Math.hypot(n.x - t.x, n.z - t.z),
        c = n.y + Math.sqrt(Math.max(0, o * o - s * s));
      r = Math.max(r, t.y - c);
    }
    ((i(`pelvis`).position.y -= It.clamp(r, 0, n)),
      e.updateWorldMatrix(!0, !0));
  }
  return {
    calibrate() {
      e.updateWorldMatrix(!0, !0);
      let t = e.getWorldQuaternion(new H()).invert();
      for (let e of o) {
        e.restRotation = t.clone().multiply(e.foot.getWorldQuaternion(new H()));
        let n = e.restRotation.clone().invert(),
          r = e.side === `l` ? 1 : -1;
        e.sole = [-0.045, 0.135].flatMap((e) =>
          [-Tx, -0.076].flatMap((t) =>
            [rx.heel - 0.003, rx.toe + 0.003].map((i) =>
              new U(e * r, t, i).applyQuaternion(n),
            ),
          ),
        );
      }
    },
    restore() {
      if (s) {
        for (let e of a)
          (e.bone.position.copy(e.position),
            e.bone.quaternion.copy(e.rotation));
        s = !1;
      }
    },
    reset() {
      ((c = null), (l = null), (u = 0), (d = null), (f = !0), (p = null));
      for (let e of o)
        ((e.anchor = null),
          (e.contact = !1),
          (e.landingEnd = null),
          (e.current = null),
          (e.release = null));
    },
    update(g, _, { lockFeet: v = !0 } = {}) {
      for (let e of a)
        (e.position.copy(e.bone.position), e.rotation.copy(e.bone.quaternion));
      s = !0;
      let y = c === null ? 0 : It.clamp(g - c, 0, 0.1);
      if (l && Math.hypot(_.x - l.x, _.z - l.z) > 0.5) {
        for (let e of o)
          ((e.anchor = null),
            (e.contact = !1),
            (e.landingEnd = null),
            (e.current = null),
            (e.release = null));
        ((u = 0), (d = null), (f = !0), (l = null));
      }
      let b = l && _.walk < 0.8 && _.walk < l.walk - 1e-6,
        x = l && _.walk > l.walk + 1e-6;
      ((c = g),
        (l = { x: _.x, z: _.z, walk: _.walk }),
        (u = _.walk > 0.04 ? 0 : u + y),
        e.updateWorldMatrix(!0, !0));
      let S = _.pivot?.stage === `turn` ? _.pivot : null;
      if (S) {
        let n = _.look ?? 0;
        (m(i(`spine_02`), Sx, n * 0.18),
          m(i(`neck_01`), Sx, n * 0.22),
          m(i(`head`), Sx, n * 0.46),
          (p?.id !== S.id || p.heading !== S.startHeading) &&
            ((p = {
              id: S.id,
              heading: S.startHeading,
              origin: e.position.clone(),
              feet: o.map((e) => ({
                position: e.current?.clone(),
                rotation: e.currentRotation?.clone(),
              })),
            }),
            (d = null)));
        let r = [];
        for (let [n, i] of o.entries()) {
          let a = Yb(S.angle, S.progress, i.side),
            o = i.restRotation,
            s = (e, t = Wb) =>
              new U(i.side === `l` ? t : -t, Tx, -0.024)
                .applyAxisAngle(Sx, S.startHeading + e)
                .add(p.origin),
            c = a.first ? It.lerp(0.119, Wb, a.t) : Wb,
            l = p.feet[n],
            u = s(a.from + (a.to - a.from) * a.t, c);
          (a.first &&
            l.position &&
            u.addScaledVector(
              l.position.clone().sub(s(a.from, 0.119)),
              1 - a.t,
            ),
            (u.y = (t(u.x, u.z, _.y) ?? _.y) + Tx + a.lift));
          let d = (
              a.first && l.rotation
                ? l.rotation
                : new H()
                    .setFromAxisAngle(Sx, S.startHeading + a.from)
                    .multiply(o)
            )
              .clone()
              .slerp(
                new H().setFromAxisAngle(Sx, S.startHeading + a.to).multiply(o),
                a.t,
              ),
            f = new U(i.side === `l` ? 0.1 : -0.1, 0, 1).applyQuaternion(
              e.quaternion,
            );
          r.push({ f: i, target: u, rotation: d, pole: f });
        }
        h(r);
        for (let { f: t, target: n, rotation: i, pole: a } of r)
          (bx(t.upper, t.lower, t.foot, n, i, a),
            (t.current = t.foot.getWorldPosition(t.current ?? new U())),
            (t.currentRotation = t.foot.getWorldQuaternion(
              t.currentRotation ?? new H(),
            )),
            (t.anchor = t.current.clone()),
            (t.anchorRotation = i.clone()),
            (t.anchorAxis = Cx.clone().applyQuaternion(e.quaternion)),
            (t.contact = !0),
            (t.landingEnd = null),
            (t.release = null));
        f = !0;
        return;
      }
      p = null;
      let C =
          (n ? 0 : xx(2, 5, u) * (1 - _.walk)) *
          0.24 *
          Math.sin(g * 0.31) *
          Math.sin(g * 0.13) ** 2,
        w = (_.look ?? 0) + C;
      (m(i(`spine_02`), Sx, w * 0.18),
        m(i(`neck_01`), Sx, w * 0.22),
        m(i(`head`), Sx, w * 0.46));
      let T = Cx.clone().applyQuaternion(e.quaternion),
        E = wx.clone().applyQuaternion(e.quaternion);
      (m(i(`spine_01`), T, 0.035 * _.walk),
        m(i(`spine_01`), E, -0.018 * (_.turn ?? 0) * _.walk));
      let D = [],
        O = _.walk < 0.025,
        k = t(_.x + E.x * 0.55, _.z + E.z * 0.55, _.y),
        A = t(_.x - E.x * 0.55, _.z - E.z * 0.55, _.y),
        j = k !== null && A !== null && k < A - 0.025,
        M = k !== null && A !== null && k > A + 0.025;
      O || (d = null);
      for (let n of o) {
        let i = n.foot.getWorldPosition(new U()),
          a = n.foot.getWorldQuaternion(new H()),
          o = _.stride ?? 1,
          s = e.worldToLocal(i.clone()),
          c = It.lerp(1, 1.1, xx(0, 0.35, 1 - o));
        ((s.x =
          (n.side === `l` ? 1 : -1) *
          It.clamp(
            Math.abs(s.x) * It.lerp(1, c, xx(0, 0.7, _.walk)),
            0.08,
            0.12,
          )),
          (s.z *= o),
          (s.x += (n.side === `l` ? 1 : -1) * (1 - o) * 0.12 * _.walk),
          i.copy(e.localToWorld(s)));
        let l = (((_.gait / r + (n.side === `r` ? 0.5 : 0)) % 1) + 1) % 1,
          u = n.landingEnd !== null;
        ((x && l >= 0.6) ||
          (n.landingEnd !== null && _.gait >= n.landingEnd)) &&
          (n.landingEnd = null);
        let d = O || l < 0.6 || n.landingEnd !== null,
          p = O ? 0 : ix(l) * _.walk,
          m = new U(0, -Tx, p < 0 ? rx.heel : rx.toe).applyQuaternion(
            e.quaternion,
          ),
          h = new H().setFromAxisAngle(T, p);
        a.copy(h)
          .multiply(new H().setFromAxisAngle(Sx, _.heading))
          .multiply(n.restRotation);
        let g = m.clone().sub(m.clone().applyQuaternion(h)),
          b = t(i.x, i.z, _.y) ?? _.y,
          S = Math.min(0.11, Math.max(0, i.y - _.y - Tx)),
          C = i.clone();
        if (((C.y = b + Tx + S), !d)) {
          let e =
            t(
              i.x + Math.sin(_.heading) * 0.12,
              i.z + Math.cos(_.heading) * 0.12,
              _.y,
            ) ?? b;
          C.y +=
            Math.max(0, Math.min(0.22, e - b)) *
            Math.sin((Math.PI * (l - nx)) / (1 - nx));
        }
        if (O && !f && n.current) n.anchor = n.current.clone();
        else if (d && !n.contact) {
          let e = n.release && n.current ? n.current : i;
          ((n.anchor = new U(e.x - g.x, b + Tx, e.z - g.z)),
            (n.anchorRotation = h.clone().invert().multiply(a)),
            (n.anchorAxis = T.clone()),
            n.release?.landed && (n.landingEnd = _.gait + (nx - l) * r));
        }
        if (d) n.release = null;
        else if (
          (n.contact && n.current
            ? (n.release = {
                offset: n.current.clone().sub(C),
                rotation: n.currentRotation.clone(),
                age: 0,
                landed: u && x,
              })
            : n.release && (n.release.age += y),
          (n.anchor = null),
          n.release && v)
        ) {
          let e = 1 - xx(0, 0.16, n.release.age);
          (C.addScaledVector(n.release.offset, e),
            a.slerp(n.release.rotation, e));
        }
        n.contact = d;
        let w = O || n.landingEnd !== null ? 1 : xx(0, 0.08, l);
        if (n.anchor) {
          if (v) {
            if (!O && n.anchorRotation) {
              let e = new H()
                  .setFromAxisAngle(n.anchorAxis, p)
                  .multiply(n.anchorRotation),
                t = new U()
                  .crossVectors(n.anchorAxis, Sx)
                  .multiplyScalar(p < 0 ? rx.heel : rx.toe)
                  .addScaledVector(Sx, -Tx);
              (g.copy(t).sub(t.clone().applyAxisAngle(n.anchorAxis, p)),
                a.slerp(e, w));
            }
            C.lerp(n.anchor.clone().add(g), w);
          } else C.y = It.lerp(C.y, b + Tx + g.y, w);
        }
        if (!O) {
          let t = e.worldToLocal(C.clone()),
            r = n.side === `l` ? 1 : -1;
          t.x * r < 0.065 &&
            ((t.x = r * 0.065),
            C.copy(e.localToWorld(t)),
            n.anchor && n.anchor.copy(C).sub(g));
        }
        let k = t(C.x, C.z, _.y) ?? b;
        ((C.y = Math.max(C.y, k + Tx)),
          j && n.current && (C.y = Math.max(C.y, n.current.y - y * 2.5)));
        let A = new U(i.x, b + Tx, i.z),
          N =
            M && O ? a.clone().multiply(n.restRotation.clone().invert()) : null,
          P = N ? new U(0, -Tx, rx.toe + 0.004).applyQuaternion(N) : null;
        if (O && P) {
          let e = (e) =>
            (t(A.x + P.x - E.x * e, A.z + P.z - E.z * e, _.y) ?? b) - P.y <=
            A.y + 1e-5;
          if (!e(0) && e(0.22)) {
            let t = 0,
              n = 0.22;
            for (let r = 0; r < 10; r++) {
              let r = (t + n) / 2;
              e(r) ? (n = r) : (t = r);
            }
            A.addScaledVector(E, -n);
          }
        }
        D.push({ f: n, target: C, rotation: a, roll: p, floor: k, rest: A });
      }
      if (O && v) {
        if (!d) {
          let e = D.find((e) => e.target.distanceTo(e.rest) > 0.02);
          e &&
            (d = {
              foot: e.f,
              from: e.target.clone(),
              to: e.rest.clone(),
              age: 0,
            });
        }
        if (d) {
          d.age += y;
          let e = Math.min(1, d.age / 0.3),
            t = e * e * (3 - 2 * e),
            n = D.find((e) => e.f === d.foot);
          (n.target.lerpVectors(d.from, d.to, t),
            (n.target.y += 0.045 * Math.sin(Math.PI * e)),
            e === 1 && ((n.f.anchor = d.to.clone()), (d = null)));
        }
      }
      if (M)
        for (let e of D) {
          let { f: n, target: r, rotation: i, floor: a } = e;
          if (!n.current) continue;
          let o = new U(),
            s = new U(),
            c = new H(),
            l = (e) => {
              let l = It.lerp(n.current.x, r.x, e),
                u = It.lerp(n.current.z, r.z, e);
              c.copy(n.currentRotation).slerp(i, e);
              let d = (t(l, u, _.y) ?? a) + Tx;
              for (let [e, r] of Ex) {
                (o.copy(n.sole[e]).applyQuaternion(c),
                  s.copy(n.sole[r]).applyQuaternion(c));
                let i = (e) =>
                    t(
                      l + It.lerp(o.x, s.x, e),
                      u + It.lerp(o.z, s.z, e),
                      _.y,
                    ) ?? a,
                  f = (e, t, n, r, a) => {
                    let c = It.lerp(o.y, s.y, e),
                      l = It.lerp(o.y, s.y, t);
                    d = Math.max(d, n - c, r - l);
                    let u = Math.max(n, r) - Math.min(c, l);
                    if (n === r || u <= d) return;
                    if (a === 8) {
                      d = Math.max(d, u);
                      return;
                    }
                    let p = (e + t) / 2,
                      m = i(p);
                    (f(e, p, n, m, a + 1), f(p, t, m, r, a + 1));
                  };
                f(0, 1, i(0), i(1), 0);
              }
              return d;
            };
          r.y = It.clamp(
            Math.max(r.y, l(1)),
            n.current.y - y * 2.5,
            n.current.y + y * 2.5,
          );
          let u = Math.hypot(r.x - n.current.x, r.z - n.current.z),
            d = u > 0 ? Math.min(1, (y * 4.5) / u) : 1,
            f = n.currentRotation.angleTo(i);
          if ((f > 0 && (d = Math.min(d, (y * 8) / f)), l(d) > r.y + 1e-5)) {
            let e = 0,
              t = d;
            for (let n = 0; n < 10; n++) {
              let n = (e + t) / 2;
              l(n) <= r.y + 1e-5 ? (e = n) : (t = n);
            }
            d = e;
          }
          ((r.x = It.lerp(n.current.x, r.x, d)),
            (r.z = It.lerp(n.current.z, r.z, d)),
            i.copy(n.currentRotation.clone().slerp(i, d)),
            (e.floor = t(r.x, r.z, _.y) ?? a),
            (r.y = Math.max(r.y, e.floor + Tx)));
        }
      if (v && b && !O)
        for (let { f: n, target: i, rotation: a, roll: o } of D) {
          if (
            n.contact ||
            !n.current ||
            i.y > n.current.y + 1e-6 ||
            !n.sole.some((e) => {
              let n = e.clone().applyQuaternion(a).add(i),
                r = t(n.x, n.z, _.y);
              return r !== null && n.y <= r + 0.001;
            })
          )
            continue;
          let s = new H().setFromAxisAngle(T, o),
            c = new U(0, -Tx, o < 0 ? rx.heel : rx.toe).applyQuaternion(
              e.quaternion,
            ),
            l = c.clone().sub(c.clone().applyQuaternion(s));
          ((n.anchor = i.clone().sub(l)),
            (n.anchorRotation = s.invert().multiply(a)),
            (n.anchorAxis = T.clone()));
          let u = (((_.gait / r + (n.side === `r` ? 0.5 : 0)) % 1) + 1) % 1;
          ((n.contact = !0),
            (n.landingEnd = _.gait + (1 + nx - u) * r),
            (n.release = null));
        }
      f = O;
      let N = D.reduce((e, t) => e + t.floor, 0) / 2;
      ((i(`pelvis`).position.y += It.clamp(N - _.y, -0.14, 0.14) * 0.65),
        e.updateWorldMatrix(!0, !0),
        h(D, M ? 0.28 : 0.16));
      for (let { f: n, target: r, rotation: i } of D) {
        let a = It.lerp(0.1, 0.025, _.walk),
          o = new U(n.side === `l` ? a : -a, 0, 1).applyQuaternion(
            e.quaternion,
          );
        (bx(n.upper, n.lower, n.foot, r, i, o),
          (n.current = n.foot.getWorldPosition(n.current ?? new U())),
          (n.currentRotation = n.foot.getWorldQuaternion(
            n.currentRotation ?? new H(),
          )));
        let s = t(n.current.x, n.current.z, _.y);
        s !== null &&
          n.current.y < s + Tx - 0.002 &&
          (r.copy(n.current),
          (r.y = s + Tx),
          bx(n.upper, n.lower, n.foot, r, i, o),
          n.foot.getWorldPosition(n.current));
      }
    },
  };
}
