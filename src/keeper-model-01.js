// keeper-model-01.js — the keeper model: GLTF load, resident-motion json, bone rebinding and skinning helpers
// Lines 58923-59085 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-model, statement-aligned).
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
    (mx ??= fetch(revisionUrlModifier(`/compact/models/resident-motion.json`)).then(
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
var xx = (e, t, n) => {
    let r = It.clamp((n - e) / (t - e), 0, 1);
    return r * r * (3 - 2 * r);
  },
  Sx = new U(0, 1, 0),
  Cx = new U(1, 0, 0),
  wx = new U(0, 0, 1),
  Tx = rx.ankle,
  Ex = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
    [0, 2],
    [1, 3],
    [4, 6],
    [5, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
