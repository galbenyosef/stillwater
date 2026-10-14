// keeper-model-03.js — the keeper model: GLTF load, resident-motion json, bone rebinding and skinning helpers
// Lines 59541-59707 of readable/assets__index-BogB70q-.pretty.js (cluster keeper-model, statement-aligned).
function cloneSkinnedGeometry(e, t) {
  if (!e?.isSkinnedMesh) return;
  let n = e.geometry,
    r = n.clone(),
    { position: i, skinIndex: a, skinWeight: o } = r.attributes,
    s = i.count,
    c = [],
    l = new Map(),
    u = [],
    d = [`l`, `r`].map((n) => {
      let r = e.skeleton.bones.findIndex((e) => e.name === `lowerarm_${n}`),
        i = e.skeleton.bones.findIndex((e) => e.name === `hand_${n}`),
        a = e.skeleton.bones.findIndex((e) => e.name === `upperarm_${n}`),
        o = t.worldToLocal(e.skeleton.bones[i].getWorldPosition(new U())),
        s = t.worldToLocal(e.skeleton.bones[r].getWorldPosition(new U()));
      return {
        lower: r,
        hand: i,
        upper: a,
        wrist: o,
        elbow: s,
        axis: o.clone().sub(s).normalize(),
      };
    }),
    f = e.skeleton.bones.map((t, n) =>
      new W().multiplyMatrices(t.matrixWorld, e.skeleton.boneInverses[n]),
    ),
    p = (t, n) => {
      let r = new W();
      r.elements.fill(0);
      for (let e = 0; e < 4; e++)
        for (let i = 0; i < 16; i++)
          r.elements[i] += f[t[e]].elements[i] * n[e];
      return r.premultiply(e.bindMatrixInverse).multiply(e.bindMatrix);
    },
    m = [];
  for (let n = 0; n < s; n++) {
    let r = Array.from({ length: 4 }, (e, t) => a.getComponent(n, t)),
      s = Array.from({ length: 4 }, (e, t) => o.getComponent(n, t)),
      f = p(r, s);
    m.push(f);
    let h = new U().fromBufferAttribute(i, n).applyMatrix4(f),
      g = h
        .toArray()
        .map((e) => Math.round(e * 1e5))
        .join(`,`),
      _ = l.get(g);
    if (_ === void 0) {
      ((_ = c.length), l.set(g, _));
      let n = t.worldToLocal(h.clone().applyMatrix4(e.matrixWorld)),
        i =
          Ox(0.1, 0.17, Math.abs(n.x)) *
          Ox(1.08, 1.2, n.y) *
          (1 - Ox(1.52, 1.57, n.y)),
        a = null;
      for (let e of d) {
        let t = r.reduce((t, n, r) => t + (n === e.lower ? s[r] : 0), 0),
          i = n.clone().sub(e.wrist),
          o = i.dot(e.axis),
          c = i.addScaledVector(e.axis, -o).length();
        t > 0.9 &&
          o > -0.14 &&
          o < 0.02 &&
          c < 0.07 &&
          (a = { ...e, weight: Ox(-0.14, -0.025, o) });
      }
      c.push({ ids: [], weights: new Map(), mask: i, cuff: a, height: n.y });
    }
    u.push(_);
    let v = c[_];
    v.ids.push(n);
    for (let e = 0; e < 4; e++)
      s[e] > 0 && v.weights.set(r[e], (v.weights.get(r[e]) ?? 0) + s[e]);
  }
  let h = e.skeleton.bones.findIndex((e) => e.name === `spine_03`);
  for (let t of c) {
    let n = new Map();
    for (let [r, i] of t.weights) {
      let a = /^(pelvis|spine_0[123])$/.test(e.skeleton.bones[r].name) ? h : r;
      n.set(a, (n.get(a) ?? 0) + i / t.ids.length);
    }
    t.weights = n;
  }
  let g = c.map(() => new Set());
  for (let e = 0; e < r.index.count; e += 3) {
    let t = [0, 1, 2].map((t) => u[r.index.getX(e + t)]);
    for (let e = 0; e < 3; e++) {
      let n = t[e],
        r = t[(e + 1) % 3];
      n !== r && (g[n].add(r), g[r].add(n));
    }
  }
  for (let e = 0; e < 48; e++) {
    let e = c.map((e, t) => {
      if (!e.mask || !g[t].size) return e.weights;
      let n = e.mask * 0.5,
        r = new Map([...e.weights].map(([e, t]) => [e, t * (1 - n)]));
      for (let e of g[t])
        for (let [i, a] of c[e].weights)
          r.set(i, (r.get(i) ?? 0) + (a * n) / g[t].size);
      return r;
    });
    c.forEach((t, n) => (t.weights = e[n]));
  }
  for (let e of c) {
    if (!e.mask && !e.cuff) continue;
    if (e.cuff) {
      let { lower: t, hand: n, weight: r } = e.cuff;
      e.weights = new Map([
        [t, 1 - r],
        [n, r],
      ]);
    } else
      for (let { lower: t, upper: n, elbow: r } of d) {
        let i =
          (e.weights.get(t) ?? 0) * Ox(r.y + 0.015, r.y + 0.085, e.height);
        i &&
          (e.weights.set(t, e.weights.get(t) - i),
          e.weights.set(n, (e.weights.get(n) ?? 0) + i));
      }
    let t = [...e.weights].sort((e, t) => t[1] - e[1]).slice(0, 4),
      n = t.reduce((e, t) => e + t[1], 0),
      s = Array.from({ length: 4 }, (e, n) => t[n]?.[0] ?? 0),
      c = Array.from({ length: 4 }, (e, r) => (t[r]?.[1] ?? 0) / n),
      l = p(s, c).invert();
    for (let t of e.ids) {
      let e = new W().multiplyMatrices(l, m[t]),
        n = new U().fromBufferAttribute(i, t).applyMatrix4(e);
      i.setXYZ(t, n.x, n.y, n.z);
      for (let i of [`normal`, `tangent`]) {
        let a = r.attributes[i];
        a &&
          (n.fromBufferAttribute(a, t).transformDirection(e),
          a.setXYZ(t, n.x, n.y, n.z));
      }
      for (let [i, a] of Object.entries(r.morphAttributes))
        for (let o of a) {
          if (
            (n.fromBufferAttribute(o, t),
            i === `position` && !r.morphTargetsRelative)
          )
            n.applyMatrix4(e);
          else {
            let t = e.elements,
              r = n.x,
              i = n.y,
              a = n.z;
            n.set(
              t[0] * r + t[4] * i + t[8] * a,
              t[1] * r + t[5] * i + t[9] * a,
              t[2] * r + t[6] * i + t[10] * a,
            );
          }
          o.setXYZ(t, n.x, n.y, n.z);
        }
      (a.setXYZW(t, ...s), o.setXYZW(t, ...c));
    }
  }
  return {
    apply() {
      e.geometry = r;
    },
    clear() {
      e.geometry = n;
    },
  };
}
