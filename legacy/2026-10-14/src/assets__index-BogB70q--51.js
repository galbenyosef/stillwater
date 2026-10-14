// assets__index-BogB70q- 51 — math
// Lines 58527-58731 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Vb(e) {
  let t = new Un(),
    n = new Bb();
  (n.scale.setScalar(1e4), t.add(n));
  let r = n.material.uniforms;
  (r.sunPosition.value.copy(_f),
    (r.turbidity.value = 4.6),
    (r.rayleigh.value = 2.1),
    (r.mieCoefficient.value = 0.003),
    (r.cloudCoverage.value = 0.36),
    (r.cloudDensity.value = 0.22),
    (r.cloudElevation.value = 0.35),
    (r.showSunDisc.value = 0));
  let i = { type: y, generateMipmaps: !0, minFilter: d },
    a = new Sl(256, i),
    o = new Sl(256, i),
    s = new _c(1, 2e4, a),
    c = e.toneMapping;
  try {
    ((e.toneMapping = 0),
      s.update(e, t),
      (r.cloudCoverage.value = 0.94),
      (r.cloudDensity.value = 0.72),
      (r.turbidity.value = 9.5),
      (r.rayleigh.value = 1.1),
      (r.mieCoefficient.value = 0.008),
      (s.renderTarget = o),
      s.update(e, t));
  } finally {
    ((e.toneMapping = c), n.geometry.dispose(), n.material.dispose());
  }
  let l = new Sl(256, i),
    u = new Un(),
    f = new ts({
      side: 1,
      depthTest: !1,
      depthWrite: !1,
      uniforms: {
        uSunny: { value: a.texture },
        uRainy: { value: o.texture },
        uCloud: { value: 0 },
      },
      vertexShader: `varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform samplerCube uSunny,uRainy;uniform float uCloud;varying vec3 vDirection;
      void main(){vec3 d=normalize(vDirection);
        vec3 dry=textureCube(uSunny,d).rgb,wet=textureCube(uRainy,d).rgb*vec3(.70,.78,.83);
        gl_FragColor=vec4(mix(dry,wet,uCloud),1.);}`,
    });
  u.add(new vi(new ba(2, 2, 2), f));
  let p = new _c(0.1, 10, l),
    m = -1;
  function h(t) {
    let n = Math.round(t * 100) / 100;
    if (n === m) return;
    let r = e.toneMapping,
      i = e.shadowMap.autoUpdate,
      a = e.shadowMap.needsUpdate;
    try {
      ((e.toneMapping = 0),
        (e.shadowMap.autoUpdate = !1),
        (e.shadowMap.needsUpdate = !1),
        (f.uniforms.uCloud.value = n),
        p.update(e, u),
        (m = n));
    } finally {
      ((e.toneMapping = r),
        (e.shadowMap.autoUpdate = i),
        (e.shadowMap.needsUpdate = a));
    }
  }
  return (h(0), { texture: l.texture, setWeather: h });
}
var Hb = (e) => Math.max(0, Math.min(1, e)),
  Ub = (e) => {
    let t = Hb(e);
    return t * t * (3 - 2 * t);
  },
  Wb = 0.145;
function Gb(e) {
  return Math.abs(e) > Math.PI / 2 + 0.01 ? 4 : 2;
}
function Kb(e) {
  return 0.36 + Math.abs(e) * 0.21;
}
function qb(e) {
  return `KeeperTurn${e >= 0 ? `Left` : `Right`}${Gb(e) === 4 ? `180` : `90`}`;
}
function Jb(e, t) {
  let n = Hb(t),
    r = 0.1;
  return (
    e *
    (n < r
      ? (n * n) / (2 * r * 0.9)
      : n > 0.9
        ? 1 - (1 - n) ** 2 / (2 * r * 0.9)
        : (n - r / 2) / 0.9)
  );
}
function Yb(e, t, n) {
  let r = Gb(e),
    i = n === (e >= 0 ? `l` : `r`) ? 0 : 1,
    a = 0;
  for (let n = i; n < r; n += 2) {
    let o = (n + 0.08) / r,
      s = (n + 0.92) / r,
      c = (e * (Math.floor(n / 2) + 1)) / (r / 2);
    if (t < o)
      return { from: a, to: a, t: 0, lift: 0, contact: !0, first: n === i };
    if (t < s) {
      let e = (t - o) / (s - o);
      return {
        from: a,
        to: c,
        t: Ub(e),
        lift: 0.055 * Math.sin(Math.PI * e) ** 1.5,
        contact: !1,
        first: n === i,
      };
    }
    a = c;
  }
  return { from: a, to: a, t: 0, lift: 0, contact: !0, first: !1 };
}
var Xb = { x: -3, near: 2.15, far: 3.42, y: 0.482 },
  Zb = 1.1,
  Qb = 0.77,
  $b = 43 / 30,
  ex = $b * 0.25,
  tx = (e) => e * e * (3 - 2 * e),
  nx = 0.6,
  rx = { ankle: 0.103, heel: -0.114, toe: 0.205 };
function ix(e) {
  let t = (t, n) => tx(Math.max(0, Math.min(1, (e - t) / (n - t))));
  return e < 0.6
    ? -0.17 * (1 - t(0, 0.1)) + 0.3 * t(0.44, nx)
    : 0.3 * (1 - t(nx, 0.78)) - 0.17 * t(0.86, 1);
}
var ax = 0.35,
  ox = (Xb.far - Xb.near) / Zb + ax,
  sx = [
    [`idle`, 21],
    [`out`, ox],
    [`idle`, 26],
    [`turn`, Kb(Math.PI)],
    [`back`, ox],
    [`turn`, Kb(Math.PI)],
  ],
  cx = sx.reduce((e, [, t]) => e + t, 0);
function lx(e, { reducedMotion: t = !1, mode: n = `routine` } = {}, r = {}) {
  if (
    ((r.x = Xb.x),
    (r.y = Xb.y),
    (r.z = Xb.near),
    (r.heading = 0),
    (r.walk = 0),
    (r.gait = ex),
    (r.turn = 0),
    (r.look = 0),
    (r.stride = 1),
    (r.pivot = null),
    (r.state = `Watching the pond`),
    t || n === `idle`)
  )
    return r;
  if (n === `walk`)
    return (
      (r.walk = 1),
      (r.gait = (e * Zb) / Qb),
      (r.state = `Walking preview`),
      r
    );
  let i = ((e % cx) + cx) % cx,
    a = 0;
  for (; a < sx.length - 1 && i >= sx[a][1]; a++) i -= sx[a][1];
  let [o, s] = sx[a];
  if (
    (a >= 2 && a <= 3 && (r.z = Xb.far),
    a >= 4 && (r.heading = Math.PI),
    o === `turn`)
  ) {
    let t = a === 3 ? 0 : Math.PI;
    ((r.pivot = {
      id: `routine-${Math.floor(e / cx)}-${a}`,
      stage: `turn`,
      angle: Math.PI,
      startHeading: t,
      progress: i / s,
    }),
      (r.heading = t + Jb(Math.PI, i / s)),
      (r.state = `Turning`));
  } else if (o === `out` || o === `back`) {
    let e = (e) => ax * (e ** 3 - 0.5 * e ** 4),
      t;
    if (i < ax) ((r.walk = tx(i / ax)), (t = Zb * e(i / ax)));
    else if (i > s - ax) {
      let n = s - i;
      ((r.walk = tx(n / ax)), (t = Xb.far - Xb.near - Zb * e(n / ax)));
    } else ((r.walk = 1), (t = Zb * (i - ax * 0.5)));
    ((r.z = o === `out` ? Xb.near + t : Xb.far - t),
      (r.gait = ex + t / Qb),
      (r.state = `Walking along the dock`));
  }
  return r;
}
