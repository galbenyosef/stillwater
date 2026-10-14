// waterwheel-motion-01.js — waterwheel motion: paddle timing, spill forces and the wheel-impact sheets
// Lines 53847-54374 of readable/assets__index-BogB70q-.pretty.js (cluster waterwheel-motion, statement-aligned).
var jv = Math.PI * 2,
  Mv = jv / waterwheelSpec.paddles,
  Nv = Mv / waterwheelSpec.angularSpeed,
  Pv = 3.6,
  Fv = Math.acos((q - waterwheelSpec.y) / waterwheelSpec.radius),
  Iv = 2.06,
  Lv = wheelSpillElement(Iv / waterwheelSpec.angularSpeed, 0),
  Rv = ballisticPointAt(Lv, Lv.life),
  zv = [
    {
      kind: `spill`,
      phase: Iv / waterwheelSpec.angularSpeed + Lv.life,
      x: Rv.x,
      z: Rv.z,
      strength: 1,
    },
    {
      kind: `entry`,
      phase: Fv / waterwheelSpec.angularSpeed,
      x: waterwheelSpec.x,
      z: waterwheelSpec.z + Math.sin(Fv) * waterwheelSpec.radius,
      strength: 0.64,
    },
    {
      kind: `exit`,
      phase: (jv - Fv) / waterwheelSpec.angularSpeed,
      x: waterwheelSpec.x,
      z: waterwheelSpec.z - Math.sin(Fv) * waterwheelSpec.radius,
      strength: 0.24,
    },
  ];
function Bv(e, t) {
  let n = createRandom(t * 7919 + { spill: 881, entry: 199, exit: 421 }[e.kind]),
    r = 0.25 + n() * 0.9;
  return {
    strength: e.strength * (0.42 + 0.58 * r),
    burst: r > 0.45,
    volume: r,
    width: 0.75 + n() * 0.45,
    linger: 0.8 + n() * 0.32,
    lean: (n() - 0.5) * 0.5,
  };
}
function Vv(e, t = Pv, n = null) {
  let r = [];
  if (n) {
    for (let i of zv) {
      let a = i.kind === `spill` ? Lv.life : 0,
        o = (i.phase - a) * waterwheelSpec.angularSpeed,
        s = e - t - a,
        c = e - a,
        l = n.angleAt(s),
        u = n.angleAt(c);
      if (u - l < 1e-9) continue;
      let d = Math.floor((l - o) / Mv) + 1,
        f = Math.floor((u - o) / Mv);
      for (let l = d; l <= f; l++) {
        let u = n.timeAtAngle(o + l * Mv, s, c),
          d = u + a,
          f = e - d,
          p = i.kind === `spill` ? n.flowAt(u) : n.speedAt(u) / waterwheelSpec.angularSpeed;
        if (f < 0 || f >= t || p < 0.002) continue;
        let m = Bv(i, l);
        r.push({
          ...i,
          ...m,
          strength: m.strength * p,
          volume: m.volume * p,
          burst: m.burst && p > 0.12,
          born: d,
          age: f,
          cycle: l,
          paddle: ((-l % waterwheelSpec.paddles) + waterwheelSpec.paddles) % waterwheelSpec.paddles,
        });
      }
    }
    return r.sort((e, t) => e.born - t.born);
  }
  for (let n of zv) {
    let i = Math.floor((e - n.phase) / Nv);
    for (let a = i; a >= i - Math.ceil(t / Nv); a--) {
      let i = n.phase + a * Nv,
        o = e - i;
      o < 0 ||
        o >= t ||
        r.push({
          ...n,
          ...Bv(n, a),
          born: i,
          age: o,
          cycle: a,
          paddle: ((-a % waterwheelSpec.paddles) + waterwheelSpec.paddles) % waterwheelSpec.paddles,
        });
    }
  }
  return r.sort((e, t) => e.born - t.born);
}
function Hv(e, t) {
  return e.map((e) => {
    let n = Math.round(e.x * 1379 + e.z * 3121 + e.nx * 733),
      r = createRandom(n),
      i = 3.5 + r() * 1.1,
      a = r() * i,
      o = Math.floor((t - a) / i),
      s = createRandom(n + o * 7919),
      c = a + o * i + s() * 0.4;
    c > t && (o--, (s = createRandom(n + o * 7919)), (c = a + o * i + s() * 0.4));
    let l = 0.38 + s() * 0.57,
      u = 1.95 + s() * 0.55,
      d = e.halfWidth * (0.78 + s() * 0.2),
      f = t - c,
      p = f / u;
    return {
      ...e,
      kind: `masonry`,
      seed: n,
      born: c,
      age: f,
      cycle: o,
      strength: l,
      duration: u,
      width: d,
      rise: Math.min(e.height * 0.7, 0.075 + l * 0.1),
      wash: smoothStep(0, 0.32, p) * (1 - smoothStep(0.32, 1, p)) * l,
    };
  });
}
var Uv = 32;
function Wv(e) {
  let t = [],
    n = new Nn(),
    r = (e, n, r, i, a, o) => {
      let s = Math.ceil(a / 0.62),
        c = a / s;
      for (let a = 0; a < s; a++) {
        let l = (a - (s - 1) / 2) * c * 2,
          u = e - i * l,
          d = n + r * l;
        islandHeight(u + r * 0.15, d + i * 0.15) > 0.145 ||
          t.push({
            x: u + r * 0.018,
            z: d + i * 0.018,
            nx: r,
            nz: i,
            halfWidth: c,
            height: Math.min(0.34, o - 0.018),
          });
      }
    },
    i = e.stoneblock && new ir().setFromObject(e.stoneblock);
  for (let e of i ? worldData.placements : []) {
    if (e.kind !== `masonry`) continue;
    (n.position.set(e.x, e.y, e.z),
      (n.rotation.y = e.angle || 0),
      Array.isArray(e.s) ? n.scale.fromArray(e.s) : n.scale.setScalar(e.s || 1),
      n.updateMatrix());
    let t = i.clone().applyMatrix4(n.matrix);
    if (t.min.y >= 0.18 || t.max.y <= 0.18) continue;
    let a = (t.min.x + t.max.x) / 2,
      o = (t.min.z + t.max.z) / 2;
    e.z < -8
      ? r(a, t.min.z, 0, -1, (t.max.x - t.min.x) / 2, t.max.y - q)
      : r(
          e.x < -3 ? t.min.x : t.max.x,
          o,
          e.x < -3 ? -1 : 1,
          0,
          (t.max.z - t.min.z) / 2,
          t.max.y - q,
        );
  }
  if (e.dockprops)
    for (let e of millMachineryOrigins.footings) {
      let t = millMachineryOrigins.origin.x + e.x,
        n = millMachineryOrigins.origin.z - e.y,
        i = millMachineryOrigins.origin.y + e.top - q;
      r(t, n + e.depth / 2, 0, 1, e.width / 2, i);
      let a = Math.sign(e.x);
      r(t + (a * e.width) / 2, n, a, 0, e.depth / 2, i);
    }
  return t.slice(0, Uv);
}
var Gv = `
uniform float uMillAmount;uniform vec4 uMillImpacts[6],uMillWalls[${Uv}],uMillWash[${Uv}];
vec4 millWater(vec2 p){
  if(uMillAmount==0.||p.x< -9.2||p.x>4.3||p.y< -9.6||p.y>2.)return vec4(0.);
  vec2 slope=vec2(0.);float foam=0.;
  for(int i=0;i<6;i++){
    vec4 hit=uMillImpacts[i];if(hit.w==0.)continue;
    vec2 delta=p-hit.xy;float r=length(delta),age=hit.z;
    float front=.12+age*.84,offset=r-front;
    float envelope=exp(-pow(offset/.19,2.));
    float fade=(1.-smoothstep(2.1,${Pv},age))*(1.-smoothstep(2.45,2.85,r))*hit.w/(1.+age*.55);
    slope+=delta/max(r,.025)*sin(offset*19.)*envelope*fade*.24;
    foam+=exp(-r*r/(.07+age*.24))*exp(-age*3.4)*hit.w*.85;
  }
  for(int i=0;i<${Uv};i++){
    vec4 wall=uMillWalls[i],state=uMillWash[i];if(state.x==0.)continue;
    vec2 delta=p-wall.xy,normal=wall.zw;
    float d=dot(delta,normal),along=dot(delta,vec2(-normal.y,normal.x));
    if(d<0.||d>1.25||abs(along)>state.x+.2)continue;
    float edge=1.-smoothstep(state.x*.65,state.x+.2,abs(along));
    float wash=state.y*exp(-d*7.)*edge;
    float front=.06+max(0.,state.z-.65)*.45,offset=d-front;
    float returning=exp(-pow(offset/.16,2.))*edge*state.w*smoothstep(0.,.55,state.z)*(1.-smoothstep(1.6,2.8,state.z));
    slope+=normal*(sin(offset*22.)*returning*.11-wash*.16);
    foam+=wash*.36+returning*.06;
  }
  return vec4(slope,foam,0.)*uMillAmount;
}`;
function Kv(e, t = {}, n = !1, r = null) {
  let i = Wv(t),
    a = {
      uMillAmount: { value: n ? 0.32 : 1 },
      uMillImpacts: { value: Array.from({ length: 6 }, () => new tn()) },
      uMillWalls: {
        value: Array.from({ length: Uv }, (e, t) => {
          let n = i[t];
          return n ? new tn(n.x, n.z, n.nx, n.nz) : new tn();
        }),
      },
      uMillWash: { value: Array.from({ length: Uv }, () => new tn()) },
    },
    o = new Pn();
  ((o.name = `Wheel impacts and masonry wash`),
    (o.userData.aboveWater = !0),
    (o.userData.skipAO = !0),
    e.add(o));
  let s = new Float32Array(9072),
    c = new Float32Array(3024),
    l = new Float32Array(6048),
    u = [];
  for (let e = 0; e < 24; e++)
    for (let t = 0; t <= 5; t++)
      for (let n = 0; n <= 20; n++) {
        let r = e * 126 + t * 21 + n;
        if ((l.set([n / 20, t / 5], r * 2), t < 5 && n < 20)) {
          let e = r + 20 + 1;
          u.push(r, e, r + 1, r + 1, e, e + 1);
        }
      }
  let d = new Hr();
  (d.setIndex(u),
    d.setAttribute(`position`, new Dr(s, 3).setUsage(Xe)),
    d.setAttribute(`normal`, new Dr(new Float32Array(s.length), 3)),
    d.setAttribute(`uv`, new Dr(l, 2)),
    d.setAttribute(`aSplashOpacity`, new Dr(c, 1).setUsage(Xe)));
  let f = new is({
    color: `#81b8b0`,
    roughness: 0.11,
    transparent: !0,
    opacity: 0.42,
    depthWrite: !1,
    side: 2,
    clearcoat: 0.75,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.1,
  });
  ((f.forceSinglePass = !0),
    (f.onBeforeCompile = (e) => {
      ((e.vertexShader =
        `attribute float aSplashOpacity;varying float vSplashOpacity;varying vec2 vSplashUv;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
vSplashOpacity=aSplashOpacity;vSplashUv=uv;`,
        )),
        (e.fragmentShader =
          `varying float vSplashOpacity;varying vec2 vSplashUv;
` + e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
      float edge=1.-smoothstep(.68,1.,abs(vSplashUv.x*2.-1.));
      float broken=.25+.75*smoothstep(-.6,.8,sin(vSplashUv.x*51.+sin(vSplashUv.y*9.)*3.));
      diffuseColor.a*=vSplashOpacity*edge*smoothstep(0.,.12,vSplashUv.y)*mix(1.,broken,vSplashUv.y);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.83,.92,.87),smoothstep(.78,1.,vSplashUv.y)*.42);`,
        )));
    }),
    (f.customProgramCacheKey = () => `mill-impact-fans-v1`));
  let p = new vi(d, f);
  ((p.name = `Wheel impact sheets`),
    (p.frustumCulled = !1),
    (p.receiveShadow = !0),
    (p.renderOrder = 4),
    o.add(p));
  let m = new Go(1, 7, 5),
    h = new Float32Array(112);
  m.setAttribute(`aSplashOpacity`, new Ii(h, 1).setUsage(Xe));
  let g = new rs({
    color: `#abd0c8`,
    roughness: 0.12,
    transparent: !0,
    opacity: 0.66,
    depthWrite: !1,
    envMapIntensity: 1.1,
  });
  ((g.onBeforeCompile = (e) => {
    ((e.vertexShader =
      `attribute float aSplashOpacity;varying float vSplashOpacity;
` + e.vertexShader),
      (e.vertexShader = e.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
vSplashOpacity=aSplashOpacity;`,
      )),
      (e.fragmentShader =
        `varying float vSplashOpacity;
` + e.fragmentShader),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
diffuseColor.a*=vSplashOpacity;`,
      )));
  }),
    (g.customProgramCacheKey = () => `mill-impact-droplets-v1`));
  let _ = new Wi(m, g, 112);
  ((_.name = `Wheel impact droplets`),
    (_.frustumCulled = !1),
    (_.receiveShadow = !0),
    (_.renderOrder = 5),
    _.instanceMatrix.setUsage(Xe),
    o.add(_));
  let v = new Nn(),
    y = new U(),
    b = new U(0, 1, 0),
    x = !0,
    S = [],
    C = 0;
  function w(e) {
    ((C = e), (S = Vv(e, Pv, r)));
    let t = Hv(i, e);
    for (let e = 0; e < 6; e++) {
      let t = S[e];
      a.uMillImpacts.value[e].set(
        t?.x || 0,
        t?.z || 0,
        t?.age || 0,
        t?.strength || 0,
      );
    }
    for (let e = 0; e < Uv; e++) {
      let n = t[e];
      a.uMillWash.value[e].set(
        n?.width || 0,
        n?.wash || 0,
        n?.age || 0,
        n?.strength || 0,
      );
    }
    a.uMillAmount.value = x ? (n ? 0.32 : 1) : 0;
    let o = [];
    for (let e of S) {
      if (e.kind === `exit` || !e.burst || e.age > 0.64 * e.linger) continue;
      let t = 0.52 + e.volume * 0.48;
      if (e.kind === `spill`)
        (o.push({
          ...e,
          nx: 0.32 + e.lean,
          nz: 0.95,
          width: 0.68 * e.width,
          rise: 0.34 * t,
          duration: 0.64 * e.linger,
        }),
          e.volume > 0.72 &&
            o.push({
              ...e,
              x: e.x + 0.32,
              nx: 0.96,
              nz: 0.28 - e.lean,
              width: 0.34 * e.width,
              rise: 0.26 * t,
              duration: 0.54 * e.linger,
            }));
      else
        for (let n of [-1, 1])
          o.push({
            ...e,
            x: e.x + n * 0.48,
            nx: n * 0.97,
            nz: -0.24 + e.lean,
            width: 0.34 * e.width * (1 + n * e.lean),
            rise: 0.2 * t * (1 - n * e.lean),
            duration: 0.52 * e.linger,
          });
    }
    for (let e of t) e.age < e.duration && o.push(e);
    let l = 0;
    if (x && !n)
      for (let e of o) {
        if (e.age >= e.duration || l >= 24) continue;
        let t = e.age / e.duration,
          n = Math.sin(t * Math.PI),
          r = e.cycle * 1.73;
        for (let i = 0; i <= 5; i++)
          for (let a = 0; a <= 20; a++) {
            let o = i / 5,
              u = (a / 20) * 2 - 1,
              d = l * 126 + i * 21 + a,
              f = e.kind === `masonry`,
              p = f
                ? 0.95 +
                  0.035 * Math.sin(u * 6 + r) +
                  0.015 * Math.sin(u * 11 - r)
                : 0.88 +
                  0.08 * Math.sin(u * 9 + r) +
                  0.04 * Math.sin(u * 17 - r),
              m = u * e.width * (f ? 1 : (0.62 + t * 0.48) * (1 - o * 0.12)),
              h = f
                ? (1 - o) * (0.08 + t * 0.15)
                : o * (0.045 + t * 0.28) + o * o * 0.1;
            s[d * 3] = e.x - e.nz * m + e.nx * h;
            let g = f ? e.wash / e.strength : n;
            ((s[d * 3 + 1] =
              q +
              0.008 +
              Math.sin(o * Math.PI * (f ? 0.5 : 0.68)) *
                e.rise *
                g *
                Math.max(0, Math.cos((u * Math.PI) / 2)) ** 0.45 *
                p),
              (s[d * 3 + 2] = e.z + e.nx * m + e.nz * h),
              (c[d] = f
                ? g * 0.65
                : Math.min(1, t * 10) * Math.min(1, (1 - t) * 3)));
          }
        l++;
      }
    (d.setDrawRange(0, l * 20 * 5 * 6),
      (p.visible = l > 0),
      l &&
        ((d.attributes.position.needsUpdate = !0),
        (d.attributes.aSplashOpacity.needsUpdate = !0),
        d.computeVertexNormals()));
    let u = 0;
    if (x && !n)
      for (let e of S) {
        if (e.kind === `exit` || !e.burst || e.age > 0.88) continue;
        let t = createRandom(e.cycle * 73 + (e.kind === `spill` ? 881 : 199)),
          n = Math.round((e.kind === `spill` ? 30 : 18) * e.volume);
        for (let r = 0; r < n && u < 112; r++) {
          let n = e.age - t() * 0.14 * e.linger,
            r = t() * Math.PI * 2,
            i = (0.4 + t() * 0.95) * e.width,
            a =
              ((e.kind === `spill` ? 2.1 : 1.35) +
                t() * (e.kind === `spill` ? 1.05 : 0.85)) *
              (0.7 + e.volume * 0.28),
            o = e.x + (t() - 0.5) * 0.92 * e.width,
            s = e.z + (t() - 0.5) * 0.13,
            c = Math.cos(r) * i,
            l = Math.sin(r) * i + (e.kind === `spill` ? 0.22 : -0.1),
            d = 0.01 + t() * 0.012,
            f = q + 0.025 + a * n - 4.905 * n * n;
          n < 0 ||
            f <= 0.192 ||
            (v.position.set(o + c * n, f, s + l * n),
            y.set(c, a - 9.81 * n, l),
            v.scale.set(d, d * (1 + Math.min(1.3, y.length() * 0.4)), d),
            v.quaternion.setFromUnitVectors(b, y.normalize()),
            v.updateMatrix(),
            _.setMatrixAt(u, v.matrix),
            (h[u] = Math.min(1, n * 35) * Math.min(1, (f - q) * 16)),
            u++);
        }
      }
    if (x && !n)
      for (let e of t) {
        if (e.strength < 0.84 || e.age < 0.48 || e.age > 1.03) continue;
        let t = createRandom(e.seed + e.cycle * 173);
        for (let n = 0; n < 3 && u < 112; n++) {
          let n = e.age - 0.48 - t() * 0.18,
            r = (t() - 0.5) * e.width * 1.6,
            i = 0.2 + t() * 0.3,
            a = 0.8 + t() * 0.5,
            o = 0.009 + t() * 0.006,
            s = q + 0.04 + a * n - 4.905 * n * n;
          n < 0 ||
            s <= 0.192 ||
            (v.position.set(
              e.x - e.nz * r + e.nx * i * n,
              s,
              e.z + e.nx * r + e.nz * i * n,
            ),
            y.set(e.nx * i, a - 9.81 * n, e.nz * i),
            v.scale.set(o, o * 1.7, o),
            v.quaternion.setFromUnitVectors(b, y.normalize()),
            v.updateMatrix(),
            _.setMatrixAt(u, v.matrix),
            (h[u] = Math.min(1, n * 30) * Math.min(1, (s - q) * 14) * 0.6),
            u++);
        }
      }
    ((_.count = u),
      (_.visible = u > 0),
      (_.instanceMatrix.needsUpdate = !0),
      (m.attributes.aSplashOpacity.needsUpdate = !0));
  }
  return (
    o.traverse((e) => {
      e.userData.skipAO = !0;
    }),
    w(0),
    {
      uniforms: a,
      group: o,
      sheets: p,
      drops: _,
      contacts: i,
      update: w,
      setEnabled(e) {
        ((x = !!e), w(C));
      },
      get atImpact() {
        return (
          !n &&
          x &&
          S.some(
            (e) =>
              e.kind === `spill` && e.burst && e.age > 0.18 && e.age < 0.27,
          )
        );
      },
    }
  );
}
var qv = 1 / 120;
