// light-shafts-01.js — the light-shaft field (gaussian footprints) and the cloud-shadow uniforms
// Lines 29824-29954 of readable/assets__index-BogB70q-.pretty.js (cluster light-shafts, statement-aligned).
function shaftLightField(x, z, y) {
  let total = 0;
  for (let i of yf) {
    let a = x - i.foot[0],
      o = z - i.foot[1],
      s = y - i.foot[2],
      c = a * bf.x + o * bf.y + s * bf.z,
      l = Math.max(0, a * a + o * o + s * s - c * c);
    total += i.strength * Math.exp(-l / (i.width * i.width));
  }
  return Math.min(1, total);
}
var Sf = 150,
  Cf = 6,
  wf = 2.3,
  Tf = 16,
  Ef = 42,
  Df = 0.4,
  Of = [_f.x / _f.y, _f.z / _f.y],
  smoothRange = (e, t, n) => {
    let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
    return r * r * (3 - 2 * r);
  },
  cloudSunlightGlsl = `
  uniform vec2 uCloudShadow;
  float cloudSunlight(vec3 p){
    if(uCloudShadow.y<=0.)return 1.;
    vec2 plane=p.xz-p.y*vec2(${Of.map((e) => e.toFixed(8)).join(`,`)});
    vec2 q=vec2((dot(plane,vec2(.96,.28))-uCloudShadow.x)/${Tf.toFixed(1)},
      (dot(plane,vec2(-.28,.96))+6.)/${Ef.toFixed(1)});
    q.x+=.10*sin(q.y*4.1)+.045*sin(q.y*9.+.8);
    return 1.-uCloudShadow.y*(1.-smoothstep(${Df.toFixed(2)},1.,dot(q,q)));
  }
`,
  jf = Gc.lights_fragment_begin.replace(
    `getDirectionalLightInfo( directionalLight, directLight );`,
    `getDirectionalLightInfo( directionalLight, directLight );
    #if UNROLLED_LOOP_INDEX == 0
      directLight.color*=cloudLight;
    #endif`,
  );
function createCloudShadows({ reducedMotion: reducedMotion = !1 } = {}) {
  let uniforms = { uCloudShadow: { value: new V() } },
    patched = new WeakSet(),
    clock = Cf,
    mode = `live`;
  function applyState() {
    let n = { clear: 0, crossing: 16, shade: 23, leaving: 34 }[mode] ?? clock,
      a = reducedMotion ? 0 : 0.7 * smoothRange(0, 5, n) * (1 - smoothRange(60, 72, n));
    uniforms.uCloudShadow.value.set(-56 + n * wf, a);
  }
  return (
    applyState(),
    {
      uniforms: uniforms,
      update(t) {
        (mode === `live` && !reducedMotion && (clock = (clock + Math.max(0, t)) % Sf), applyState());
      },
      preview(e) {
        (e === `play` ? ((clock = Cf), (mode = `live`)) : (mode = e), applyState());
      },
      install(e) {
        e.traverse((e) => {
          if (e.isMesh)
            for (let r of Array.isArray(e.material)
              ? e.material
              : [e.material]) {
              let e =
                r.isMeshBasicMaterial && /^Distant .* canopy$/.test(r.name);
              if (
                (!(
                  r.isMeshStandardMaterial ||
                  r.isMeshLambertMaterial ||
                  r.isMeshPhongMaterial ||
                  r.isMeshToonMaterial
                ) &&
                  !e) ||
                patched.has(r)
              )
                continue;
              patched.add(r);
              let i = r.onBeforeCompile,
                a = r.customProgramCacheKey();
              ((r.onBeforeCompile = (n, a) => {
                (i.call(r, n, a),
                  Object.assign(n.uniforms, uniforms),
                  (n.vertexShader =
                    `varying vec3 vCloudWorld;
` + n.vertexShader),
                  (n.vertexShader = n.vertexShader.replace(
                    `#include <worldpos_vertex>`,
                    `#include <worldpos_vertex>
              vec4 cloudPosition=vec4(transformed,1.);
              #ifdef USE_BATCHING
                cloudPosition=batchingMatrix*cloudPosition;
              #endif
              #ifdef USE_INSTANCING
                cloudPosition=instanceMatrix*cloudPosition;
              #endif
              vCloudWorld=(modelMatrix*cloudPosition).xyz;`,
                  )),
                  (n.fragmentShader =
                    cloudSunlightGlsl +
                    `
varying vec3 vCloudWorld;
` +
                    n.fragmentShader),
                  e
                    ? (n.fragmentShader = n.fragmentShader.replace(
                        `#include <map_fragment>`,
                        `#include <map_fragment>
diffuseColor.rgb*=mix(1.,cloudSunlight(vCloudWorld),.72);`,
                      ))
                    : ((n.fragmentShader = n.fragmentShader.replace(
                        `#include <lights_fragment_begin>`,
                        `float cloudLight=cloudSunlight(vCloudWorld);
` + jf,
                      )),
                      (n.fragmentShader = n.fragmentShader.replaceAll(
                        `getShadowMask()`,
                        `(getShadowMask()*cloudLight)`,
                      ))));
              }),
                (r.customProgramCacheKey = () => a + `-passing-cloud-v2`),
                (r.needsUpdate = !0));
            }
        });
      },
    }
  );
}
