// assets__index-BogB70q- 52 — getworldposition
// Lines 58732-59063 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function ux(e, t, n) {
  let r = [],
    i = [];
  e.traverse((e) => {
    (e.isBone && r.push(e),
      e.morphTargetDictionary?.HelmNeutral !== void 0 && i.push(e));
  });
  let a = (t) => e.getObjectByName(t),
    o = new Pc(e),
    s = new H().setFromAxisAngle(new U(0, 1, 0), Math.PI),
    c = [`Neutral`, `Left`, `Right`].map((i, c) => {
      let l = As.findByName(n, `KeeperHelm` + i);
      if (!l) throw Error(`Keeper animation missing: KeeperHelm${i}`);
      (o.clipAction(l).play(), o.update(0), t.updateMatrixWorld(!0));
      let u = {
          joints: r.map((e) => ({
            position: e.position.clone(),
            rotation: e.quaternion.clone(),
          })),
        },
        d = [0, -xb.maxAngle, xb.maxAngle][c],
        f = new H().setFromAxisAngle(new U().copy(xb.axis), d).invert();
      if (
        ((u.gripOffset = a(`hand_r`)
          .getWorldPosition(new U())
          .applyQuaternion(s)
          .add(yb)
          .sub(wb(d))
          .applyQuaternion(f)),
        (u.gripRotation = f
          .clone()
          .multiply(s)
          .multiply(a(`hand_r`).getWorldQuaternion(new H()))),
        c === 0 &&
          ((u.support = [`hand_l`, `foot_l`, `foot_r`].map((e) => ({
            position: a(e).getWorldPosition(new U()),
            rotation: a(e).getWorldQuaternion(new H()),
          }))),
          (u.lap = a(`thigh_l`).worldToLocal(
            a(`hand_l`).getWorldPosition(new U()),
          )),
          e.userData.resident))
      ) {
        let e = a(`thigh_l`).getWorldPosition(new U()),
          n = a(`calf_l`).getWorldPosition(new U());
        u.lap = a(`thigh_l`).worldToLocal(
          e
            .lerp(n, 0.55)
            .add(
              new U(0, 0.18, 0).applyQuaternion(t.getWorldQuaternion(new H())),
            ),
        );
        let r = a(`hand_l`).getWorldPosition(new U()),
          i = a(`middle_01_l`).getWorldPosition(new U()).sub(r).normalize(),
          o = a(`index_01_l`)
            .getWorldPosition(new U())
            .sub(a(`pinky_01_l`).getWorldPosition(new U()));
        (o.addScaledVector(i, -o.dot(i)).normalize(),
          (u.handFrame = new H()
            .setFromRotationMatrix(new W().makeBasis(o, i, o.clone().cross(i)))
            .invert()
            .multiply(a(`hand_l`).getWorldQuaternion(new H()))));
      }
      return (o.stopAllAction(), u);
    });
  o.uncacheRoot(e);
  let l = new U(),
    u = new U(),
    d = new U(),
    f = new H(),
    p = new H(),
    m = new H();
  function h(e, t, n) {
    (e.getWorldPosition(l),
      t.getWorldPosition(u),
      f.setFromUnitVectors(u.sub(l).normalize(), d.copy(n).sub(l).normalize()),
      e.getWorldQuaternion(m),
      e.parent.getWorldQuaternion(p),
      e.quaternion.copy(p.invert().multiply(f).multiply(m)),
      e.updateWorldMatrix(!1, !0));
  }
  let g = new U(),
    _ = new U(),
    v = new U(),
    y = new U();
  function b(e, t, n, r, i, a) {
    (e.getWorldPosition(g),
      a ? v.copy(a) : (t.getWorldPosition(v), v.sub(g)),
      _.copy(r).sub(g));
    let o = t.position.length(),
      s = n.position.length(),
      c = Math.max(Math.abs(o - s) + 1e-5, Math.min(_.length(), o + s - 1e-5));
    (_.normalize(), v.addScaledVector(_, -v.dot(_)).normalize());
    let l = (o * o - s * s + c * c) / (2 * c),
      u = Math.sqrt(Math.max(0, o * o - l * l));
    (y.copy(g).addScaledVector(_, l).addScaledVector(v, u),
      h(e, t, y),
      h(t, n, r),
      i &&
        (n.parent.getWorldQuaternion(p),
        n.quaternion.copy(p.invert().multiply(i)),
        n.updateWorldMatrix(!1, !0)));
  }
  let x = [
      [`upperarm_l`, `lowerarm_l`, `hand_l`],
      [`thigh_l`, `calf_l`, `foot_l`],
      [`thigh_r`, `calf_r`, `foot_r`],
    ].map((e) => e.map(a)),
    S = new Set(),
    C = new Set();
  (a(`clavicle_l`).traverse((e) => S.add(e)),
    a(`clavicle_r`).traverse((e) => C.add(e)));
  let w = [`upperarm_r`, `lowerarm_r`, `hand_r`].map(a),
    T = !!e.userData.resident,
    E = a(`thigh_l`),
    D = x[0][2],
    O = new U(),
    k = new U(),
    A = new U(),
    j = new U(),
    M = new U(),
    N = new W(),
    P = new U(),
    F = new H(),
    I = new H();
  return {
    clear() {
      for (let e of i) e.morphTargetInfluences.fill(0);
    },
    update(n) {
      let o = Math.max(-1, Math.min(1, n?.steering ?? 0)),
        s = Math.abs(o),
        u = o >= 0 ? 1 : 2,
        d = c[0],
        f = c[u],
        m = e.userData.resident && o > 0 ? s * 0.5 : s;
      for (let e = 0; e < r.length; e++) {
        let t = T && S.has(r[e]) ? 0 : C.has(r[e]) ? s : m;
        (r[e].position.copy(d.joints[e].position).lerp(f.joints[e].position, t),
          r[e].quaternion
            .copy(d.joints[e].rotation)
            .slerp(f.joints[e].rotation, t));
      }
      for (let e of i) {
        let t = e.morphTargetDictionary,
          n = e.morphTargetInfluences;
        ((n[t.HelmNeutral] = 1 - m),
          (n[t.HelmLeft] = u === 1 ? m : 0),
          (n[t.HelmRight] = u === 2 ? m : 0));
      }
      (t.updateWorldMatrix(!0, !0), t.getWorldQuaternion(I));
      for (let e = 0; e < x.length; e++)
        (T && e === 0) ||
          (P.copy(d.support[e].position).applyMatrix4(t.matrixWorld),
          F.copy(I).multiply(d.support[e].rotation),
          b(...x[e], P, F));
      (T &&
        (M.set(0, 1, 0).applyQuaternion(I),
        P.copy(d.lap).applyMatrix4(E.matrixWorld),
        O.set((o > 0 ? 0.25 : 0.15) * s, -1, 0).applyQuaternion(I),
        b(...x[0], P, null, O),
        a(`calf_l`).getWorldPosition(k),
        E.getWorldPosition(l),
        k.sub(l).normalize().addScaledVector(M, -0.18).normalize(),
        A.crossVectors(M, k).negate().normalize(),
        j.crossVectors(A, k),
        F.setFromRotationMatrix(N.makeBasis(A, k, j)).multiply(d.handFrame),
        D.parent.getWorldQuaternion(p),
        D.quaternion.copy(p.invert().multiply(F)),
        D.updateWorldMatrix(!1, !0)),
        n &&
          (P.copy(d.gripOffset)
            .lerp(f.gripOffset, s)
            .applyQuaternion(n.quaternion)
            .add(n.position),
          F.copy(d.gripRotation)
            .slerp(f.gripRotation, s)
            .premultiply(n.quaternion),
          b(...w, P, F)));
    },
  };
}
var dx = 0.045,
  fx = {
    Hips: `pelvis`,
    Spine: `spine_01`,
    Spine1: `spine_02`,
    Spine2: `spine_03`,
    Neck: `neck_01`,
    Head: `head`,
  };
for (let [e, t] of [
  [`Left`, `l`],
  [`Right`, `r`],
]) {
  for (let [n, r] of Object.entries({
    Shoulder: `clavicle`,
    Arm: `upperarm`,
    ForeArm: `lowerarm`,
    Hand: `hand`,
    UpLeg: `thigh`,
    Leg: `calf`,
    Foot: `foot`,
    ToeBase: `ball`,
  }))
    fx[e + n] = `${r}_${t}`;
  for (let n of [`Thumb`, `Index`, `Middle`, `Ring`, `Pinky`])
    for (let r = 1; r <= 3; r++)
      fx[`${e}Hand${n}${r}`] = `${n.toLowerCase()}_0${r}_${t}`;
}
var px, mx;
async function hx() {
  px ??= new qp()
    .setMeshoptDecoder(qm)
    .loadAsync(`/compact/models/fishing-resident.glb`)
    .then((e) => {
      let t = e.scene.getObjectByName(`ResidentSkin`);
      return (
        (t.material = t.material.clone()),
        (t.material.onBeforeCompile = (e) => {
          e.fragmentShader = e.fragmentShader.replace(
            `#include <lights_fragment_maps>`,
            `#include <lights_fragment_maps>
        vec3 skinLuma=vec3(.2126,.7152,.0722);
        irradiance=mix(irradiance,vec3(dot(irradiance,skinLuma)),.45);
        iblIrradiance=mix(iblIrradiance,vec3(dot(iblIrradiance,skinLuma)),.60);`,
          );
        }),
        (t.material.customProgramCacheKey = () =>
          `keeper-tripo-skin-bounce-v1`),
        e
      );
    });
  let e = await px;
  return { ...e, scene: Gp(e.scene) };
}
async function gx() {
  return (
    (mx ??= fetch(uf(`/compact/models/resident-motion.json`)).then(
      async (e) => {
        if (!e.ok) throw Error(`Could not load the resident motion.`);
        return (await e.json()).clips.map((e) => As.parse(e));
      },
    )),
    mx
  );
}
function _x(e) {
  let t = e.scene,
    n = t.getObjectByName(`ResidentFishingOrientation`),
    r = t.getObjectByName(`FishingKeeper`);
  return (
    t.getObjectByName(`FishingRodRig`)?.removeFromParent(),
    t.getObjectByName(`FishingFloatPivot`)?.removeFromParent(),
    n.quaternion.identity(),
    r.position.set(0, 0, 0),
    (r.name = `ResidentKeeper`),
    t.traverse((e) => {
      if (e.isBone) {
        let t = e.name.replace(/^mixamorig:?/, ``);
        fx[t] && (e.name = fx[t]);
      }
    }),
    (t.userData.resident = !0),
    t.updateMatrixWorld(!0),
    e
  );
}
function vx(e, t, n) {
  let r = e.scene.getObjectByName(`FishingKeeper`),
    i = new Set();
  (r.traverse((e) => i.add(e.name)),
    r.removeFromParent(),
    e.scene.add(_x(t).scene),
    (e.scene.userData.residentRodLift = dx));
  let a = e.animations[0],
    o = n.find((e) => e.name === `ResidentBoatFishing`);
  if (!o) throw Error(`Resident boat fishing motion is missing.`);
  return (
    (e.animations = [
      new As(a.name, a.duration, [
        ...a.tracks
          .filter((e) => !i.has(e.name.slice(0, e.name.lastIndexOf(`.`))))
          .map((e) => {
            if (e.name !== `FishingRodRig.position`) return e;
            let t = e.clone();
            for (let e = 1; e < t.values.length; e += 3) t.values[e] += dx;
            return t;
          }),
        ...o.tracks,
      ]),
    ]),
    e
  );
}
function yx(e, t, n) {
  let r = e.getWorldPosition(new U()),
    i = t.getWorldPosition(new U()).sub(r),
    a = n.clone().sub(r),
    o = new H()
      .setFromUnitVectors(i.normalize(), a.normalize())
      .multiply(e.getWorldQuaternion(new H()));
  (e.quaternion
    .copy(e.parent.getWorldQuaternion(new H()).invert().multiply(o))
    .normalize(),
    e.updateWorldMatrix(!1, !0));
}
function bx(e, t, n, r, i, a) {
  let o = e.getWorldPosition(new U()),
    s = t.getWorldPosition(new U()),
    c = n.getWorldPosition(new U()),
    l = o.distanceTo(s),
    u = s.distanceTo(c),
    d = r.clone().sub(o),
    f = Math.max(Math.abs(l - u) + 1e-6, Math.min(d.length(), l + u - 1e-6));
  d.normalize();
  let p = a.clone().addScaledVector(d, -a.dot(d)).normalize(),
    m = (l * l - u * u + f * f) / (2 * f);
  (yx(
    e,
    t,
    o
      .clone()
      .addScaledVector(d, m)
      .addScaledVector(p, Math.sqrt(Math.max(0, l * l - m * m))),
  ),
    yx(t, n, r),
    n.quaternion
      .copy(n.parent.getWorldQuaternion(new H()).invert().multiply(i))
      .normalize(),
    n.updateWorldMatrix(!1, !0));
}
