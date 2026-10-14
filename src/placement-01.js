// placement-01.js — prop placement from the world tables (instances, LOD distances, shadow flags)
// Lines 36074-36352 of readable/assets__index-BogB70q-.pretty.js (cluster placement, statement-aligned).
function placeInstance(e, t) {
  (e.position.set(t.x, t.y, t.z),
    e.rotation.set(t.rx || 0, t.angle || 0, t.rz || 0),
    t.normal &&
      (e.quaternion.setFromUnitVectors(gh, _h.fromArray(t.normal)),
      e.rotateY(t.angle || 0)),
    Array.isArray(t.s) ? e.scale.set(...t.s) : e.scale.setScalar(t.s || 1),
    e.updateMatrix());
}
function populateWorld(
  e,
  t,
  n,
  {
    wind: r = !1,
    cast: i = !0,
    receive: a = !0,
    fade: o = !1,
    cellSize: s = 0,
    waterClass: c = null,
  } = {},
) {
  if (c === null) {
    (t.updateMatrixWorld(!0),
      dh.has(t) || dh.set(t, new ir().setFromObject(t)));
    let c = dh.get(t),
      l = new ir(),
      u = { above: [], below: [], crossing: [] };
    for (let e of n)
      (placeInstance(uh, e),
        l.copy(c).applyMatrix4(uh.matrix),
        u[
          t.userData.canopy || l.min.y > 0.215
            ? `above`
            : l.max.y < 0.145
              ? `below`
              : `crossing`
        ].push(e));
    let d = new Pn();
    e.add(d);
    for (let [e, n] of Object.entries(u))
      n.length &&
        populateWorld(d, t, n, {
          wind: r,
          cast: i,
          receive: a,
          fade: o,
          cellSize: s,
          waterClass: e,
        });
    return d;
  }
  if (s && n.length > 25) {
    let l = new Map(),
      u = new Pn();
    e.add(u);
    for (let e of n) {
      let t = `${Math.floor(e.x / s)},${Math.floor(e.z / s)}`;
      (l.has(t) || l.set(t, []), l.get(t).push(e));
    }
    for (let e of l.values())
      populateWorld(u, t, e, { wind: r, cast: i, receive: a, fade: o, waterClass: c });
    return u;
  }
  let l = new Pn();
  return (
    t.updateMatrixWorld(!0),
    (l.userData.aboveWater = c === `above`),
    (l.userData.belowWater = c === `below`),
    t.traverse((e) => {
      if (!e.isMesh) return;
      let s = e.material,
        c = !!e.geometry.getAttribute(`_leaf_anchor`);
      if (r) {
        let n = s.onBeforeCompile,
          r = !!e.geometry.getAttribute(`_crown_occlusion`),
          i = fh.get(s);
        i || ((i = new Map()), fh.set(s, i));
        let a = [!!t.userData.lod, o, c, r].join(`:`);
        i.has(a)
          ? (s = i.get(a))
          : ((s = s.clone()),
            t.userData.lod &&
              /Leaves|growth|leaves|fern/.test(s.name) &&
              (s.normalMap = null),
            (s.onBeforeCompile = (e, t) => {
              (n(e, t),
                (e.uniforms.uWorldTime = ch),
                (e.uniforms.uBoat = lh),
                (e.vertexShader =
                  `uniform float uWorldTime;varying float vPlantLight;
` + e.vertexShader),
                (e.fragmentShader =
                  `varying float vPlantLight;
` + e.fragmentShader),
                c
                  ? (oh(e, { normals: !0 }),
                    (e.vertexShader = e.vertexShader.replace(
                      `#include <begin_vertex>`,
                      `#include <begin_vertex>
vPlantLight=mix(.76,1.,smoothstep(.01,.38,position.y));`,
                    )))
                  : (sh(e, { normals: !0 }),
                    (e.vertexShader = e.vertexShader.replace(
                      `#include <begin_vertex>`,
                      `#include <begin_vertex>
vPlantLight=mix(.63,1.,smoothstep(.01,.38,max(0.,position.y)));`,
                    ))),
                (e.fragmentShader = e.fragmentShader.replace(
                  `#include <color_fragment>`,
                  `#include <color_fragment>
            diffuseColor.rgb*=${s.userData.woodlandDepth ? `mix(vPlantLight,vPlantLight*vPlantLight,woodlandNear*.24)` : `vPlantLight`};`,
                )),
                r &&
                  ((e.vertexShader =
                    `attribute float _crown_occlusion;varying float vCrownOcclusion;
` + e.vertexShader),
                  (e.vertexShader = e.vertexShader.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
vCrownOcclusion=_crown_occlusion;`,
                  )),
                  (e.fragmentShader =
                    `varying float vCrownOcclusion;
` + e.fragmentShader),
                  (e.fragmentShader = e.fragmentShader.replace(
                    `#include <lights_fragment_end>`,
                    `#include <lights_fragment_end>
              reflectedLight.indirectDiffuse*=${s.userData.woodlandDepth ? `pow(vCrownOcclusion,mix(1.,1.12,woodlandNear))` : `vCrownOcclusion`};
              reflectedLight.indirectSpecular*=mix(.55,1.,vCrownOcclusion);`,
                  )),
                  (e.fragmentShader = e.fragmentShader.replace(
                    `#include <aomap_fragment>`,
                    `
              reflectedLight.directDiffuse*=mix(1.,vCrownOcclusion,${s.userData.woodlandDepth ? `mix(.36,.50,woodlandNear)` : `.36`});
              #include <aomap_fragment>`,
                  ))),
                o &&
                  ((e.vertexShader =
                    `varying vec3 vTreeWorld;
` + e.vertexShader),
                  (e.vertexShader = e.vertexShader.replace(
                    `#include <worldpos_vertex>`,
                    `#include <worldpos_vertex>
vTreeWorld=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;`,
                  )),
                  (e.fragmentShader =
                    `varying vec3 vTreeWorld;uniform vec3 uBoat;
` + e.fragmentShader),
                  (e.fragmentShader = e.fragmentShader.replace(
                    `#include <color_fragment>`,
                    `#include <color_fragment>
              vec3 rayDirection=normalize(cameraPosition-uBoat);vec3 relative=vTreeWorld-uBoat;
              float along=dot(relative,rayDirection);float perpendicular=length(relative-rayDirection*along);
              float visibility=along>1.4?smoothstep(2.25,3.40,perpendicular):1.;
              if(visibility<.005)discard;`,
                  )),
                  (e.fragmentShader = e.fragmentShader.replace(
                    `#include <opaque_fragment>`,
                    `#include <opaque_fragment>
gl_FragColor.a*=visibility;`,
                  ))));
            }),
            (s.alphaToCoverage = o),
            (s.customProgramCacheKey = () =>
              `stillwater-wind-${s.name}-${o ? `fade` : `solid`}-${r ? `crown-light` : `plain`}-${c ? `leaf-pivots` : `plant`}-${s.userData.woodlandDepth ? `layered-woodland` : `original`}-passing-breeze-v1`),
            i.set(a, s));
      }
      let u = new Wi(e.geometry, s, n.length);
      (r &&
        i &&
        ((u.customDepthMaterial = new os()),
        (u.customDepthMaterial.onBeforeCompile = (e) => {
          ((e.uniforms.uWorldTime = ch),
            (e.vertexShader =
              `uniform float uWorldTime;
` + e.vertexShader),
            c ? oh(e) : sh(e));
        }),
        (u.customDepthMaterial.customProgramCacheKey = () =>
          c
            ? `leaf-pivots-shadow-breeze-v1`
            : `moving-foliage-shadow-breeze-v1`)),
        (u.userData.skipAO = r));
      for (let t = 0; t < n.length; t++) {
        let r = n[t];
        placeInstance(uh, r);
        let i = uh.matrix.clone().multiply(e.matrixWorld);
        u.setMatrixAt(t, i);
        let a = r.tint ?? 1,
          o =
            0.5 +
            0.5 *
              Math.sin((r.worldX ?? r.x) * 1.137 + (r.worldZ ?? r.z) * 2.71),
          c = o > 0.77 && /Leaves|leaves|growth|canopy/.test(s.name),
          l = new G().setRGB(
            a * (c ? 1.24 : 1),
            a * (c ? 0.95 : 0.96 + o * 0.07),
            a * (c ? 0.7 : 1.04 - o * 0.1),
          );
        (r.leafTint &&
          /Leaves|leaves|growth/.test(s.name) &&
          l.multiply(new G().setRGB(...r.leafTint)),
          s.name === `Lily pads` &&
            l.multiply(
              new G().setRGB(
                o > 0.76 ? 1.42 : 0.75 + o * 0.3,
                o > 0.76 ? 1.08 : 0.84 + o * 0.2,
                o > 0.76 ? 0.58 : 0.82,
              ),
            ),
          u.setColorAt(t, l));
      }
      ((u.castShadow = i && !s.userData.clearGlazing),
        (u.receiveShadow = a),
        (u.instanceMatrix.needsUpdate = !0),
        u.instanceColor && (u.instanceColor.needsUpdate = !0),
        u.computeBoundingSphere(),
        r && (u.boundingSphere.radius += c ? 0.85 : 0.45),
        l.add(u));
    }),
    e.add(l),
    l
  );
}
function bh(
  e,
  t,
  n,
  r,
  i,
  { distance: a = 30, canopyDistance: o = 38, cellSize: s = 12, ...c } = {},
) {
  let l = new Map();
  for (let e of i) {
    let t = `${Math.floor(e.x / s)},${Math.floor(e.z / s)}`;
    (l.has(t) || l.set(t, []), l.get(t).push(e));
  }
  let u = new Pn();
  e.add(u);
  for (let e of l.values()) {
    let i = e.reduce((e, t) => e + t.x, 0) / e.length,
      s = e.reduce((e, t) => e + t.z, 0) / e.length,
      l = e.map((e) => ({
        ...e,
        worldX: e.x,
        worldZ: e.z,
        x: e.x - i,
        z: e.z - s,
      })),
      d = new Pn(),
      f = new Pn(),
      p = new ei();
    if (
      ((p.userData.reflectionLOD = n.startsWith(`tree`)),
      populateWorld(d, t[n], l, c),
      populateWorld(f, t[r], l, c),
      p.position.set(i, 0, s),
      p.addLevel(d, 0),
      p.addLevel(f, a, 0.1),
      t.canopies?.variants[n])
    ) {
      let e = new Pn();
      if (
        (populateWorld(e, t.canopies.variants[n], l, { cast: !1, receive: !1 }),
        n.startsWith(`tree`))
      ) {
        let n = populateWorld(e, t[r], l, { cast: !0, receive: !1, waterClass: `above` });
        n.userData.shadowOnly = !0;
      }
      (e.traverse((e) => {
        e.userData.skipAO = !0;
      }),
        p.addLevel(e, o, 0.08));
    }
    u.add(p);
  }
  return u;
}
