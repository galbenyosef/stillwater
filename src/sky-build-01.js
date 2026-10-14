// sky-build-01.js — the sky dome build (Sky at 10 km)
// Lines 58527-58598 of readable/assets__index-BogB70q-.pretty.js (cluster sky-build, statement-aligned).
function Vb(e) {
  let t = new Un(),
    n = new Bb();
  (n.scale.setScalar(1e4), t.add(n));
  let r = n.material.uniforms;
  (r.sunPosition.value.copy(_f),
    (r.turbidity.value = 4.6),
    (r.rayleigh.value = 2.1),
    (r.mieCoefficient.value = 0.003),
    (r.cloudCoverage.value = 0.36),
    (r.cloudDensity.value = 0.22),
    (r.cloudElevation.value = 0.35),
    (r.showSunDisc.value = 0));
  let i = { type: y, generateMipmaps: !0, minFilter: d },
    a = new Sl(256, i),
    o = new Sl(256, i),
    s = new _c(1, 2e4, a),
    c = e.toneMapping;
  try {
    ((e.toneMapping = 0),
      s.update(e, t),
      (r.cloudCoverage.value = 0.94),
      (r.cloudDensity.value = 0.72),
      (r.turbidity.value = 9.5),
      (r.rayleigh.value = 1.1),
      (r.mieCoefficient.value = 0.008),
      (s.renderTarget = o),
      s.update(e, t));
  } finally {
    ((e.toneMapping = c), n.geometry.dispose(), n.material.dispose());
  }
  let l = new Sl(256, i),
    u = new Un(),
    f = new ts({
      side: 1,
      depthTest: !1,
      depthWrite: !1,
      uniforms: {
        uSunny: { value: a.texture },
        uRainy: { value: o.texture },
        uCloud: { value: 0 },
      },
      vertexShader: `varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform samplerCube uSunny,uRainy;uniform float uCloud;varying vec3 vDirection;
      void main(){vec3 d=normalize(vDirection);
        vec3 dry=textureCube(uSunny,d).rgb,wet=textureCube(uRainy,d).rgb*vec3(.70,.78,.83);
        gl_FragColor=vec4(mix(dry,wet,uCloud),1.);}`,
    });
  u.add(new vi(new ba(2, 2, 2), f));
  let p = new _c(0.1, 10, l),
    m = -1;
  function h(t) {
    let n = Math.round(t * 100) / 100;
    if (n === m) return;
    let r = e.toneMapping,
      i = e.shadowMap.autoUpdate,
      a = e.shadowMap.needsUpdate;
    try {
      ((e.toneMapping = 0),
        (e.shadowMap.autoUpdate = !1),
        (e.shadowMap.needsUpdate = !1),
        (f.uniforms.uCloud.value = n),
        p.update(e, u),
        (m = n));
    } finally {
      ((e.toneMapping = r),
        (e.shadowMap.autoUpdate = i),
        (e.shadowMap.needsUpdate = a));
    }
  }
  return (h(0), { texture: l.texture, setWeather: h });
}
