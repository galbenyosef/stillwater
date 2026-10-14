// keeper-poses-02.js — the keeper's pose system (idle/walk/fish poses, hand IK, the mill keeper rig)
// Lines 60202-60764 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-poses, statement-aligned).
function buildKeeperRig(e, t, n) {
  let r = [];
  e.traverse((e) => {
    e.isBone && r.push(e);
  });
  let i = r.map((e) => ({ p: e.position.clone(), q: e.quaternion.clone() })),
    a = new Pc(e);
  (a.clipAction(As.findByName(n, `KeeperIdle`)).play(),
    a.update(0),
    t.updateWorldMatrix(!0, !0));
  let o = r.map((e) => ({ p: e.position.clone(), q: e.quaternion.clone() })),
    s = cloneSkinnedGeometry(e.getObjectByName(`ResidentHoodie`), t),
    c = (t) => e.getObjectByName(t),
    l = c(`pelvis`).getWorldPosition(new U());
  t.worldToLocal(l);
  let u = t.worldToLocal(c(`spine_03`).getWorldPosition(new U())).sub(l),
    d = {};
  for (let e of [`l`, `r`])
    for (let n of [`hand`, `foot`]) {
      let r = c(`${n}_${e}`);
      ((d[`${n}_${e}`] = {
        p: t.worldToLocal(r.getWorldPosition(new U())),
        q: r.quaternion.clone(),
        worldQ: r.getWorldQuaternion(new H()),
      }),
        n === `foot` &&
          (d[`${n}_${e}`].bend = c(`calf_${e}`)
            .getWorldPosition(new U())
            .sub(c(`thigh_${e}`).getWorldPosition(new U()))
            .normalize()
            .applyQuaternion(t.getWorldQuaternion(new H()).invert())));
    }
  for (let [e, t] of [
    [`l`, 1],
    [`r`, -1],
  ]) {
    let n = c(`hand_${e}`),
      r = d[`hand_${e}`],
      i = c(`middle_01_${e}`)
        .getWorldPosition(new U())
        .sub(n.getWorldPosition(new U()))
        .normalize(),
      a = new U(-t, 0, 0).addScaledVector(i, t * i.x).normalize();
    ((r.gripFrame = new H()
      .setFromRotationMatrix(new W().makeBasis(i.clone().cross(a), i, a))
      .invert()
      .multiply(r.worldQ)),
      (r.upperLength = c(`upperarm_${e}`)
        .getWorldPosition(new U())
        .distanceTo(c(`lowerarm_${e}`).getWorldPosition(new U()))),
      (r.forearmLength = c(`lowerarm_${e}`)
        .getWorldPosition(new U())
        .distanceTo(n.getWorldPosition(new U()))),
      (r.curls = []));
    for (let t of [`index`, `middle`, `ring`, `pinky`])
      for (let n = 1; n <= 3; n++) {
        let o = c(`${t}_0${n}_${e}`),
          s = o.children.find((e) => e.isBone),
          l = (
            s
              ? s
                  .getWorldPosition(new U())
                  .sub(o.getWorldPosition(new U()))
                  .normalize()
              : i.clone()
          )
            .cross(a)
            .normalize()
            .applyQuaternion(o.getWorldQuaternion(new H()).invert());
        r.curls.push({
          joint: o,
          axis: l,
          angle: [0.6, 0.55, 0.2][n - 1],
          knuckle: n === 1,
        });
      }
  }
  (a.stopAllAction(),
    a.uncacheRoot(e),
    r.forEach((e, t) => {
      (e.position.copy(i[t].p), e.quaternion.copy(i[t].q));
    }));
  let f = new H(),
    p = new H(),
    m = new U(),
    h = new U(),
    g = new U(),
    _ = new H(),
    v = new U(),
    y = new U(),
    b = new U(),
    x = new U(),
    S = new U(),
    C = new H(),
    w = Xx(),
    T = new U(),
    E = new U(),
    D = new U(),
    O = new U();
  function k(e, t, n, r, i = 1, a = null) {
    if (i <= 0) return;
    let [o, s, l] = (
        e === `hand`
          ? [`upperarm`, `lowerarm`, `hand`]
          : [`thigh`, `calf`, `foot`]
      ).map((e) => c(`${e}_${t}`)),
      u =
        i < 1
          ? [o.quaternion.clone(), s.quaternion.clone(), l.quaternion.clone()]
          : null;
    (h.copy(n),
      a ? _.copy(a) : l.getWorldQuaternion(_),
      bx(o, s, l, h, _, r),
      a || l.quaternion.copy(d[`${e}_${t}`].q),
      u && [o, s, l].forEach((e, t) => e.quaternion.slerp(u[t], 1 - i)),
      o.updateWorldMatrix(!1, !0));
  }
  function A(e) {
    return e.applyQuaternion(f).add(m);
  }
  function j(e, t, n, r = c(`hand_${e}`).quaternion.clone()) {
    let i = c(`hand_${e}`),
      a = c(`lowerarm_${e}`),
      o = d[`hand_${e}`],
      s = i.position.clone().normalize(),
      l = a
        .getWorldQuaternion(new H())
        .invert()
        .multiply(t)
        .multiply(o.q.clone().invert()),
      u = s.x * l.x + s.y * l.y + s.z * l.z;
    (l.set(s.x * u, s.y * u, s.z * u, l.w).normalize(),
      a.quaternion.multiply(new H().slerp(l, n)),
      a.updateWorldMatrix(!1, !0),
      t.premultiply(i.parent.getWorldQuaternion(_).invert()),
      i.quaternion.copy(t).slerp(r, 1 - n),
      i.updateWorldMatrix(!1, !0));
  }
  function M(e, t, n = 1) {
    let r = t.effort,
      i = Nx(t.cycle ?? t.time / keeperMotionSpec.strokeDuration);
    for (let [e, a] of [
      [`l`, 1],
      [`r`, -1],
    ]) {
      let o = w(t.time, a),
        s = d[`hand_${e}`];
      if (
        (c(`upperarm_${e}`).getWorldPosition(T),
        E.copy(o.upper).applyQuaternion(f),
        T.addScaledVector(E, s.upperLength),
        b.copy(o.forearm).applyQuaternion(f),
        T.addScaledVector(b, s.forearmLength),
        Px(tS, i.phase, v),
        (v.x *= a),
        (v.y += q - m.y),
        A(v).lerpVectors(T, v, r),
        g
          .set(a * eS(-0.15, 0.75, i.pull), -0.32, -eS(1, 0.12, i.pull))
          .applyQuaternion(f)
          .lerpVectors(E, g, r),
        k(`hand`, e, v, g, n),
        D.copy(o.fingers).applyQuaternion(f),
        O.copy(o.palm).applyQuaternion(f),
        b
          .set(a * 0.12 * i.pull, -0.16 - 0.35 * i.pull, 1)
          .normalize()
          .applyQuaternion(f)
          .lerpVectors(D, b, r)
          .normalize(),
        g
          .set(a * 0.45 * i.pull, -1, 0)
          .applyQuaternion(f)
          .lerpVectors(O, g, r),
        g.addScaledVector(b, -g.dot(b)).normalize(),
        r > 0)
      ) {
        (c(`hand_${e}`).getWorldPosition(x),
          c(`lowerarm_${e}`).getWorldPosition(S),
          x.sub(S).normalize());
        let t = x.angleTo(b);
        if (t > 0.25) {
          let e = 0.25 + 0.3 * Math.tanh((t - 0.25) / 0.3);
          (p.setFromUnitVectors(b, x),
            _.identity().slerp(p, 1 - e / t),
            b.applyQuaternion(_),
            g.applyQuaternion(_));
        }
      }
      (x.crossVectors(b, g),
        C.setFromRotationMatrix(new W().makeBasis(x, b, g)).multiply(
          d[`hand_${e}`].gripFrame,
        ),
        j(e, C, n));
      for (let { joint: t, axis: r, angle: i, knuckle: a } of d[`hand_${e}`]
        .curls) {
        let e = a ? 0.2 : i > 0.3 ? 0.33 : 0.08;
        t.quaternion.multiply(p.setFromAxisAngle(r, -e * n));
      }
      (Px(nS, i.phase, y),
        (y.x *= a),
        y.lerpVectors(o.foot, y, r),
        (y.y += q - m.y),
        g.set(a * eS(0.18, 0.3, r), -1, eS(0.32, -0.15, r)).applyQuaternion(f),
        k(`foot`, e, A(y), g, n));
      let l = c(`foot_${e}`),
        u = c(`ball_${e}`);
      u &&
        (l.getWorldPosition(b),
        u.getWorldPosition(x).sub(b).normalize(),
        S.set(
          a * i.recover * 0.85,
          -Math.sin(Math.PI - 0.18),
          Math.cos(Math.PI - 0.18),
        )
          .normalize()
          .lerpVectors(o.toe, S, r)
          .normalize()
          .applyQuaternion(f),
        l.getWorldQuaternion(_),
        C.setFromUnitVectors(x, S).multiply(_),
        C.premultiply(l.parent.getWorldQuaternion(_).invert()),
        l.quaternion.slerp(C, n),
        l.updateWorldMatrix(!1, !0));
    }
  }
  return {
    clear() {
      s?.clear();
    },
    update(e) {
      s?.apply();
      let n = e.swim,
        i = n.phase === `entering` || n.phase === `exiting`,
        a = n.progress;
      r.forEach((e, t) => {
        (e.position.copy(o[t].p), e.quaternion.copy(o[t].q));
      });
      let h = i ? fisherClimbAt(a, l.y) : null,
        w = h?.release ?? 1,
        T = i ? 0 : n.effort,
        E = Nx(n.cycle ?? n.time / keeperMotionSpec.strokeDuration),
        D = eS(0.13, 1.3 - 0.15 * E.breath, T) * w;
      (c(`neck_01`).quaternion.multiply(p.setFromAxisAngle(Qx, -D * 0.95)),
        c(`head`).quaternion.multiply(p.setFromAxisAngle(Qx, -D * 0.3)),
        c(`head`).quaternion.multiply(
          p.setFromAxisAngle($x, clampValue((n.turn ?? 0) * 0.16, -0.2, 0.2) * w),
        ));
      let O = e.heading;
      if (
        (i &&
          n.phase === `entering` &&
          (O = keeperMotionSpec.landing.heading - Math.PI * h.turn),
        f.setFromAxisAngle($x, O),
        t.quaternion.copy(f).multiply(p.setFromAxisAngle(Qx, D)),
        i)
      ) {
        let { hip: e, standing: t } = h;
        m.set(e.x + l.z * t, e.y, e.z - l.x * t);
      } else {
        let r = eS(-0.19, -0.115 + 0.035 * E.breath, T);
        (b.copy(u).applyQuaternion(t.quaternion),
          m.set(
            e.x,
            q + r - b.y + Math.sin(n.time * 2.6) * 0.008 * (1 - T),
            e.z,
          ));
      }
      if (
        (t.position.copy(m).sub(l.clone().applyQuaternion(t.quaternion)),
        t.updateWorldMatrix(!0, !0),
        !i)
      ) {
        M(e, n);
        return;
      }
      ((t.position.y -= 0.095 * (1 - h.standing) * (1 - h.release)),
        t.updateWorldMatrix(!0, !0),
        w > 0 && M(e, { ...n, effort: 0 }, w));
      let A = new H().setFromAxisAngle($x, keeperMotionSpec.landing.heading);
      for (let [e, t] of [
        [`l`, 1],
        [`r`, -1],
      ]) {
        let n = h.feet[e],
          r = h.hands[e],
          i = d[`foot_${e}`],
          a = i.p
            .clone()
            .applyQuaternion(A)
            .add(new U(keeperMotionSpec.landing.x, keeperMotionSpec.landing.y, keeperMotionSpec.landing.z));
        (y.set(
          eS(keeperMotionSpec.ladderX - 0.16 - n.back, a.x, n.dock),
          n.sole + i.p.y,
          eS(keeperMotionSpec.water.z - t * 0.15, a.z, n.dock),
        ),
          g
            .copy(i.bend)
            .applyQuaternion(A)
            .lerp(x.set(1, -0.1, t * 0.12), 1 - h.standing),
          C.copy(A).multiply(i.worldQ),
          k(`foot`, e, y, g, n.weight, C));
        let o = d[`hand_${e}`];
        v.set(
          keeperMotionSpec.ladderX - 0.065 - r.back,
          r.y,
          keeperMotionSpec.water.z - t * (keeperMotionSpec.railSpacing / 2 + 0.08),
        );
        let s = c(`hand_${e}`),
          l = s.quaternion.clone();
        (g.set(-0.4, -1, -t * 0.25),
          k(`hand`, e, v, g, r.weight),
          s.getWorldPosition(b).sub(c(`lowerarm_${e}`).getWorldPosition(x)));
        let u = clampValue(Math.atan2(b.y, b.x), -0.25, 0.7);
        (b.set(Math.cos(u), Math.sin(u), 0),
          g.set(0, 0, t),
          x.crossVectors(b, g),
          C.setFromRotationMatrix(new W().makeBasis(x, b, g)).multiply(
            o.gripFrame,
          ),
          j(e, C, r.weight, l));
        for (let { joint: e, axis: t, angle: n, knuckle: i } of o.curls) {
          let a = n - (i ? Math.max(0, u) * 1.3 : 0);
          e.quaternion.multiply(
            p.setFromAxisAngle(t, a * r.weight * (1 - (r.back / 0.06) * 0.7)),
          );
        }
        c(`hand_${e}`).updateWorldMatrix(!1, !0);
        for (let n of [1, 2]) {
          let i = c(`thumb_0${n}_${e}`),
            a = c(`thumb_0${n + 1}_${e}`);
          (i.getWorldPosition(b),
            a.getWorldPosition(x).sub(b).normalize(),
            S.set(
              n === 1 ? -1 : -0.25,
              n === 1 ? 0.2 : -0.15,
              t * (n === 1 ? 0.4 : 1),
            ).normalize(),
            i.getWorldQuaternion(_),
            C.setFromUnitVectors(x, S).multiply(_),
            C.premultiply(i.parent.getWorldQuaternion(_).invert()),
            i.quaternion.slerp(C, r.weight * (1 - (r.back / 0.06) * 0.7)),
            i.updateWorldMatrix(!1, !0));
        }
      }
    },
  };
}
async function iS() {
  let [e, t] = await Promise.all([hx(), gx()]);
  return (
    _x(e),
    (e.animations = t.filter((e) => e.name !== `ResidentBoatFishing`)),
    e
  );
}
function buildMillKeeper(e, t, { reducedMotion: n = !1, surface: r = null } = {}) {
  let i = new Pn();
  ((i.name = `Mill keeper`),
    (i.userData.aboveWater = !0),
    i.add(t.scene),
    e.add(i));
  let a = new Pc(t.scene),
    o = (e) => {
      let n = As.findByName(t.animations, e);
      if (!n) throw Error(`Keeper animation missing: ${e}`);
      return a.clipAction(n).play();
    },
    s = o(`KeeperIdle`),
    c = o(`KeeperWalk`),
    l = new Map(
      t.animations
        .filter((e) => e.name.startsWith(`KeeperTurn`))
        .map((e) => {
          let t = a.clipAction(e);
          return (
            t.setLoop(Me, 1),
            (t.clampWhenFinished = !0),
            t.play(),
            t.setEffectiveWeight(0),
            [e.name, t]
          );
        }),
    ),
    u = 0,
    d = 0,
    f = 0,
    p = `routine`,
    m = !0,
    h = { value: 0 },
    g = { value: 0 };
  t.scene.traverse((e) => {
    if ((e.isBone && d++, !e.isMesh)) return;
    (f++,
      (u +=
        (e.geometry.index?.count ?? e.geometry.attributes.position.count) / 3));
    let n = [`ResidentHoodie`, `ResidentClothes`].includes(e.name);
    if (n || e.name === `ResidentSkin`) {
      let t = e.material,
        r = t.onBeforeCompile,
        i = t.customProgramCacheKey();
      ((e.material = t.clone()),
        (e.material.onBeforeCompile = (e, t) => {
          (r(e, t),
            (e.uniforms.uKeeperWet = h),
            (e.uniforms.uKeeperImmersion = g),
            (e.vertexShader =
              `varying vec3 vKeeperWaterWorld;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <worldpos_vertex>`,
              `#include <worldpos_vertex>
vKeeperWaterWorld=(modelMatrix*vec4(transformed,1.)).xyz;`,
            )),
            (e.fragmentShader =
              `uniform float uKeeperWet,uKeeperImmersion;varying vec3 vKeeperWaterWorld;
          float keeperWet(){return max(uKeeperWet,uKeeperImmersion*(1.-smoothstep(${q - 0.006},${q + 0.025},vKeeperWaterWorld.y)));}
        ` + e.fragmentShader),
            n &&
              ((e.fragmentShader = e.fragmentShader.replace(
                `#include <map_fragment>`,
                `#include <map_fragment>
diffuseColor.rgb*=mix(1.,.60,keeperWet());`,
              )),
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <roughnessmap_fragment>`,
                `#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,max(.44,roughnessFactor*.70),keeperWet());`,
              ))),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <opaque_fragment>`,
              `
          float keeperDepth=max(0.,${q}-vKeeperWaterWorld.y);
          float keeperHaze=(1.-exp(-keeperDepth*1.8))*uKeeperImmersion;
          outgoingLight=mix(outgoingLight,outgoingLight*vec3(.68,.88,.82),keeperHaze);
          outgoingLight=mix(outgoingLight,vec3(.035,.052,.043),keeperHaze*.58);
          #include <opaque_fragment>`,
            )));
        }),
        (e.material.customProgramCacheKey = () =>
          i + `-immersed-keeper-v2-` + n));
    }
    ((e.castShadow = ![
      `ResidentGroom`,
      `ResidentScalp`,
      `ResidentCornea`,
      `ResidentTearline`,
    ].includes(e.name)),
      (e.receiveShadow = !0),
      (e.material.envMapIntensity = 0.75),
      (e.boundingSphere = t.scene.userData.resident
        ? new Pr(new U(0, 1, 0), 1.8)
        : new Pr(new U(0, 0.9, 0), 1.2)),
      (e.boundingBox = t.scene.userData.resident
        ? new ir(new U(-1.1, -0.1, -1.2), new U(1.1, 2.1, 1.2))
        : new ir(new U(-0.76, -0.08, -0.7), new U(0.65, 1.92, 1.04))),
      (e.frustumCulled = !0));
  });
  let _ = {},
    v = [];
  t.scene.traverse((e) => {
    e.isBone && v.push(e);
  });
  let y = v.map((e) => ({
      position: e.position.clone(),
      rotation: e.quaternion.clone(),
    })),
    b = mapSkeleton(t.scene, i, t.animations),
    x = buildKeeperRig(t.scene, i, t.animations),
    S = r ? Dx(i, r, { reducedMotion: n, period: c.getClip().duration }) : null;
  b.clear();
  let C = !1,
    w = !1,
    T = 0;
  function E(e, t = null, { grounded: r = !1 } = {}) {
    if (!m) return;
    (S?.restore(),
      t
        ? Object.assign(_, { pivot: null, stride: 1 }, t, {
            state: t.swim
              ? t.swim.phase === `surface`
                ? t.swim.effort > 0.15
                  ? `Swimming`
                  : `Floating`
                : `At the swim ladder`
              : t.seated
                ? `At the helm`
                : t.pivot
                  ? `Turning`
                  : t.walk > 0.08
                    ? `Walking`
                    : `On foot`,
          })
        : lx(e, { reducedMotion: n, mode: p }, _),
      i.position.set(_.x, _.y, _.z),
      i.rotation.set(t?.pitch ?? 0, _.heading, t?.roll ?? 0, `YXZ`));
    let o = !!t?.seated,
      u = !!t?.swim;
    if (((g.value = +!!u), w && !u && x.clear(), u)) {
      let n =
        t.swim.phase === `entering`
          ? It.smoothstep(t.swim.progress, 0.76, 1)
          : 1;
      ((h.value = Math.max(h.value, n)), (T = e));
    } else h.value = Math.min(h.value, Math.max(0, 1 - (e - T) / 55));
    if (((i.userData.aboveWater = !u), u)) (b.clear(), x.update(t), S?.reset());
    else if (o) b.update(t.grip);
    else {
      if (C || w) {
        a.stopAllAction();
        for (let e = 0; e < v.length; e++)
          (v[e].position.copy(y[e].position),
            v[e].quaternion.copy(y[e].rotation));
        (s.play(), c.play(), b.clear());
      }
      let i = _.pivot?.stage === `turn` ? _.pivot : null,
        o = i ? l.get(qb(i.angle)) : null,
        u = i ? Kb(i.angle) : 0,
        d = o
          ? Ub((i.progress * u) / 0.1) *
            Ub(((1 - i.progress) * u) / 0.1) *
            (i.fade ?? 1)
          : 0;
      for (let e of l.values()) e.setEffectiveWeight(e === o ? d : 0);
      (o &&
        (o.play(),
        (o.paused = !1),
        (o.enabled = !0),
        (o.time = Math.min(
          o.getClip().duration - 1e-7,
          i.progress * o.getClip().duration,
        ))),
        s.setEffectiveWeight(o ? 1 - d : 1 - _.walk),
        c.setEffectiveWeight(o ? 0 : _.walk),
        (s.time = (n ? 0 : e) % s.getClip().duration),
        (c.time = _.gait % c.getClip().duration),
        a.update(0),
        r ? S?.update(e, _, { lockFeet: !!t || p !== `walk` }) : S?.reset());
    }
    (o && S?.reset(), (C = o), (w = u));
  }
  return (
    E(0),
    S?.calibrate(),
    {
      root: i,
      update: E,
      counts: { triangles: u, bones: d, meshes: f },
      get state() {
        return m ? _.state : `Hidden`;
      },
      get enabled() {
        return m;
      },
      setEnabled(e) {
        ((m = !!e), (i.visible = m));
      },
      setMode(e) {
        [`routine`, `idle`, `walk`].includes(e) && (p = e);
      },
    }
  );
}
