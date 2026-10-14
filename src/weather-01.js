// weather-01.js — the weather cycle (rain/wet/cloud), the breeze shader chunk and the rain-cover shader
// Lines 29955-30183 of readable/assets__index-BogB70q-.pretty.js (cluster weather, statement-aligned).
var Nf = [0.8, 0.6],
  Pf = 12,
  Ff = 4.2,
  If = 112,
  Lf = (e, t, n) => {
    let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
    return r * r * (3 - 2 * r);
  },
  breezeUniform = { value: new V(-60, 0) },
  zf = `
  uniform vec2 uPassingBreeze;
  const vec2 breezeDirection=vec2(${Nf.join(`,`)});
  float passingBreeze(vec2 p){
    float q=(dot(p,breezeDirection)-uPassingBreeze.x)/${Pf.toFixed(1)};
    float pulse=max(0.,1.-q*q);
    return pulse*pulse*uPassingBreeze.y;
  }
`;
function createBreezeState({ reducedMotion: e = !1, uniform: t = breezeUniform } = {}) {
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
var breezeShaderChunk = `
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
function weatherCycleAt(e) {
  let t = ((e % 420) + 420) % 420;
  return {
    rain: Hf(48, 63, t) * (1 - Hf(95, 113, t)),
    wet: Hf(49, 87, t) * (1 - Hf(128, 230, t)),
    cloud: Hf(32, 54, t) * (1 - Hf(112, 143, t)),
  };
}
function createWeather({ reducedMotion: e = !1 } = {}) {
  let t = { rain: 0, wet: 0, cloud: 0 },
    n = { uShower: { value: new U() }, uRainTime: { value: 0 } },
    r = 0,
    i = `live`;
  function a() {
    let a =
      { clear: 0, arriving: 54, shower: 82, clearing: 124, drying: 172 }[i] ??
      r;
    (Object.assign(t, weatherCycleAt(e ? 0 : a)),
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
var rainShaderChunk = `
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
  sluiceSpec = {
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
  millMachineryOrigins = {
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
  clampValue = (e, t, n) => Math.max(t, Math.min(n, e)),
  smoothStep = (e, t, n) => {
    let r = clampValue((n - e) / (t - e), 0, 1);
    return r * r * (3 - 2 * r);
  };
