// assets__index-BogB70q- 24 — fragmentshader
// Lines 49794-50118 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function jg(e) {
  e.traverse((e) => {
    if (!e.isMesh || e.material.name !== `Mill interior | Oak • weathered`)
      return;
    let t = e.geometry;
    if (t.userData.millBeamGrain || t.hasAttribute(`tangent`)) return;
    let n = t.getAttribute(`position`),
      r = t.getAttribute(`uv`),
      i = t.index;
    if (!n || !r) return;
    let a = new Uint8Array(n.count),
      o = i?.count ?? n.count;
    for (let e = 0; e < o; e += 3) {
      let t = [0, 1, 2].map((t) => (i ? i.getX(e + t) : e + t)),
        r = t.map((e) => n.getX(e)),
        o =
          Math.max(...r) - Math.min(...r) > 6.3 &&
          t.every((e) => {
            let t = n.getY(e),
              r = n.getZ(e);
            return (
              Math.abs(n.getX(e)) < 3.181 &&
              t >= X.ceiling - 0.241 &&
              t <= X.ceiling + 0.001 &&
              [-1.93, 0.1, 2.18].some((e) => Math.abs(r - e) < 0.081)
            );
          });
      for (let e of t) a[e] |= o ? 1 : 2;
    }
    if (!a.includes(1) || a.includes(3)) return;
    let s = t.clone(),
      c = s.getAttribute(`uv`);
    for (let e = 0; e < a.length; e++)
      a[e] === 1 && c.setXY(e, r.getY(e), -r.getX(e));
    ((c.needsUpdate = !0),
      (s.userData = { ...t.userData, millBeamGrain: !0 }),
      (e.geometry = s));
  });
}
function Mg(e, { naturalDaylight: t = !1 } = {}) {
  let n = new Map();
  e.traverse((e) => {
    if (!e.isMesh) return;
    let r = (e) => {
      if (n.has(e)) return n.get(e);
      let r = /Oak|Cedar shingles/.test(e.name),
        i = /Limestone/.test(e.name),
        a = /(?:Old|Room) lime plaster/.test(e.name),
        o = e.name === `Old leaded glass`,
        s = /Forged iron/.test(e.name),
        c = t && /^(Leaves|New growth|Fern shadow)/.test(e.name);
      if (!r && !i && !a && !o && !s && !c) return e;
      if (c) {
        let t = e.clone(),
          r = e.onBeforeCompile,
          i = e.customProgramCacheKey();
        return (
          (t.onBeforeCompile = (e, t) => {
            (r(e, t),
              (e.fragmentShader = e.fragmentShader.replace(
                `vec3(1.9,1.6,.85)*translucency`,
                `vec3(1.12,1.21,.67)*translucency`,
              )));
          }),
          (t.customProgramCacheKey = () => i + `-mature-ivy-v1`),
          t.color.multiply(
            new G().setRGB(
              ...(e.name.startsWith(`New growth`)
                ? [0.47, 0.5, 0.46]
                : [0.36, 0.4, 0.36]),
            ),
          ),
          n.set(e, t),
          t
        );
      }
      let l;
      if (o)
        ((l = new is({
          name: e.name,
          color: e.color,
          aoMap: e.aoMap,
          aoMapIntensity: 0.75,
          roughness: 0.16,
          metalness: 0,
          ior: 1.5,
          clearcoat: 1,
          clearcoatRoughness: 0.09,
          envMapIntensity: 1.15,
          transparent: !0,
          depthWrite: !1,
          side: 2,
        })),
          (l.forceSinglePass = !0),
          (l.userData.clearGlazing = !0));
      else {
        if (
          ((l = e.clone()),
          l.normalScale?.multiplyScalar(
            r ? (t ? 1.02 : 1.24) : a ? 1.18 : i ? 1.12 : 1,
          ),
          s && ((l.roughness = 0.53), (l.metalness = 0.72)),
          t && r)
        ) {
          let t = /Cedar shingles/.test(e.name)
            ? [1.14, 1.04, 0.92]
            : /end grain/.test(e.name)
              ? [1.28, 1.1, 0.86]
              : /cut edges/.test(e.name)
                ? [1.16, 1.03, 0.88]
                : [1.3, 1.1, 0.86];
          l.color.multiply(new G().setRGB(...t));
        }
        t && i && l.color.multiply(new G().setRGB(1.05, 1, 0.94));
      }
      for (let e of [l.map, l.normalMap, l.roughnessMap])
        e && (e.anisotropy = 16);
      l.aoMap && (l.aoMapIntensity = t && r ? 0.76 : 0.96);
      let u = e.onBeforeCompile,
        d = e.customProgramCacheKey();
      return (
        (l.onBeforeCompile = (e, n) => {
          (o || u(e, n),
            (e.vertexShader =
              `varying vec2 vArchitectureUv;varying vec3 vArchitectureWorld;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <uv_vertex>`,
              `#include <uv_vertex>
vArchitectureUv=uv;`,
            )),
            o &&
              ((e.vertexShader =
                `attribute float _window_depth;varying float vWindowDepth;
` + e.vertexShader),
              (e.vertexShader = e.vertexShader.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
vWindowDepth=_window_depth;`,
              )),
              (e.fragmentShader =
                `varying float vWindowDepth;
` + e.fragmentShader),
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <opaque_fragment>`,
                `
            if(vWindowDepth>.5){
              float grazing=pow(1.-abs(dot(normal,geometryViewDir)),5.);
              float paneAlpha=clamp(.13+.60*grazing+architectureNoise(vArchitectureUv*18.)*.035,.13,.82);
              vec3 paneDiffuse=totalDiffuse;
              #ifdef USE_CLEARCOAT
                paneDiffuse*=1.-material.clearcoat*Fcc;
              #endif
              outgoingLight=(outgoingLight-paneDiffuse)/paneAlpha+paneDiffuse;
              diffuseColor.a=paneAlpha;
            }
            #include <opaque_fragment>`,
              ))),
            (e.vertexShader = e.vertexShader.replace(
              `#include <worldpos_vertex>`,
              `#include <worldpos_vertex>
          vec4 architecturePosition=vec4(transformed,1.);
          #ifdef USE_INSTANCING
            architecturePosition=instanceMatrix*architecturePosition;
          #endif
          vArchitectureWorld=(modelMatrix*architecturePosition).xyz;`,
            )),
            (e.fragmentShader =
              `varying vec2 vArchitectureUv;varying vec3 vArchitectureWorld;
          float architectureHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float architectureNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
            return mix(mix(architectureHash(i),architectureHash(i+vec2(1.,0.)),f.x),mix(architectureHash(i+vec2(0.,1.)),architectureHash(i+1.),f.x),f.y);}
          vec3 architectureBump(vec3 p,vec3 n,float height){
            vec3 dx=dFdx(p),dy=dFdy(p),r1=cross(dy,n),r2=cross(n,dx);
            float determinant=dot(dx,r1);
            return normalize(abs(determinant)*n-sign(determinant)*(dFdx(height)*r1+dFdy(height)*r2));
          }
        ` + e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <normal_fragment_maps>`,
              `#include <normal_fragment_maps>
          vec2 finishUv=vArchitectureUv;
          float finishFootprint=length(fwidth(finishUv));
          ${
            r
              ? `
            float grainBend=architectureNoise(finishUv*vec2(7.,2.))*1.7;
            float fineGrain=architectureNoise(vec2(finishUv.x*145.+grainBend,finishUv.y*5.));
            float pores=architectureNoise(finishUv*vec2(235.,38.));
            float grainVisibility=1.-smoothstep(.32,1.1,finishFootprint*145.);
            float finishRelief=(fineGrain*.00072+pores*.00022)*grainVisibility;
          `
              : o
                ? `
            float finishRelief=(architectureNoise(finishUv*11.)*.0008+architectureNoise(finishUv*27.)*.00022);
          `
                : `
            float grainVisibility=1.-smoothstep(.3,1.1,finishFootprint*120.);
            float finishRelief=architectureNoise(finishUv*120.)*${a ? `.00052` : i ? `.00075` : `.00025`}*grainVisibility;
          `
          }
          normal=architectureBump(-vViewPosition,normal,finishRelief);`,
            )),
            o ||
              ((e.fragmentShader = e.fragmentShader.replace(
                `#include <map_fragment>`,
                `#include <map_fragment>
            float weatherPatch=architectureNoise(vArchitectureWorld.xz*.83+vArchitectureWorld.y*.24);
            ${r || i ? `float contactHeight=vArchitectureWorld.y-(weatherPatch-.5)*.22;` : ``}
            diffuseColor.rgb*=.955+weatherPatch*.065;
            #ifdef USE_AOMAP
              float settledDust=1.-texture2D(aoMap,vAoMapUv).r;
              diffuseColor.rgb*=1.-settledDust*${r ? `.075` : `.045`};
            #endif`,
              )),
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <roughnessmap_fragment>`,
                `#include <roughnessmap_fragment>
            float finishVariation=architectureNoise(vArchitectureUv*vec2(18.,6.));
            roughnessFactor=clamp(roughnessFactor+(finishVariation-.35)*.09,${s ? `.38` : r ? `.40` : `.62`},.98);
            ${
              t && r
                ? `// Only waterline timber gets a damp sheen; walking surfaces stay matte.
            roughnessFactor=max(roughnessFactor,mix(.44,.68,smoothstep(.18,.67,contactHeight)));`
                : ``
            }`,
              )),
              r &&
                (e.fragmentShader = e.fragmentShader
                  .replace(
                    `smoothstep(.17,.52,vTimberWorld.y)`,
                    `smoothstep(.17,.52,contactHeight)`,
                  )
                  .replace(
                    `smoothstep(.18,.67,vTimberWorld.y)`,
                    `smoothstep(.18,.67,contactHeight)`,
                  )),
              i &&
                (e.fragmentShader = e.fragmentShader
                  .replace(
                    `smoothstep(.14,.68,vSurfaceWorld.y)`,
                    `smoothstep(.14,.68,contactHeight)`,
                  )
                  .replace(
                    `smoothstep(.16,.62,vSurfaceWorld.y)`,
                    `smoothstep(.16,.62,contactHeight)`,
                  ))));
        }),
        (l.customProgramCacheKey = () =>
          `architecture-v5-${t ? `daylight` : `original`}-${e.name}-${d}`),
        n.set(e, l),
        l
      );
    };
    e.material = Array.isArray(e.material) ? e.material.map(r) : r(e.material);
  });
}
var Ng = {
    plaster: `#E7D6B8`,
    shutters: `#A4513D`,
    oak: `#956A43`,
    beams: `#594333`,
    roof: `#755744`,
    stone: `#B5A58B`,
  },
  Pg = {
    wood: new G().setRGB(105 / 255, 98 / 255, 87 / 255, We),
    plaster: new G().setRGB(132 / 255, 127 / 255, 115 / 255, We),
    stone: new G().setRGB(102 / 255, 86 / 255, 74 / 255, We),
  },
  Fg = Object.fromEntries(
    Object.entries(Ng).map(([e, t]) => {
      let n = new G(t),
        r = Pg[e === `plaster` ? `plaster` : e === `stone` ? `stone` : `wood`];
      return [e, new G().setRGB(n.r / r.r, n.g / r.g, n.b / r.b)];
    }),
  ),
  Ig = [
    [-2.45, 3.37, 0.9, 1.31],
    [2.45, 3.37, 0.9, 1.31],
    [0.68, 3.45, 0.8, 1.5],
    [-0.6, 5.83, 0.66, 0.86],
  ];
function Lg(e, t, n, r, i) {
  return t === `milldoor` || t === `millsidedoor`
    ? `oak`
    : t === `architecture`
      ? `beams`
      : e.startsWith(`Bridge entrance |`)
        ? /Cedar shingles/.test(e)
          ? `roof`
          : /weathered|cut edges/.test(e)
            ? `oak`
            : `beams`
        : (i > 4.35 && r < 1.3) || (n > 3.6 && r < 4.1)
          ? null
          : /Cedar shingles/.test(e)
            ? r < 4 && i > 2.8
              ? `oak`
              : `roof`
            : Math.abs(n) > 3.75 && r > 4.3
              ? `beams`
              : /end grain/.test(e) &&
                  i >= 2.914 &&
                  i <= 2.976 &&
                  Ig.some(
                    ([e, t, i]) =>
                      Math.abs(Math.abs(n - e) - (i * 0.5 + 0.31)) <= 0.201 &&
                      Math.abs(Math.abs(r - t) - 0.4) <= 0.031,
                  )
                ? `shutters`
                : !(
                      i >= (/weathered/.test(e) ? 2.9 : 2.799) &&
                      i < 3.3 &&
                      Ig.some(
                        ([e, t, i, a]) =>
                          Math.abs(n - e) <= i * 0.5 + 0.18 &&
                          Math.abs(r - t) <= a * 0.5 + 0.2,
                      )
                    ) &&
                    r > 1.25 &&
                    (i < 2.901 || r > 4.3)
                  ? `beams`
                  : `oak`;
}
