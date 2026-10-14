// terrain-dressing-01.js — terrain dressing: the 1024/256 masks, tree scatter and terrain flattening under the buildings
// Lines 48873-49266 of readable/assets__index-BogB70q-.pretty.js (cluster terrain-dressing, statement-aligned).
function buildTerrainMask(e, { size: t = 1024, extent: n = 48 } = {}) {
  let r = new Uint8Array(t * t * 4),
    i = (n * 2) / t;
  for (let e = 0; e < t; e++)
    for (let a = 0; a < t; a++) {
      let o = (a + 0.5) * i - n,
        s = (e + 0.5) * i - n;
      r[(e * t + a) * 4 + 3] = Math.round(255 * hillNoise(o, s));
    }
  let a = (e, a, o, s, c, l = !1) => {
    let u = Math.max(a, o) * 1.25,
      d = e.angle || 0,
      f = Math.cos(d),
      p = Math.sin(d),
      m = Math.max(0, Math.floor((e.x - u + n) / i)),
      h = Math.min(t - 1, Math.ceil((e.x + u + n) / i)),
      g = Math.max(0, Math.floor((e.z - u + n) / i)),
      _ = Math.min(t - 1, Math.ceil((e.z + u + n) / i));
    for (let u = g; u <= _; u++)
      for (let d = m; d <= h; d++) {
        let m = (d + 0.5) * i - n,
          h = (u + 0.5) * i - n,
          g = islandHeight(m, h);
        if (
          g < 0.06 ||
          (l && (g <= 0.54 || onPath(m, h))) ||
          (s === 3 && (g < 0.3 || onPath(m, h))) ||
          (e.kind === `benchpatch` && (g < 0.3 || onPath(m, h)))
        )
          continue;
        let _ = m - e.x,
          v = h - e.z,
          y = (_ * f + v * p) / a,
          b = (-_ * p + v * f) / o,
          x = Math.atan2(b, y),
          S =
            1 -
            smoothStep(
              0.16,
              1 +
                0.1 * Math.sin(x * 3 + e.x) +
                0.06 * Math.cos(x * 5 + e.z) +
                (s === 0 ? 0.14 * (valueNoise(m * 0.65, h * 0.65) - 0.5) : 0),
              Math.hypot(y, b),
            ),
          C = smoothStep(q - 0.12, q + 0.18, g) * (l ? smoothStep(q + 0.36, q + 0.62, g) : 1),
          w = Math.round(255 * S * C * c),
          T = (u * t + d) * 4 + s;
        r[T] = s === 3 ? Math.min(r[T], 255 - w) : Math.max(r[T], w);
      }
  };
  for (let t of e) {
    let e = Array.isArray(t.s) ? t.s : [t.s || 1, t.s || 1, t.s || 1];
    (t.kind === `tree`
      ? (a(t, 4.1 * e[0], 3.4 * e[2], 0, 0.94),
        a(t, 0.58 * e[0], 0.5 * e[2], 1, 0.88),
        a(
          { ...t, x: t.x + 0.22, z: t.z - 0.18 },
          1.1 * e[0],
          0.95 * e[2],
          2,
          0.36,
        ))
      : t.kind === `rock` && islandHeight(t.x, t.z) > 0.18 - 0.22
        ? (a(t, 0.92 * e[0], 0.82 * e[2], 1, 0.52),
          a(t, 1.45 * e[0], 1.25 * e[2], 2, 0.68),
          a(t, 0.84 * e[0], 0.72 * e[2], 0, 0.48, !0),
          a(t, 0.54 * e[0], 0.46 * e[2], 1, 0.78, !0))
        : t.kind === `benchpatch`
          ? (a(t, e[0], e[2], 3, 0.92), a(t, e[0] * 0.75, e[2] * 0.75, 2, 0.42))
          : t.kind === `lakesidecover` &&
            t.asset === `meadowgrass` &&
            a(t, 1.05 * e[0], 0.9 * e[2], 3, 0.85),
      /bankcover|fern|grass|foxglove|flowers|shrub/.test(t.asset) &&
        !onPath(t.x, t.z) &&
        (a(t, 0.09 + 0.24 * e[0], 0.08 + 0.2 * e[2], 1, 0.46, !0),
        t.asset.includes(`grass`) ||
          a(t, 0.48 * e[0], 0.4 * e[2], 0, 0.28, !0)));
  }
  return { data: r, size: t, extent: n };
}
function findMillAnchors(e) {
  let t = e.find((e) => e.asset === `mill`),
    n = e.find((e) => e.asset === `bridge`),
    r = [];
  if (t) {
    r.push({ x: t.x, z: t.z, hx: 3.68, hz: 2.9, spread: 0.86, strength: 0.94 });
    for (let e of millMachineryOrigins.footings)
      r.push({
        x: t.x + e.x,
        z: t.z - e.y,
        hx: e.width / 2,
        hz: e.depth / 2,
        spread: 0.44,
        strength: 0.85,
      });
  }
  if (n)
    for (let e of [-1, 1])
      for (let t of [-1, 1])
        r.push({
          x: n.x + e * 4.85 * n.s[0],
          z: n.z + t * 0.62 * n.s[2],
          hx: 0.14,
          hz: 0.17,
          spread: 0.34,
          strength: 0.72,
        });
  return r;
}
var boxDistance = (e, t, n) => {
  let r = Math.abs(e - n.x) - n.hx,
    i = Math.abs(t - n.z) - n.hz;
  return (
    Math.hypot(Math.max(r, 0), Math.max(i, 0)) + Math.min(Math.max(r, i), 0)
  );
};
function buildMillMask(e, { size: t = 256, extent: n = 12 } = {}) {
  let r = { x: -7, z: -4.2 },
    i = new Uint8Array(t * t * 4),
    a = (n * 2) / t,
    o = findMillAnchors(e),
    s = e.filter((e) => e.kind === `masonry` && e.y > -0.1);
  for (let e = 0; e < t; e++)
    for (let c = 0; c < t; c++) {
      let l = r.x + (c + 0.5) * a - n,
        u = r.z + (e + 0.5) * a - n,
        d = islandHeight(l, u);
      if (d < 0.06) continue;
      let f =
          0.5 +
          0.28 * Math.sin(l * 9.3 + Math.sin(u * 6.7)) +
          0.22 * Math.sin(u * 13.1 - l * 3.8),
        p = 0,
        m = 0,
        h = 0;
      for (let e of o) {
        let t = Math.max(0, boxDistance(l, u, e)),
          n = (1 - smoothStep(0.02, e.spread * (0.78 + f * 0.38), t)) * e.strength;
        ((p = Math.max(p, n)),
          (m = Math.max(m, (1 - smoothStep(0, 0.19, t)) * e.strength)),
          (h = Math.max(h, n * smoothStep(0.42, 0.79, f) * 0.54)));
      }
      for (let e of s) {
        let t =
          1 - smoothStep(0.36, 1.25, Math.hypot((l - e.x) / 0.58, (u - e.z) / 0.46));
        ((p = Math.max(p, t * 0.38)),
          (m = Math.max(m, t * 0.36)),
          (h = Math.max(h, t * f * 0.88)));
      }
      let g = smoothStep(q - 0.12, q + 0.2, d),
        _ = (e * t + c) * 4;
      ((i[_] = Math.round(255 * p * g)),
        (i[_ + 1] = Math.round(255 * m * g)),
        (i[_ + 2] = Math.round(255 * h * g)),
        (i[_ + 3] = 255));
    }
  return { data: i, size: t, extent: n, center: r };
}
function scatterMillRocks(e) {
  let t = createRandom(180927),
    n = [],
    r = findMillAnchors(e),
    i = e.filter((e) => e.kind === `rock`),
    a = [
      [-7.04, -6.98, 0.31],
      [-7.07, -5.15, 0.33],
      [-7.04, -3.82, 0.39],
      [-7.02, -2.62, 0.33],
      [-7.06, -1.51, 0.28],
      [-6.11, -7.57, 0.35],
      [-4.9, -7.6, 0.27],
      [-1.27, -7.55, 0.32],
      [0.08, -7.52, 0.3],
      [-6.51, 0.48, 0.29],
      [0.65, 0.18, 0.25],
    ],
    o = (e, t) => {
      let n = islandHeight(e, t);
      if (
        n < 0.215 ||
        shoreDistance(e, t) < 2.35 ||
        r.some((n) => boxDistance(e, t, n) < 0.04) ||
        i.some(
          (n) =>
            Math.hypot(e - n.x, t - n.z) <
            (Array.isArray(n.s) ? n.s[0] : n.s) * 0.54,
        )
      )
        return null;
      let a = (islandHeight(e + 0.05, t) - islandHeight(e - 0.05, t)) / 0.1,
        o = (islandHeight(e, t + 0.05) - islandHeight(e, t - 0.05)) / 0.1;
      if (Math.hypot(a, o) > 1.45) return null;
      let s = Math.hypot(a, 1, o);
      return { y: n, normal: [-a / s, 1 / s, -o / s] };
    };
  for (let [e, [r, i, s]] of a.entries()) {
    for (let a = 0; a < 9; a++) {
      let c = t() * Math.PI * 2,
        l = Math.sqrt(t()) * s,
        u = r + Math.cos(c) * l,
        d = i + Math.sin(c) * l,
        f = o(u, d);
      if (!f) continue;
      let p = 0.033 + t() * 0.062;
      n.push({
        asset: `pebble` + ((e + a) % 3),
        x: u,
        z: d,
        y: f.y - 0.017,
        s: [p, p * (0.44 + t() * 0.3), p * (0.8 + t() * 0.45)],
        normal: f.normal,
        angle: t() * Math.PI * 2,
        tint: 0.76 + t() * 0.21,
        kind: `foundationstone`,
      });
    }
    let a = r + (e < 5 ? 0.17 : 0) + (t() - 0.5) * 0.1,
      c = i + (e >= 5 && e < 9 ? 0.17 : 0) + (t() - 0.5) * 0.1,
      l = o(a, c);
    !l ||
      l.normal[1] < 0.72 ||
      n.push({
        asset: e % 3 == 1 ? `grass` : `bankcover` + (e % 2),
        x: a,
        z: c,
        y: l.y - 0.019,
        s: e % 3 == 1 ? 0.23 : 0.26 + t() * 0.08,
        normal: l.normal,
        angle: t() * Math.PI * 2,
        tint: 0.72 + t() * 0.13,
        kind: `foundationplant`,
      });
  }
  return n;
}
var pathVec2Table = shorePath.points.map((e) => `vec2(${e.map((e) => e.toFixed(4)).join(`,`)})`),
  qh = pathVec2Table.slice(1).map(
    (e, t) =>
      `trail=min(trail,bankTrailDistance(vBankWorld.xz,${pathVec2Table[t]},${e}));`,
  ).join(`
`);
function flattenTerrain(e, t) {
  let n = new Map();
  e.traverse((e) => {
    if (e.isMesh)
      for (let t of Array.isArray(e.material) ? e.material : [e.material])
        n.set(t.name, t);
  });
  let r = n.get(`Island | pale river sand`),
    i = n.get(`Island | woodland floor`);
  if (!r?.map || !i?.map) return;
  let a = buildTerrainMask(t),
    o = new Mi(a.data, a.size, a.size, D);
  ((o.minFilter = o.magFilter = l),
    (o.generateMipmaps = !1),
    (o.needsUpdate = !0));
  let s = buildMillMask(t),
    c = new Mi(s.data, s.size, s.size, D);
  ((c.minFilter = c.magFilter = l),
    (c.generateMipmaps = !1),
    (c.needsUpdate = !0));
  let u = new Map();
  for (let e of [r, i]) {
    let t = e.clone();
    ((t.map = r.map),
      (t.normalMap = r.normalMap),
      (t.roughnessMap = r.roughnessMap),
      t.normalScale.set(0.72, 0.72),
      (t.onBeforeCompile = (e) => {
        (Object.assign(e.uniforms, {
          uBankField: { value: o },
          uFoundationField: { value: c },
          uForestColor: { value: i.map },
          uForestNormal: { value: i.normalMap },
          uForestRough: { value: i.roughnessMap },
        }),
          Object.assign(e.uniforms, Jm),
          (e.vertexShader =
            `varying vec3 vBankWorld;
` + e.vertexShader),
          (e.vertexShader = e.vertexShader.replace(
            `#include <worldpos_vertex>`,
            `#include <worldpos_vertex>
vBankWorld=(modelMatrix*vec4(transformed,1.)).xyz;`,
          )),
          (e.fragmentShader =
            `varying vec3 vBankWorld;uniform sampler2D uBankField,uFoundationField,uForestColor,uForestNormal,uForestRough;
        float bankTrailDistance(vec2 p,vec2 a,vec2 b){vec2 d=b-a;return length(p-a-d*clamp(dot(p-a,d)/dot(d,d),0.,1.));}
      ` +
            Ym +
            e.fragmentShader),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <map_fragment>`,
            `
        vec4 bankMask=texture2D(uBankField,(vBankWorld.xz+${a.extent}.)/${a.extent * 2}.);
        vec3 foundationMask=texture2D(uFoundationField,(vBankWorld.xz-vec2(${s.center.x}.,${s.center.z})+${s.extent}.)/${s.extent * 2}.).rgb;
        float bankPatch=sin(vBankWorld.x*.46+sin(-vBankWorld.z*.4))*cos(vBankWorld.z*.51);
        float bankMix=smoothstep(.27+bankPatch*.13,.92+bankPatch*.18,vBankWorld.y);
        bankMix=max(bankMix,foundationMask.r*.94);
        vec3 woodland=texture2D(uForestColor,vMapUv).rgb;
        float duff=bankMask.r*(.74+.26*smoothstep(.025,.20,woodland.r));
        float openSoil=smoothstep(.57,.71,bankMask.a);
        vec3 meadowTint=mix(vec3(.16,.35,.065),vec3(.46,.56,.21),smoothstep(.25,.62,bankMask.a));
        vec3 woodlandTint=mix(meadowTint,vec3(.63,.54,.38),max(duff,openSoil*.88));
        woodlandTint=mix(woodlandTint,vec3(.62,.61,.50),foundationMask.r);
        woodlandTint*=.92+bankMask.a*.16;
        vec3 sandColor=texture2D(map,vMapUv).rgb*vec3(.90,.98,.87);
        vec3 bankColor=mix(sandColor,woodland*woodlandTint,bankMix);
        float moss=max(bankMask.b*(1.-duff*.62)*smoothstep(${q + 0.12},1.15,vBankWorld.y),foundationMask.b*.75);
        bankColor=mix(bankColor,woodland*vec3(.20,.36,.065),moss*.78);
        float trail=100.;${qh}
        trail=min(trail,length(vBankWorld.xz-vec2(${benchApproach.x},${benchApproach.z.toFixed(1)}))-${benchArea.clearingRadius - shorePath.width / 2});
        float trailEdge=${shorePath.width / 2}+.06*sin(vBankWorld.x*11.)*sin(vBankWorld.z*8.);
        float worn=1.-smoothstep(trailEdge-.18,trailEdge+.16,trail);
        bankColor=mix(bankColor,woodland*vec3(.87,.77,.60),worn*.88);
        // Finish only the dry ground above the approved shoreline treatment.
        // World-scale patches break up the mapped detail without moving plants.
        float groundFinish=smoothstep(${q + 0.36},${q + 0.62},vBankWorld.y);
        vec2 groundWarp=vec2(shoreNoise(vBankWorld.xz*.075),shoreNoise(vBankWorld.xz*.075+vec2(9.4,-5.7)));
        float groundMacro=shoreNoise(vBankWorld.xz*.17+groundWarp*1.8);
        float soilEdge=bankMask.a+(groundMacro-.5)*.16+(shoreNoise(vBankWorld.xz*2.4)-.5)*.045;
        float bareSoil=smoothstep(.49,.67,soilEdge);
        vec3 greenTint=mix(vec3(.14,.33,.065),vec3(.39,.52,.17),groundMacro);
        vec3 soilTint=vec3(.65,.49,.32)*mix(.82,1.13,groundMacro);
        vec3 groundColor=woodland*mix(greenTint,soilTint,max(duff,bareSoil));
        groundColor=mix(groundColor,woodland*vec3(.62,.61,.50),foundationMask.r);
        groundColor=mix(groundColor,woodland*greenTint,moss*.72);
        float dampBank=(1.-smoothstep(${q + 0.42},${q + 1.5}+groundMacro*.32,vBankWorld.y))*(1.-worn*.90);
        vec3 bankSoil=mix(sandColor,woodland,bankMix)*vec3(.53,.44,.32)*mix(.88,1.08,groundMacro);
        groundColor=mix(groundColor,bankSoil,dampBank*.86);
        vec3 pathColor=mix(woodland*vec3(1.04,.81,.52),sandColor*vec3(.86,.69,.45),.32)*mix(.92,1.06,groundMacro);
        groundColor=mix(groundColor,pathColor,worn*.96);
        bankColor=mix(bankColor,groundColor,groundFinish);
        vec2 bankWet=shoreWetness(vBankWorld,.31);
        float dampShore=smoothstep(${q - 0.2},${q + 0.02},vBankWorld.y)*bankWet.x;
        bankColor*=mix(vec3(1.),vec3(.67,.73,.67),dampShore*.85);
        float shoreFilm=0.;
        if(abs(vBankWorld.y-${q})<.24){
          vec4 lap=shoreLapping(vBankWorld.xz,0.);
          float reach=${q}+lap.x;
          shoreFilm=smoothstep(${q - 0.025},${q + 0.005},vBankWorld.y)*bankWet.y;
          float lace=.35+.65*shoreNoise(vBankWorld.xz*6.);
          float edge=exp(-pow((vBankWorld.y-reach)/.018,2.))*smoothstep(0.,.018,lap.x)*lap.z*lace;
          bankColor*=mix(vec3(1.),vec3(.70,.81,.77),shoreFilm*.65);
          bankColor=mix(bankColor,vec3(.42,.53,.47),edge*.16);
        }
        diffuseColor.rgb*=bankColor;
      `,
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <color_fragment>`,
            ``,
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <normal_fragment_maps>`,
            Gc.normal_fragment_maps
              .replaceAll(
                `texture2D( normalMap, vNormalMapUv ).xyz`,
                `mix(texture2D(normalMap,vNormalMapUv).xyz,texture2D(uForestNormal,vNormalMapUv).xyz,bankMix)`,
              )
              .replace(
                `mapN.xy *= normalScale;`,
                `mapN.xy *= normalScale * mix(1.,.66,worn*groundFinish);`,
              ),
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <roughnessmap_fragment>`,
            `
        float roughnessFactor=roughness*mix(texture2D(roughnessMap,vRoughnessMapUv).g,texture2D(uForestRough,vRoughnessMapUv).g,bankMix);
        roughnessFactor=mix(roughnessFactor,.91,worn*groundFinish*.72);
        roughnessFactor-=dampBank*groundFinish*.11;
        roughnessFactor=clamp(roughnessFactor-dampShore*.19-shoreFilm*.22,.32,1.);
      `,
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <lights_fragment_end>`,
            `#include <lights_fragment_end>
        reflectedLight.directDiffuse*=1.-bankMask.g*mix(.18,.24,groundFinish);
        reflectedLight.indirectDiffuse*=1.-max(bankMask.g*mix(.43,.58,groundFinish),foundationMask.g*.24);
        reflectedLight.indirectSpecular*=1.-max(bankMask.g*mix(.30,.40,groundFinish),foundationMask.g*.17);
      `,
          )));
      }),
      (t.customProgramCacheKey = () => `continuous-bank-surface-v9`),
      u.set(e, t));
  }
  e.traverse((e) => {
    e.isMesh &&
      (e.material = Array.isArray(e.material)
        ? e.material.map((e) => u.get(e) || e)
        : u.get(e.material) || e.material);
  });
}
