// assets__index-BogB70q- 11 — console
// Lines 32655-32986 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Vp(e, t, n, { samples: r = 2, sun: i = null, clouds: a = null } = {}) {
  let o = new rn(1, 1, { type: y, samples: r });
  o.depthTexture = new _a(1, 1, _);
  let s = new rn(1, 1, { type: y, depthBuffer: !1 }),
    c = s.clone(),
    l = i ? Bp(n, i, o.depthTexture, a) : null,
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
function Hp(e, t = !1) {
  let n = e[0].index !== null,
    r = new Set(Object.keys(e[0].attributes)),
    i = new Set(Object.keys(e[0].morphAttributes)),
    a = {},
    o = {},
    s = e[0].morphTargetsRelative,
    c = new Hr(),
    l = 0;
  for (let u = 0; u < e.length; ++u) {
    let d = e[u],
      f = 0;
    if (n !== (d.index !== null))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
            u +
            `. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`,
        ),
        null
      );
    for (let e in d.attributes) {
      if (!r.has(e))
        return (
          console.error(
            `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
              u +
              `. All geometries must have compatible attributes; make sure "` +
              e +
              `" attribute exists among all geometries, or in none of them.`,
          ),
          null
        );
      (a[e] === void 0 && (a[e] = []), a[e].push(d.attributes[e]), f++);
    }
    if (f !== r.size)
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
            u +
            `. Make sure all geometries have the same number of attributes.`,
        ),
        null
      );
    if (s !== d.morphTargetsRelative)
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
            u +
            `. .morphTargetsRelative must be consistent throughout all geometries.`,
        ),
        null
      );
    for (let e in d.morphAttributes) {
      if (!i.has(e))
        return (
          console.error(
            `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
              u +
              `.  .morphAttributes must be consistent throughout all geometries.`,
          ),
          null
        );
      (o[e] === void 0 && (o[e] = []), o[e].push(d.morphAttributes[e]));
    }
    if (t) {
      let e;
      if (n) e = d.index.count;
      else if (d.attributes.position !== void 0)
        e = d.attributes.position.count;
      else
        return (
          console.error(
            `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
              u +
              `. The geometry must have either an index or a position attribute`,
          ),
          null
        );
      (c.addGroup(l, e, u), (l += e));
    }
  }
  if (n) {
    let t = 0,
      n = [];
    for (let r = 0; r < e.length; ++r) {
      let i = e[r].index;
      for (let e = 0; e < i.count; ++e) n.push(i.getX(e) + t);
      t += e[r].attributes.position.count;
    }
    c.setIndex(n);
  }
  for (let e in a) {
    let t = Up(a[e]);
    if (!t)
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ` +
            e +
            ` attribute.`,
        ),
        null
      );
    c.setAttribute(e, t);
  }
  for (let e in o) {
    let t = o[e][0].length;
    if (t !== 0) {
      ((c.morphAttributes = c.morphAttributes || {}),
        (c.morphAttributes[e] = []));
      for (let n = 0; n < t; ++n) {
        let t = [];
        for (let r = 0; r < o[e].length; ++r) t.push(o[e][r][n]);
        let r = Up(t);
        if (!r)
          return (
            console.error(
              `THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ` +
                e +
                ` morphAttribute.`,
            ),
            null
          );
        c.morphAttributes[e].push(r);
      }
    }
  }
  return c;
}
function Up(e) {
  let t,
    n,
    r,
    i = -1,
    a = 0;
  for (let o = 0; o < e.length; ++o) {
    let s = e[o];
    if ((t === void 0 && (t = s.array.constructor), t !== s.array.constructor))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`,
        ),
        null
      );
    if ((n === void 0 && (n = s.itemSize), n !== s.itemSize))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`,
        ),
        null
      );
    if ((r === void 0 && (r = s.normalized), r !== s.normalized))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`,
        ),
        null
      );
    if ((i === -1 && (i = s.gpuType), i !== s.gpuType))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`,
        ),
        null
      );
    a += s.count * n;
  }
  let o = new t(a),
    s = new Dr(o, n, r),
    c = 0;
  for (let t = 0; t < e.length; ++t) {
    let r = e[t];
    if (r.isInterleavedBufferAttribute) {
      let e = c / n;
      for (let t = 0, i = r.count; t < i; t++)
        for (let i = 0; i < n; i++) {
          let n = r.getComponent(t, i);
          s.setComponent(t + e, i, n);
        }
    } else o.set(r.array, c);
    c += r.count * n;
  }
  return (i !== void 0 && (s.gpuType = i), s);
}
function Wp(e, t) {
  if (t === 0)
    return (
      console.warn(
        `THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`,
      ),
      e
    );
  if (t === 2 || t === 1) {
    let n = e.getIndex();
    if (n === null) {
      let t = [],
        r = e.getAttribute(`position`);
      if (r !== void 0) {
        for (let e = 0; e < r.count; e++) t.push(e);
        (e.setIndex(t), (n = e.getIndex()));
      } else
        return (
          console.error(
            `THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`,
          ),
          e
        );
    }
    let r = n.count - 2,
      i = [];
    if (t === 2)
      for (let e = 1; e <= r; e++)
        (i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1)));
    else
      for (let e = 0; e < r; e++)
        e % 2 == 0
          ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2)))
          : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
    return (
      i.length / 3 !== r &&
        console.error(
          `THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`,
        ),
      e.setIndex(i),
      e.clearGroups(),
      e
    );
  }
  return (
    console.error(
      `THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,
      t,
    ),
    e
  );
}
