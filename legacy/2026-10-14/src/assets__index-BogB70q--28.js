// assets__index-BogB70q- 28 — math
// Lines 51126-51464 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function i_(e) {
  let t;
  if (
    (e.traverse((e) => {
      !t &&
        e.isMesh &&
        /leaves/i.test(e.material.name) &&
        e.geometry.hasAttribute(`_leaf_anchor`) &&
        (t = e);
    }),
    !t)
  )
    throw Error(`The woodland floor needs the reviewed birch leaf surface.`);
  let n = t.geometry,
    r = n.attributes.position,
    i = n.attributes._leaf_anchor,
    a = n.attributes.uv,
    o = new U().fromBufferAttribute(i, 0),
    s = [];
  for (let e = 0; e < r.count; e++)
    i.getX(e) === o.x && i.getY(e) === o.y && i.getZ(e) === o.z && s.push(e);
  let c = (e) =>
      e
        .reduce((e, t) => e.add(new U().fromBufferAttribute(r, t)), new U())
        .multiplyScalar(1 / e.length),
    l = s.map((e) => a.getX(e)),
    u = s.map((e) => a.getY(e)),
    d = [
      c(s.filter((e, t) => u[t] >= Math.max(...u) - 0.001)),
      c(s.filter((e, t) => u[t] <= Math.min(...u) + 0.001)),
    ],
    f = (d[0].distanceToSquared(o) > d[1].distanceToSquared(o) ? d[0] : d[1])
      .sub(o)
      .normalize(),
    p = c(s.filter((e, t) => l[t] >= Math.max(...l) - 0.001)).sub(
      c(s.filter((e, t) => l[t] <= Math.min(...l) + 0.001)),
    );
  p.addScaledVector(f, -p.dot(f)).normalize();
  let m = new U().crossVectors(p, f).normalize(),
    h = new Hr(),
    g = new U();
  for (let e of [`position`, `normal`, `uv`, `color`]) {
    let t = n.attributes[e];
    if (!t) continue;
    let r = [];
    for (let n of s)
      if (e === `position` || e === `normal`)
        (g.fromBufferAttribute(t, n),
          e === `position` && g.sub(o),
          r.push(g.dot(p), g.dot(m), -g.dot(f)));
      else for (let e = 0; e < t.itemSize; e++) r.push(t.getComponent(n, e));
    h.setAttribute(e, new Ar(r, t.itemSize));
  }
  let _ = new Map(s.map((e, t) => [e, t])),
    v = [];
  for (let e = 0; e < n.index.count; e += 3) {
    let t = [0, 1, 2].map((t) => n.index.getX(e + t));
    t.every((e) => _.has(e)) && v.push(...t.map((e) => _.get(e)));
  }
  (h.setIndex(v), h.computeBoundingSphere());
  let y = t.material.clone();
  ((y.onBeforeCompile = t.material.onBeforeCompile),
    (y.customProgramCacheKey = t.material.customProgramCacheKey),
    (y.name = `Fallen birch leaves`),
    y.color.multiply({ r: 1.45, g: 0.87, b: 0.48 }),
    (y.roughness = 0.94));
  let b = new Pn();
  return (b.add(new vi(h, y)), b);
}
function a_(e) {
  e.traverse((e) => {
    (e.updateMatrix(), (e.matrixAutoUpdate = !1));
  });
}
function o_(e, t) {
  e.updateWorldMatrix(!0, !0);
  let n = new ir();
  e.traverse((e) => {
    e.isMesh &&
      !e.userData.skipAO &&
      (e.isInstancedMesh
        ? (e.computeBoundingBox(), n.copy(e.boundingBox))
        : (e.geometry.computeBoundingBox(), n.copy(e.geometry.boundingBox)),
      n.applyMatrix4(e.matrixWorld),
      (e.userData.aboveWater = n.min.y > t + 0.035),
      (e.userData.belowWater = n.max.y < t - 0.035));
  });
}
function s_(e, t) {
  let n = Math.max(Math.abs(e), Math.abs(t)),
    r =
      5 +
      3 * Math.sin(e * 0.039 + t * 0.023) +
      2 * Math.cos(t * 0.047 - e * 0.017),
    i =
      5 * Math.abs(Math.sin(e * 0.024 + t * 0.013)) +
      3 * Math.abs(Math.sin(t * 0.031 - e * 0.017)),
    a =
      (Math.sin(e * 0.13 + Math.sin(t * 0.09) * 2) +
        Math.cos(t * 0.15 - e * 0.04)) *
      0.8;
  return Y(e, t) + Zf(42, 90, n) * (r + i + a);
}
function c_() {
  let e = cp(821926),
    t = [];
  for (let n = 0; n < 36; n++) {
    let r = ((n + e() * 0.65) / 36) * Math.PI * 2,
      i = 29 + e() * 16,
      a = Math.cos(r) * i,
      o = Math.sin(r) * i;
    t.push({
      asset: n % 3 == 0 ? `tree1_lod` : `tree2_lod`,
      x: a,
      y: s_(a, o),
      z: o,
      s: 1.2 + e() * 0.65,
      angle: e() * Math.PI * 2,
      tint: 0.64 + e() * 0.2,
    });
  }
  return t;
}
function l_(e, t) {
  let n = Math.floor(e),
    r = Math.floor(t),
    i = Zf(0, 1, e - n),
    a = Zf(0, 1, t - r),
    o = (e, t) => {
      let n = Math.sin(e * 127.1 + t * 311.7 + 82.9) * 43758.5453;
      return n - Math.floor(n);
    },
    s = o(n, r) * (1 - i) + o(n + 1, r) * i,
    c = o(n, r + 1) * (1 - i) + o(n + 1, r + 1) * i;
  return s * (1 - a) + c * a;
}
function u_(e, t) {
  let n = l_(e * 0.018, t * 0.018) * 18;
  return Zf(
    0.3,
    0.64,
    l_((e + n) * 0.028, (t - n) * 0.028) * 0.72 +
      l_(e * 0.075, t * 0.075) * 0.28,
  );
}
function d_() {
  let e = cp(280926),
    t = [],
    n = 4.8;
  for (let r = -185; r <= 185; r += n)
    for (let i = -185; i <= 185; i += n) {
      let a = i + (e() - 0.5) * n * 0.9,
        o = r + (e() - 0.5) * n * 0.9,
        s = Math.max(Math.abs(a), Math.abs(o)),
        c = Math.hypot(a, o),
        l = u_(a, o),
        u = Zf(30, 43, s);
      if (c < 37 || c > 190 || e() > l * 0.9 * u) continue;
      let d = l_(a * 0.041 + 31, o * 0.041 - 18) > 0.63,
        f = (0.78 + e() * 0.58) * (0.7 + 0.3 * Zf(35, 78, c));
      t.push({
        asset: d ? `birch` : `alder`,
        x: a,
        y: s_(a, o) - 0.1,
        z: o,
        s: [f * (0.83 + e() * 0.25), f, f],
        angle: e() * Math.PI * 2,
        tint: 0.73 + e() * 0.27,
      });
    }
  return t;
}
function f_(e, t) {
  let n = new Pn();
  ((n.name = `Wooded hills beyond the pond`), e.add(n));
  let r = new Wo(420, 420, 120, 120);
  r.rotateX(-Math.PI / 2);
  let i = r.attributes.position,
    a = r.attributes.uv,
    o = new Float32Array(i.count * 3),
    s = new G(`#8b965d`),
    c = new G(`#3e6049`),
    l = new G(`#98998b`),
    u = new G(),
    d = new G(`#64764d`),
    f = new G(`#425d41`),
    p = new G();
  for (let e = 0; e < i.count; e++) {
    let t = i.getX(e),
      n = i.getZ(e),
      r = s_(t, n),
      m = 0.85 * (1 - Zf(38.5, 45.5, Math.max(Math.abs(t), Math.abs(n))));
    (i.setY(e, r - m), a.setXY(e, t * 0.13, n * 0.13));
    let h = Math.hypot(s_(t + 0.5, n) - r, s_(t, n + 0.5) - r) * 2,
      g =
        0.5 +
        0.5 * Math.sin(t * 0.08 + Math.sin(n * 0.065) * 2) * Math.cos(n * 0.07);
    p.copy(f).lerp(d, g * 0.75);
    let _ = u_(t, n),
      v = l_(t * 0.16, n * 0.16);
    (u
      .copy(s)
      .lerp(c, _ * 0.91)
      .multiplyScalar(0.86 + v * 0.24),
      u.lerp(l, Zf(16, 38, r) * Zf(0.1, 0.8, h) * 0.45),
      u.copy(p.lerp(u, Zf(42, 62, Math.max(Math.abs(t), Math.abs(n))))),
      u.toArray(o, e * 3));
  }
  let m = [];
  for (let e = 0; e < 120; e++)
    for (let t = 0; t < 120; t++) {
      let n = -210 + (t + 0.5) * 3.5,
        r = -210 + (e + 0.5) * 3.5;
      if (Math.abs(n) < 38.5 && Math.abs(r) < 38.5) continue;
      let i = e * 121 + t,
        a = i + 121;
      m.push(i, a, i + 1, a, a + 1, i + 1);
    }
  (r.setIndex(m),
    r.setAttribute(`color`, new Ar(o, 3)),
    r.computeVertexNormals());
  let h = null;
  t.terrain?.traverse((e) => {
    if (e.isMesh) {
      let t = Array.isArray(e.material) ? e.material : [e.material];
      h ??= t.find((e) => e.name === `Island | woodland floor`)?.map;
    }
  });
  let g = new vi(
    r,
    new rs({ vertexColors: !0, map: h, roughness: 1, envMapIntensity: 0.7 }),
  );
  ((g.name = `Distant wooded ridges`), (g.userData.skipAO = !0), n.add(g));
  let _ = c_();
  for (let e of [`tree1_lod`, `tree2_lod`])
    t[e] &&
      yh(
        n,
        t[e],
        _.filter((t) => t.asset === e),
        { wind: !0, cast: !1, receive: !1, waterClass: `above` },
      );
  let v = 0,
    y = d_();
  for (let e of [`alder`, `birch`])
    if (t.distantWoodland?.[e]) {
      let r = y.filter((t) => t.asset === e),
        i = yh(n, t.distantWoodland[e], r, {
          cast: !1,
          receive: !1,
          cellSize: 40,
          waterClass: `above`,
        });
      ((i.name = `Distant ${e} woods`),
        i.traverse((e) => {
          e.isMesh && (e.userData.skipAO = !0);
        }),
        (v += r.length));
    }
  return ((n.userData.aboveWater = !0), { root: n, treeCount: _.length + v });
}
async function p_() {
  let e = await Promise.all(
    [`alder`, `birch`].map(async (e) => {
      let t = `/textures/${e}-canopy`,
        [n, r] = await Promise.all([
          new Us().loadAsync(`${t}.webp`),
          fetch(uf(`${t}.json`)),
        ]);
      if (!r.ok) throw Error(`The distant ${e} metadata could not load.`);
      let i = await r.json();
      if (i.frames.length !== 8)
        throw Error(`The distant ${e} atlas is incomplete.`);
      return ((n.colorSpace = We), (n.anisotropy = 4), [e, m_(n, i, e)]);
    }),
  );
  return Object.fromEntries(e);
}
function m_(e, t, n) {
  let r = n === `birch` ? 11 : 9,
    i = (t.span * r) / t.height,
    a = new V(...t.frames[0].root),
    o = new Wo(i, i);
  (o.translate(0, (0.5 - a.y) * i, 0),
    (o.boundingSphere = new Pr(
      new U(0, (0.5 - a.y) * i, 0),
      i / Math.sqrt(2),
    )));
  let s = n === `birch` ? [0.51, 0.6, 0.46] : [0.68, 0.78, 0.61],
    c = new oi({
      map: e,
      color: new G().setRGB(...s),
      alphaTest: 0.32,
      side: 2,
      fog: !0,
    });
  ((c.name = `Distant ${n} canopy`),
    (c.alphaToCoverage = !0),
    (c.onBeforeCompile = (e) => {
      ((e.uniforms.uWoodlandSpan = { value: i }),
        (e.uniforms.uWoodlandRoot = { value: a }),
        (e.vertexShader =
          `uniform float uWoodlandSpan;uniform vec2 uWoodlandRoot;varying float vWoodlandDistance;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <uv_vertex>`,
          `#include <uv_vertex>
      vec4 treeOrigin=modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
      vWoodlandDistance=length(cameraPosition-treeOrigin.xyz);
      float viewAngle=atan(cameraPosition.x-treeOrigin.x,cameraPosition.z-treeOrigin.z);
      float treeYaw=atan(instanceMatrix[2].x,instanceMatrix[2].z);
      float frame=floor(mod(viewAngle-treeYaw+0.392699,6.283185)/0.785398);
      vMapUv=vec2((uv.x+mod(frame,4.))*.25,(uv.y+1.-floor(frame*.25))*.5);`,
        )),
        (e.vertexShader = e.vertexShader.replace(
          `#include <project_vertex>`,
          `
      vec2 card=(uv-uWoodlandRoot)*uWoodlandSpan;
      card*=vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));
      vec3 right=vec3(cos(viewAngle),0.,-sin(viewAngle));
      treeOrigin.xyz+=right*card.x+vec3(0.,card.y,0.);
      vec4 mvPosition=viewMatrix*treeOrigin;
      gl_Position=projectionMatrix*mvPosition;`,
        )),
        (e.fragmentShader =
          `varying float vWoodlandDistance;
` + e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <opaque_fragment>`,
          `
      float woodlandAir=mix(.12,.48,smoothstep(35.,145.,vWoodlandDistance));
      outgoingLight=mix(outgoingLight*vec3(.92,1.,1.10),vec3(.30,.405,.43),woodlandAir);
      #include <opaque_fragment>`,
        )));
    }),
    (c.customProgramCacheKey = () => `distant-woodland-v2`));
  let l = new Pn();
  return (l.add(new vi(o, c)), l);
}
