// render-pipeline-01.js — the woodland light-field pass and the pond render pipeline (GTAO + bloom + output composer)
// Lines 32503-32750 of readable/assets__index-BogB70q-.pretty.js (cluster render-pipeline, statement-aligned).
function createWoodlandLightField(e, t, n, r = null) {
  let i = new Ji(),
    a = new W(),
    s = new U(),
    c = new rn(1, 1, { type: y, depthBuffer: !1, minFilter: o, magFilter: o }),
    l = !0,
    u = new Np({
      uniforms: {
        tDepth: { value: null },
        tShadow: { value: null },
        uInvProjection: { value: new W() },
        uCameraWorld: { value: new W() },
        uShadowMatrix: { value: new W() },
        uEye: { value: new U() },
        uSunDirection: { value: new U() },
        uShadowPixel: { value: new V() },
        uSteps: { value: 40 },
      },
      vertexShader: Pp,
      fragmentShader: `precision highp sampler2DShadow;
      ${cloudSunlightGlsl}
      uniform sampler2D tDepth;uniform sampler2DShadow tShadow;
      uniform mat4 uInvProjection,uCameraWorld,uShadowMatrix;
      uniform vec3 uEye,uSunDirection;uniform vec2 uShadowPixel;uniform int uSteps;varying vec2 vUv;
      float shaft(vec3 p,vec3 foot,float width){
        vec3 offset=p-foot;offset-=uSunDirection*dot(offset,uSunDirection);
        return exp(-dot(offset,offset)/(width*width));
      }
      float sunlight(vec3 p){
        vec4 q=uShadowMatrix*vec4(p,1.);q.xyz/=q.w;
        if(any(lessThan(q.xyz,vec3(0.)))||any(greaterThan(q.xyz,vec3(1.))))return 0.;
        vec2 r=uShadowPixel*2.;
        return .25*cloudSunlight(p)*(texture(tShadow,vec3(q.xy+vec2(-r.x,-r.y),q.z-.00015))+
          texture(tShadow,vec3(q.xy+vec2(r.x,-r.y),q.z-.00015))+
          texture(tShadow,vec3(q.xy+vec2(-r.x,r.y),q.z-.00015))+
          texture(tShadow,vec3(q.xy+r,q.z-.00015)));
      }
      void main(){
        float depth=texture2D(tDepth,vUv).r;
        vec4 view=uInvProjection*vec4(vUv*2.-1.,depth*2.-1.,1.);view/=view.w;
        vec3 end=(uCameraWorld*view).xyz,ray=normalize(end-uEye);
        float distanceToSurface=length(end-uEye);
        // Safe slab intersection also covers cameras inside the volume.
        vec3 invRay=mix(vec3(-1.),vec3(1.),step(vec3(0.),ray))/max(abs(ray),vec3(.000001));
        vec3 a=(vec3(${Lp})-uEye)*invRay,b=(vec3(${Rp})-uEye)*invRay;
        vec3 entry=min(a,b),leave=max(a,b);
        float start=max(0.,max(entry.x,max(entry.y,entry.z)));
        float stop=min(distanceToSurface,min(leave.x,min(leave.y,leave.z)));
        float stepSize=max(0.,stop-start)/float(uSteps),transmittance=1.,light=0.;
        if(stop>start){
          for(int i=0;i<56;i++){
            if(i>=uSteps)break;
            vec3 p=uEye+ray*(start+(float(i)+.5)*stepSize);
            vec2 bank=(p.xz-vec2(-20.,-4.))/vec2(10.,11.);
            float beams=${Fp};
            float density=(.0003+.032*beams)*(1.-smoothstep(.25,1.,dot(bank,bank)))*
              smoothstep(1.6,3.8,p.y)*(1.-smoothstep(7.5,11.,p.y));
            float opacity=1.-exp(-density*stepSize);
            light+=transmittance*opacity*sunlight(p);
            transmittance*=1.-opacity;
          }
        }
        gl_FragColor=vec4(light,1.-transmittance,-view.z,1.);
      }`,
    });
  ((u.uniforms.tDepth.value = n),
    (u.uniforms.uCloudShadow = r?.uniforms.uCloudShadow ?? { value: new V() }),
    (u.material.name = `woodland light field`));
  let d = new Np({
    uniforms: {
      tDiffuse: { value: null },
      tField: { value: null },
      tDepth: { value: null },
      uPixel: { value: new V() },
      uNear: { value: e.near },
      uFar: { value: e.far },
      uLight: { value: new G() },
    },
    vertexShader: Pp,
    fragmentShader: `#include <packing>
      uniform sampler2D tDiffuse,tField,tDepth;uniform vec2 uPixel;
      uniform float uNear,uFar;uniform vec3 uLight;varying vec2 vUv;
      void main(){
        float depth=-perspectiveDepthToViewZ(texture2D(tDepth,vUv).r,uNear,uFar);
        vec2 air=vec2(0.);float weight=0.;
        // Depth-aware reconstruction keeps the soft field off foreground edges.
        for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
          vec3 sampleAir=texture2D(tField,vUv+vec2(float(x),float(y))*uPixel).rgb;
          float w=exp(-abs(sampleAir.b-depth)*4.)*exp(-float(x*x+y*y)*.7);
          air+=sampleAir.rg*w;weight+=w;
        }
        air/=max(weight,.0001);
        vec3 base=texture2D(tDiffuse,vUv).rgb;
        gl_FragColor=vec4(base*(1.-air.y)+uLight*air.x+vec3(.12,.15,.16)*air.y,1.);
      }`,
  });
  return (
    (d.uniforms.tField.value = c.texture),
    (d.uniforms.tDepth.value = n),
    (d.material.name = `woodland light composite`),
    {
      render(n, r, o) {
        if (
          !t.visible ||
          !t.castShadow ||
          !t.shadow.map?.depthTexture ||
          (i.setFromProjectionMatrix(
            a.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
          ),
          s.setFromMatrixPosition(e.matrixWorld),
          i.planes[5].setFromNormalAndCoplanarPoint(i.planes[5].normal, s),
          !i.intersectsBox(zp))
        )
          return !1;
        let l = u.uniforms;
        return (
          (l.tShadow.value = t.shadow.map.depthTexture),
          l.uInvProjection.value.copy(e.projectionMatrixInverse),
          l.uCameraWorld.value.copy(e.matrixWorld),
          l.uEye.value.setFromMatrixPosition(e.matrixWorld),
          l.uShadowMatrix.value.copy(t.shadow.matrix),
          l.uSunDirection.value
            .subVectors(t.position, t.target.position)
            .normalize(),
          l.uShadowPixel.value.set(
            1 / t.shadow.mapSize.x,
            1 / t.shadow.mapSize.y,
          ),
          (d.uniforms.uNear.value = e.near),
          (d.uniforms.uFar.value = e.far),
          d.uniforms.uLight.value
            .copy(t.color)
            .multiplyScalar(t.intensity * 0.24),
          u.render(n, c, r),
          d.render(n, o, r),
          !0
        );
      },
      resize(e, t) {
        let n = Math.min(0.5, (l ? 480 : 640) / e, (l ? 270 : 360) / t);
        (c.setSize(
          Math.max(1, Math.round(e * n)),
          Math.max(1, Math.round(t * n)),
        ),
          d.uniforms.uPixel.value.set(1 / c.width, 1 / c.height));
      },
      setLow(e) {
        ((l = e), (u.uniforms.uSteps.value = e ? 24 : 56));
      },
    }
  );
}
function createRenderPipeline(e, t, n, { samples: r = 2, sun: i = null, clouds: a = null } = {}) {
  let o = new rn(1, 1, { type: y, samples: r });
  o.depthTexture = new _a(1, 1, _);
  let s = new rn(1, 1, { type: y, depthBuffer: !1 }),
    c = s.clone(),
    l = i ? createWoodlandLightField(n, i, o.depthTexture, a) : null,
    u = !0,
    d = new _p(t, n),
    f = new Op(t, n, 1, 1, void 0, {
      radius: 0.55,
      thickness: 0.85,
      distanceExponent: 1.4,
      distanceFallOff: 0.85,
      scale: 1,
    }),
    p = f.depthTexture,
    m = f.normalTexture;
  ((f.blendIntensity = 0.4),
    f.updatePdMaterial({ radius: 5, lumaPhi: 10, depthPhi: 3, normalPhi: 4 }),
    (f._overrideVisibility = function () {
      t.traverse((e) => {
        e.visible &&
          (e.isPoints ||
            e.isLine ||
            e.userData.skipAO ||
            e.material?.transparent) &&
          (this._visibilityCache.push(e), (e.visible = !1));
      });
    }));
  let h = new Ap(new V(1, 1), 0.035, 0.35, 3.5),
    g = new Mp(),
    v = new Np({
      uniforms: { tDiffuse: { value: null }, uPixel: { value: new V(1, 1) } },
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform sampler2D tDiffuse;uniform vec2 uPixel;varying vec2 vUv;
      void main(){
        vec3 c=texture2D(tDiffuse,vUv).rgb;
        vec3 n=texture2D(tDiffuse,vUv+vec2(0.,uPixel.y)).rgb;
        vec3 s=texture2D(tDiffuse,vUv-vec2(0.,uPixel.y)).rgb;
        vec3 e=texture2D(tDiffuse,vUv+vec2(uPixel.x,0.)).rgb;
        vec3 w=texture2D(tDiffuse,vUv-vec2(uPixel.x,0.)).rgb;
        vec3 low=min(c,min(min(n,s),min(e,w))),high=max(c,max(max(n,s),max(e,w)));
        vec3 range=high-low;float contrast=max(range.r,max(range.g,range.b));
        float clarity=mix(.16,.06,smoothstep(.04,.28,contrast));
        c=clamp(c+(c-(n+s+e+w)*.25)*clarity,low-.003,high+.003);
        float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,1.02);
        c=(c-.42)*1.015+.42;
        gl_FragColor=vec4(clamp(c,0.,1.),1.);
      }`,
    });
  v.renderToScreen = !0;
  function b() {
    let t = e.getRenderTarget();
    try {
      (d.render(e, null, o),
        f.render(e, s, o),
        h.enabled && h.render(e, null, s, 0, !1),
        u && l?.render(e, s, c)
          ? (g.render(e, s, c), v.render(e, null, s))
          : (g.render(e, c, s), v.render(e, null, c)));
    } finally {
      e.setRenderTarget(t);
    }
  }
  function x(t, n) {
    let r = e.getPixelRatio();
    for (let e of [o, s, c]) e.setSize(t * r, n * r);
    v.uniforms.uPixel.value.set(1 / (t * r), 1 / (n * r));
    let i = Math.min(0.6, 720 / (t * r));
    (f.setSize(Math.round(t * r * i), Math.round(n * r * i)),
      h.setSize(Math.round(t * r * 0.4), Math.round(n * r * 0.4)),
      l?.resize(t * r, n * r));
  }
  return {
    render: b,
    resize: x,
    async compile() {
      let r = e.getRenderTarget();
      try {
        (e.setRenderTarget(o), await e.compileAsync(t, n));
      } finally {
        e.setRenderTarget(r);
      }
    },
    setLow(e) {
      ((h.enabled = !e),
        l?.setLow(e),
        f.setGBuffer(e ? o.depthTexture : p, e ? void 0 : m),
        (f._renderGBuffer = !e),
        (f.gtaoMaterial.needsUpdate = f.pdMaterial.needsUpdate = !0));
    },
    setWoodlandLight(e) {
      u = e;
    },
  };
}
