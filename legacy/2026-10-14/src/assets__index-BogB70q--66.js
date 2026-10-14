// assets__index-BogB70q- 66 — color
// Lines 62782-63064 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function XS() {
  let e = new ts({
      name: `Fire behind the stove glass`,
      transparent: !0,
      depthWrite: !1,
      side: 1,
      clipping: !0,
      uniforms: { uFireTime: { value: 0 }, uFireEye: { value: new U() } },
      vertexShader: `
      #include <common>
      #include <clipping_planes_pars_vertex>
      varying vec3 vFirePosition;
      void main(){vFirePosition=position;vec4 mvPosition=modelViewMatrix*vec4(position,1.);
        gl_Position=projectionMatrix*mvPosition;
        #include <clipping_planes_vertex>
      }`,
      fragmentShader: `
      #include <clipping_planes_pars_fragment>
      ${qS}
      uniform float uFireTime;uniform vec3 uFireEye;varying vec3 vFirePosition;
      void main(){
        #include <clipping_planes_fragment>
        vec3 ray=normalize(vFirePosition-uFireEye),inv=1./(ray+vec3(.000001));
        vec3 a=(-.5-uFireEye)*inv,b=(.5-uFireEye)*inv;
        vec3 lo=min(a,b),hi=max(a,b);
        float near=max(0.,max(lo.x,max(lo.y,lo.z))),far=min(hi.x,min(hi.y,hi.z));
        if(far<=near)discard;
        float stepSize=(far-near)/28.;vec4 fire=vec4(0.);
        for(int i=0;i<28;i++){
          vec3 p=uFireEye+ray*(near+(float(i)+.5)*stepSize);float h=p.y+.5;
          vec3 flow=p*vec3(6.,4.,5.)-vec3(0.,uFireTime*2.25,0.);
          float turbulence=stoveNoise(flow)*.65+stoveNoise(flow*2.1+4.7)*.35;
          float curl=sin(h*5.-uFireTime*2.1)*h*.075;
          float tongues=0.;
          for(int j=0;j<3;j++){
            float seed=float(j),x=(seed-1.)*.235+curl+(stoveNoise(flow*.7+seed*3.)-.5)*h*.2;
            float width=mix(.14,.015,smoothstep(.08,.88,h));
            float tip=.56+.22*sin(uFireTime*1.4+seed*2.8)+turbulence*.17;
            float body=exp(-pow((p.x-x)/width,2.)-pow((p.z+.015)/(.22-h*.13),2.));
            tongues+=body*(1.-smoothstep(tip-.24,tip+.03,h));
          }
          float density=max(0.,tongues*(.5+turbulence)-.12)*smoothstep(0.,.08,h);
          density*=1.-smoothstep(.84,1.,h);
          float alpha=1.-exp(-density*stepSize*6.);
          vec3 color=mix(vec3(1.7,.20,.012),vec3(3.8,1.65,.27),clamp(density*.7,0.,1.));
          color=mix(color,vec3(4.6,3.5,1.45),smoothstep(1.1,1.8,density)*(1.-h));
          fire.rgb+=(1.-fire.a)*color*alpha;fire.a+=(1.-fire.a)*alpha;
        }
        if(fire.a<.005)discard;
        gl_FragColor=vec4(fire.rgb/max(fire.a,.001),fire.a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    }),
    t = new vi(new ba(1, 1, 1), e),
    n = new W();
  return (
    (t.name = `A small contained wood fire`),
    t.scale.set(0.43, 0.39, 0.28),
    t.position.set(0, 0.62, 0),
    (t.userData.skipAO = !0),
    (t.renderOrder = 2),
    (t.onBeforeRender = (r, i, a) => {
      (n.copy(t.matrixWorld).invert(),
        e.uniforms.uFireEye.value
          .setFromMatrixPosition(a.matrixWorld)
          .applyMatrix4(n));
    }),
    t
  );
}
function ZS(e, { reducedMotion: t = !1 } = {}) {
  let n = new Pn();
  ((n.name = `The keeper’s wood stove`),
    n.position.set(Wy.stove.x, Wy.upper, Wy.stove.z),
    (n.rotation.y = Wy.stove.heading),
    e.add(n));
  let r = JS(
      new rs({
        name: `Seasoned cast iron`,
        color: `#383733`,
        metalness: 0.68,
        roughness: 0.64,
      }),
      95,
      8e-4,
    ),
    i = new rs({
      name: `Worn iron edges`,
      color: `#4b4942`,
      metalness: 0.8,
      roughness: 0.42,
    }),
    a = JS(
      new rs({ name: `Slate hearth`, color: `#494c47`, roughness: 0.93 }),
      38,
      0.0014,
    ),
    o = new rs({
      name: `Soot inside the firebox`,
      color: `#15120e`,
      roughness: 1,
    }),
    s = JS(
      new rs({ name: `Warm firebrick`, color: `#614434`, roughness: 1 }),
      72,
      0.001,
    ),
    c = JS(
      new rs({
        name: `Charred logs`,
        color: `#24211c`,
        roughness: 0.98,
        emissive: `#ff4a08`,
        emissiveIntensity: 0.8,
      }),
      65,
      0.002,
    ),
    l = c.onBeforeCompile;
  ((c.onBeforeCompile = (e) => {
    (l(e),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <emissivemap_fragment>`,
        `#include <emissivemap_fragment>
      float cracks=pow(1.-abs(sin(vStoveFinish.y*83.+stoveNoise(vStoveFinish*29.)*5.)),18.);
      totalEmissiveRadiance*=.012+cracks*(.2+stoveNoise(vStoveFinish*41.)*.8);`,
      )));
  }),
    (c.customProgramCacheKey = () => `stove-charred-log-v1`));
  let u = JS(
      new rs({
        name: `Embers beneath the logs`,
        color: `#352015`,
        roughness: 1,
        emissive: `#e84405`,
        emissiveIntensity: 0.6,
      }),
      90,
      0.001,
    ),
    d = u.onBeforeCompile;
  ((u.onBeforeCompile = (e) => {
    (d(e),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <emissivemap_fragment>`,
        `#include <emissivemap_fragment>
totalEmissiveRadiance*=.12+pow(stoveGrain,3.)*1.5;`,
      )));
  }),
    (u.customProgramCacheKey = () => `stove-embers-v1`));
  function f(e, t, r, i, a) {
    let o = new vi(e, t);
    return (
      o.position.set(r, i, a),
      (o.castShadow = o.receiveShadow = !0),
      n.add(o),
      o
    );
  }
  function p(e, t, n, i, a, o, s = r, c = 0.008) {
    return f(new GS(e, t, n, 2, Math.min(c, e / 3, t / 3, n / 3)), s, i, a, o);
  }
  function m(e, t, n, i, a, o = r) {
    return f(new Sa(e, e, t, 24), o, n, i, a);
  }
  for (let e = 0; e < 2; e++)
    for (let t = 0; t < 2; t++)
      p(
        0.386,
        0.044,
        0.366,
        (e - 0.5) * 0.394,
        0.031,
        (t - 0.5) * 0.374,
        a,
        0.008,
      );
  for (let e of [-0.218, 0.218])
    for (let t of [-0.17, 0.17])
      (p(0.06, 0.19, 0.065, e, 0.15, t, r),
        p(0.085, 0.035, 0.085, e, 0.064, t, i));
  (p(0.57, 0.065, 0.49, 0, 0.264, 0),
    p(0.59, 0.068, 0.5, 0, 0.9, 0),
    p(0.042, 0.57, 0.46, -0.256, 0.58, 0),
    p(0.042, 0.57, 0.46, 0.256, 0.58, 0),
    p(0.51, 0.57, 0.034, 0, 0.58, -0.218),
    p(0.47, 0.045, 0.4, 0, 0.34, 0, o),
    p(0.46, 0.49, 0.018, 0, 0.61, -0.192, s, 0.004),
    p(0.49, 0.065, 0.45, 0, 0.302, 0.025),
    p(0.18, 0.017, 0.022, 0, 0.305, 0.264, i, 0.005));
  for (let e = 0; e < 5; e++)
    p(0.042, 0.012, 0.007, (e - 2) * 0.074, 0.302, 0.254, o, 0.002);
  let h = YS(to, 0.54, 0.515, 0.048);
  (h.holes.push(YS(eo, 0.43, 0.4, 0.029)),
    f(
      new Bo(h, {
        depth: 0.025,
        bevelEnabled: !0,
        bevelSize: 0.005,
        bevelThickness: 0.005,
        bevelSegments: 2,
        curveSegments: 5,
      }),
      r,
      0,
      0.605,
      0.239,
    ));
  for (let e of [0.45, 0.76]) m(0.015, 0.07, -0.27, e, 0.263, i);
  let g = m(0.012, 0.067, 0.277, 0.615, 0.294, i);
  g.rotation.x = Math.PI / 2;
  let _ = m(0.019, 0.105, 0.284, 0.59, 0.329, r);
  _.rotation.z = 0.2;
  let v = new is({
      name: `Slightly sooted stove glass`,
      color: `#a57d51`,
      transparent: !0,
      opacity: 0.065,
      roughness: 0.17,
      metalness: 0,
      clearcoat: 1,
      depthWrite: !1,
    }),
    y = f(new Wo(0.44, 0.41), v, 0, 0.605, 0.272);
  ((y.castShadow = !1), (y.renderOrder = 3));
  for (let e = 0; e < 3; e++) {
    let t = m(
      0.043 + (e % 2) * 0.011,
      0.36,
      (e - 1) * 0.022,
      0.389 + (e === 2 ? 0.058 : 0),
      (e - 1) * 0.082,
      c,
    );
    ((t.rotation.z = Math.PI / 2), (t.rotation.y = (e - 1) * 0.19));
  }
  for (let e = 0; e < 15; e++) {
    let t = f(
      new wa(0.019 + (e % 3) * 0.005),
      u,
      (((e * 7) % 11) - 5) * 0.034,
      0.368,
      ((e % 3) - 1) * 0.105,
    );
    ((t.scale.y = 0.48), t.rotation.set(e * 0.71, e * 1.3, e * 0.42));
  }
  let b = Wy.ceiling - Wy.upper - 0.93;
  m(0.067, b, 0, 0.93 + b / 2, -0.075);
  for (let e of [0.965, 1.53]) m(0.075, 0.04, 0, e, -0.075, i);
  p(0.23, 0.035, 0.23, 0, Wy.ceiling - Wy.upper - 0.018, -0.075, r, 0.018);
  let x = f(new Ko(0.137, 0.006, 8, 40), i, 0, 0.937, 0.04);
  x.rotation.x = Math.PI / 2;
  let S = XS();
  n.add(S);
  let C = new ac(`#ffb56a`, 3.8, 4.5, Math.PI * 0.46, 1, 2);
  (C.position.set(0, 0.6, 0.32),
    C.target.position.set(0, 0.25, 3),
    n.add(C, C.target),
    (C.castShadow = !0),
    C.shadow.mapSize.set(512, 512),
    (C.shadow.camera.near = 0.045),
    (C.shadow.camera.far = 4.5),
    (C.shadow.bias = -4e-4),
    (C.shadow.normalBias = 0.012),
    (C.shadow.radius = 4),
    (C.shadow.autoUpdate = !1),
    (C.shadow.needsUpdate = !0),
    n.traverse((e) => {
      e.userData.aboveWater = !0;
    }),
    a_(n));
  let w = 0;
  function T(e) {
    (t || (w += Math.min(0.1, Math.max(0, e))),
      (S.material.uniforms.uFireTime.value = w));
    let n = KS(w);
    ((C.intensity = 3.8 * n),
      (u.emissiveIntensity = 0.6 * n),
      (c.emissiveIntensity = 0.8 * n));
  }
  return (T(0), { root: n, fire: S, light: C, update: T });
}
