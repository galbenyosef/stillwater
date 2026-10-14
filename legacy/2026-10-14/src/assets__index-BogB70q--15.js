// assets__index-BogB70q- 15 — math
// Lines 35241-35327 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Gm(e, t, n) {
  let r = t.attributes,
    i = new ir();
  if (r.POSITION !== void 0) {
    let e = n.json.accessors[r.POSITION],
      t = e.min,
      a = e.max;
    if (t !== void 0 && a !== void 0) {
      if (
        (i.set(new U(t[0], t[1], t[2]), new U(a[0], a[1], a[2])), e.normalized)
      ) {
        let t = Vm(Em[e.componentType]);
        (i.min.multiplyScalar(t), i.max.multiplyScalar(t));
      }
    } else {
      console.warn(
        `THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`,
      );
      return;
    }
  } else return;
  let a = t.targets;
  if (a !== void 0) {
    let e = new U(),
      t = new U();
    for (let r = 0, i = a.length; r < i; r++) {
      let i = a[r];
      if (i.POSITION !== void 0) {
        let r = n.json.accessors[i.POSITION],
          a = r.min,
          o = r.max;
        if (a !== void 0 && o !== void 0) {
          if (
            (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))),
            t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))),
            t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))),
            r.normalized)
          ) {
            let e = Vm(Em[r.componentType]);
            t.multiplyScalar(e);
          }
          e.max(t);
        } else
          console.warn(
            `THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`,
          );
      }
    }
    i.expandByVector(e);
  }
  e.boundingBox = i;
  let o = new Pr();
  (i.getCenter(o.center),
    (o.radius = i.min.distanceTo(i.max) / 2),
    (e.boundingSphere = o));
}
function Km(e, t, n) {
  let r = t.attributes,
    i = [];
  function a(t, r) {
    return n.getDependency(`accessor`, t).then(function (t) {
      e.setAttribute(r, t);
    });
  }
  for (let t in r) {
    let n = Am[t] || t.toLowerCase();
    n in e.attributes || i.push(a(r[t], n));
  }
  if (t.indices !== void 0 && !e.index) {
    let r = n.getDependency(`accessor`, t.indices).then(function (t) {
      e.setIndex(t);
    });
    i.push(r);
  }
  return (
    Wt.workingColorSpace !== `srgb-linear` &&
      `COLOR_0` in r &&
      console.warn(
        `THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Wt.workingColorSpace}" not supported.`,
      ),
    Im(e, t),
    Gm(e, t, n),
    Promise.all(i).then(function () {
      return t.targets === void 0 ? e : Lm(e, t.targets, n);
    })
  );
}
