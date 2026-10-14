// assets__index-BogB70q- 63 — math
// Lines 61830-62087 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function PS(e, t, n, { reducedMotion: r = !1 } = {}) {
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
      ? (s.position.set(oS.x, oS.y, oS.z), (s.rotation.x = oS.pitch), e.add(s))
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
