// assets__index-BogB70q- 26 — math
// Lines 50464-50814 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Qg(e) {
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
      n = new to(Yg(t.teeth, t.pitch).outline.map((e) => new V(...e))),
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
