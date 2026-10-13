// assets__index-BogB70q- 22 — math
// Lines 49115-49461 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Jh(e, t) {
  let n = new Map();
  e.traverse((e) => {
    if (e.isMesh)
      for (let t of Array.isArray(e.material) ? e.material : [e.material])
        n.set(t.name, t);
  });
  let r = n.get(`Island | pale river sand`),
    i = n.get(`Island | woodland floor`);
  if (!r?.map || !i?.map) return;
  let a = Vh(t),
    o = new Mi(a.data, a.size, a.size, D);
  ((o.minFilter = o.magFilter = l),
    (o.generateMipmaps = !1),
    (o.needsUpdate = !0));
  let s = Wh(t),
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
        trail=min(trail,length(vBankWorld.xz-vec2(${kh.x},${kh.z.toFixed(1)}))-${Dh.clearingRadius - Eh.width / 2});
        float trailEdge=${Eh.width / 2}+.06*sin(vBankWorld.x*11.)*sin(vBankWorld.z*8.);
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
var Yh = {
    x: 1.16,
    y: 1.88,
    z: -4.2,
    radius: 1.965,
    paddles: 28,
    angularSpeed: 0.105,
  },
  Xh = (e, t = null) => (t ? t.angleAt(e) : e * Yh.angularSpeed),
  Zh = Math.PI * 2,
  Qh = (e, t, n) => (((Xh(e, n) + (t * Zh) / Yh.paddles) % Zh) + Zh) % Zh,
  $h = Yh.y + Yh.radius + 0.008 - q - 0.022,
  eg = (Yh.radius + 0.008) * Yh.angularSpeed + 0.48 + 0.14,
  tg = (eg + Math.sqrt(eg ** 2 + 19.62 * $h)) / 9.81;
function ng(e, t, n = null) {
  let r = Qh(e, t, n);
  return r >= 0.45 && r <= 2.28 + Yh.angularSpeed * tg;
}
function rg(e, t, n = 0, r = null) {
  let i = Qh(e, t, r),
    a = r ? r.speedAt(e) : Yh.angularSpeed,
    o = Math.sin(i),
    s = Math.cos(i),
    c = Yh.radius + 0.008,
    l = [Yh.x + n, Yh.y + s * c, Yh.z + o * c],
    u = [0, -o * (c * a + 0.48) - 0.14, s * c * a + 0.1];
  return {
    start: l,
    velocity: u,
    life: Math.max(
      0,
      (u[1] + Math.sqrt(Math.max(0, u[1] ** 2 + 19.62 * (l[1] - q - 0.022)))) /
        9.81,
    ),
    amount: Zf(0.45, 0.88, i) * (1 - Zf(1.65, 2.28, i)) * (r ? r.flowAt(e) : 1),
    angle: i,
  };
}
function ig(e, t) {
  return {
    x: e.start[0] + e.velocity[0] * t,
    y: e.start[1] + e.velocity[1] * t - 4.905 * t * t,
    z: e.start[2] + e.velocity[2] * t,
    vx: e.velocity[0],
    vy: e.velocity[1] - 9.81 * t,
    vz: e.velocity[2],
  };
}
function ag(e, t, n, r, i = null) {
  let a = J(r, 0, 1),
    o = rg(e, t, n, i),
    s = o.life * a;
  for (let r = 0; r < 3; r++) ((o = rg(e - s, t, n, i)), (s = o.life * a));
  return { ...ig(o, s), amount: o.amount, age: s };
}
function og(e, t) {
  let n = [0],
    r = [0],
    i = 0.35 + t * 1.1,
    a = e[0][1];
  for (let t = 1; t < e.length; t++) {
    let o = e[t - 1],
      s = e[t],
      c = Math.hypot(...s.map((e, t) => e - o[t])),
      l = Math.sqrt(i * i + 19.62 * Math.max(0, a - o[1])),
      u = Math.sqrt(i * i + 19.62 * Math.max(0, a - s[1]));
    (n.push(n.at(-1) + c), r.push(r.at(-1) + c / ((l + u) * 0.5)));
  }
  return { distances: n, times: r, duration: r.at(-1), length: n.at(-1) };
}
function sg(e, t) {
  let n = J(t, 0, 1) * (e.times.length - 1),
    r = Math.min(e.times.length - 2, Math.floor(n)),
    i = n - r;
  return {
    time: e.times[r] + (e.times[r + 1] - e.times[r]) * i,
    distance: e.distances[r] + (e.distances[r + 1] - e.distances[r]) * i,
  };
}
var cg = Object.freeze({ x: -1.85, y: 1.35, z: 0.16 }),
  lg = Object.freeze({ x: -1.85, z: 0.185, hx: 0.209, hz: 0.095 }),
  ug = 0.4,
  dg = 4.31,
  fg = og(qf.flows[1].points, qf.flows[1].speed),
  pg = og(qf.flows[2].points, qf.flows[2].speed),
  mg = og(qf.flows[3].points, qf.flows[3].speed),
  hg = fg.duration - pg.times[1] + pg.duration + mg.duration,
  gg = 1 / 120,
  _g = 1201,
  vg = (e) => Math.max(0, Math.min(1, e));
function yg(e) {
  return vg((qf.gate.bottom - ug + ug * vg(e) - dg) / (qf.basin.water - dg));
}
function bg(e, t, n) {
  return t !== `foot` ||
    e.y > 1.2 ||
    e.z < 0.15 ||
    e.z > 1.1 ||
    Math.hypot(e.x - cg.x, e.z - cg.z) > 0.95
    ? null
    : n.target
      ? `close-sluice`
      : `open-sluice`;
}
function xg() {
  let e = {
      time: 0,
      target: 1,
      gate: 1,
      gateFlow: 1,
      flow: 1,
      speed: 1,
      angle: 0,
    },
    t = Array.from({ length: _g }, () => ({
      time: 0,
      gate: 1,
      speed: 1,
      angle: 0,
    })),
    n = 0;
  function r(r, i) {
    if (r <= 0) return i === `angle` ? r * Yh.angularSpeed : 1;
    if (r >= e.time) return e[i];
    let a = Math.max(0, n - _g + 1),
      o = Math.max(a, Math.min(n, r / gg)),
      s = Math.floor(o),
      c = Math.min(n, s + 1),
      l = o - s;
    return t[s % _g][i] * (1 - l) + t[c % _g][i] * l;
  }
  let i = {
    state: e,
    toggle() {
      return ((e.target = 1 - e.target), e.target);
    },
    gateAt: (e) => r(e, `gate`),
    angleAt: (e) => r(e, `angle`),
    speedAt: (e) => r(e, `speed`) * Yh.angularSpeed,
    flowAt: (e) => yg(r(e - hg, `gate`)),
    supplyAt: (e) => yg(r(e, `gate`)),
    timeAtAngle(e, t, n) {
      for (let i = 0; i < 18; i++) {
        let i = (t + n) / 2;
        r(i, `angle`) < e ? (t = i) : (n = i);
      }
      return (t + n) / 2;
    },
    update(r) {
      let a = Math.floor((r + 1e-9) / gg);
      for (; n < a;) {
        let r = e.speed;
        (n++,
          (e.time = n * gg),
          (e.gate +=
            Math.sign(e.target - e.gate) *
            Math.min(Math.abs(e.target - e.gate), gg / 2.8)),
          (e.gateFlow = yg(e.gate)),
          (e.flow = i.flowAt(e.time)));
        let a = Math.sqrt(e.flow),
          o = a > e.speed ? 3.5 : 4;
        ((e.speed = a + (e.speed - a) * Math.exp(-0.008333333333333333 / o)),
          !e.flow && e.speed < 0.002 && (e.speed = 0),
          (e.angle += (r + e.speed) * 0.5 * Yh.angularSpeed * gg),
          Object.assign(t[n % _g], {
            time: e.time,
            gate: e.gate,
            speed: e.speed,
            angle: e.angle,
          }));
      }
      return e;
    },
  };
  return i;
}
function Sg(e, t, n, r) {
  let i = [];
  for (let a = 0; a < e.length; a++) {
    let o = e[a],
      s = e[(a + 1) % e.length],
      c = o.p[t] - n,
      l = s.p[t] - n,
      u = r ? c <= 0 : c >= 0,
      d = r ? l <= 0 : l >= 0;
    if ((u && i.push(o), u !== d)) {
      let e = c / (c - l),
        t = {};
      for (let n of Object.keys(o))
        t[n] = o[n].map((t, r) => t + (s[n][r] - t) * e);
      i.push(t);
    }
  }
  return i;
}
