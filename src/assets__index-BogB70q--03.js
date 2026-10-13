// assets__index-BogB70q- 03 — math
// Lines 30184-30493 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Y(e, t) {
  let n = Math.atan2((t - 0.4) / 16.4, e / 17.8),
    r =
      Math.hypot(e / 17.8, (t - 0.4) / 16.4) +
      0.035 * Math.sin(n * 5 + 0.6) +
      0.022 * Math.cos(n * 9),
    i = -2.3 + Zf(0.77, 1.1, r) * 4.1,
    a =
      0.64 -
      Zf(
        0.86,
        1.4,
        Math.max(Math.abs((e + 3) / 4.3), Math.abs((t + 4.2) / 3.65)),
      ) *
        3.15,
    o =
      0.51 - Zf(0.42, 1.1, Math.hypot((e + 3) / 2.7, (t + 0.35) / 1.35)) * 2.8,
    s = 2.8 * Math.exp(-(((e - 1.16) / 0.95) ** 2) - ((t + 4.2) / 2.9) ** 2),
    c = Math.max(i, Math.max(a, o) - s);
  ((c +=
    Zf(0.96, 1.32, r) *
    (1.2 + 0.7 * Math.sin(e * 0.31 + t * 0.13) * Math.cos(t * 0.27))),
    (c +=
      0.09 * Math.sin(e * 0.91 + t * 0.7) * Math.cos(t * 0.71) +
      0.055 * Math.sin(e * 0.55 - t * 0.94)),
    (c += 0.24 * Math.exp(-(((e + 5) / 6) ** 2) - ((t - 10) / 3.5) ** 2)));
  let l =
    Zf(-4.95, -4.65, e) *
    (1 - Zf(-1.35, -1.05, e)) *
    Zf(-0.2, 0.32, t) *
    (1 - Zf(5.2, 5.6, t));
  return c * (1 - l) + Math.min(c, -1.2) * l;
}
var Qf = [
    [-7, 8],
    [0, 10],
    [7, 8],
    [10, 2],
    [8, -6],
    [2, -12],
    [-6, -12],
    [-11, -6],
    [-11, 2],
    [-7, 8],
  ],
  $f = [
    qf.obstacle,
    { x: -3, z: 2.65, hx: 1.79, hz: 2.57, kind: `dock` },
    { x: 1.16, z: -4.2, hx: 0.85, hz: 2.05, kind: `wheel` },
    ...Jf.footings.map((e) => ({
      x: Jf.origin.x + e.x,
      z: Jf.origin.z - e.y,
      hx: e.width / 2,
      hz: e.depth / 2,
      kind: `mill apron`,
    })),
    ...[-1, 1].flatMap((e) =>
      [-1, 1].map((t) => ({
        x: -11.65 + e * 4.85 * 0.86,
        z: -6.45 + t * 0.62 * 1.15,
        hx: 0.18,
        hz: 0.21,
        kind: `bridge support`,
      })),
    ),
  ],
  ep = [],
  tp = (e) => {
    ep = e;
  };
function np(e, t) {
  let n = 1 / 0;
  for (let r = 0; r < Qf.length - 1; r++) {
    let [i, a] = Qf[r],
      [o, s] = Qf[r + 1],
      c = o - i,
      l = s - a,
      u = J(((e - i) * c + (t - a) * l) / (c * c + l * l), 0, 1);
    n = Math.min(n, Math.hypot(e - i - u * c, t - a - u * l));
  }
  return n;
}
function rp(e, t, n = 0.78, r = 0.44) {
  if (
    !Number.isFinite(e) ||
    !Number.isFinite(t) ||
    Math.abs(e) > 42 ||
    Math.abs(t) > 42
  )
    return !1;
  for (let [i, a] of [
    [0, 0],
    [n, 0],
    [-n, 0],
    [0, n],
    [0, -n],
  ])
    if (Y(e + i, t + a) > 0.18 - r) return !1;
  return (
    !$f.some(
      (r) => Math.abs(e - r.x) < r.hx + n && Math.abs(t - r.z) < r.hz + n,
    ) && !ep.some((r) => Math.hypot(e - r.x, t - r.z) < r.r + n)
  );
}
function ip(e, t, n) {
  let r = Math.sin(n),
    i = Math.cos(n);
  return (
    rp(e, t, 0.7) &&
    rp(e + r * 1.32, t + i * 1.32, 0.32) &&
    rp(e - r * 2.15, t - i * 2.15, 0.32, 0.82)
  );
}
function ap(e, t, n, r, i) {
  let a = (e, t) => (Number.isFinite(i) ? ip(e, t, i) : rp(e, t)),
    o = Math.max(1, Math.ceil(Math.hypot(n, r) / 0.18)),
    s = !1;
  for (let i = 0; i < o; i++) {
    let i = n / o,
      c = r / o;
    a(e + i, t + c)
      ? ((e += i), (t += c))
      : ((s = !0), a(e + i, t) && (e += i), a(e, t + c) && (t += c));
  }
  return { x: e, z: t, bumped: s };
}
var op = [
    {
      x: -3,
      z: 4,
      name: `The old landing`,
      line: `A little way around. Nowhere to rush.`,
    },
    {
      x: 2,
      z: -1,
      name: `The watermill`,
      line: `The wheel keeps its own time.`,
    },
    {
      x: 10,
      z: 5,
      name: `Willow bank`,
      line: `Watch the light move on the water.`,
    },
    {
      x: -7,
      z: 9,
      name: `The lily shallows`,
      line: `Old stones beneath the surface.`,
    },
    {
      x: -11,
      z: -6,
      name: `The little footbridge`,
      line: `A quiet passage to the other side.`,
    },
    {
      x: -20.25,
      z: -3,
      name: `The quiet bank`,
      line: `A place to sit and watch the pond.`,
    },
    {
      x: 0,
      z: -12,
      name: `The woodland spring`,
      line: `A small spring sets the mill in motion.`,
    },
  ],
  sp = (e, t) =>
    op.reduce((n, r) =>
      Math.hypot(e - n.x, t - n.z) < Math.hypot(e - r.x, t - r.z) ? n : r,
    );
function cp(e = 73) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
function lp(e, t) {
  let n = new rn(512, 512);
  n.depthTexture = new _a(512, 512, _);
  let r = new cc(-42, 42, 42, -42, 0.1, 50);
  (r.position.set(0, 35, 0), r.up.set(0, 0, -1), r.lookAt(0, 0, 0));
  let i = new os({ side: 2 }),
    a = [],
    o = {
      target: e.getRenderTarget(),
      override: t.overrideMaterial,
      background: t.background,
      planes: e.clippingPlanes,
      auto: e.shadowMap.autoUpdate,
      dirty: e.shadowMap.needsUpdate,
    };
  t.traverse((e) => {
    if (!e.visible) return;
    let t = Array.isArray(e.material) ? e.material : [e.material];
    (e.isPoints ||
      e.isLine ||
      e.isSkinnedMesh ||
      e.customDepthMaterial ||
      t.some(
        (e) => e && (e.transparent || e.alphaTest > 0 || e.isMeshBasicMaterial),
      )) &&
      (a.push(e), (e.visible = !1));
  });
  try {
    ((t.overrideMaterial = i),
      (t.background = null),
      (e.clippingPlanes = []),
      (e.shadowMap.autoUpdate = !1),
      (e.shadowMap.needsUpdate = !1),
      t.updateMatrixWorld(!0),
      e.setRenderTarget(n),
      e.clear(),
      e.render(t, r));
  } finally {
    ((t.overrideMaterial = o.override),
      (t.background = o.background),
      (e.clippingPlanes = o.planes),
      (e.shadowMap.autoUpdate = o.auto),
      (e.shadowMap.needsUpdate = o.dirty),
      e.setRenderTarget(o.target));
    for (let e of a) e.visible = !0;
    i.dispose();
  }
  return n;
}
function up(e, t) {
  let n = new WeakSet();
  e.traverse((e) => {
    if (e.isMesh)
      for (let r of Array.isArray(e.material) ? e.material : [e.material]) {
        if (
          !r.isMeshStandardMaterial ||
          r.transparent ||
          r.alphaTest > 0 ||
          r.metalness > 0.5 ||
          n.has(r)
        )
          continue;
        n.add(r);
        let i = r.onBeforeCompile,
          a = r.customProgramCacheKey(),
          o = e.name === `ResidentSkin`,
          s = r.userData.millExteriorPalette === !0;
        ((r.onBeforeCompile = (e, n) => {
          if (
            (i.call(r, e, n),
            Object.assign(e.uniforms, t),
            (e.vertexShader =
              `varying vec3 vRainSurface;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <worldpos_vertex>`,
              `#include <worldpos_vertex>
          vec4 rainPosition=vec4(transformed,1.);
          #ifdef USE_BATCHING
            rainPosition=batchingMatrix*rainPosition;
          #endif
          #ifdef USE_INSTANCING
            rainPosition=instanceMatrix*rainPosition;
          #endif
          vRainSurface=(modelMatrix*rainPosition).xyz;`,
            )),
            (e.fragmentShader =
              Gf +
              `
varying vec3 vRainSurface;
` +
              e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <roughnessmap_fragment>`,
              `#include <roughnessmap_fragment>
          float rainWet=0.;
          if(uShower.y>.001){
            float shelter=rainCoverHeight(vRainSurface.xz)-vRainSurface.y;
            rainWet=uShower.y*(1.-smoothstep(.12,.42,shelter))*smoothstep(.20,.52,vRainSurface.y);
          }
          // Skin takes a soft wet sheen without the strong darkening of porous surfaces.
          diffuseColor.rgb*=mix(1.,${o ? `.96` : `.72`},rainWet);
          roughnessFactor=mix(roughnessFactor,min(roughnessFactor,${o ? `.42` : `.30`}),rainWet*${o ? `.45` : `.85`});`,
            )),
            s)
          ) {
            let t = Gc.fog_fragment.replace(
              `gl_FragColor.rgb = mix(`,
              `fogFactor*=mix(1.,.70,uShower.z);
	gl_FragColor.rgb = mix(`,
            );
            e.fragmentShader = e.fragmentShader.replace(
              `#include <fog_fragment>`,
              t,
            );
          }
        }),
          (r.customProgramCacheKey = () =>
            a +
            `-rain-wetness-v2` +
            (o ? `-skin` : ``) +
            (s ? `-mill-haze-v1` : ``)),
          (r.needsUpdate = !0));
      }
  });
}
