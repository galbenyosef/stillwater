// world-utils-01.js — the seeded PRNG, the sun-shadow pass, the shadow-material pass and the grass point scatter
// Lines 30358-30558 of readable/assets__index-BogB70q-.pretty.js (cluster world-utils, statement-aligned).
function createRandom(e = 73) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
function lp(e, t) {
  let n = new rn(512, 512);
  n.depthTexture = new _a(512, 512, _);
  let r = new cc(-42, 42, 42, -42, 0.1, 50);
  (r.position.set(0, 35, 0), r.up.set(0, 0, -1), r.lookAt(0, 0, 0));
  let i = new os({ side: 2 }),
    a = [],
    o = {
      target: e.getRenderTarget(),
      override: t.overrideMaterial,
      background: t.background,
      planes: e.clippingPlanes,
      auto: e.shadowMap.autoUpdate,
      dirty: e.shadowMap.needsUpdate,
    };
  t.traverse((e) => {
    if (!e.visible) return;
    let t = Array.isArray(e.material) ? e.material : [e.material];
    (e.isPoints ||
      e.isLine ||
      e.isSkinnedMesh ||
      e.customDepthMaterial ||
      t.some(
        (e) => e && (e.transparent || e.alphaTest > 0 || e.isMeshBasicMaterial),
      )) &&
      (a.push(e), (e.visible = !1));
  });
  try {
    ((t.overrideMaterial = i),
      (t.background = null),
      (e.clippingPlanes = []),
      (e.shadowMap.autoUpdate = !1),
      (e.shadowMap.needsUpdate = !1),
      t.updateMatrixWorld(!0),
      e.setRenderTarget(n),
      e.clear(),
      e.render(t, r));
  } finally {
    ((t.overrideMaterial = o.override),
      (t.background = o.background),
      (e.clippingPlanes = o.planes),
      (e.shadowMap.autoUpdate = o.auto),
      (e.shadowMap.needsUpdate = o.dirty),
      e.setRenderTarget(o.target));
    for (let e of a) e.visible = !0;
    i.dispose();
  }
  return n;
}
function applyWeatherMaterials(e, t) {
  let n = new WeakSet();
  e.traverse((e) => {
    if (e.isMesh)
      for (let r of Array.isArray(e.material) ? e.material : [e.material]) {
        if (
          !r.isMeshStandardMaterial ||
          r.transparent ||
          r.alphaTest > 0 ||
          r.metalness > 0.5 ||
          n.has(r)
        )
          continue;
        n.add(r);
        let i = r.onBeforeCompile,
          a = r.customProgramCacheKey(),
          o = e.name === `ResidentSkin`,
          s = r.userData.millExteriorPalette === !0;
        ((r.onBeforeCompile = (e, n) => {
          if (
            (i.call(r, e, n),
            Object.assign(e.uniforms, t),
            (e.vertexShader =
              `varying vec3 vRainSurface;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <worldpos_vertex>`,
              `#include <worldpos_vertex>
          vec4 rainPosition=vec4(transformed,1.);
          #ifdef USE_BATCHING
            rainPosition=batchingMatrix*rainPosition;
          #endif
          #ifdef USE_INSTANCING
            rainPosition=instanceMatrix*rainPosition;
          #endif
          vRainSurface=(modelMatrix*rainPosition).xyz;`,
            )),
            (e.fragmentShader =
              rainShaderChunk +
              `
varying vec3 vRainSurface;
` +
              e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <roughnessmap_fragment>`,
              `#include <roughnessmap_fragment>
          float rainWet=0.;
          if(uShower.y>.001){
            float shelter=rainCoverHeight(vRainSurface.xz)-vRainSurface.y;
            rainWet=uShower.y*(1.-smoothstep(.12,.42,shelter))*smoothstep(.20,.52,vRainSurface.y);
          }
          // Skin takes a soft wet sheen without the strong darkening of porous surfaces.
          diffuseColor.rgb*=mix(1.,${o ? `.96` : `.72`},rainWet);
          roughnessFactor=mix(roughnessFactor,min(roughnessFactor,${o ? `.42` : `.30`}),rainWet*${o ? `.45` : `.85`});`,
            )),
            s)
          ) {
            let t = Gc.fog_fragment.replace(
              `gl_FragColor.rgb = mix(`,
              `fogFactor*=mix(1.,.70,uShower.z);
	gl_FragColor.rgb = mix(`,
            );
            e.fragmentShader = e.fragmentShader.replace(
              `#include <fog_fragment>`,
              t,
            );
          }
        }),
          (r.customProgramCacheKey = () =>
            a +
            `-rain-wetness-v2` +
            (o ? `-skin` : ``) +
            (s ? `-mill-haze-v1` : ``)),
          (r.needsUpdate = !0));
      }
  });
}
function scatterGrassPoints(e, t) {
  let n = 7500,
    r = createRandom(3817),
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
      ${rainShaderChunk}
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
