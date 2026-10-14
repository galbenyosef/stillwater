// assets__index-BogB70q- 02 — math
// Lines 29836-30183 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var Sf = 150,
  Cf = 6,
  wf = 2.3,
  Tf = 16,
  Ef = 42,
  Df = 0.4,
  Of = [_f.x / _f.y, _f.z / _f.y],
  kf = (e, t, n) => {
    let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
    return r * r * (3 - 2 * r);
  },
  Af = `
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
function Mf({ reducedMotion: e = !1 } = {}) {
  let t = { uCloudShadow: { value: new V() } },
    n = new WeakSet(),
    r = Cf,
    i = `live`;
  function a() {
    let n = { clear: 0, crossing: 16, shade: 23, leaving: 34 }[i] ?? r,
      a = e ? 0 : 0.7 * kf(0, 5, n) * (1 - kf(60, 72, n));
    t.uCloudShadow.value.set(-56 + n * wf, a);
  }
  return (
    a(),
    {
      uniforms: t,
      update(t) {
        (i === `live` && !e && (r = (r + Math.max(0, t)) % Sf), a());
      },
      preview(e) {
        (e === `play` ? ((r = Cf), (i = `live`)) : (i = e), a());
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
                n.has(r)
              )
                continue;
              n.add(r);
              let i = r.onBeforeCompile,
                a = r.customProgramCacheKey();
              ((r.onBeforeCompile = (n, a) => {
                (i.call(r, n, a),
                  Object.assign(n.uniforms, t),
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
                    Af +
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
var Nf = [0.8, 0.6],
  Pf = 12,
  Ff = 4.2,
  If = 112,
  Lf = (e, t, n) => {
    let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
    return r * r * (3 - 2 * r);
  },
  Rf = { value: new V(-60, 0) },
  zf = `
  uniform vec2 uPassingBreeze;
  const vec2 breezeDirection=vec2(${Nf.join(`,`)});
  float passingBreeze(vec2 p){
    float q=(dot(p,breezeDirection)-uPassingBreeze.x)/${Pf.toFixed(1)};
    float pulse=max(0.,1.-q*q);
    return pulse*pulse*uPassingBreeze.y;
  }
`;
function Bf({ reducedMotion: e = !1, uniform: t = Rf } = {}) {
  let n = 102,
    r = `live`;
  function i() {
    let i = { calm: -10, bank: 10, pond: 16 }[r] ?? n,
      a = e ? 0 : Lf(0, 3, i) * (1 - Lf(28, 32, i));
    t.value.set(-60 + i * Ff, a);
  }
  return (
    i(),
    {
      update(t) {
        (r === `live` && !e && (n = (n + Math.max(0, t)) % If), i());
      },
      preview(e) {
        (e === `play` ? ((n = 7), (r = `live`)) : (r = e), i());
      },
    }
  );
}
var Vf = `
  vec3 localBreezeDirection(mat3 basis){
    vec3 wind=vec3(breezeDirection.x,0.,breezeDirection.y);
    return vec3(dot(wind,basis[0]),dot(wind,basis[1]),dot(wind,basis[2]))/
      max(vec3(dot(basis[0],basis[0]),dot(basis[1],basis[1]),dot(basis[2],basis[2])),vec3(.00001));
  }
  vec3 breezeBend(vec3 p,float reach,float stiffness){
    mat3 basis=mat3(modelMatrix*instanceMatrix);
    vec3 origin=(modelMatrix*instanceMatrix[3]).xyz;
    float h=max(0.,p.y)*length(basis[1]);
    float flex=reach*h*h/(h*h+stiffness);
    return localBreezeDirection(basis)*flex*passingBreeze(origin.xz);
  }
  vec3 breezeBendNormal(vec3 n,vec3 p,float reach,float stiffness){
    mat3 basis=mat3(modelMatrix*instanceMatrix);
    vec3 origin=(modelMatrix*instanceMatrix[3]).xyz,wind=localBreezeDirection(basis);
    float scale=length(basis[1]),h=max(0.,p.y)*scale;
    float slope=2.*reach*stiffness*h*scale/pow(h*h+stiffness,2.)*passingBreeze(origin.xz);
    n.y-=dot(n,wind)*slope/(1.+wind.y*slope);
    return n;
  }
`,
  Hf = (e, t, n) => {
    let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
    return r * r * (3 - 2 * r);
  };
function Uf(e) {
  let t = ((e % 420) + 420) % 420;
  return {
    rain: Hf(48, 63, t) * (1 - Hf(95, 113, t)),
    wet: Hf(49, 87, t) * (1 - Hf(128, 230, t)),
    cloud: Hf(32, 54, t) * (1 - Hf(112, 143, t)),
  };
}
function Wf({ reducedMotion: e = !1 } = {}) {
  let t = { rain: 0, wet: 0, cloud: 0 },
    n = { uShower: { value: new U() }, uRainTime: { value: 0 } },
    r = 0,
    i = `live`;
  function a() {
    let a =
      { clear: 0, arriving: 54, shower: 82, clearing: 124, drying: 172 }[i] ??
      r;
    (Object.assign(t, Uf(e ? 0 : a)),
      n.uShower.value.set(t.rain, t.wet, t.cloud));
  }
  return {
    state: t,
    uniforms: n,
    update(t) {
      let o = e ? 0 : Math.max(0, t);
      ((n.uRainTime.value += o), i === `live` && (r = (r + o) % 420), a());
    },
    preview(e) {
      (e === `play` ? ((r = 43), (i = `live`)) : (i = e), a());
    },
    seek(e, o = e, s = {}) {
      ((r = Math.max(0, e)),
        (i = `live`),
        (n.uRainTime.value = Math.max(0, o)),
        a());
      for (let e of [`rain`, `wet`, `cloud`])
        t[e] *= Math.max(0, Math.min(1, s[e] ?? 1));
      n.uShower.value.set(t.rain, t.wet, t.cloud);
    },
  };
}
var Gf = `
  uniform sampler2D uRainCover;
  uniform vec3 uShower;
  uniform float uRainTime;
  float rainCoverHeight(vec2 p){
    vec2 uv=vec2(p.x,-p.y)/84.+.5;
    if(any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.))))return -15.;
    return 35.-(.1+texture2D(uRainCover,uv).r*49.9);
  }
`,
  Kf = `
  float rainHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  vec3 rainRing(vec2 p,float seed){
    vec2 cell=floor(p/1.3);
    float clock=uRainTime*.82+rainHash(cell+seed)*13.;
    float cycle=floor(clock),age=fract(clock);
    vec2 random=vec2(rainHash(cell+vec2(cycle,seed)),rainHash(cell+vec2(seed+7.,cycle)));
    vec2 offset=p-(cell+.3+random*.4)*1.3;
    float r=length(offset),radius=.035+age*.26;
    float wave=(r-radius)*85.;
    float envelope=exp(-wave*wave*.22)*smoothstep(0.,.06,age)*pow(1.-age,1.6);
    float density=smoothstep(random.x-.08,random.x+.08,uShower.x*.72);
    return vec3(offset/max(r,.001)*sin(wave)*envelope*.055,exp(-wave*wave)*envelope)*density;
  }
  vec3 rainRipples(vec2 p){
    if(uShower.x<.001||rainCoverHeight(p)>.25)return vec3(0.);
    return (rainRing(p,4.7)+rainRing(p+vec2(.63,.39),17.3)*.65)*uShower.x;
  }
`,
  qf = {
    basin: {
      x: -0.88,
      z: -8.2,
      width: 1.86,
      length: 1.7,
      floor: 4.08,
      water: 4.38,
      rim: 4.55,
    },
    gate: { x: 0.13, z: -8.2, width: 0.86, bottom: 4.434, top: 5.186 },
    obstacle: { x: -1.05, z: -8.5, hx: 2.8, hz: 1.65, kind: `spring bank` },
    flows: [
      {
        name: `Spring source`,
        width: 0.31,
        opacity: 0.86,
        speed: 0.83,
        points: [
          [-0.97, 5.32, -9.23],
          [-0.84, 5.25, -9.17],
          [-0.73, 4.97, -9.07],
          [-0.65, 4.9, -8.98],
          [-0.58, 4.6, -8.84],
          [-0.55, 4.38, -8.65],
        ],
      },
      {
        name: `Spring gate`,
        width: 0.73,
        opacity: 0.68,
        speed: 0.53,
        points: [
          [-0.06, 4.38, -8.2],
          [0.24, 4.37, -8.2],
          [0.7, 4.33, -8.2],
          [0.92, 4.29, -8.2],
          [1.16, 4.19, -8.2],
        ],
      },
      {
        name: `Mill race`,
        width: 0.82,
        opacity: 0.62,
        speed: 0.48,
        points: [
          [1.16, 4.19, -8.51],
          [1.16, 4.185, -8.2],
          [1.16, 4.16, -6.6],
          [1.16, 4.12, -4.38],
        ],
      },
      {
        name: `Wheel lip`,
        width: 0.79,
        opacity: 0.62,
        speed: 0.74,
        points: [
          [1.16, 4.12, -4.38],
          [1.16, 4.09, -4.25],
          [1.16, 4.01, -4.17],
          [1.16, 3.844116, -4.141059],
        ],
      },
    ],
  },
  Jf = {
    origin: { x: -3, y: 0.58, z: -4.2 },
    footings: [
      {
        name: `Wood store apron`,
        x: -2.35,
        y: -3.88,
        width: 1.86,
        depth: 1.88,
        top: 0.12,
      },
      {
        name: `Bench apron`,
        x: 2.47,
        y: -3.64,
        width: 2.08,
        depth: 1.44,
        top: 0,
      },
    ],
  },
  q = 0.18,
  Yf = { x: -7, z: 8, heading: 1.24 },
  Xf = 2.46,
  J = (e, t, n) => Math.max(t, Math.min(n, e)),
  Zf = (e, t, n) => {
    let r = J((n - e) / (t - e), 0, 1);
    return r * r * (3 - 2 * r);
  };
