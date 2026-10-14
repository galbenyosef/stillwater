// assets__index-BogB70q- 35 — math
// Lines 53474-53649 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var Tv = `
uniform float uWaveTime,uWaveSpeed,uWaveTurn,uWaveAmount;
uniform mat4 uWaveInverse;
${pv}
${_v}
vec2 ambientContact(vec2 world,vec2 normal,float d){
  vec2 result=vec2(0.);
  ${yv.map(
    (e) => `{
    vec2 direction=vec2(${e.x},${e.z});
    vec2 localDirection=(uWaveInverse*vec4(direction.x,0.,direction.y,0.)).xz;
    float incidence=max(0.,-dot(normal,normalize(localDirection)));
    float across=dot(world,vec2(-direction.y,direction.x));
    float phase=dot(world,direction)*${e.k}-uWaveTime*${e.omega}+${e.phase};
    float group=smoothstep(.05,.78,sin(uWaveTime*${e.group}+across*.32+${e.phase}));
    float locality=.42+.58*pow(.5+.5*sin(across*2.6-uWaveTime*.23+${e.phase}),2.);
    float crest=pow(max(0.,cos(phase)),3.);
    float draining=pow(max(0.,cos(phase+.8)),4.);
    float rebound=pow(max(0.,cos(phase+2.*${e.k}*d*incidence+1.1)),3.);
    float strength=incidence*locality*${e.weight.toFixed(2)};
    result.x+=strength*(crest*(.018+.014*group+(.016+.075*group)*exp(-d*8.))
      +rebound*(.006+.009*group)*exp(-d*4.)*smoothstep(.07,.22,d));
    result.y+=strength*group*group*(crest*.48+draining*.52)*exp(-d*7.)*.85;
  }`,
  ).join(`
`)}
  return result;
}
vec4 boatWave(vec2 world){
  vec3 hull=(uWaveInverse*vec4(world.x,${q},world.y,1.)).xyz;
  if(abs(hull.x)>1.7||abs(hull.z)>2.9)return vec4(0.,0.,2.,0.);
  vec3 contact=hullContact(hull);float d=max(0.,contact.z);
  if(d>=${vv})return vec4(0.,0.,contact.z,0.);
  float pressure=clamp(dot(vec2(uWaveTurn*hull.z,-uWaveSpeed-uWaveTurn*hull.x),contact.xy)/1.65,0.,1.);
  float along=-hull.z,side=hull.x<0.?-1.:1.;
  float phase=along*3.7+uWaveTime*(2.5+abs(uWaveSpeed)*.65)+side*1.2;
  float pulse=pow(.5+.5*sin(phase),3.);
  float lap=pow(.5+.5*sin(world.x*1.65+world.y*.94-uWaveTime*2.1),2.);
  float fade=1.-smoothstep(.58,${vv},d);
  float shoulder=exp(-pow((d-.075-.025*pulse)/.105,2.));
  float edge=(.006+.022*lap+.043*pressure*(.45+.55*pulse))*exp(-d*12.);
  float crest=shoulder*(.012*lap+.070*pressure*(.35+.65*pulse));
  float outgoing=sin(d*16.-uWaveTime*3.6+along*2.3)*exp(-d*4.8)*smoothstep(.10,.28,d)*(.008+.021*pressure);
  vec2 ambient=ambientContact(world,contact.xy,d)*(1.-pressure*.55);
  return vec4((edge+crest+outgoing+ambient.x)*fade*uWaveAmount,
    (shoulder*pressure*smoothstep(.36,.90,pulse)+ambient.y)*fade*uWaveAmount,contact.z,pressure);
}`,
  Ev = 1 / 60,
  Dv = 48,
  Ov = [-1.35, -0.55, 0.35, 1.05, 1.57]
    .flatMap((e) => [-1, 1].map((t) => ({ along: e, side: t })))
    .concat([
      { along: -1.82, side: -1, stern: !0 },
      { along: -1.82, side: 1, stern: !0 },
    ]);
function kv(e) {
  let t = new Float32Array(1560),
    n = new Float32Array(520),
    r = new Float32Array(1040),
    i = [];
  for (let e = 0; e < 8; e++)
    for (let t = 0; t <= 4; t++)
      for (let n = 0; n <= 12; n++) {
        let a = e * 65 + t * 13 + n;
        if (((r[a * 2] = n / 12), (r[a * 2 + 1] = t / 4), t < 4 && n < 12)) {
          let e = a,
            t = e + 1,
            n = e + 12 + 1,
            r = n + 1;
          i.push(e, n, t, t, n, r);
        }
      }
  let a = new Hr();
  (a.setIndex(i),
    a.setAttribute(`position`, new Dr(t, 3).setUsage(Xe)),
    a.setAttribute(
      `normal`,
      new Dr(new Float32Array(t.length), 3).setUsage(Xe),
    ),
    a.setAttribute(`uv`, new Dr(r, 2)),
    a.setAttribute(`aLipOpacity`, new Dr(n, 1).setUsage(Xe)));
  let o = new is({
    color: `#9dc3b9`,
    roughness: 0.12,
    metalness: 0,
    transparent: !0,
    opacity: 0.52,
    depthWrite: !1,
    side: 2,
    envMapIntensity: 1.25,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });
  ((o.forceSinglePass = !0),
    (o.onBeforeCompile = (e) => {
      ((e.vertexShader =
        `attribute float aLipOpacity;varying float vLipOpacity;varying vec2 vLipUv;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
vLipOpacity=aLipOpacity;vLipUv=uv;`,
        )),
        (e.fragmentShader =
          `varying float vLipOpacity;varying vec2 vLipUv;
` + e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
      diffuseColor.a*=vLipOpacity*smoothstep(0.,.18,vLipUv.y)*(1.-smoothstep(.62,1.,abs(vLipUv.x*2.-1.)));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.87,.83),smoothstep(.78,1.,vLipUv.y)*.7);`,
        )));
    }),
    (o.customProgramCacheKey = () => `boat-breaking-lips-v1`));
  let s = new vi(a, o);
  ((s.name = `Small breaking hull wavelets`),
    (s.visible = !1),
    (s.frustumCulled = !1),
    (s.receiveShadow = !0),
    (s.renderOrder = 3),
    (s.userData.aboveWater = !0),
    (s.userData.skipAO = !0),
    e.add(s));
  let c = [],
    l = new U(),
    u = new W();
  function d() {
    ((c.length = 0), (s.visible = !1), a.setDrawRange(0, 0));
  }
  return {
    mesh: s,
    events: c,
    reset: d,
    emit(e) {
      c.length < 8 && c.push(e);
    },
    update(e, r, i) {
      u.copy(i.matrixWorld).invert();
      let o = 0;
      for (let i = c.length - 1; i >= 0; i--) {
        let a = c[i],
          s = Math.max(0, e - a.born) / 0.38;
        if (s >= 1) {
          c.splice(i, 1);
          continue;
        }
        l.set(a.x, q, a.z).applyMatrix4(u);
        let d = wv(l, a, e, r.speed, r.turnRate, 1, r.heading).height,
          f = Math.sin(Math.PI * s),
          p = (0.075 + a.strength * 0.055) * f,
          m = 0.17 + a.strength * 0.06 + s * 0.07;
        for (let e = 0; e <= 4; e++)
          for (let r = 0; r <= 12; r++) {
            let i = e / 4,
              c = (r / 12) * 2 - 1,
              l = o * 65 + e * 13 + r,
              u = 0.82 + 0.18 * Math.sin(c * 15 + a.seed),
              f = Math.max(0, Math.cos((c * Math.PI) / 2)) ** 0.7,
              h = c * m * (1 - i * 0.18),
              g = i * (0.035 + s * 0.13) + i * i * 0.07;
            ((t[l * 3] = a.x - a.nz * h + a.nx * g),
              (t[l * 3 + 1] = q + d + Math.sin(i * Math.PI * 0.65) * p * f * u),
              (t[l * 3 + 2] = a.z + a.nx * h + a.nz * g),
              (n[l] = Math.min(1, s * 12) * Math.min(1, (1 - s) * 3)));
          }
        o++;
      }
      ((s.visible = o > 0),
        a.setDrawRange(0, o * 12 * 4 * 6),
        o &&
          ((a.attributes.position.needsUpdate = !0),
          (a.attributes.aLipOpacity.needsUpdate = !0),
          a.computeVertexNormals()));
    },
  };
}
