// fishing-01.js — fishing: rod, line, bobber and the cast/reel states
// Lines 61593-62087 of readable/assets__index-BogB70q-.pretty.js (cluster fishing, statement-aligned).
function MS(e, t, { reducedMotion: n = !1 } = {}) {
  let r = e.getObjectByName(`ResidentKeeper`);
  if (!r) return null;
  let i = (e) => r.getObjectByName(e),
    a = e.getObjectByName(`FishingRodRig`),
    o = e.getObjectByName(`Rod_06`),
    s = e.getObjectByName(`FishingFloatPivot`);
  e.updateWorldMatrix(!0, !0);
  let c = new W().compose(
      new U(0.01513131, 0.0545, 0.05206528),
      new H(-0.18753244, -0.81743495, 0.12178499, 0.53084847).normalize(),
      new U(1, 1, 1),
    ),
    l = new W().compose(
      new U(-0.108, 0.32, -0.036),
      new H().setFromAxisAngle(new U(0, 0, 1), -Math.PI / 2),
      new U(1, 1, 1),
    );
  function u(e, t, n) {
    let r = new H()
      .setFromUnitVectors(t.normalize(), n.normalize())
      .multiply(e.getWorldQuaternion(new H()));
    (e.quaternion.copy(
      e.parent.getWorldQuaternion(new H()).invert().multiply(r),
    ),
      e.updateWorldMatrix(!1, !0));
  }
  function d(e, t, n) {
    let r = i(`hand_${e}`);
    kS(r, new W().multiplyMatrices(a.matrixWorld, t));
    let o = new U(0, 1, 0).applyQuaternion(a.getWorldQuaternion(new H())),
      s = a.getWorldPosition(new U()),
      c = new U(0, 1, 0).applyQuaternion(r.getWorldQuaternion(new H()));
    for (let t of [`index`, `middle`, `ring`, `pinky`]) {
      let n = i(`${t}_01_${e}`).getWorldPosition(new U()),
        r = n.clone().sub(s).addScaledVector(o, -n.clone().sub(s).dot(o)),
        a = new U().crossVectors(o, r).dot(c) > 0 ? 1 : -1;
      for (let n = 1; n <= 3; n++) {
        let r = i(`${t}_0${n}_${e}`),
          c = r.getWorldPosition(new U()),
          l =
            n < 3
              ? i(`${t}_0${n + 1}_${e}`).getWorldPosition(new U())
              : r.localToWorld(new U(0, 0.018, 0)),
          d = s.clone().addScaledVector(o, c.clone().sub(s).dot(o)),
          f = c.clone().sub(d),
          p = n === 1 ? 0.027 : n === 2 ? 0.024 : 0.022,
          m =
            (f.lengthSq() + p * p - c.distanceToSquared(l)) /
            (2 * f.length() * p),
          h = f
            .normalize()
            .applyAxisAngle(o, a * Math.acos(Math.max(-1, Math.min(1, m))))
            .multiplyScalar(p)
            .add(d);
        u(r, l.sub(c), h.sub(c));
      }
    }
    let l = new U(0, 0, 1).applyQuaternion(r.getWorldQuaternion(new H())),
      d = a.localToWorld(new U(0, n + 0.045, 0)).addScaledVector(l, -0.019),
      f = i(`thumb_03_${e}`);
    for (let t = 0; t < 12; t++)
      for (let t = 3; t >= 1; t--) {
        let n = i(`thumb_0${t}_${e}`),
          r = n.getWorldPosition(new U()),
          a = f.localToWorld(new U(0, 0.02, 0)),
          o = new H().setFromUnitVectors(
            a.sub(r).normalize(),
            d.clone().sub(r).normalize(),
          ),
          s = o.angleTo(new H());
        s > 0.3 && o.slerp(new H(), 1 - 0.3 / s);
        let c = o.multiply(n.getWorldQuaternion(new H()));
        (n.quaternion.copy(
          n.parent.getWorldQuaternion(new H()).invert().multiply(c),
        ),
          n.updateWorldMatrix(!1, !0));
      }
    let p = [];
    for (let t of [`thumb`, `index`, `middle`, `ring`, `pinky`])
      for (let n = 1; n <= 3; n++) {
        let r = i(`${t}_0${n}_${e}`);
        p.push({ node: r, rotation: r.quaternion.clone() });
      }
    return p;
  }
  let f = d(`r`, c, 0.14),
    p = d(`l`, l, 0.32);
  t(1);
  let m = s
    .getWorldPosition(new U())
    .sub(o.getWorldPosition(new U()))
    .applyQuaternion(e.getWorldQuaternion(new H()).invert());
  t(174);
  let h = [`upperarm_l`, `lowerarm_l`].map((e) => ({
    node: i(e),
    rotation: i(e).quaternion.clone(),
  }));
  t(1);
  function g(t, n, r) {
    let i = n.clone().applyQuaternion(e.getWorldQuaternion(new H())),
      a = new H()
        .setFromAxisAngle(i, r)
        .multiply(t.getWorldQuaternion(new H()));
    (t.quaternion.copy(
      t.parent.getWorldQuaternion(new H()).invert().multiply(a),
    ),
      t.updateWorldMatrix(!1, !0));
  }
  let _ = (e) => (e * Math.PI) / 180;
  return (t, u = 0, d = 0) => {
    let v = TS(18, 42, t) * (1 - TS(48, 76, t)) * (1 - u),
      y = TS(34, 48, t) * (1 - TS(54, 76, t)) * (1 - u),
      b = TS(167, 177, t) * (1 - TS(214, 231, t)) * (1 - u),
      x = n ? 0 : Math.sin(d * 1.5) * 0.5,
      S = o.getWorldPosition(new U()),
      C = i(`hand_r`).getWorldPosition(new U()),
      w = e.getWorldQuaternion(new H()),
      T = new W().multiplyMatrices(
        a.matrixWorld.clone().invert(),
        i(`hand_l`).matrixWorld,
      ),
      E = i(`hand_l`),
      D = E.worldToLocal(
        i(`index_03_l`)
          .getWorldPosition(new U())
          .add(i(`thumb_03_l`).getWorldPosition(new U()))
          .multiplyScalar(0.5),
      ),
      O = E.worldToLocal(
        i(`middle_01_l`).getWorldPosition(new U()),
      ).normalize(),
      k = new U(0, 1, 0)
        .applyQuaternion(a.getWorldQuaternion(new H()))
        .applyQuaternion(w.clone().invert()),
      A = new U(-k.z, 0, k.x).normalize().applyQuaternion(w),
      j = new H().setFromAxisAngle(A, _(11)),
      M = a.getWorldPosition(new U()).sub(C).applyQuaternion(j).add(C);
    (M.add(
      new U(-0.18, 0.095 + v * 0.012, 0.12).applyQuaternion(
        e.getWorldQuaternion(new H()),
      ),
    ),
      kS(
        a,
        new W().compose(
          M,
          j.multiply(a.getWorldQuaternion(new H())),
          new U(1, 1, 1),
        ),
      ),
      g(i(`spine_01`), new U(1, 0, 0), _(-4 - v * 3 - x)),
      g(i(`spine_02`), new U(0, 1, 0), _(14 - v * 4)),
      g(i(`spine_03`), new U(0, 1, 0), _(8 - v * 2)),
      g(i(`neck_01`), new U(0, 1, 0), _(24 - v * 10)),
      g(i(`head`), new U(1, 0, 0), _(5 - v * 3)));
    let N = new U(),
      P = new H(),
      F = new U(),
      I = new W().multiplyMatrices(a.matrixWorld, c);
    (I.decompose(N, P, F),
      bx(
        i(`upperarm_r`),
        i(`lowerarm_r`),
        i(`hand_r`),
        N,
        P,
        new U(0.6, -1, 0.15).applyQuaternion(w),
      ));
    for (let { node: e, rotation: t } of f) e.quaternion.copy(t);
    let ee = l.clone();
    (ee.decompose(N, P, F), (N.y -= y * 0.012));
    let te = new U(),
      ne = new H();
    T.decompose(te, ne, F);
    let re = new U(-0.55, -1, 0.12).applyQuaternion(w);
    if (b) {
      let e = a.localToWorld(te.clone()),
        t = a.getWorldQuaternion(new H()).multiply(ne),
        n = D.clone().multiply(F).applyQuaternion(t).add(e);
      for (let { node: e, rotation: t } of h) e.quaternion.copy(t);
      r.updateWorldMatrix(!1, !0);
      for (let r = 0; r < 3; r++) {
        bx(i(`upperarm_l`), i(`lowerarm_l`), E, e, t, re);
        let r = E.getWorldPosition(new U())
          .sub(i(`lowerarm_l`).getWorldPosition(new U()))
          .normalize();
        (t.premultiply(
          new H().setFromUnitVectors(O.clone().applyQuaternion(t), r),
        ),
          e.copy(n).sub(D.clone().multiply(F).applyQuaternion(t)));
      }
      (a.worldToLocal(e),
        te.copy(e),
        ne.copy(a.getWorldQuaternion(new H()).invert().multiply(t)));
    }
    (N.lerp(te, b),
      P.slerp(ne, b),
      ee.compose(N, P, F),
      I.multiplyMatrices(a.matrixWorld, ee),
      I.decompose(N, P, F));
    for (let { node: e, rotation: t } of h) e.quaternion.copy(t);
    (r.updateWorldMatrix(!1, !0),
      bx(i(`upperarm_l`), i(`lowerarm_l`), i(`hand_l`), N, P, re));
    for (let { node: e, rotation: t } of p) e.quaternion.slerp(t, 1 - b);
    r.updateWorldMatrix(!1, !0);
    let ie = (1 - TS(45, 65, t) + TS(218, 240, t)) * (1 - u) + u,
      ae = o.getWorldPosition(new U()).sub(S).multiplyScalar(ie);
    s.getWorldPosition(N).add(ae);
    let oe = TS(177, 240, t) * (1 - u);
    (oe &&
      N.lerp(o.getWorldPosition(new U()).add(m.clone().applyQuaternion(w)), oe),
      s.position.copy(s.parent.worldToLocal(N)),
      s.updateWorldMatrix(!1, !0));
  };
}
async function NS() {
  let e = new qp().setMeshoptDecoder(qm),
    t = async (t) => {
      let [n, r] = await Promise.all([
        t === `resident`
          ? hx()
          : e.loadAsync(`/compact/models/fishing-${t}.glb`),
        fetch(revisionUrlModifier(`/compact/models/fishing-${t}-line.json`)),
      ]);
      if (!r.ok) throw Error(`Could not load the ${t} fishing line.`);
      return { gltf: n, line: await r.json() };
    },
    [n, r, i, a, o] = await Promise.all([
      t(`resident`),
      t(`boat`),
      e.loadAsync(`/compact/models/fishing-chair.glb`),
      hx(),
      gx(),
    ]);
  return (vx(r.gltf, a, o), (n.scenery = i.scene), { chair: n, boat: r });
}
function buildFishingLine(e, t, n, { reducedMotion: r = !1 } = {}) {
  let i = [],
    a = new U(),
    o = new U(),
    s = new U(),
    c = 0,
    l = -10,
    u = {};
  for (let i of [`chair`, `boat`]) {
    let { gltf: a, line: o } = n[i],
      s = new Pn();
    ((s.name = `Fishing ${i}`), s.add(a.scene));
    let c = n[i].scenery;
    if (c) {
      c.updateMatrixWorld(!0);
      let e = [];
      c.traverse((t) => {
        t.isMesh &&
          [`chair`, `gear`].includes(t.userData.fishingPart) &&
          e.push(t);
      });
      for (let t of e) s.attach(t);
    }
    i === `chair`
      ? (s.position.set(chairSpec.x, chairSpec.y, chairSpec.z), (s.rotation.x = chairSpec.pitch), e.add(s))
      : t.add(s);
    let l = new Pc(a.scene);
    if (a.animations.length !== 1)
      throw Error(`Expected one reviewed ${i} fishing animation.`);
    let d = l.clipAction(a.animations[0]);
    (d.play(), (d.paused = !0));
    let f = [];
    s.traverse((e) => {
      if (e.isMesh) {
        ((e.castShadow = ![
          `ResidentGroom`,
          `ResidentScalp`,
          `ResidentCornea`,
          `ResidentTearline`,
        ].includes(e.name)),
          (e.receiveShadow = !0),
          f.push(e));
        for (let t of [e.material].flat()) t.envMapIntensity = 0.75;
        (e.isSkinnedMesh && (e.frustumCulled = !1),
          (e.userData.aboveWater = e.userData.fishingPart !== `equipment`));
      }
    });
    let p = new Hr();
    p.setAttribute(
      `position`,
      new Dr(new Float32Array(o.points * 3), 3).setUsage(Xe),
    );
    let m = new ra(
      p,
      new Yi({
        color: `#b8b59b`,
        transparent: !0,
        opacity: 0.68,
        depthWrite: !1,
      }),
    );
    ((m.name = `Fishing line`),
      (m.frustumCulled = !1),
      (m.userData.skipAO = !0),
      s.add(m));
    let h = a.scene.getObjectByName(`FishingFloatPivot`);
    if (!h) throw Error(`Missing ${i} float.`);
    let g = o.frames - 1,
      _ = o.timeline?.ready ?? 1,
      v = o.timeline?.water ?? 83,
      y = [
        ...new Set(
          a.animations[0].tracks.map((e) =>
            jc.findNode(a.scene, jc.parseTrackName(e.name).nodeName),
          ),
        ),
      ],
      b = [],
      x = new H(),
      S = new U();
    for (let e = 1; e <= o.frames; e++) {
      ((d.time = Math.min((e - 1) / o.fps, a.animations[0].duration - 1e-7)),
        l.update(0));
      let t = new Float32Array(y.length * 10);
      (y.forEach((e, n) => {
        (e.position.toArray(t, n * 10),
          e.quaternion.toArray(t, n * 10 + 3),
          e.scale.toArray(t, n * 10 + 7));
      }),
        b.push(t));
    }
    let C,
      w = (e, t = 0, n = 0) => {
        let r = Math.max(0, Math.min(g, e - 1)),
          i = Math.floor(r),
          a = Math.min(g, i + 1),
          o = r - i;
        (y.forEach((e, n) => {
          let r = n * 10;
          (e.position.fromArray(b[i], r).lerp(S.fromArray(b[a], r), o),
            e.quaternion
              .fromArray(b[i], r + 3)
              .slerp(x.fromArray(b[a], r + 3), o),
            e.scale.fromArray(b[i], r + 7).lerp(S.fromArray(b[a], r + 7), o),
            t &&
              (e.position.lerp(S.fromArray(b[_ - 1], r), t),
              e.quaternion.slerp(x.fromArray(b[_ - 1], r + 3), t),
              e.scale.lerp(S.fromArray(b[_ - 1], r + 7), t)));
        }),
          s.updateWorldMatrix(!0, !0),
          C?.(e, t, n));
      };
    w(_);
    let T = a.scene.userData.residentRodLift ?? 0,
      E =
        o.timeline || T
          ? [0, 1, 1, 2, 3, 4, 5, 6, 6, 6].map((e, t) => {
              let n = a.scene.getObjectByName(
                  `Rod_${String(e).padStart(2, `0`)}`,
                ),
                r = new U(...o.samples[_ - 1][t]);
              return (
                (r.y += T),
                { bone: n, point: n.worldToLocal(s.localToWorld(r)) }
              );
            })
          : null;
    (i === `boat` && (C = MS(s, w, { reducedMotion: r })),
      w(_),
      (u[i] = {
        root: s,
        mixer: l,
        action: d,
        meshes: f,
        geometry: p,
        lineMesh: m,
        line: o,
        floating: h,
        startFloat: h.position.clone(),
        startRotation: h.quaternion.clone(),
        sample: w,
        ready: _,
        waterFrame: v,
        guides: E,
        rodLift: T,
        refined: !!C,
      }));
  }
  function d(e, t) {
    c += t;
    for (let e = i.length - 1; e >= 0; e--)
      ((i[e].age += t), i[e].age > 3.8 && i.splice(e, 1));
    for (let [t, n] of Object.entries(u)) {
      let u = e.setting === t && e.seated && e.phase !== `leaving`;
      n.root.visible = t === `chair` || u;
      for (let e of n.meshes)
        e.visible =
          u ||
          (t === `chair` && [`chair`, `gear`].includes(e.userData.fishingPart));
      if (((n.lineMesh.visible = u), !u)) continue;
      let d = e.phase === `stowing`,
        f = d ? It.smoothstep(e.stow, 0, 1) : 0;
      n.sample(e.frame, f, e.waitAge ?? 0);
      let { samples: p } = n.line,
        m = n.line.frames - 1,
        h = Math.min(m, Math.max(0, e.frame - 1)),
        g = Math.floor(h),
        _ = Math.min(m, g + 1),
        v = h - g,
        y = n.geometry.attributes.position;
      for (let e = 0; e < n.line.points; e++)
        (o.fromArray(p[g][e]).lerp(s.fromArray(p[_][e]), v),
          d && o.lerp(s.fromArray(p[n.ready - 1][e]), f),
          (o.y +=
            n.rodLift *
            Math.min(1, (n.line.points - 1 - e) / (n.line.points - 10))),
          y.setXYZ(e, o.x, o.y, o.z));
      if ((d || n.refined) && n.guides) {
        for (let [e, { bone: t, point: r }] of n.guides.entries())
          (o.copy(r),
            t.localToWorld(o),
            n.root.worldToLocal(o),
            y.setXYZ(e, o.x, o.y, o.z));
        o.fromBufferAttribute(y, 9).sub(s.fromBufferAttribute(y, 10));
        for (let e = 10; e < n.line.points; e++) {
          let t = 1 - (e - 10) / (n.line.points - 11);
          y.setXYZ(
            e,
            y.getX(e) + o.x * t,
            y.getY(e) + o.y * t,
            y.getZ(e) + o.z * t,
          );
        }
      }
      let b = n.floating;
      if (
        (n.root.updateWorldMatrix(!0, !0),
        e.waiting ||
          e.phase === `reeling` ||
          (e.phase === `casting` && e.frame >= n.waterFrame) ||
          (d && e.stowOnWater))
      ) {
        b.getWorldPosition(o);
        let t = q + (r ? 0 : Math.sin(c * 2.6) * 0.004);
        if (d) {
          let e = n.startFloat.clone();
          (b.parent.localToWorld(e), (o.y = It.lerp(t, e.y, f)));
        } else
          n.refined && e.phase === `reeling`
            ? (o.y = It.lerp(t, o.y, It.smoothstep(e.frame, 214, 240)))
            : (o.y = t);
        if (!r && e.waiting && e.waitAge > 6) {
          let t = (e.waitAge - 6) % 9;
          t < 0.9 && (o.y -= Math.sin((t / 0.9) * Math.PI) ** 2 * 0.022);
        }
        (b.parent.worldToLocal(o),
          b.position.copy(o),
          b.updateWorldMatrix(!1, !0));
      }
      (b.getWorldPosition(o),
        n.root.worldToLocal(o),
        o.sub(s.fromBufferAttribute(y, n.line.points - 1)));
      for (let e = 10; e < n.line.points; e++) {
        let t = (e - 10) / (n.line.points - 11);
        y.setXYZ(
          e,
          y.getX(e) + o.x * t,
          y.getY(e) + o.y * t,
          y.getZ(e) + o.z * t,
        );
      }
      ((y.needsUpdate = !0),
        b.getWorldPosition(a),
        e.waiting &&
          !r &&
          c - l > 2.8 &&
          (i.push({
            x: a.x,
            z: a.z,
            age: 0,
            strength: e.waitAge > 6 ? 0.065 : 0.025,
          }),
          (l = c)));
    }
  }
  return {
    models: u,
    ripples: i,
    floatPosition: a,
    update: d,
    splash() {
      i.push({ x: a.x, z: a.z, age: 0, strength: 0.15 });
    },
    reset() {
      i.length = 0;
    },
  };
}
