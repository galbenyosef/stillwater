// assets__index-BogB70q- 04 — fog
// Lines 30494-30607 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function dp(e, t) {
  let n = 7500,
    r = cp(3817),
    i = new Float32Array(n * 4);
  for (let e = 0; e < n; e++)
    i.set([(r() - 0.5) * 84, (r() - 0.5) * 84, r(), r()], e * 4);
  let a = new Wo(1, 1),
    o = new fc().copy(a);
  (a.dispose(), o.setAttribute(`aDrop`, new Ii(i, 4)), (o.instanceCount = n));
  let s = new vi(
    o,
    new ts({
      name: `Soft passing rain`,
      uniforms: t,
      transparent: !0,
      depthWrite: !1,
      side: 2,
      clipping: !0,
      vertexShader: `
      #include <common>
      #include <clipping_planes_pars_vertex>
      attribute vec4 aDrop;
      uniform float uRainTime;
      varying vec2 vDropUv;varying vec3 vDropWorld;varying float vDropSeed;
      void main(){
        float y=25.-fract(aDrop.z+uRainTime*(.32+aDrop.w*.08))*26.;
        vec3 p=vec3(aDrop.x+(25.-y)*.065,y,aDrop.y+(25.-y)*.028);
        float length=.16+aDrop.w*.13;
        p+=vec3(-.065,1.,-.028)*position.y*length;
        vDropWorld=p;vDropUv=uv;vDropSeed=aDrop.w;
        vec4 mvPosition=viewMatrix*vec4(p,1.);
        vec2 direction=normalize((viewMatrix*vec4(-.065,1.,-.028,0.)).xy+vec2(.00001));
        mvPosition.xy+=vec2(direction.y,-direction.x)*position.x*(.010+aDrop.w*.005);
        gl_Position=projectionMatrix*mvPosition;
        #include <clipping_planes_vertex>
      }`,
      fragmentShader: `
      #include <clipping_planes_pars_fragment>
      ${Gf}
      varying vec2 vDropUv;varying vec3 vDropWorld;varying float vDropSeed;
      void main(){
        #include <clipping_planes_fragment>
        float surface=max(.18,rainCoverHeight(vDropWorld.xz));
        if(vDropWorld.y<surface+.035)discard;
        float alpha=pow(max(0.,1.-abs(vDropUv.x-.5)*2.),1.4)*sin(vDropUv.y*3.14159);
        alpha*=smoothstep(vDropSeed-.08,vDropSeed+.08,uShower.x)*uShower.x*.46;
        float distance=length(cameraPosition-vDropWorld);
        alpha*=smoothstep(.65,1.8,distance)*(1.-smoothstep(45.,82.,distance));
        gl_FragColor=vec4(.68,.79,.84,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    }),
  );
  return (
    (s.name = `Passing shower`),
    (s.frustumCulled = !1),
    (s.userData.aboveWater = !0),
    (s.userData.skipAO = !0),
    (s.renderOrder = 6),
    (s.raycast = () => {}),
    e.add(s),
    s
  );
}
function fp(
  e,
  t,
  { sun: n, hemisphere: r, fill: i, sky: a, reducedMotion: o = !1 },
) {
  let s = Wf({ reducedMotion: o }),
    c = lp(e, t),
    l = { ...s.uniforms, uRainCover: { value: c.depthTexture } };
  up(t, l);
  let u = dp(t, l),
    d = {
      sun: n.intensity,
      sunColor: n.color.clone(),
      hemi: r.intensity,
      fill: i.intensity,
      environment: t.environmentIntensity,
      fogColor: t.fog.color.clone(),
      near: t.fog.near,
      far: t.fog.far,
    },
    f = new G(`#dbe6ed`),
    p = new G(`#a1b5bb`);
  function m() {
    let { cloud: e, rain: o } = s.state;
    ((u.visible = o > 0.001),
      (n.intensity = d.sun * (1 - e * 0.72)),
      n.color.copy(d.sunColor).lerp(f, e * 0.7),
      (r.intensity = d.hemi + e * 0.24),
      (i.intensity = d.fill + e * 0.13),
      (t.environmentIntensity = d.environment * (1 - e * 0.15)),
      t.fog.color.copy(d.fogColor).lerp(p, e * 0.65),
      (t.fog.near = d.near - e * 22),
      (t.fog.far = d.far - e * 45),
      a.setWeather(e));
  }
  return {
    uniforms: l,
    state: s.state,
    update(e) {
      (s.update(e), m());
    },
    preview(e) {
      (s.preview(e), m());
    },
    seek(e, t, n) {
      (s.seek(e, t, n), m());
    },
  };
}
