// ground-cover-01.js — the ground-cover pass
// Lines 50815-50931 of readable/assets__index-BogB70q-.pretty.js (cluster ground-cover, statement-aligned).
function buildGroundCover(e, { groundCover: t = !1 } = {}) {
  let n = new Map();
  e.traverse((e) => {
    if (!e.isMesh) return;
    let r = (e) => {
      if (n.has(e)) return n.get(e);
      let r = /[Ll]eaves|growth|[Ff]ern/.test(e.name),
        i = e.name.startsWith(`Willow`);
      if (t && !r) return e;
      let a = e.name === `Silver birch bark`,
        o = e.clone(),
        s = e.onBeforeCompile,
        c = e.customProgramCacheKey();
      for (let e of [o.map, o.normalMap, o.roughnessMap])
        e && (e.anisotropy = 16);
      return (
        o.normalScale?.multiplyScalar(t ? 1.08 : r ? 1.18 : a ? 1.25 : 1.12),
        (o.userData.woodlandDepth = !0),
        r &&
          ((o.side = 2),
          t || (o.roughness = i ? 0.74 : 0.79),
          t ||
            o.color.multiply(
              new G().setRGB(...(i ? [0.94, 0.97, 0.93] : [0.64, 0.86, 0.6])),
            ),
          t || (o.envMapIntensity = 0.64)),
        (o.onBeforeCompile = (e, n) => {
          (s(e, n),
            (e.vertexShader =
              `varying vec2 vTreeUv;varying vec3 vBarkLocal;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <uv_vertex>`,
              `#include <uv_vertex>
vTreeUv=uv;vBarkLocal=position;`,
            )),
            (e.fragmentShader =
              `varying vec2 vTreeUv;varying vec3 vBarkLocal;
          float treeHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float treeNoise(vec2 p){vec2 c=floor(p),f=fract(p);f=f*f*(3.-2.*f);
            return mix(mix(treeHash(c),treeHash(c+vec2(1.,0.)),f.x),mix(treeHash(c+vec2(0.,1.)),treeHash(c+1.),f.x),f.y);}
          vec3 treeRelief(vec3 p,vec3 n,float h){
            vec3 dx=dFdx(p),dy=dFdy(p),a=cross(dy,n),b=cross(n,dx);
            float d=dot(dx,a);
            return normalize(abs(d)*n-sign(d)*(dFdx(h)*a+dFdy(h)*b));
          }
        ` + e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <map_fragment>`,
              `#include <map_fragment>
          float woodlandNear=1.-smoothstep(16.,42.,length(vViewPosition));
          ${
            r
              ? `float leafTintPatch=treeNoise(vBarkLocal.xz*.93+vBarkLocal.y*.71);
          diffuseColor.rgb*=mix(vec3(.95,1.015,1.035),vec3(1.065,1.01,.93),leafTintPatch);`
              : ``
          }`,
            )),
            r
              ? ((e.fragmentShader = e.fragmentShader.replace(
                  `vec3(1.9,1.6,.85)*translucency`,
                  t
                    ? `vec3(1.9,1.6,.85)*mix(1.,1.12,woodlandNear)*translucency`
                    : `mix(vec3(1.28,1.36,.74),vec3(1.55,1.60,.82),woodlandNear)*translucency`,
                )),
                i &&
                  ((e.fragmentShader = e.fragmentShader.replace(
                    `#include <normal_fragment_maps>`,
                    `#include <normal_fragment_maps>
              float midrib=exp(-abs(vTreeUv.x-.5)*105.);
              float veinCoord=(vTreeUv.y-abs(vTreeUv.x-.5)*.66)*13.;
              float veinDistance=abs(fract(veinCoord+.5)-.5);
              float veinAA=max(fwidth(veinCoord),.008);
              float veins=1.-smoothstep(.023,.023+veinAA,veinDistance);
              float leafDetail=1.-smoothstep(.06,.15,length(fwidth(vTreeUv)));
              normal=treeRelief(-vViewPosition,normal,(midrib*.00032+veins*.00009)*leafDetail);`,
                  )),
                  (e.fragmentShader = e.fragmentShader.replace(
                    `#include <map_fragment>`,
                    `#include <map_fragment>
              float rib=exp(-abs(vTreeUv.x-.5)*85.);
              float mottling=treeNoise(vTreeUv*vec2(22.,35.));
              diffuseColor.rgb*=.93+mottling*.095+rib*.10;`,
                  ))))
              : ((e.fragmentShader = e.fragmentShader.replace(
                  `#include <map_fragment>`,
                  `#include <map_fragment>
            float barkPatch=treeNoise(vBarkLocal.xz*3.+vBarkLocal.y*.73);
            float dampBase=(1.-smoothstep(.05,1.05,vBarkLocal.y))*(.28+.72*barkPatch);
            diffuseColor.rgb*=mix(vec3(1.),vec3(.63,.72,.50),dampBase*.60);`,
                )),
                (e.fragmentShader = e.fragmentShader.replace(
                  `#include <normal_fragment_maps>`,
                  `#include <normal_fragment_maps>
            float barkFootprint=length(fwidth(vTreeUv));
            float poreVisibility=1.-smoothstep(.32,1.1,barkFootprint*105.);
            float barkPores=treeNoise(vTreeUv*vec2(${a ? `42.,140.` : `120.,28.`}));
            normal=treeRelief(-vViewPosition,normal,barkPores*${a ? `.00065` : `.0011`}*poreVisibility);`,
                ))),
            t ||
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <opaque_fragment>`,
                `
          float woodlandAir=smoothstep(36.,110.,length(vViewPosition))*.30;
          outgoingLight=mix(outgoingLight*mix(vec3(1.),vec3(.92,1.,1.08),woodlandAir),vec3(.30,.405,.43),woodlandAir);
          #include <opaque_fragment>`,
              )));
        }),
        (o.customProgramCacheKey = () =>
          `tree-finish-v2-${t ? `undergrowth` : `crown`}-${e.name}-${c}`),
        n.set(e, o),
        o
      );
    };
    e.material = Array.isArray(e.material) ? e.material.map(r) : r(e.material);
  });
}
