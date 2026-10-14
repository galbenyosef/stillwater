// waterwheel-build-01.js — the waterwheel build (gear config, rim geometry, materials) and the mill machinery it drives
// Lines 50357-50814 of readable/assets__index-BogB70q-.pretty.js (cluster waterwheel-build, statement-aligned).
var Ug = [-3, 0.58, -4.2],
  Wg = {
    input: { x: 3.01, y: 1.3, z: 0, teeth: 80, pitch: 0.6 },
    offset: { x: 3.01, y: 1.3, z: -1.05, teeth: 60, pitch: 0.45 },
    crown: { x: 0.7, y: 1.3, z: -1.05, teeth: 24, pitch: 0.2 },
    lantern: { x: 0.52, y: 1.5, z: -1.05, teeth: 6, pitch: 0.05 },
    stone: { x: 0.52, z: -1.05, radius: 0.54 },
  },
  Gg = { min: [-1.65, 0.4, 1.24], max: [1.3, 2.38, 1.38] },
  Kg = [{ min: [3.14, 1.09, -0.21], max: [3.74, 1.51, 0.21] }],
  qg = 2 * Math.PI,
  Jg = (20 * Math.PI) / 180;
function buildWheelRim(e, t, n = 0.002) {
  let r = (2 * t) / e,
    i = t * Math.cos(Jg),
    a = t - 1.25 * r,
    o = t + r,
    s = (e) => {
      let t = Math.sqrt(Math.max(0, (e * e) / (i * i) - 1));
      return t - Math.atan(t);
    },
    c = (r) => Math.PI / (2 * e) - n / (2 * t) + s(t) - s(r),
    l = [];
  for (let t = 0; t < e; t++) {
    let n = (t * qg) / e,
      r = [];
    for (let e = 0; e <= 5; e++) {
      let t = a + ((o - a) * e) / 5,
        i = n - c(t);
      r.push([t * Math.cos(i), t * Math.sin(i)]);
    }
    for (let e = 1; e <= 3; e++) {
      let t = n - c(o) + (c(o) * 2 * e) / 3;
      r.push([o * Math.cos(t), o * Math.sin(t)]);
    }
    for (let e = 4; e >= 0; e--) {
      let t = a + ((o - a) * e) / 5,
        i = n + c(t);
      r.push([t * Math.cos(i), t * Math.sin(i)]);
    }
    l.push(r);
  }
  return { teeth: l, root: a, outer: o, outline: l.flat() };
}
function Xg(e) {
  let t = {};
  if (
    (e.millinterior.traverse((e) => {
      if (!e.isMesh) return;
      let n = e.material.name;
      (n === `Mill interior | Oak • weathered` && (t.wood = e.material),
        n === `Mill interior | Forged iron` && (t.iron = e.material),
        n === `Mill interior | Limestone` && (t.stone = e.material));
    }),
    !Object.keys(t).length)
  )
    return null;
  for (let e of [`wood`, `iron`, `stone`]) {
    let n = t[e];
    if (!n) throw Error(`Missing mill machinery material: ` + e);
    let r = n.clone();
    ((r.onBeforeCompile = n.onBeforeCompile),
      (r.customProgramCacheKey = n.customProgramCacheKey),
      (r.aoMap = null),
      (t[e] = r));
  }
  return buildMillMachinery(t);
}
function Zg(e) {
  for (let t of [e.millinterior, e.mill])
    t.traverse((e) => {
      if (!e.isMesh) return;
      let t = e.material.name,
        n =
          t === `Mill interior | Room lime plaster`
            ? [Gg, ...Kg]
            : t === `Limestone` || t === `Old lime plaster`
              ? Kg
              : null;
      if (!n) return;
      let r = e.geometry,
        i = r.attributes.position,
        a = r.index,
        o = Object.fromEntries(Object.keys(r.attributes).map((e) => [e, []]));
      for (let e = 0; e < (a?.count ?? i.count); e += 3) {
        let t = [0, 1, 2].map((t) => {
          let n = a ? a.getX(e + t) : e + t,
            i = {};
          for (let [e, t] of Object.entries(r.attributes))
            i[e === `position` ? `p` : e] = Array.from(
              { length: t.itemSize },
              (e, r) => t.array[n * t.itemSize + r],
            );
          return i;
        });
        for (let e of wg(t, n))
          for (let t = 1; t < e.length - 1; t++)
            for (let n of [e[0], e[t], e[t + 1]])
              for (let e of Object.keys(o))
                o[e].push(...n[e === `position` ? `p` : e]);
      }
      let s = new Hr();
      for (let [e, t] of Object.entries(r.attributes))
        s.setAttribute(e, new Ar(o[e], t.itemSize));
      (s.computeBoundingBox(), s.computeBoundingSphere(), (e.geometry = s));
    });
}
function buildMillMachinery(e) {
  let t = new Pn();
  ((t.name = `Waterwheel-driven mill machinery`),
    t.position.fromArray(Ug),
    (t.userData.aboveWater = !0));
  let n = { input: new Pn(), offset: new Pn(), runner: new Pn() };
  for (let [e, r] of Object.entries(n)) {
    r.name = e + ` rotor`;
    let n = Wg[e === `runner` ? `lantern` : e];
    (r.position.set(n.x, n.y, n.z), t.add(r));
  }
  let r = [];
  function i(e) {
    let t = e.attributes.position,
      n = new Float32Array(t.count * 3);
    for (let e = 0; e < t.count; e++)
      ((n[e * 3] = 0.73), (n[e * 3 + 1] = 0.72), (n[e * 3 + 2] = 0.69));
    return (
      e.setAttribute(`color`, new Dr(n, 3)),
      e.attributes.uv && e.setAttribute(`uv1`, e.attributes.uv.clone()),
      e
    );
  }
  function a(a, o, s, c = `wood`, l = null, u = null) {
    let d = l ? n[l] : t,
      f = new vi(i(o), e[c]);
    return (
      (f.name = a),
      f.position.set(...s),
      l && f.position.sub(d.position),
      (f.castShadow = f.receiveShadow = !0),
      (f.userData.aboveWater = !0),
      u && (f.userData.envelope = u),
      d.add(f),
      r.push(f),
      f
    );
  }
  function o(e, t, n, r = `wood`) {
    return a(e, new ba(...n), t, r);
  }
  function s(e, t, n, r, i = `y`, o = `iron`, s = null, c = null) {
    let l = new Sa(n, n, r, 48);
    return (i === `x` && l.rotateZ(-Math.PI / 2), a(e, l, t, o, s, c));
  }
  function c(e, t, n, r, i, o = `y`, s = `iron`, c = null, l = null) {
    let u = new Uo(
      [
        [n, -i / 2],
        [r, -i / 2],
        [r, i / 2],
        [n, i / 2],
        [n, -i / 2],
      ].map((e) => new V(...e)),
      64,
    );
    return (o === `x` && u.rotateZ(-Math.PI / 2), a(e, u, t, s, c, l));
  }
  function l(e) {
    let t = Wg[e],
      n = new to(buildWheelRim(t.teeth, t.pitch).outline.map((e) => new V(...e))),
      r = new eo();
    (r.absarc(0, 0, t.pitch - 0.11, 0, Math.PI * 2, !0), n.holes.push(r));
    let i = new Bo(n, { depth: 0.08, bevelEnabled: !1, curveSegments: 48 });
    (i.translate(0, 0, -0.04),
      i.applyMatrix4(
        new W().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1),
      ),
      a(
        e + ` involute oak gear`,
        i,
        [t.x, t.y, t.z],
        `wood`,
        e,
        e === `input` ? `Input gear teeth` : `Offset gear teeth`,
      ));
    let o = e === `input` ? 0.205 : 0.13,
      s = e === `input` ? 0.181 : 0.061;
    c(
      e + ` iron hub`,
      [t.x, t.y, t.z],
      s,
      o,
      0.115,
      `x`,
      `iron`,
      e,
      e === `input` ? `Input hub` : `Offset hub`,
    );
    for (let n = 0; n < 8; n++) {
      let r = (n * Math.PI) / 4,
        i = o - 0.008,
        s = t.pitch - 0.08 - i,
        c = new ba(0.08, s, 0.065),
        l = a(
          e + ` oak spoke ` + n,
          c,
          [
            t.x,
            t.y + Math.cos(r) * (i + s / 2),
            t.z + Math.sin(r) * (i + s / 2),
          ],
          `wood`,
          e,
          e === `input` ? `Input gear teeth` : `Offset gear teeth`,
        );
      l.rotation.x = r;
    }
  }
  (l(`input`),
    l(`offset`),
    s(
      `Waterwheel axle continuation`,
      [3.1475, 1.3, 0],
      0.18,
      0.275,
      `x`,
      `iron`,
      `input`,
      `Axle extension`,
    ),
    s(
      `Offset drive shaft`,
      [1.91, 1.3, -1.05],
      0.06,
      2.52,
      `x`,
      `iron`,
      `offset`,
      `Offset shaft`,
    ),
    c(`Input flanged bearing`, [3.125, 1.3, 0], 0.182, 0.23, 0.09, `x`),
    c(`Offset flanged bearing`, [3.125, 1.3, -1.05], 0.061, 0.125, 0.09, `x`),
    c(`Pedestal bearing`, [0.94, 1.3, -1.05], 0.061, 0.12, 0.12, `x`),
    o(`Bearing pedestal`, [0.94, 0.785, -1.05], [0.13, 0.79, 0.25]),
    o(`Bearing foot`, [0.94, 0.425, -1.05], [0.25, 0.07, 0.38]));
  for (let e of [-0.245, 0.245])
    o(
      `Input bearing mounting ear`,
      [3.125, 1.3, e],
      [0.09, 0.12, 0.05],
      `iron`,
    );
  (c(
    `Crown wheel rim`,
    [0.7, 1.3, -1.05],
    0.145,
    0.23,
    0.08,
    `x`,
    `wood`,
    `offset`,
    `Crown wheel`,
  ),
    c(
      `Crown hub`,
      [0.7, 1.3, -1.05],
      0.061,
      0.105,
      0.08,
      `x`,
      `iron`,
      `offset`,
      `Crown wheel`,
    ));
  for (let e = 0; e < 6; e++) {
    let t = (e * Math.PI) / 3,
      n = a(
        `Crown spoke ` + e,
        new ba(0.08, 0.1, 0.045),
        [0.7, 1.3 + 0.145 * Math.cos(t), -1.05 + 0.145 * Math.sin(t)],
        `wood`,
        `offset`,
        `Crown wheel`,
      );
    n.rotation.x = t;
  }
  for (let e = 0; e < 24; e++) {
    let t = (e * Math.PI * 2) / 24;
    s(
      `Face cog ` + e,
      [0.61, 1.3 + 0.2 * Math.cos(t), -1.05 + 0.2 * Math.sin(t)],
      0.009,
      0.11,
      `x`,
      `wood`,
      `offset`,
      `Crown face teeth`,
    );
  }
  for (let e of [1.39, 1.61])
    c(
      `Lantern end cheek`,
      [0.52, e, -1.05],
      0.026,
      0.065,
      0.02,
      `y`,
      `iron`,
      `runner`,
      `Lantern cage`,
    );
  for (let e = 0; e < 6; e++) {
    let t = (e * Math.PI) / 3 + Math.PI / 6;
    s(
      `Lantern stave ` + e,
      [0.52 + 0.05 * Math.cos(t), 1.5, -1.05 + 0.05 * Math.sin(t)],
      0.009,
      0.2,
      `y`,
      `iron`,
      `runner`,
      `Lantern cage`,
    );
  }
  s(
    `Stone spindle`,
    [0.52, 1.7575, -1.05],
    0.025,
    0.785,
    `y`,
    `iron`,
    `runner`,
    `Stone spindle`,
  );
  let u = new to(
      [
        [-0.64, -0.64],
        [0.64, -0.64],
        [0.64, 0.64],
        [-0.64, 0.64],
      ].map((e) => new V(...e)),
    ),
    d = new eo();
  (d.absarc(0, 0, 0.09, 0, Math.PI * 2, !0), u.holes.push(d));
  let f = new Bo(u, { depth: 0.09, bevelEnabled: !1 });
  (f.rotateX(-Math.PI / 2), a(`Bored millstone base`, f, [0.52, 1.56, -1.05]));
  for (let e of [0, 1.04])
    for (let t of [-1.57, -0.53])
      o(`Stone frame leg`, [e, 0.975, t], [0.1, 1.17, 0.1]);
  for (let e of [-1.6, -0.5])
    o(`Stone frame brace`, [0.52, 0.67, e], [1.14, 0.09, 0.09]);
  (c(`Fixed bedstone`, [0.52, 1.725, -1.05], 0.065, 0.54, 0.15, `y`, `stone`),
    c(
      `Runner stone`,
      [0.52, 1.885, -1.05],
      0.065,
      0.54,
      0.168,
      `y`,
      `stone`,
      `runner`,
      `Runner stone`,
    ),
    c(
      `Stone-spindle bearing in bored base`,
      [0.52, 1.6375, -1.05],
      0.026,
      0.078,
      0.025,
      `y`,
      `iron`,
    ),
    c(
      `Runner iron band`,
      [0.52, 1.885, -1.05],
      0.54,
      0.546,
      0.1,
      `y`,
      `iron`,
      `runner`,
      `Runner stone`,
    ),
    c(
      `Runner drive boss`,
      [0.52, 1.88, -1.05],
      0.025,
      0.061,
      0.08,
      `y`,
      `iron`,
      `runner`,
      `Runner stone`,
    ));
  for (let e of [-0.07, 1.11])
    for (let t of [-1.3, -0.8])
      o(`Hopper horse upright`, [e, 1.9875, t], [0.04, 0.675, 0.04]);
  for (let e of [-1.3, -0.8])
    o(`Hopper horse crossbar`, [0.52, 2.32, e], [1.22, 0.05, 0.04]);
  let p = [],
    m = [];
  for (let e = 0; e < 4; e++) {
    let t = (e * Math.PI) / 2,
      n = [
        [-0.27, 2.345, -0.27],
        [0.27, 2.345, -0.27],
        [0.075, 2.045, -0.075],
        [-0.075, 2.045, -0.075],
      ].map(([e, n, r]) => [
        0.52 + e * Math.cos(t) - r * Math.sin(t),
        n,
        -1.05 + e * Math.sin(t) + r * Math.cos(t),
      ]),
      r = p.length / 3;
    (n.forEach((e) => p.push(...e)), m.push(r, r + 1, r + 2, r, r + 2, r + 3));
  }
  let h = new Hr();
  (h.setAttribute(`position`, new Ar(p, 3)),
    h.setIndex(m),
    h.setAttribute(
      `uv`,
      new Ar(
        Array.from({ length: 16 }, (e, t) => [t % 2, (t >> 1) % 2]).flat(),
        2,
      ),
    ),
    h.computeVertexNormals(),
    a(`Small open grain hopper`, h, [0, 0, 0]));
  for (let e of [-1.335, -0.765])
    o(`Hopper upper rim`, [0.52, 2.3575, e], [0.59, 0.025, 0.025]);
  for (let e of [0.235, 0.805])
    o(`Hopper upper rim`, [e, 2.3575, -1.05], [0.025, 0.025, 0.59]);
  (c(
    `Open grain throat`,
    [0.52, 2.025, -1.05],
    0.059,
    0.074,
    0.04,
    `y`,
    `wood`,
  ),
    o(`New machinery bay floor`, [-0.165, 0.33, -0.5], [3.25, 0.12, 3.8]));
  for (let e of [-1.65, 1.3])
    o(`Guard upright`, [e, 0.835, 0.81], [0.1, 0.89, 0.08]);
  (o(`Guard upper rail`, [-0.175, 1.24, 0.81], [3.05, 0.08, 0.08]),
    o(`Guard lower rail`, [-0.175, 0.68, 0.81], [3.05, 0.055, 0.055]));
  for (let e = 1; e < 11; e++)
    o(
      `Guard spindle`,
      [-1.65 + (e * 2.95) / 11, 0.935, 0.81],
      [0.028, 0.555, 0.028],
      `iron`,
    );
  function g(e) {
    n.input.rotation.x = e;
    let t = (-e * 80) / 60 + Math.PI / 60;
    ((n.offset.rotation.x = t), (n.runner.rotation.y = -t * 4));
  }
  return (g(0), { root: t, groups: n, all: r, update: g });
}
