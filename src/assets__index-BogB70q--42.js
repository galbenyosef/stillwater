// assets__index-BogB70q- 42 — math
// Lines 55391-55877 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function uy(e, t, n, r = null) {
  let i = { value: 0 },
    a = cp(729),
    o = new Pn(),
    s = new Float32Array(256).fill(1),
    c = new Mi(s, 64, 1, D, v);
  ((c.minFilter = c.magFilter = l), (c.needsUpdate = !0));
  let u = `uniform sampler2D uSluiceHistory;uniform float uFlowRole,uPowerActive;
    float admittedWater(float travel){
      if(uFlowRole<.5||uPowerActive<.5)return 1.;
      float age=clamp(max(0.,travel)+(uFlowRole>1.5?.8:0.),0.,${(8).toFixed(1)})/${(8).toFixed(1)};
      float supply=texture2D(uSluiceHistory,vec2((age*63.+.5)/64.,.5)).r;
      return uFlowRole>1.5?1.-supply:supply;
    }`,
    d = null;
  ((o.name = `Mill spill`),
    o.position.set(2, 0, -1.2),
    (o.userData.aboveWater = !0),
    e.add(o));
  let f = `
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
    float fbm(vec2 p){return noise(p)*.57+noise(p*2.13+19.)*.28+noise(p*4.27-8.)*.15;}
  `,
    p = t.clone();
  p.repeat.set(0.7, 2.4);
  let m = qf.flows.map((e) => og(e.points, e.speed)),
    h = [0, 0, 0, 0];
  ((h[2] = m[1].duration - m[2].times[1]), (h[3] = h[2] + m[2].duration));
  let g = h[3] + m[3].duration;
  function _(e, t, n = 0) {
    let r = e.attributes.uv,
      i = new Float32Array(r.count),
      a = new Float32Array(r.count);
    for (let e = 0; e < r.count; e++) {
      let o = sg(t, 1 - r.getY(e));
      ((i[e] = n + o.time), (a[e] = o.distance));
    }
    (e.setAttribute(`aFlowTravel`, new Dr(i, 1)),
      e.setAttribute(`aFlowDistance`, new Dr(a, 1)),
      e.setAttribute(
        `aFlowAmount`,
        new Dr(new Float32Array(r.count).fill(1), 1),
      ));
  }
  function y(e, t, n = 1, a = !1, o = 0, s = 4.065) {
    let l = new rs({
      color: a ? `#88b0a8` : `#bdd4d0`,
      transparent: !0,
      opacity: e,
      depthWrite: !1,
      side: 2,
      roughness: 0.13,
      metalness: 0.04,
      normalMap: p,
      normalScale: new V(a ? 0.18 : 0.28, a ? 0.3 : 0.44),
      envMapIntensity: 1.25,
    });
    return (
      (l.onBeforeCompile = (e) => {
        ((e.uniforms.uFlowTime = i),
          (e.uniforms.uFlowSeed = { value: t }),
          (e.uniforms.uFlowSpeed = { value: n }),
          (e.uniforms.uChannel = { value: +!!a }),
          (e.uniforms.uChannelBed = { value: s }),
          (e.uniforms.uSluiceHistory = { value: c }),
          (e.uniforms.uFlowRole = { value: o }),
          (e.uniforms.uPowerActive = { value: +!!r }),
          (e.vertexShader =
            `${u}\nvarying vec2 vFlowUv;varying float vFlowTravel,vFlowDistance,vFlowAmount;attribute float aFlowTravel,aFlowDistance,aFlowAmount;uniform float uFlowTime,uFlowSeed,uChannel,uChannelBed;\n` +
            e.vertexShader),
          (e.vertexShader = e.vertexShader.replace(
            `#include <uv_vertex>`,
            `#include <uv_vertex>
vFlowUv=uv;vFlowTravel=aFlowTravel;vFlowDistance=aFlowDistance;vFlowAmount=aFlowAmount*admittedWater(aFlowTravel);`,
          )),
          (e.vertexShader = e.vertexShader.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
        float edge=(.45+.55*sin(uv.x*3.14159))*sin(uv.y*3.14159);
        float ripple=sin((aFlowTravel-uFlowTime)*11.+uv.x*3.)*.008+sin((aFlowTravel-uFlowTime)*19.-uv.x*6.)*.003;
        transformed+=normal*ripple*edge;
        transformed.y-=uChannel*(1.-vFlowAmount)*max(0.,position.y-uChannelBed-.003);`,
          )),
          (e.fragmentShader =
            `varying vec2 vFlowUv;varying float vFlowTravel,vFlowDistance,vFlowAmount;uniform float uFlowTime,uFlowSeed,uFlowSpeed,uChannel;${f}\n` +
            e.fragmentShader),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
        float flowTime=uFlowTime-vFlowTravel;
        vec2 flowP=vec2(vFlowUv.x*4.+uFlowSeed,-flowTime*6.);
        float bend=noise(flowP*vec2(.63,.25))*.85;
        float filament=fbm(vec2(flowP.x+bend,flowP.y*.24));
        float broken=fbm(vec2(flowP.x*.9,flowP.y*2.7));
        float bubbles=smoothstep(.61,.81,broken)*smoothstep(.38,.73,filament);
        float glimmer=pow(.5+.5*sin(flowP.y*3.2+filament*4.),10.);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.82,.90,.87),bubbles*.75+glimmer*.09);
        float sides=smoothstep(0.,.16,vFlowUv.x)*(1.-smoothstep(.84,1.,vFlowUv.x));
        float strands=smoothstep(.22,.64,filament)*(.40+.60*broken);
        float current=mix(.15+strands*.73+bubbles*.40,.52+strands*.32+bubbles*.25,uChannel);
        diffuseColor.a*=sides*current*vFlowAmount;`,
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <normal_fragment_maps>`,
            Gc.normal_fragment_maps.replaceAll(
              `vNormalMapUv`,
              `vec2(vFlowUv.x*.7,(uFlowTime-vFlowTravel)*.8)`,
            ),
          )));
      }),
      (l.customProgramCacheKey = () => `falling-water-v11`),
      l
    );
  }
  function b(e, t, n, r, i = 1, a = 1, s = g) {
    let c = new Pa(
        e.map((e) => new U(...e)),
        !1,
        `centripetal`,
      ),
      l = [],
      u = [],
      d = [],
      f = new U(1, 0, 0);
    for (let e = 0; e <= 64; e++) {
      let n = e / 64,
        i = c.getPoint(n),
        o = c.getTangent(n);
      a === 2 && Math.hypot(o.x, o.z) > 0.02
        ? f
            .copy(o)
            .cross(new U(0, 1, 0))
            .normalize()
        : f.addScaledVector(o, -f.dot(o)).normalize();
      let s =
        t * (0.68 + 0.21 * Math.sin(n * 19 + r) + 0.11 * Math.sin(n * 37 - r));
      i.x += Math.sin(n * 22 + r) * t * 0.035;
      for (let e of [-1, 1]) {
        let t = i.clone().addScaledVector(f, e * s * 0.5);
        (l.push(t.x, t.y, t.z), u.push((e + 1) * 0.5, 1 - n));
      }
      if (e < 64) {
        let t = e * 2;
        d.push(t, t + 1, t + 2, t + 1, t + 3, t + 2);
      }
    }
    let p = new Hr();
    (p.setAttribute(`position`, new Ar(l, 3)),
      p.setAttribute(`uv`, new Ar(u, 2)),
      p.setIndex(d),
      p.computeVertexNormals(),
      _(p, og(e, i), s));
    let m = new vi(p, y(n, r, i, !1, a));
    return ((m.receiveShadow = !0), (m.renderOrder = 4), o.add(m), m);
  }
  let x = [];
  for (let e = 0; e <= 15; e++) {
    let t = e / 15,
      n = 0.03 + Math.min(t / 0.85, 1) * 2.03;
    x.push([
      -0.84,
      t < 0.85
        ? 1.88 + Math.cos(n) * 1.965
        : It.lerp(1.88 + Math.cos(2.06) * 1.965, q + 0.015, (t - 0.85) / 0.15),
      -3 + Math.sin(n) * 1.965 + (t > 0.85 ? (t - 0.85) * 0.85 : 0),
    ]);
  }
  b(x, 0.86, 0.36, 33.34);
  for (let [e, t] of [-0.39, -0.26, -0.08, 0.17, 0.35].entries())
    b(
      x.map(([n, r, i], a) => [
        n + t + Math.sin(a * 0.65 + e * 2.1) * 0.047,
        r + 0.012,
        i + 0.025,
      ]),
      0.018 + a() * 0.03,
      0.36 + a() * 0.2,
      e * 3.13,
      1.1 + a() * 0.4,
    );
  if (n) {
    let t = n.clone(!0);
    ((t.name = `Woodland spring water`),
      (t.userData.aboveWater = !0),
      e.add(t),
      t.traverse((e) => {
        if (!e.isMesh) return;
        let t = qf.flows.find((t) => jc.sanitizeNodeName(t.name) === e.name);
        if (t) {
          let n = qf.flows.indexOf(t);
          ((e.geometry = e.geometry.clone()),
            _(e.geometry, m[n], h[n]),
            (e.material = y(
              t.opacity,
              n === 0 ? 27 : 33.34,
              t.speed,
              n === 1 || n === 2,
              n === 0 ? 0 : 1,
              n === 1 ? 4.31 : 4.065,
            )));
        } else {
          let t = new rs({
            color: `#578b7b`,
            transparent: !0,
            opacity: 0.58,
            depthWrite: !1,
            side: 2,
            roughness: 0.17,
            metalness: 0.08,
            normalMap: p,
            normalScale: new V(0.22, 0.22),
            envMapIntensity: 1.1,
          });
          ((t.onBeforeCompile = (e) => {
            ((e.uniforms.uSpringTime = i),
              (e.fragmentShader =
                `uniform float uSpringTime;
` + e.fragmentShader),
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <normal_fragment_maps>`,
                Gc.normal_fragment_maps.replaceAll(
                  `vNormalMapUv`,
                  `(vNormalMapUv*1.6+vec2(uSpringTime*.018,uSpringTime*.027))`,
                ),
              )));
          }),
            (t.customProgramCacheKey = () => `spring-basin-v1`),
            (e.material = t),
            (d = e));
        }
        ((e.castShadow = !1), (e.receiveShadow = !0), (e.renderOrder = 4));
      }));
  } else
    b(
      [
        [-0.84, 3.67, -7.32],
        [-0.84, 3.67, -5.68],
        [-0.84, 3.69, -3.2],
      ],
      0.81,
      0.42,
      19,
      0.52,
    );
  if (r) {
    let e = b(
      Tg.points.map(([e, t, n]) => [e - 2, t, n + 1.2]),
      0.29,
      0.62,
      41.7,
      0.55,
      2,
      0,
    );
    e.name = `Spring basin overflow`;
  }
  let S = Yh.paddles * 2,
    C = S * 23 * 2,
    w = new Float32Array(C * 3),
    T = new Float32Array(C * 3),
    E = new Float32Array(C * 2),
    O = new Float32Array(C),
    k = new Float32Array(C),
    A = [];
  for (let e = 0; e < S; e++)
    for (let t = 0; t <= 22; t++) {
      let n = (e * 23 + t) * 2;
      (E.set([0, 1 - t / 22, 1, 1 - t / 22], n * 2),
        t < 22 && A.push(n, n + 1, n + 2, n + 1, n + 3, n + 2));
    }
  let j = new Hr();
  for (let [e, t, n] of [
    [`position`, w, 3],
    [`normal`, T, 3],
    [`uv`, E, 2],
    [`aFlowTravel`, O, 1],
    [`aFlowAmount`, k, 1],
  ])
    j.setAttribute(e, new Dr(t, n).setUsage(Xe));
  (j.setAttribute(`aFlowDistance`, new Dr(new Float32Array(C), 1)),
    j.setIndex(A),
    j.setDrawRange(0, 0));
  let M = 0,
    N = new vi(j, y(0.72, 33.34));
  ((N.name = `Water draining from individual paddles`),
    (N.frustumCulled = !1),
    (N.receiveShadow = !0),
    (N.renderOrder = 4),
    o.add(N));
  let P = new ts({
      transparent: !0,
      depthWrite: !1,
      uniforms: { uTime: i },
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform float uTime;varying vec2 vUv;${f}
      void main(){
        vec2 p=(vUv-.5)*2.;float r=length(p),a=atan(p.y,p.x);
        vec2 drift=vec2(uTime*.08,-uTime*.58);
        float flecks=fbm(p*10.-drift);
        float foam=smoothstep(.48,.79,flecks);
        float patches=fbm(p*3.4-drift*.22);
        float edge=1.-smoothstep(.24+patches*.16,.72+patches*.27,r);
        float arc=1.-smoothstep(.025,.063,abs(fract(r*3.4-uTime*.22+patches*.14)-.55));
        float pulse=.88+.12*cos(uTime*${(Yh.angularSpeed * Yh.paddles).toFixed(4)});
        float alpha=(foam*.65+arc*.07)*edge*(.35+patches*.65)*pulse;
        gl_FragColor=vec4(.79,.89,.79,alpha);
      }`,
    }),
    F = [],
    I = qf.flows[0].points.at(-1);
  n && F.push([I[0] - 2, I[2] + 1.2, 0.65, 0.68, qf.basin.water + 0.016]);
  let ee = [];
  for (let [e, t, n, r, i] of F) {
    let a = new vi(new Wo(n, r), P);
    ((a.rotation.x = -Math.PI / 2),
      a.position.set(e, i, t),
      (a.renderOrder = 5),
      o.add(a),
      ee.push({ mesh: a, y: i }));
  }
  let te = n ? 380 : 304,
    ne = new Float32Array(te * 3),
    re = new Float32Array(te * 3),
    ie = new Float32Array(te),
    ae = new Float32Array(te),
    oe = Array.from({ length: te }, (e, t) => {
      let n = a(),
        r = a() * Math.PI * 2;
      if (t < 240)
        return {
          seed: n,
          paddle: !0,
          angle: 0.65 + a() * 1.5,
          side: (a() - 0.5) * 0.94,
          period: 1.65 + a() * 0.7,
          spread: (a() - 0.5) * 0.24,
        };
      if (t < 304) {
        let e = qf.flows[3].points.at(-1);
        return {
          seed: n,
          start: [e[0] - 2 + (a() - 0.5) * 0.7, e[1] + 0.012, e[2] + 1.2],
          velocity: [(a() - 0.5) * 0.4, 0.38 + a() * 0.9, 0.18 + a() * 0.45],
          life: 0.18 + a() * 0.2,
        };
      }
      let i = [I[0] - 2, I[2] + 1.2],
        o = 0.28 + a() * 0.45,
        s = 0.08 + a() * 0.2;
      return {
        seed: n,
        start: [
          i[0] + (a() - 0.5) * 0.18,
          qf.basin.water + 0.025,
          i[1] + (a() - 0.5) * 0.12,
        ],
        velocity: [Math.cos(r) * s, o, Math.sin(r) * s],
        life: o / 4.9,
      };
    });
  for (let e = 0; e < te; e++) ie[e] = 0.009 + a() * 0.022;
  let L = new Hr();
  (L.setAttribute(`position`, new Dr(ne, 3)),
    L.setAttribute(`aSize`, new Dr(ie, 1)),
    L.setAttribute(`aOpacity`, new Dr(ae, 1)),
    L.setAttribute(`aVelocity`, new Dr(re, 3)));
  let se = new ts({
      transparent: !0,
      depthWrite: !1,
      uniforms: { uResolution: { value: 800 } },
      vertexShader: `attribute float aSize,aOpacity;attribute vec3 aVelocity;uniform float uResolution;
      varying float vOpacity,vStretch;varying vec2 vDirection;
      void main(){vOpacity=aOpacity;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;
        vDirection=normalize((modelViewMatrix*vec4(aVelocity,0.)).xy+vec2(.0001));vDirection.y*=-1.;
        vStretch=1.+min(length(aVelocity),4.)*.32;
        gl_PointSize=clamp(aSize*uResolution/max(1.,-p.z)*vStretch,1.,7.);}`,
      fragmentShader: `varying float vOpacity,vStretch;varying vec2 vDirection;
      void main(){vec2 p=(gl_PointCoord-.5)*2.;
        p=vec2(dot(p,vec2(-vDirection.y,vDirection.x))*vStretch,dot(p,vDirection));
        float a=(1.-smoothstep(.12,1.,dot(p,p)))*vOpacity;gl_FragColor=vec4(.85,.93,.87,a);}`,
    }),
    ce = new ma(L, se);
  return (
    (ce.frustumCulled = !1),
    (ce.renderOrder = 5),
    o.add(ce),
    {
      update(e, t = innerHeight) {
        if (((i.value = e), (se.uniforms.uResolution.value = t * 1.8), r)) {
          for (let t = 0; t < 64; t++) s[t * 4] = r.supplyAt(e - (t / 63) * 8);
          c.needsUpdate = !0;
          let t = 0.1 * (1 - r.state.gateFlow);
          d && (d.position.y = t);
          for (let e of ee) e.mesh.position.y = e.y + t;
        }
        let n = 0;
        for (let t = 0; t < Yh.paddles; t++)
          if (ng(e, t, r)) {
            for (let i = 0; i <= 22; i++) {
              let a = i / 22,
                o = ag(e, t, 0, a, r),
                s = (0.014 + o.amount * 0.023) * (1 - a * 0.45),
                c = Math.hypot(o.vy, o.vz) || 1,
                l =
                  o.amount *
                  (0.78 + 0.22 * Math.sin(e * 3.1 - o.age * 13 + t)) *
                  (1 - a * 0.28);
              for (let e = 0; e < 2; e++) {
                let r = (e === 0 ? -1 : 1) * (0.22 + (t % 3) * 0.06),
                  a = ((n + e) * 23 + i) * 2;
                for (let e = 0; e < 2; e++) {
                  let t = a + e;
                  (w.set([o.x + r - 2 + (e - 0.5) * s, o.y, o.z + 1.2], t * 3),
                    T.set([0, -o.vz / c, o.vy / c], t * 3),
                    (O[t] = g + o.age),
                    (k[t] = l));
                }
              }
            }
            n += 2;
          }
        let a = n * 23 * 2;
        j.setDrawRange(0, n * 22 * 6);
        for (let e of [`position`, `normal`, `aFlowTravel`, `aFlowAmount`]) {
          let t = j.attributes[e];
          (a < M && t.array.fill(0, a * t.itemSize, M * t.itemSize),
            t.clearUpdateRanges(),
            t.addUpdateRange(0, a * t.itemSize),
            (t.needsUpdate = !0));
        }
        M = a;
        for (let t = 0; t < te; t++) {
          let n = oe[t];
          if (n.paddle) {
            let i = Math.floor((e + n.seed * n.period) / n.period),
              a = (i - n.seed) * n.period,
              o = e - a;
            n.cycle !== i &&
              ((n.release = rg(
                a,
                Math.round((n.angle - Xh(a, r)) / ((Math.PI * 2) / Yh.paddles)),
                n.side,
                r,
              )),
              (n.release.velocity[0] = n.spread),
              (n.cycle = i));
            let s = n.release,
              c = ig(s, Math.min(o, s.life)),
              l = s.amount * 0.55;
            if (o > s.life) {
              let e = o - s.life,
                r = 0.75 + (t % 7) * 0.13;
              ((c.x += n.spread * e * 2),
                (c.z += s.velocity[2] * e * 0.7),
                (c.y = q + 0.022 + r * e - 4.905 * e * e),
                (c.vy = r - 9.81 * e),
                (l *= Math.max(0, 1 - e / (r / 4.905))));
            } else l *= Math.min(1, o * 25);
            (ne.set([c.x - 2, Math.max(q + 0.015, c.y), c.z + 1.2], t * 3),
              re.set([c.vx, c.vy, c.vz], t * 3),
              (ae[t] = l));
            continue;
          }
          let i = (e / n.life + n.seed) % 1,
            a = i * n.life;
          ((ne[t * 3] = n.start[0] + n.velocity[0] * a),
            (ne[t * 3 + 1] = n.start[1] + n.velocity[1] * a - 4.9 * a * a),
            (ne[t * 3 + 2] = n.start[2] + n.velocity[2] * a),
            re.set(
              [n.velocity[0], n.velocity[1] - 9.8 * a, n.velocity[2]],
              t * 3,
            ),
            (ae[t] =
              Math.min(1, i * 12) *
              Math.min(1, (1 - i) * 9) *
              (0.27 + (t % 7) * 0.055) *
              (r && t < 304 ? r.flowAt(e - a) : 1)));
        }
        ((L.attributes.position.needsUpdate = !0),
          (L.attributes.aOpacity.needsUpdate = !0),
          (L.attributes.aVelocity.needsUpdate = !0));
      },
    }
  );
}
