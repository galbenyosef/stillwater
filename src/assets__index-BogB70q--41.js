// assets__index-BogB70q- 41 — visible
// Lines 54900-55390 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function ly(e, t, n, i = {}, a = null, o = null, s = null) {
  ((Jm.uShoreTime.value = 0), (Jm.uShoreAmount.value = t ? 0.3 : 2.8));
  let c = gv(1, _f);
  ((n.wrapS = n.wrapT = r), (n.anisotropy = 8));
  let u = sy(n),
    d = Av(e, { reducedMotion: t }),
    f = Kv(e, i, t, s),
    p = [],
    m = new Map(),
    h = new Nn(),
    g = new U();
  for (let e of xh.placements) {
    if (!e.asset.startsWith(`rock`) || !i[e.asset]) continue;
    (m.has(e.asset) || m.set(e.asset, new ir().setFromObject(i[e.asset])),
      h.position.set(e.x, e.y, e.z),
      h.rotation.set(e.rx || 0, e.angle || 0, e.rz || 0),
      e.normal &&
        (h.quaternion.setFromUnitVectors(Nn.DEFAULT_UP, g.fromArray(e.normal)),
        h.rotateY(e.angle || 0)),
      Array.isArray(e.s) ? h.scale.fromArray(e.s) : h.scale.setScalar(e.s || 1),
      h.updateMatrix());
    let t = Qm(m.get(e.asset).clone().applyMatrix4(h.matrix));
    t && p.push(t);
  }
  let b = new Mi(Zm(p, 256), 256, 256, D, v);
  ((b.minFilter = b.magFilter = l), (b.needsUpdate = !0));
  let x = new rn(1280, 720, { type: y, depthBuffer: !0 });
  x.depthTexture = new _a(1280, 720, _);
  let S = new Yr(new U(0, -1, 0), q + 0.025),
    C = new Yr(new U(0, 1, 0), -q + 0.02),
    w = new rn(1, 1),
    T = new rc(1, 1, 500, 501),
    E = {
      name: `Stillwater refractive water`,
      uniforms: {
        color: { value: new G(2713179) },
        tDiffuse: { value: null },
        textureMatrix: { value: new W() },
        uFloor: { value: b },
        uRefraction: { value: null },
        uSceneDepth: { value: null },
        uNormals: { value: n },
        uWake: { value: null },
        uProjectionInverse: { value: new W() },
        uCameraWorld: { value: new W() },
        uWorldToClip: { value: new W() },
        uTime: { value: 0 },
        uWakeDebug: { value: 0 },
        uWakeLighting: { value: 1 },
        uWakeActive: { value: 0 },
        uSun: { value: _f.clone().normalize() },
        uBoat: { value: new V() },
        uHeading: { value: 0 },
        uSwimContact: { value: new tn() },
        uSwimMotion: { value: new V() },
        uSwimSections: { value: Array.from({ length: 3 }, () => new tn()) },
        ...Sv(),
        ...f.uniforms,
        ...Jm,
      },
      vertexShader: `
    #include <common>
    #include <shadowmap_pars_vertex>
    uniform mat4 textureMatrix;
    uniform vec2 uBoat;uniform float uHeading;
    ${Tv}
    varying vec4 vMirror;varying vec3 vWorld;varying vec4 vScreen;varying vec2 vContactSlope;
    void main(){
      float s=sin(uHeading),c=cos(uHeading);
      vec2 pond=uBoat+vec2(c*position.x-s*position.y,-s*position.x-c*position.y);
      vec3 surface=vec3(pond.x,-pond.y,boatWave(pond).x);
      // Smooth crest normals across the small triangles, rather than letting
      // each triangle's flat face split the reflection into separate facets.
      vContactSlope=vec2(boatWave(pond+vec2(.018,0.)).x-boatWave(pond-vec2(.018,0.)).x,
        boatWave(pond+vec2(0.,.018)).x-boatWave(pond-vec2(0.,.018)).x)/.036;
      vec4 worldPosition=modelMatrix*vec4(surface,1.);
      vec3 transformedNormal=normalMatrix*normal;
      vec4 mvPosition=modelViewMatrix*vec4(surface,1.);
      vWorld=worldPosition.xyz;
      vMirror=textureMatrix*vec4(surface,1.);
      vScreen=projectionMatrix*mvPosition;
      gl_Position=vScreen;
      #include <shadowmap_vertex>
    }`,
      fragmentShader: `
    ${Af}
    ${zf}
    ${Gf}
    ${Kf}
    #include <common>
    #include <packing>
    #include <shadowmap_pars_fragment>
    uniform bool receiveShadow;
    #include <shadowmask_pars_fragment>
    uniform sampler2D tDiffuse,uFloor,uRefraction,uSceneDepth,uNormals,uWake;
    uniform mat4 uProjectionInverse,uCameraWorld,uWorldToClip,textureMatrix;
    uniform float uTime,uWakeDebug,uWakeLighting,uWakeActive;uniform vec3 uSun;
    uniform vec4 uSwimContact,uSwimSections[3];uniform vec2 uSwimMotion;
    #if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
      uniform mat4 directionalShadowMatrix[NUM_DIR_LIGHT_SHADOWS];
    #endif
    varying vec4 vMirror;varying vec3 vWorld;varying vec4 vScreen;varying vec2 vContactSlope;
    vec2 wakeLightRay(vec2 gradient){
      vec3 normal=normalize(vec3(-gradient.x,1.,-gradient.y));
      vec3 ray=refract(-uSun,normal,1./1.333);
      return ray.xz/max(-ray.y,.15);
    }
    float wakeBedLighting(vec3 receiver){
      float depth=.18-receiver.y;
      if(uWakeActive<.5||uWakeLighting<.5||depth<.025||depth>5.)return 1.;
      // Follow the refracted sunlight back to the water surface. Its horizontal
      // offset varies with bed depth, rather than sticking a shadow to the wake.
      vec2 source=receiver.xz-wakeLightRay(vec2(0.))*depth;
      vec2 uv=source/44.+.5;
      float radius=.085+depth*.025;
      vec2 stepX=vec2(radius/44.,0.),stepZ=stepX.yx;
      vec4 center=texture2D(uWake,uv);
      vec2 left=texture2D(uWake,uv-stepX).xy,right=texture2D(uWake,uv+stepX).xy;
      vec2 back=texture2D(uWake,uv-stepZ).xy,front=texture2D(uWake,uv+stepZ).xy;
      // Finite differences of the refracted ray footprint give light focusing
      // and spreading. A flat field yields exactly one; no permanent dark decal.
      vec2 dx=(wakeLightRay(right)-wakeLightRay(left))*depth/(2.*radius);
      vec2 dz=(wakeLightRay(front)-wakeLightRay(back))*depth/(2.*radius);
      float area=(1.+dx.x)*(1.+dz.y)-dx.y*dz.x;
      float focusing=clamp(1./max(abs(area),.50),.65,1.45)-1.;
      float change=(focusing*.72-clamp(center.b,0.,1.)*.075)
        *smoothstep(.025,.30,depth)*exp(-depth*.22)*(1.-smoothstep(3.5,5.,depth));
      if(abs(change)<.0001)return 1.;
      float sunlight=1.;
      #if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
        DirectionalLightShadow sunShadow=directionalLightShadows[0];
        sunlight=getShadow(directionalShadowMap[0],sunShadow.shadowMapSize,
          sunShadow.shadowIntensity,sunShadow.shadowBias,sunShadow.shadowRadius,
          directionalShadowMatrix[0]*vec4(receiver+vec3(${c.x.toFixed(8)}*depth,.025,${c.z.toFixed(8)}*depth),1.));
      #endif
      return 1.+change*sunlight*cloudSunlight(receiver)*(1.-uShower.z*.72);
    }
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
    ${Zv}
    vec2 waves(vec2 p,float wind){
      vec2 uv0=p*.095+vec2(uTime*.008,uTime*.003);
      vec2 uv1=mat2(.8,.6,-.6,.8)*p*.147+vec2(-uTime*.006,uTime*.009);
      vec2 uv2=mat2(.38,-.92,.92,.38)*p*.43+vec2(uTime*.012,-uTime*.015);
      vec2 g=(texture2D(uNormals,uv0).xy*2.-1.)*.070;
      g+=(texture2D(uNormals,uv1).xy*2.-1.)*.042;
      g+=(texture2D(uNormals,uv2).xy*2.-1.)*.013;
      g*=wind;
      return g+swellGradient(p,uTime);
    }
    vec3 surfaceRipples(vec2 p){
      vec2 a=vec2(.84,.54),b=vec2(-.42,.91);
      float phase=dot(p,a)*3.8-uTime*2.0+noise(p*.32)*1.4;
      float crossing=dot(p,b)*6.3-uTime*2.5;
      vec2 slope=a*cos(phase)*.0315+b*cos(crossing)*.0133;
      float height=sin(phase)*.00826+sin(crossing)*.0021;
      return vec3(slope,height);
    }
    ${Tv}
    ${Gv}
    ${Ym}
    vec3 swimmerContact(vec2 p){
      if(uSwimContact.w<.5)return vec3(0.);
      float s=sin(uSwimContact.z),c=cos(uSwimContact.z);
      vec3 contact=vec3(0.);
      for(int i=0;i<3;i++){
        vec4 section=uSwimSections[i];if(section.z<.001)continue;
        vec2 d=p-section.xy,q=vec2(c*d.x-s*d.y,s*d.x+c*d.y);
        vec2 radius=section.zw*vec2(1.,1.+uSwimMotion.x*.8);
        vec2 ellipse=q/radius;float r=length(ellipse);
        if(r>2.3)continue;
        vec2 direction=normalize(ellipse/radius+vec2(.0001));
        direction=vec2(c*direction.x+s*direction.y,-s*direction.x+c*direction.y);
        float edge=exp(-pow((r-1.)/.22,2.));
        float lace=.30+.70*smoothstep(.35,.70,noise(p*38.-uTime*.45));
        float wave=sin((r-1.)*10.-uTime*2.7)*exp(-pow((r-1.4)/.55,2.));
        vec2 slope=direction*(edge*.10+wave*.04)*(.75+uSwimMotion.y*.25);
        contact+=vec3(slope,edge*lace*(.085+.10*uSwimMotion.y));
      }
      return contact;
    }
    void main(){
      vec2 p=vWorld.xz;
      vec3 hull=(uWaveInverse*vec4(vWorld,1.)).xyz;
      float along=-hull.z,across=abs(hull.x);
      if(along> -1.765&&along<1.80){
        if(across<max(0.,hullSectionWidth(along,hull.y)-.026))discard;
      }
      vec4 bed=texture2D(uFloor,p/${(84).toFixed(1)}+.5);
      float floorH=bed.r;
      // Keep the refraction boundary closed; the bank material carries run-up.
      if(floorH>.19)discard;
      vec4 shore=vec4(0.);
      if(bed.g<2.9)shore=shoreLapping(p,bed.g);
      float bedDepth=max(.01,.18-floorH);
      vec4 trail=vec4(0.);
      if(uWakeActive>.5)trail=texture2D(uWake,p/44.+.5);
      vec4 millContact=millWater(p);
      // Break up the aerated impact on the pond itself, so its highlights and
      // refraction remain continuous with the surrounding lake.
      if(millContact.z>.0001)millContact.z*=smoothstep(.28,.76,noise(p*31.-uTime*.65)+noise(p*63.+uTime*.3)*.25);
      vec4 contact=boatWave(p);
      vec3 swimmer=swimmerContact(p);
      vec3 ripples=surfaceRipples(p);
      float shoreFade=smoothstep(.015,.22,bedDepth);
      float windPatch=noise(p*.16-vec2(uTime*.016,uTime*.008));
      float gust=passingBreeze(p);
      float wind=(.38+.62*smoothstep(.23,.78,windPatch)+gust*.65)*mix(.42,1.,smoothstep(.2,2.8,bed.g));
      float edgeWave=sin(bed.g*14.-uTime*3.5+noise(p*.6)*1.2)*exp(-bed.g*2.6)*smoothstep(0.,.13,bed.g);
      // Exposed rocks also receive lapping when the terrain beneath them is deep.
      float shoreBand=1.-smoothstep(1.3,2.5,bed.g);
      vec2 bankRipple=bed.ba*edgeWave*.033*(.4+.6*wind)*(1.-shoreBand);
      // Fine waves and the wake retain their reflection/refraction detail over
      // the smooth slope of the raised hull water.
      vec2 grad=(waves(p,wind)+ripples.xy*wind+bankRipple+trail.xy+vContactSlope+millContact.xy+swimmer.xy)*shoreFade;
      vec3 rain=rainRipples(p);grad+=rain.xy*shoreFade;
      // Fine wind ripples ruffle reflections inside the same moving gust that
      // bends the bank vegetation. They add no foam or boat-sized swell.
      grad+=breezeDirection*cos(dot(p,breezeDirection)*10.-uTime*5.)*.025*gust*shoreFade;
      // Let the arriving crest stay readable in the last few centimetres of water.
      grad+=bed.ba*shore.y*shoreBand*smoothstep(.003,.055,bedDepth);
      vec3 n=normalize(vec3(-grad.x,1.,-grad.y));
      vec3 view=normalize(cameraPosition-vWorld);
      vec2 screen=vScreen.xy/vScreen.w*.5+.5;
      // Turbulent wake normals should not drag a distant dark motor silhouette
      // across open water. Refraction stays continuous through the fresh wash.
      float disturbance=clamp(trail.b+abs(trail.a)*10.,0.,1.);
      // A fish near the surface has a much shorter refraction path than the bed.
      // Sampling its depth before displacement keeps the silhouette from tearing.
      float straightDepth=texture2D(uSceneDepth,screen).r;
      vec4 straightView=uProjectionInverse*vec4(screen*2.-1.,straightDepth*2.-1.,1.);
      vec3 straightWorld=(uCameraWorld*vec4(straightView.xyz/straightView.w,1.)).xyz;
      float receiverDepth=min(bedDepth,max(.025,.18-straightWorld.y));
      // Move the bent ray in world space before projecting it. Rotating the
      // camera therefore cannot rotate the apparent current or smear a fish.
      vec3 flatRay=refract(-view,vec3(0.,1.,0.),1./1.333);
      vec3 bentRay=refract(-view,n,1./1.333);
      vec2 rayShift=(bentRay.xz/max(-bentRay.y,.25)-flatRay.xz/max(-flatRay.y,.25))
        *receiverDepth*mix(.82,.46,disturbance);
      vec4 refractedClip=uWorldToClip*vec4(straightWorld+vec3(rayShift.x,0.,rayShift.y),1.);
      vec2 refractUv=clamp(refractedClip.xy/refractedClip.w*.5+.5,vec2(.002),vec2(.998));
      float sceneDepth=texture2D(uSceneDepth,refractUv).r;
      vec4 underView=uProjectionInverse*vec4(refractUv*2.-1.,sceneDepth*2.-1.,1.);
      vec3 underWorld=(uCameraWorld*vec4(underView.xyz/underView.w,1.)).xyz;
      // Fall back at a clipped bank or a large depth discontinuity. Water near
      // a shallow fish must not sample the distant bed through its silhouette.
      if(sceneDepth>.99999||underWorld.y>.205||abs(underWorld.y-straightWorld.y)>.28+receiverDepth*.55){
        refractUv=screen;sceneDepth=straightDepth;underWorld=straightWorld;
      }
      float d=clamp(.18-underWorld.y,.015,5.0);
      vec3 under=texture2D(uRefraction,refractUv).rgb;
      if(sceneDepth<.99999)under*=wakeBedLighting(underWorld);
      // Freshwater absorbs blue as well as red; deeper water settles into an
      // olive-green tone while the shallow margins retain their bed detail.
      float shadow=getShadowMask()*cloudSunlight(vWorld)*(1.-uShower.z*.72);
      float opticalPath=d*(1./max(-flatRay.y,.35)+1./max(uSun.y,.25));
      float shallowMargin=(1.-smoothstep(.30,1.15,d))*(1.-smoothstep(1.,2.7,bed.g));
      opticalPath*=mix(1.,.70,shallowMargin);
      vec3 transmission=exp(-vec3(.50,.31,.38)*opticalPath);
      vec3 scatter=vec3(.017,.027,.013)*(.40+.60*shadow);
      vec3 col=under*transmission+scatter*(1.-transmission);
      // A narrow shaded contact seam joins the wet hull to the surface without
      // painting an opaque halo or a second boat-shaped shadow on the water.
      col*=1.-exp(-max(0.,contact.z)*32.)*.055;
      // The reflection offset follows the projected pond axes and distance,
      // retaining coherent silhouettes through broad, gently moving ripples.
      vec4 reflectedClip=vMirror+textureMatrix*vec4(grad.x,-grad.y,0.,0.)*mix(1.8,3.2,1.-view.y);
      vec2 mirrorUv=clamp(reflectedClip.xy/reflectedClip.w,vec2(.002),vec2(.998));
      vec3 reflection=texture2D(tDiffuse,mirrorUv).rgb;
      float fresnel=.0204+.9796*pow(1.-max(dot(n,view),0.),5.);
      col=mix(col,reflection,min(.88,.045+fresnel*.955));
      float spec=max(dot(reflect(-uSun,n),view),0.);
      float gloss=mix(clamp(1./(.00065+fwidth(spec)*1.3),250.,1500.),190.,clamp(trail.b+abs(trail.a)*8.,0.,.7));
      float glint=pow(spec,gloss)*gloss/1500.+pow(spec,160.)*.008;
      col+=vec3(.26,.24,.19)*glint*shadow;
      float shallow=(1.-smoothstep(.02,.18,bedDepth));
      col+=vec3(.13,.15,.09)*shallow*.13;
      // At the exploration camera angle, crest/trough contrast keeps the waves
      // readable even where their reflection contains only an even patch of sky.
      float faceLight=max(dot(n,uSun),0.);
      float sunlit=.32+.68*shadow*(.5+.5*faceLight);
      col+=vec3(.04,.055,.06)*rain.z*shoreFade;
      float crestLight=clamp(max(trail.a,0.)*6.,0.,.20);
      col*=1.+clamp(trail.a*2.7,-.075,0.)*shoreFade;
      col+=vec3(.55,.68,.64)*crestLight*shoreFade*sunlit;
      col+=vec3(.008,.014,.015)*smoothstep(.003,.013,ripples.z)*wind*shoreFade*sunlit;
      // A broken, shallow highlight follows the incoming crest, not a foam ring.
      float shoreLace=.35+.65*noise(p*6.+bed.ba*uShoreTime*.12);
      col+=vec3(.055,.078,.072)*shore.z*shoreBand*shoreLace*sunlit;
      col*=1.+min(0.,shore.w)*1.8*shoreBand;
      float hullFoam=0.;
      if(contact.y>.0001){
        float lace=smoothstep(.37,.69,noise(vec2(along*22.-uWaveTime*1.8,contact.z*68.))+noise(p*47.)*.24);
        hullFoam=contact.y*lace*.65;
      }
      float bubbles=clamp((1.-exp(-(trail.b+hullFoam+millContact.z+swimmer.z)*1.75))*shoreFade,0.,.68);
      vec3 foamLight=vec3(.30,.38,.38)+vec3(.56,.50,.40)*faceLight*shadow;
      col=mix(col,foamLight,bubbles);
      if(uWakeDebug>.5)col=vec3(abs(trail.x)*6.,trail.b*3.,abs(trail.y)*6.)+vec3(.008);
      gl_FragColor=vec4(col,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
    },
    O = new iv(xv(), {
      textureWidth: 896,
      textureHeight: 896,
      clipBias: 0.003,
      multisample: 0,
      shader: E,
    });
  ((O.name = `Reflective and refractive pond`),
    (O.rotation.x = -Math.PI / 2),
    (O.position.y = q),
    (O.material.depthWrite = !0),
    (O.material.transparent = !1),
    (O.material.side = 0),
    (O.receiveShadow = !0),
    (O.material.lights = !0),
    Object.assign(O.material.uniforms, Qo.clone(K.lights)),
    Object.assign(O.material.uniforms, f.uniforms, Jm),
    (O.material.uniforms.uCloudShadow = a?.uniforms.uCloudShadow ?? {
      value: new V(),
    }),
    (O.material.uniforms.uPassingBreeze = Rf),
    Object.assign(
      O.material.uniforms,
      o?.uniforms ?? {
        uShower: { value: new U() },
        uRainTime: { value: 0 },
        uRainCover: { value: null },
      },
    ),
    (O.userData.skipAO = !0),
    (O.frustumCulled = !1),
    e.add(O));
  let k = O.material.uniforms;
  ((k.uRefraction.value = x.texture),
    (k.uSceneDepth.value = x.depthTexture),
    (k.uWake.value = u.texture));
  let A = O.onBeforeRender,
    j = cy(e),
    M = 0,
    N = !1,
    P = 0,
    F = 0,
    I = !0,
    ee;
  O.onBeforeRender = function (e, t, ...n) {
    t.overrideMaterial ||
      (j(n[0], N ? 2 : 1.2, () => A.call(this, e, t, ...n)), M++);
  };
  let te = new V();
  return {
    mesh: O,
    setSwimmer(e) {
      Object.assign(k, e);
    },
    setWakeDebug(e) {
      k.uWakeDebug.value = +!!e;
    },
    setWakeLighting(e) {
      k.uWakeLighting.value = +!!e;
    },
    setBoatContact(e) {
      ((I = !!e),
        (k.uWaveAmount.value = e ? (t ? 0.35 : 1) : 0),
        ee && (ee.uWaveAmount.value = k.uWaveAmount.value),
        (d.mesh.visible = I && d.mesh.count > 0),
        (d.lips.mesh.visible = I && d.lips.events.length > 0));
    },
    prepareWake(e) {
      (u.render(e), (k.uWakeActive.value = +!!u.active));
    },
    resetWake() {
      (u.reset(), d.reset());
    },
    get atLakeSplash() {
      return I && d.atLakeSplash;
    },
    setMillContact(e) {
      f.setEnabled(e);
    },
    get atMillSplash() {
      return f.atImpact;
    },
    get reflectionFrames() {
      return M;
    },
    resetCounters() {
      M = 0;
    },
    prepareShadows(t, n) {
      if (!t.shadowMap.needsUpdate) return;
      (T.position.copy(n.position),
        T.quaternion.copy(n.quaternion),
        (T.layers.mask = n.layers.mask),
        T.updateMatrixWorld(!0));
      let r = t.getRenderTarget(),
        i = t.clippingPlanes,
        a = O.visible;
      ((O.visible = !1), (t.clippingPlanes = []));
      try {
        (t.setRenderTarget(w), j(n, N ? 2 : 1, () => t.render(e, T)));
      } finally {
        (t.setRenderTarget(r), (t.clippingPlanes = i), (O.visible = a));
      }
    },
    renderSurface(t, n) {
      let r = [],
        i = t.clippingPlanes,
        a = eh.value;
      (e.traverse((e) => {
        e.visible &&
          (e.userData.belowWater || e.userData.shadowOnly) &&
          (r.push(e), (e.visible = !1));
      }),
        (t.clippingPlanes = [C]),
        (eh.value = 1));
      try {
        return n();
      } finally {
        ((t.clippingPlanes = i), (eh.value = a));
        for (let e of r) e.visible = !0;
      }
    },
    prepare(t, n) {
      t.getDrawingBufferSize(te);
      let r = Math.min(N ? 0.75 : 1, (N ? 1280 : 2560) / te.x),
        i = Math.round(te.x * r),
        a = Math.round(te.y * r);
      ((i !== P || a !== F) && (x.setSize(i, a), (P = i), (F = a)),
        n.updateMatrixWorld(),
        k.uProjectionInverse.value.copy(n.projectionMatrixInverse),
        k.uCameraWorld.value.copy(n.matrixWorld),
        k.uWorldToClip.value.multiplyMatrices(
          n.projectionMatrix,
          n.matrixWorldInverse,
        ));
      let o = t.getRenderTarget(),
        s = t.clippingPlanes,
        c = eh.value,
        l = t.shadowMap.needsUpdate,
        u = t.shadowMap.autoUpdate,
        d = [];
      (e.traverse((e) => {
        e.visible &&
          (e.userData.aboveWater || e.isPoints || e.material?.transparent) &&
          (d.push(e), (e.visible = !1));
      }),
        (O.visible = !1),
        (t.clippingPlanes = [S]),
        (eh.value = -1),
        (t.shadowMap.needsUpdate = !1),
        (t.shadowMap.autoUpdate = !1),
        t.setRenderTarget(x));
      try {
        (t.clear(), t.render(e, n));
      } finally {
        (t.setRenderTarget(o),
          (t.clippingPlanes = s),
          (eh.value = c),
          (t.shadowMap.needsUpdate = l),
          (t.shadowMap.autoUpdate = u));
        for (let e of d) e.visible = !0;
        O.visible = !0;
      }
    },
    update(e, n, r, i = []) {
      ((Jm.uShoreTime.value = t ? 0 : e),
        f.update(e),
        u.update(e, n, i),
        (k.uTime.value = e),
        k.uBoat.value.set(n.x, n.z),
        (k.uHeading.value = n.heading),
        Cv(k, e, n, r, t),
        (ee = r?.userData.hullWaveUniforms),
        ee && Cv(ee, e, n, r, t),
        I
          ? d.update(e, n, r)
          : ((k.uWaveAmount.value = 0),
            ee && (ee.uWaveAmount.value = 0),
            d.reset()));
    },
    setLow(e) {
      ((N = e), u.setLow(N));
      let t = N ? 640 : 1280;
      O.getRenderTarget().setSize(t, t);
    },
  };
}
