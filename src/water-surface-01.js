// water-surface-01.js — the pond surface: wave uniforms/shaders, wake damping and the water geometry
// Lines 53380-53846 of readable/assets__index-BogB70q-.pretty.js (cluster water-surface, statement-aligned).
function xv() {
  let e = (e, t) => [
      -84,
      -8,
      ...Array.from({ length: t + 1 }, (n, r) => -e + (2 * e * r) / t),
      8,
      84,
    ],
    t = e(2.25, 90),
    n = e(3, 120),
    r = [],
    i = [],
    a = [];
  for (let e of n) for (let n of t) (r.push(n, e, 0), i.push(0, 0, 1));
  for (let e = 0; e < n.length - 1; e++)
    for (let n = 0; n < t.length - 1; n++) {
      let r = e * t.length + n,
        i = r + 1,
        o = i + t.length,
        s = r + t.length;
      a.push(r, i, s, i, o, s);
    }
  let o = new Hr();
  return (
    o.setAttribute(`position`, new Ar(r, 3)),
    o.setAttribute(`normal`, new Ar(i, 3)),
    o.setIndex(a),
    o.computeBoundingSphere(),
    o
  );
}
function createWaveUniforms() {
  return {
    uWaveTime: { value: 0 },
    uWaveSpeed: { value: 0 },
    uWaveTurn: { value: 0 },
    uWaveAmount: { value: 1 },
    uWaveInverse: { value: new W() },
  };
}
function updateWaveUniforms(e, t, n, r, i = !1) {
  ((e.uWaveTime.value = i ? t * 0.35 : t),
    (e.uWaveSpeed.value = n.speed || 0),
    (e.uWaveTurn.value = n.turnRate || 0),
    (e.uWaveAmount.value = i ? 0.35 : 1),
    r && e.uWaveInverse.value.copy(r.matrixWorld).invert());
}
function wv(e, t, n, r = 0, i = 0, a = 1, o = 0) {
  if (Math.abs(e.x) > 1.7 || Math.abs(e.z) > 2.9)
    return {
      height: 0,
      foam: 0,
      pressure: 0,
      pulse: 0,
      impact: 0,
      distance: 2,
    };
  let s = hullContactDistance(e.x, e.y, e.z),
    c = Math.max(0, s.distance);
  if (c >= 0.92)
    return {
      height: 0,
      foam: 0,
      pressure: 0,
      pulse: 0,
      impact: 0,
      distance: s.distance,
    };
  let l = clampValue((i * e.z * s.nx + (-r - i * e.x) * s.nz) / 1.65, 0, 1),
    u = -e.z,
    d = e.x < 0 ? -1 : 1,
    f = u * 3.7 + n * (2.5 + Math.abs(r) * 0.65) + d * 1.2,
    p = (0.5 + 0.5 * Math.sin(f)) ** 3,
    m = (0.5 + 0.5 * Math.sin(t.x * 1.65 + t.z * 0.94 - n * 2.1)) ** 2,
    h = 1 - smoothStep(0.58, vv, c),
    g = Math.exp(-(((c - 0.075 - 0.025 * p) / 0.105) ** 2)),
    _ = (0.006 + 0.022 * m + 0.043 * l * (0.45 + 0.55 * p)) * Math.exp(-c * 12),
    v = g * (0.012 * m + 0.07 * l * (0.35 + 0.65 * p)),
    y =
      Math.sin(c * 16 - n * 3.6 + u * 2.3) *
      Math.exp(-c * 4.8) *
      smoothStep(0.1, 0.28, c) *
      (0.008 + 0.021 * l),
    b = bv(t, n, s, c, o),
    x = 1 - l * 0.55;
  return {
    height: (_ + v + y + b.height * x) * h * a,
    foam: (g * l * smoothStep(0.36, 0.9, p) + b.foam * x) * h * a,
    pressure: l,
    pulse: p,
    impact: b.impact * h * a,
    distance: s.distance,
  };
}
var Tv = `
uniform float uWaveTime,uWaveSpeed,uWaveTurn,uWaveAmount;
uniform mat4 uWaveInverse;
${hullWidthGlsl}
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
function buildWaterGeometry(e) {
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
function buildPondWater(e, { reducedMotion: t = !1 } = {}) {
  let n = [],
    r = createRandom(724),
    i = new Float32Array(Ov.length),
    a = new Float32Array(Ov.length),
    o = buildWaterGeometry(e),
    s = new Go(1, 5, 3),
    c = new Float32Array(Dv);
  s.setAttribute(`aDropFade`, new Ii(c, 1).setUsage(Xe));
  let l = new rs({
    color: `#aecdc6`,
    roughness: 0.13,
    metalness: 0.03,
    transparent: !0,
    opacity: 0.72,
    depthWrite: !1,
    envMapIntensity: 1.1,
  });
  ((l.onBeforeCompile = (e) => {
    ((e.vertexShader =
      `attribute float aDropFade;varying float vDropFade;
` + e.vertexShader),
      (e.vertexShader = e.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
vDropFade=aDropFade;`,
      )),
      (e.fragmentShader =
        `varying float vDropFade;
` + e.fragmentShader),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
diffuseColor.a*=vDropFade;`,
      )));
  }),
    (l.customProgramCacheKey = () => `boat-contact-droplets-v1`));
  let u = new Wi(s, l, Dv);
  ((u.name = `Boat contact droplets`),
    (u.count = 0),
    u.instanceMatrix.setUsage(Xe),
    (u.frustumCulled = !1),
    (u.receiveShadow = !0),
    (u.userData.aboveWater = !0),
    (u.userData.skipAO = !0),
    (u.renderOrder = 4),
    e.add(u));
  let d = new U(),
    f = new H(),
    p = new U(1, 1, 1),
    m = new W(),
    h = new U(),
    g = new U(),
    _ = new U(),
    v = new Nn(),
    y = new U(),
    b = new U(0, 1, 0),
    x = null,
    S = 0,
    C = 0,
    w = !1,
    T = 0;
  function E() {
    ((n.length = 0),
      o.reset(),
      (x = null),
      i.fill(0),
      a.fill(0),
      (C = 0),
      (w = !1),
      (u.count = 0),
      (u.visible = !1));
  }
  function D(e, t) {
    let s = m.elements;
    for (let c = 0; c < Ov.length; c++) {
      let { along: l, side: u, stern: d } = Ov[c],
        f = 0.34,
        p = 0;
      for (let e = 0; e < 3; e++)
        ((p = d ? u * 0.25 : u * (hullSectionWidth(l, f) + 0.055)),
          (f = (q - s[13] - s[1] * p + s[9] * l) / s[5]));
      (h.set(p, f, -l), g.copy(h).applyMatrix4(m));
      let v = wv(h, g, e, t.speed, t.turnRate, 1, t.heading),
        y = w && i[c] < 0.76 && v.pulse >= 0.76 && v.pressure >= 0.18,
        b = w && a[c] < 0.34 && v.impact >= 0.34 && e >= C;
      if (((i[c] = v.pulse), (a[c] = v.impact), !y && !b)) continue;
      b && (C = e + 0.55 + r() * 0.4);
      let x = hullContactDistance(h.x, h.y, h.z);
      (_.set(x.nx, 0, x.nz).transformDirection(m),
        b &&
          o.emit({
            x: g.x,
            z: g.z,
            nx: _.x,
            nz: _.z,
            born: e,
            strength: v.impact,
            seed: r() * 6.28,
          }));
      for (let i = 0; i < (y ? 3 : 4) && n.length < Dv; i++) {
        let i = y ? 0.18 + r() * 0.26 : 0.16 + r() * 0.19,
          a = y ? 0.65 + v.pressure * (0.75 + r() * 0.5) : 0.85 + r() * 0.35;
        n.push({
          x: g.x,
          z: g.z,
          y: q + v.height,
          born: e,
          source: y ? `motion` : `lake`,
          vx:
            _.x * i + Math.sin(t.heading) * t.speed * 0.22 + (r() - 0.5) * 0.1,
          vz:
            _.z * i + Math.cos(t.heading) * t.speed * 0.22 + (r() - 0.5) * 0.1,
          vy: a,
          size: y
            ? 0.008 + r() * 0.009 + v.pressure * 0.004
            : 0.009 + r() * 0.006,
        });
      }
    }
    w = !0;
  }
  return {
    mesh: u,
    drops: n,
    lips: o,
    reset: E,
    get atLakeSplash() {
      return n.some(
        (e) => e.source === `lake` && T - e.born > 0.14 && T - e.born < 0.22,
      );
    },
    update(e, r, i) {
      if (((T = e), t || !i)) {
        E();
        return;
      }
      let a = {
        ...r,
        t: e,
        position: new U().setFromMatrixPosition(i.matrixWorld),
        rotation: new H().setFromRotationMatrix(i.matrixWorld),
      };
      (x &&
        (e < x.t ||
          e - x.t > 0.35 ||
          a.position.distanceTo(x.position) > 1.5) &&
        E(),
        x || ((x = a), (S = e)));
      let l = e - x.t;
      for (; S <= e + 1e-8;) {
        let e = l > 0 ? clampValue((S - x.t) / l, 0, 1) : 1;
        (d.copy(x.position).lerp(a.position, e),
          f.copy(x.rotation).slerp(a.rotation, e),
          m.compose(d, f, p));
        let t =
          x.heading +
          Math.atan2(
            Math.sin(r.heading - x.heading),
            Math.cos(r.heading - x.heading),
          ) *
            e;
        (D(S, {
          speed: x.speed + (r.speed - x.speed) * e,
          turnRate:
            (x.turnRate || 0) + ((r.turnRate || 0) - (x.turnRate || 0)) * e,
          heading: t,
        }),
          (S += Ev));
      }
      ((x = a), o.update(e, r, i));
      let h = 0;
      for (let t = n.length - 1; t >= 0; t--) {
        let r = n[t],
          i = Math.max(0, e - r.born),
          a = r.y + r.vy * i - 4.905 * i * i;
        if (a < 0.18 || i > 0.8) {
          n.splice(t, 1);
          continue;
        }
        (v.position.set(r.x + r.vx * i, a, r.z + r.vz * i),
          y.set(r.vx, r.vy - 9.81 * i, r.vz));
        let o = 1 + Math.min(1.2, y.length() * 0.55);
        (v.quaternion.setFromUnitVectors(b, y.normalize()),
          v.scale.set(r.size, r.size * o, r.size),
          v.updateMatrix(),
          u.setMatrixAt(h, v.matrix),
          (c[h] = Math.min(1, i * 45) * Math.min(1, (a - q) * 35)),
          h++);
      }
      ((u.count = h),
        (u.visible = h > 0),
        (u.instanceMatrix.needsUpdate = !0),
        (s.attributes.aDropFade.needsUpdate = !0));
    },
  };
}
