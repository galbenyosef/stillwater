// assets__index-BogB70q- 13 — extras
// Lines 34093-34238 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Pm(e) {
  return (
    e.DefaultMaterial === void 0 &&
      (e.DefaultMaterial = new rs({
        color: 16777215,
        emissive: 0,
        metalness: 1,
        roughness: 1,
        transparent: !1,
        depthTest: !0,
        side: 0,
      })),
    e.DefaultMaterial
  );
}
function Fm(e, t, n) {
  for (let r in n.extensions)
    e[r] === void 0 &&
      ((t.userData.gltfExtensions = t.userData.gltfExtensions || {}),
      (t.userData.gltfExtensions[r] = n.extensions[r]));
}
function Im(e, t) {
  t.extras !== void 0 &&
    (typeof t.extras == `object`
      ? Object.assign(e.userData, t.extras)
      : console.warn(
          `THREE.GLTFLoader: Ignoring primitive type .extras, ` + t.extras,
        ));
}
function Lm(e, t, n) {
  let r = !1,
    i = !1,
    a = !1;
  for (let e = 0, n = t.length; e < n; e++) {
    let n = t[e];
    if (
      (n.POSITION !== void 0 && (r = !0),
      n.NORMAL !== void 0 && (i = !0),
      n.COLOR_0 !== void 0 && (a = !0),
      r && i && a)
    )
      break;
  }
  if (!r && !i && !a) return Promise.resolve(e);
  let o = [],
    s = [],
    c = [];
  for (let l = 0, u = t.length; l < u; l++) {
    let u = t[l];
    if (r) {
      let t =
        u.POSITION === void 0
          ? e.attributes.position
          : n.getDependency(`accessor`, u.POSITION);
      o.push(t);
    }
    if (i) {
      let t =
        u.NORMAL === void 0
          ? e.attributes.normal
          : n.getDependency(`accessor`, u.NORMAL);
      s.push(t);
    }
    if (a) {
      let t =
        u.COLOR_0 === void 0
          ? e.attributes.color
          : n.getDependency(`accessor`, u.COLOR_0);
      c.push(t);
    }
  }
  return Promise.all([Promise.all(o), Promise.all(s), Promise.all(c)]).then(
    function (t) {
      let n = t[0],
        o = t[1],
        s = t[2];
      return (
        r && (e.morphAttributes.position = n),
        i && (e.morphAttributes.normal = o),
        a && (e.morphAttributes.color = s),
        (e.morphTargetsRelative = !0),
        e
      );
    },
  );
}
function Rm(e, t) {
  if ((e.updateMorphTargets(), t.weights !== void 0))
    for (let n = 0, r = t.weights.length; n < r; n++)
      e.morphTargetInfluences[n] = t.weights[n];
  if (t.extras && Array.isArray(t.extras.targetNames)) {
    let n = t.extras.targetNames;
    if (e.morphTargetInfluences.length === n.length) {
      e.morphTargetDictionary = {};
      for (let t = 0, r = n.length; t < r; t++)
        e.morphTargetDictionary[n[t]] = t;
    } else
      console.warn(
        `THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`,
      );
  }
}
function zm(e) {
  let t,
    n = e.extensions && e.extensions[Xp.KHR_DRACO_MESH_COMPRESSION];
  if (
    ((t = n
      ? `draco:` + n.bufferView + `:` + n.indices + `:` + Bm(n.attributes)
      : e.indices + `:` + Bm(e.attributes) + `:` + e.mode),
    e.targets !== void 0)
  )
    for (let n = 0, r = e.targets.length; n < r; n++)
      t += `:` + Bm(e.targets[n]);
  return t;
}
function Bm(e) {
  let t = ``,
    n = Object.keys(e).sort();
  for (let r = 0, i = n.length; r < i; r++) t += n[r] + `:` + e[n[r]] + `;`;
  return t;
}
function Vm(e) {
  switch (e) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw Error(
        `THREE.GLTFLoader: Unsupported normalized accessor component type.`,
      );
  }
}
function Hm(e) {
  return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0
    ? `image/jpeg`
    : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0
      ? `image/webp`
      : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0
        ? `image/ktx2`
        : `image/png`;
}
