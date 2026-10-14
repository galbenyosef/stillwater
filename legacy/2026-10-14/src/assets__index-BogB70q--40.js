// assets__index-BogB70q- 40 — visible
// Lines 54642-54899 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function sy(e) {
  let t = iy(),
    n = ny * 6,
    r = new Hr();
  for (let [e, t] of [
    [`position`, 3],
    [`aWake`, 4],
    [`aDirection`, 2],
    [`aKind`, 1],
  ])
    r.setAttribute(e, new Dr(new Float32Array(n * t), t).setUsage(Xe));
  (r.setIndex(new Dr(new Uint16Array((ny - 1) * 18), 1).setUsage(Xe)),
    r.setDrawRange(0, 0));
  let i = { uTime: { value: 0 }, uNormals: { value: e } },
    a = new vi(
      r,
      new ts({
        uniforms: i,
        depthTest: !1,
        depthWrite: !1,
        transparent: !0,
        blending: 5,
        blendEquation: 100,
        blendSrc: 201,
        blendDst: 201,
        side: 2,
        toneMapped: !1,
        vertexShader: `attribute vec4 aWake;attribute vec2 aDirection;attribute float aKind;
      varying vec4 vWake;varying vec2 vDirection,vWorld;varying float vKind;
      void main(){vWake=aWake;vDirection=aDirection;vKind=aKind;vWorld=position.xz;
        gl_Position=vec4(position.x/22.,position.z/22.,0.,1.);}`,
        fragmentShader: `uniform float uTime;uniform sampler2D uNormals;
      varying vec4 vWake;varying vec2 vDirection,vWorld;varying float vKind;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
      void main(){
        float across=vWake.x,arc=vWake.y,age=max(0.,vWake.z),strength=vWake.w;
        float edge=1.-smoothstep(.70,1.,abs(across));
        float fade=(1.-smoothstep(5.8,${ey},age))*strength;
        vec2 right=normalize(vDirection),forward=vec2(-right.y,right.x);
        vec2 slope=vec2(0.);float foam=0.,height=0.;
        if(vKind<.5){
          float twist=sin(arc*4.3-age*1.8)*.17+sin(arc*7.7+age)*.055;
          vec2 swirl=vec2((across+twist)*3.6,arc*3.2-age*1.15);
          vec2 fine=texture2D(uNormals,vWorld*.7+vec2(uTime*.013,-uTime*.009)).xy*2.-1.;
          float patches=noise(swirl)+noise(swirl*2.3+age*.35)*.27;
          float center=exp(-across*across*2.8)*edge;
          float freshness=exp(-age*.24);
          slope=(right*(sin(across*13.+arc*5.-age*4.)*.055+fine.x*.13)
            +forward*(cos(across*11.-arc*7.+age*3.)*.045+fine.y*.085))*fade*center*freshness;
          foam=smoothstep(.43,.81,patches)*center*fade*freshness*.86;
          foam*=.7+.3*noise(vec2(across*30.,arc*19.)+age*.4);
          // A narrow jet starts inside the lower leg; bubbles develop as it mixes.
          foam*=.30+.70*smoothstep(0.,.30,age);
          height=sin(across*12.+arc*4.-age*3.2)*.009*center*fade*freshness;
        }else{
          float forming=.14+.86*smoothstep(.04,.65,age);
          float phase=across*8.2+sin(arc*1.9-age*.8)*.48;
          float packet=exp(-across*across*2.8)*edge;
          float crest=sin(phase)*packet;
          slope=-right*crest*fade*exp(-age*.10)*.24*forming;
          float breakup=smoothstep(.18,.82,noise(vec2(arc*6.5,across*11.-age*1.6)));
          foam=pow(max(0.,cos(phase)),6.)*packet*fade*exp(-age*.28)*breakup*.16*smoothstep(.08,.70,age);
          height=cos(phase)*packet*fade*exp(-age*.10)*.029*forming;
        }
        gl_FragColor=vec4(slope,foam,height);
      }`,
      }),
    );
  ((a.frustumCulled = !1), (a.name = `Boat wake field`));
  let o = new Un();
  o.add(a);
  let s = new $s(),
    c = new Hr();
  (c.setAttribute(`position`, new Dr(new Float32Array(144), 3).setUsage(Xe)),
    c.setAttribute(`aRipple`, new Dr(new Float32Array(192), 4).setUsage(Xe)),
    c.setDrawRange(0, 0));
  let l = new vi(
    c,
    new ts({
      depthTest: !1,
      depthWrite: !1,
      transparent: !0,
      blending: 5,
      blendEquation: 100,
      blendSrc: 201,
      blendDst: 201,
      side: 2,
      toneMapped: !1,
      vertexShader: `attribute vec4 aRipple;varying vec4 vRipple;
      void main(){vRipple=aRipple;gl_Position=vec4(position.x/22.,position.z/22.,0.,1.);}`,
      fragmentShader: `varying vec4 vRipple;
      void main(){
        float r=length(vRipple.xy),age=vRipple.z,strength=vRipple.w;
        float front=.09+age*.72,delta=r-front;
        float envelope=exp(-pow(delta/.22,2.))+.46*exp(-pow((delta+.34)/.19,2.))*smoothstep(.35,.85,age);
        float fade=(1.-smoothstep(1.3,${ay},age))*strength/(1.+age*.6);
        float phase=delta*17.;
        vec2 slope=vRipple.xy/max(r,.025)*sin(phase)*envelope*fade*.16;
        float height=cos(phase)*envelope*fade*.017;
        float broken=.58+.42*sin(atan(vRipple.y,vRipple.x)*11.+r*39.);
        float foam=exp(-r*r/max(.015,age*.15))*exp(-age*5.)*strength*.20*broken;
        gl_FragColor=vec4(slope,foam,height);
      }`,
    }),
  );
  ((l.name = `Fish contact field`),
    (l.frustumCulled = !1),
    (l.visible = !1),
    o.add(l));
  let u = new rn(768, 768, { type: y, depthBuffer: !1, stencilBuffer: !1 });
  u.texture.name = `Persistent boat wake`;
  let d = new G(),
    f = () => r.drawRange.count > 0 || c.drawRange.count > 0,
    p = !1;
  return {
    texture: u.texture,
    history: t,
    geometry: r,
    rippleGeometry: c,
    get active() {
      return f();
    },
    reset() {
      (t.reset(), r.setDrawRange(0, 0));
    },
    setLow(e) {
      let t = e ? 768 : 1024;
      u.width !== t && (u.setSize(t, t), (p = !1));
    },
    update(e, n, a = []) {
      let o = 0;
      for (let e of a.slice(-8)) {
        if (e.age < 0 || e.age > 3.8) continue;
        let t = 0.55 + e.age * 0.72;
        for (let [n, r] of [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ])
          (c.attributes.position.setXYZ(o, e.x + n * t, 0, e.z + r * t),
            c.attributes.aRipple.setXYZW(o, n * t, r * t, e.age, e.strength),
            o++);
      }
      (c.setDrawRange(0, o), (l.visible = o > 0));
      for (let e of Object.values(c.attributes)) e.needsUpdate = !0;
      t.update(e, n);
      let s = t.rows(e, n);
      i.uTime.value = e;
      let u = r.attributes.position,
        d = r.attributes.aWake,
        f = r.attributes.aDirection,
        p = r.attributes.aKind,
        m = 0;
      for (let t = 0; t < s.length; t++) {
        let n = s[t],
          i = Math.max(0, e - n.born),
          a = n.dz,
          o = -n.dx,
          c = n.beam + i * (0.27 + n.speed * 0.055),
          l = 0.065 + 0.23 * (1 - Math.exp(-i * 3)) + Math.sqrt(i) * 0.12,
          h = 0.025 + 0.49 * (1 - Math.exp(-i * 2.3)) + i * 0.032,
          g = Math.sin(i * 0.65 + n.arc * 0.8) * 0.027 * i,
          _ = i * 0.009;
        for (let e = 0; e < 3; e++)
          for (let r = 0; r < 2; r++) {
            let s = e === 1 ? -1 : 1,
              m = r * 2 - 1,
              v = e === 0 ? m * l : s * c + m * h,
              y = e === 0 ? 0 : n.shoulderOffset,
              b = t * 6 + e * 2 + r;
            (u.setXYZ(
              b,
              n.x + n.dx * y + a * v + g,
              0,
              n.z + n.dz * y + o * v + _,
            ),
              d.setXYZW(b, m, n.arc, i, n.strength),
              f.setXY(b, a, o),
              p.setX(b, e === 0 ? 0 : 1));
          }
        if (t > 0 && s[t - 1].stroke === n.stroke)
          for (let e = 0; e < 3; e++) {
            let n = t * 6 + e * 2,
              i = n - 6;
            (r.index.array.set([i, i + 1, n, i + 1, n + 1, n], m), (m += 6));
          }
      }
      for (let e of Object.values(r.attributes)) e.needsUpdate = !0;
      ((r.index.needsUpdate = !0), r.setDrawRange(0, m));
    },
    render(e) {
      let t = f();
      if (!t && p) return;
      p = !1;
      let n = e.getRenderTarget(),
        i = e.getClearAlpha(),
        c = e.clippingPlanes,
        l = e.shadowMap.autoUpdate,
        m = e.shadowMap.needsUpdate;
      (e.getClearColor(d),
        (e.shadowMap.autoUpdate = !1),
        (e.shadowMap.needsUpdate = !1));
      try {
        ((e.clippingPlanes = []),
          e.setClearColor(0, 0),
          e.setRenderTarget(u),
          e.clear(),
          (a.visible = r.drawRange.count > 0),
          t && e.render(o, s),
          (p = !t));
      } finally {
        (e.setRenderTarget(n),
          e.setClearColor(d, i),
          (e.clippingPlanes = c),
          (e.shadowMap.autoUpdate = l),
          (e.shadowMap.needsUpdate = m));
      }
    },
  };
}
function cy(e) {
  let t = [];
  e.traverse((e) => {
    e.isLOD && e.userData.reflectionLOD && t.push(e);
  });
  let n = t.map((e) => ({ auto: !0, visible: Array(e.levels.length) }));
  return (e, r, i) => {
    let a = e.matrixWorld.elements;
    for (let i = 0; i < t.length; i++) {
      let o = t[i],
        s = n[i],
        c = o.matrixWorld.elements;
      s.auto = o.autoUpdate;
      for (let e = 0; e < o.levels.length; e++)
        s.visible[e] = o.levels[e].object.visible;
      let l = Math.hypot(a[12] - c[12], a[13] - c[13], a[14] - c[14]) / e.zoom,
        u = o.getObjectForDistance(l * r);
      o.autoUpdate = !1;
      for (let e of o.levels) e.object.visible = e.object === u;
    }
    try {
      return i();
    } finally {
      for (let e = 0; e < t.length; e++) {
        let r = t[e],
          i = n[e];
        r.autoUpdate = i.auto;
        for (let e = 0; e < r.levels.length; e++)
          r.levels[e].object.visible = i.visible[e];
      }
    }
  };
}
