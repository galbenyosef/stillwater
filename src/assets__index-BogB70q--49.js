// assets__index-BogB70q- 49 — vertexshader
// Lines 57900-58219 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Db(e, t, n, r, i = 0, a = new U()) {
  if (
    (a.copy(t),
    Tb(e, t.x, t.y, t.z) &&
      (a.z -=
        xb.extension *
        (e.startsWith(`Rubber`)
          ? 1
          : Math.max(0, Math.min(1, (1.74 - t.z) / 0.4)))),
    e.startsWith(`Steel`) && t.z > 2.29 && t.y < -0.05)
  ) {
    let e = Math.cos(i),
      t = Math.sin(i),
      n = a.x,
      r = a.y + 0.235;
    ((a.x = e * n - t * r), (a.y = t * n + e * r - 0.235));
  }
  let o = a.x,
    s = a.y,
    c = a.z;
  return (
    Cb(a, r, a),
    a.set(o + (a.x - o) * n, s + (a.y - s) * n, c + (a.z - c) * n)
  );
}
function Ob(e) {
  let t = { value: 0 },
    n = { value: 0 },
    r = { value: 0 },
    i = { position: new U(), quaternion: new H(), steering: 0 },
    a = new H(),
    o = new U().copy(xb.axis),
    s = new W(),
    c = { value: new zt() };
  return (
    vb(e),
    e.traverse((e) => {
      if (!e.isMesh) return;
      let i = e.material,
        a = i.name === `Coral | pennant`,
        o = i.name === `Steel | fasteners and propeller`,
        s = e.geometry.attributes.position,
        l = Eb(e.geometry, i.name),
        u = null;
      if (
        [`Charcoal | cast engine housing`, `Rubber | grips and seals`].includes(
          i.name,
        )
      ) {
        u = new Float32Array(s.count);
        for (let e = 0; e < s.count; e++)
          u[e] = Number(Tb(i.name, s.getX(e), s.getY(e), s.getZ(e)));
        e.geometry.setAttribute(`tillerPart`, new Dr(u, 1));
      }
      if (l) {
        (e.geometry.setAttribute(`outboardPart`, new Dr(l, 1)),
          e.geometry.computeBoundingBox());
        let t = new U(),
          n = new U();
        for (let r = 0; r < s.count; r++)
          if (l[r]) {
            t.fromBufferAttribute(s, r);
            let a = o && t.z > 2.29 && t.y < -0.05;
            for (let o = -6; o <= 6; o++)
              for (let s = 0; s < (a ? 16 : 1); s++)
                e.geometry.boundingBox.expandByPoint(
                  Db(
                    i.name,
                    t,
                    l[r],
                    (o * xb.maxAngle) / 6,
                    (s * Math.PI) / 8,
                    n,
                  ),
                );
          }
        (e.geometry.boundingBox.expandByScalar(0.01),
          (e.geometry.boundingSphere = e.geometry.boundingBox.getBoundingSphere(
            new Pr(),
          )));
      }
      if (!a && !l) return;
      let d = u
          ? `
      if(tillerPart>.5){
        transformed.z-=${xb.extension}*${i.name === `Rubber | grips and seals` ? `1.` : `clamp((1.74-position.z)/.40,0.,1.)`};
      }
    `
          : ``,
        f = a
          ? `
      float cloth=clamp((position.x-.015)/.31,0.,1.);
      transformed.z+=sin(cloth*8.-uBoatTime*5.2+position.y*3.)*.026*cloth;
      transformed.y+=cos(cloth*7.-uBoatTime*4.4)*.004*cloth;
    `
          : d +
            (o
              ? `
      if(position.z>2.29&&position.y<-.05){
        float c=cos(uMotorAngle),s=sin(uMotorAngle);
        vec2 p=position.xy-vec2(0.,-.235);
        transformed.xy=mat2(c,s,-s,c)*p+vec2(0.,-.235);
      }
    `
              : ``) +
            `
      vec3 swivel=vec3(${xb.pivot.x},${xb.pivot.y},${xb.pivot.z});
      transformed=mix(transformed,uOutboardRotation*(transformed-swivel)+swivel,outboardPart);
    `,
        p = a
          ? ``
          : (o
              ? `
      if(position.z>2.29&&position.y<-.05){float c=cos(uMotorAngle),s=sin(uMotorAngle);objectNormal.xy=mat2(c,s,-s,c)*objectNormal.xy;}
    `
              : ``) +
            `objectNormal=normalize(mix(objectNormal,uOutboardRotation*objectNormal,outboardPart));`;
      function m(e, i) {
        ((e.uniforms.uBoatTime = t),
          (e.uniforms.uMotorAngle = n),
          (e.uniforms.uTillerAngle = r),
          (e.uniforms.uOutboardRotation = c),
          (e.vertexShader =
            `uniform float uBoatTime,uMotorAngle,uTillerAngle;
` +
            (l
              ? `attribute float outboardPart; uniform mat3 uOutboardRotation;
`
              : ``) +
            (u
              ? `attribute float tillerPart;
`
              : ``) +
            e.vertexShader),
          (e.vertexShader = e.vertexShader.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
` + f,
          )),
          i &&
            p &&
            (e.vertexShader = e.vertexShader.replace(
              `#include <beginnormal_vertex>`,
              `#include <beginnormal_vertex>
` + p,
            )));
      }
      let h = i.onBeforeCompile,
        g = i.customProgramCacheKey(),
        _ = a ? `cloth` : `outboard-v2-` + i.name;
      ((i.onBeforeCompile = (e, t) => {
        (h(e, t), m(e, !0));
      }),
        (i.customProgramCacheKey = () => g + `-` + _),
        (e.customDepthMaterial = new os()),
        (e.customDepthMaterial.onBeforeCompile = (e) => m(e, !1)),
        (e.customDepthMaterial.customProgramCacheKey = () => _ + `-depth`));
    }),
    {
      get grip() {
        return (
          wb(r.value, i.position).applyQuaternion(e.quaternion).add(e.position),
          i.quaternion
            .copy(e.quaternion)
            .multiply(a.setFromAxisAngle(o, r.value)),
          (i.steering = -r.value / xb.maxAngle),
          i
        );
      },
      update(e, i, a, l = !1, u = 0, d = u) {
        t.value = l ? e * 0.25 : e;
        let f = Math.max(Math.abs(a), Math.abs(d) * 0.65);
        ((n.value += (a < 0 ? -1 : 1) * f * i * 32),
          (r.value = Sb(u)),
          c.value.setFromMatrix4(s.makeRotationAxis(o, r.value)));
      },
    }
  );
}
var kb = gv(1, _f),
  Ab = `vec2(${kb.x.toFixed(8)},${kb.z.toFixed(8)})`,
  jb = Gc.shadowmap_vertex.replace(
    `vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;`,
    `shadowWorldPosition.xz+=${Ab}*vPondShadowDepth;
   vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;`,
  ),
  Mb = Gc.shadowmap_pars_fragment.replace(
    `float radius = shadowRadius * texelSize.x;`,
    `float radius = (shadowRadius+min(vPondShadowDepth*1.2,3.5)) * texelSize.x;`,
  ),
  Nb = Gc.project_vertex.replace(
    `mvPosition = modelViewMatrix * mvPosition;`,
    `
  vec4 pondCasterWorld=modelMatrix*mvPosition;
  pondCasterWorld.xz+=${Ab}*max(0.,${q}-pondCasterWorld.y);
  mvPosition=viewMatrix*pondCasterWorld;`,
  );
function Pb(e) {
  let t = new Map(),
    n = new Set(),
    r = new os();
  e.traverse((e) => {
    if (!e.isMesh) return;
    for (let t of Array.isArray(e.material) ? e.material : [e.material])
      t.isMeshStandardMaterial && n.add(t);
    if (!e.castShadow) return;
    let i = e.customDepthMaterial || r;
    if (!t.has(i)) {
      let e = i.clone(),
        n = i.onBeforeCompile,
        r = i.customProgramCacheKey();
      ((e.onBeforeCompile = (e, t) => {
        (n(e, t),
          (e.vertexShader = e.vertexShader.replace(
            `#include <project_vertex>`,
            Nb,
          )));
      }),
        (e.customProgramCacheKey = () => r + `-refracted-shadow-caster-v1`),
        t.set(i, e));
    }
    e.customDepthMaterial = t.get(i);
  });
  for (let e of n) Fb(e);
}
function Fb(e) {
  let t = e.onBeforeCompile,
    n = e.customProgramCacheKey();
  ((e.onBeforeCompile = (e, n) => {
    (t(e, n),
      (e.vertexShader =
        `varying float vPondShadowDepth;
` + e.vertexShader),
      (e.vertexShader = e.vertexShader.replace(
        `#include <worldpos_vertex>`,
        `#include <worldpos_vertex>
      vec4 pondReceiver=vec4(transformed,1.);
      #ifdef USE_INSTANCING
        pondReceiver=instanceMatrix*pondReceiver;
      #endif
      vPondShadowDepth=max(0.,${q}-(modelMatrix*pondReceiver).y);`,
      )),
      (e.vertexShader = e.vertexShader.replace(
        `#include <shadowmap_vertex>`,
        jb,
      )),
      (e.fragmentShader =
        `varying float vPondShadowDepth;
` + e.fragmentShader),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <shadowmap_pars_fragment>`,
        Mb,
      )));
  }),
    (e.customProgramCacheKey = () => n + `-submerged-sun-v1`));
}
var Ib = Object.freeze({ x: 0, y: 1.26, z: 0.77 }),
  Lb = Object.freeze({
    pitch: -0.12,
    minPitch: -1.2,
    maxPitch: 0.85,
    maxYaw: Math.PI - 0.08,
  });
function Rb({ reducedMotion: e = !1 } = {}) {
  let t = !1,
    n = 0,
    r = 0,
    i = Lb.pitch,
    a = 0,
    o = i,
    s = new U(),
    c = new H(),
    l = new gn(0, 0, 0, `YXZ`);
  return {
    get active() {
      return t;
    },
    get blend() {
      return n * n * (3 - 2 * n);
    },
    get look() {
      return { yaw: r, pitch: i, targetYaw: a, targetPitch: o };
    },
    setActive(r, { instant: i = !1 } = {}) {
      ((t = !!r), (i || e) && (n = +!!t));
    },
    drag(e, t) {
      ((a = It.clamp(a - e * 0.0032, -Lb.maxYaw, Lb.maxYaw)),
        (o = It.clamp(o - t * 0.0032, Lb.minPitch, Lb.maxPitch)));
    },
    recenter({ instant: e = !1 } = {}) {
      ((a = 0), (o = Lb.pitch), e && ((r = 0), (i = o)));
    },
    update(u, d, f, p) {
      let m = It.clamp(p, 0, 0.1);
      n = e ? +!!t : It.clamp(n + ((t ? 1 : -1) * m) / 1.05, 0, 1);
      let h = 1 - Math.exp(-m * 18);
      ((r += (a - r) * h),
        (i += (o - i) * h),
        u.position.copy(d.position),
        u.quaternion.copy(d.quaternion));
      let g = f ? this.blend : 0;
      g > 0 &&
        (s.set(Ib.x, Ib.y, Ib.z).applyQuaternion(f.quaternion).add(f.position),
        l.set(
          i + (e ? 0 : f.rotation.x * 0.24),
          f.rotation.y + r,
          e ? 0 : f.rotation.z * 0.16,
          `YXZ`,
        ),
        c.setFromEuler(l),
        u.position.lerp(s, g),
        u.quaternion.slerp(c, g));
      let _ = It.lerp(36, u.aspect < 1 ? 76 : 68, g),
        v = It.lerp(0.25, 0.055, g);
      (Math.abs(u.fov - _) > 1e-6 || Math.abs(u.near - v) > 1e-6) &&
        ((u.fov = _), (u.near = v), u.updateProjectionMatrix());
    },
  };
}
