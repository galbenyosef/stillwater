// assets__index-BogB70q- 33 — elements
// Lines 52831-53173 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function rv(e, t) {
  let n = new Set(e.children),
    r = Ph(xh.placements),
    i = h_(),
    a = h_({ rootColor: `#365b2c`, tipColor: `#779650` }),
    o = v_(xh.placements),
    s = c_().map((e) => ({ ...e, kind: `tree` })),
    c = y_([...xh.placements, ...s]),
    l = h_({ rootColor: `#355025`, tipColor: `#8ba051`, blades: 16 }),
    u = Fh(),
    d = Ih(xh.placements),
    f = Lh(xh.placements),
    p = Gh(xh.placements),
    m = [
      ...xh.placements,
      ...u,
      ...d,
      ...f,
      ...r,
      ...o.plants,
      ...c.plants,
      ...c.stones,
      ...p,
    ].filter((e) =>
      e.asset.startsWith(`bankcover`) &&
      e.x > Sh.landing.x - 0.8 &&
      e.x < Sh.approach.x1 &&
      Math.abs(e.z - Sh.landing.z) < 0.55
        ? !1
        : !(
            /bankcover|fern|grass|foxglove|flowers|shrub/.test(e.asset) &&
            (jh(e.x, e.z) || Math.hypot(e.x - Dh.x, e.z - Dh.z) < 1.3)
          ),
    ),
    h = { value: 0 },
    g = t.terrain.clone(!0);
  (e.add(g),
    Jh(g, [...m, ...s, ...o.patches]),
    g.traverse((e) => {
      if (
        !e.isMesh ||
        ((e.receiveShadow = !0), (e.castShadow = !1), e.name.includes(`earth`))
      )
        return;
      let t = e.material.onBeforeCompile;
      ((e.material.onBeforeCompile = (e, n) => {
        (t(e, n),
          (e.uniforms.uPondTime = h),
          (e.vertexShader =
            `varying vec3 vBed;
` + e.vertexShader),
          (e.vertexShader = e.vertexShader.replace(
            `#include <worldpos_vertex>`,
            `#include <worldpos_vertex>
vBed=(modelMatrix*vec4(transformed,1.)).xyz;`,
          )),
          (e.fragmentShader =
            `varying vec3 vBed;uniform float uPondTime;
        vec2 lightHash(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
        float lightCells(vec2 p){
          vec2 cell=floor(p),f=fract(p);float a=8.,b=8.;
          for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){
            vec2 g=vec2(float(i),float(j));vec2 point=g+.5+.33*sin(uPondTime*.39+6.283*lightHash(cell+g))-f;
            float d=dot(point,point);if(d<a){b=a;a=d;}else b=min(b,d);
          }return 1.-smoothstep(.015,.075,sqrt(b)-sqrt(a));
        }
      ` + e.fragmentShader),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <lights_fragment_end>`,
            `#include <lights_fragment_end>
        if(vBed.y<.19){
          float waterDepth=max(0.,.18-vBed.y);
          vec2 p=vBed.xz*(1.85/(1.+waterDepth*.10));
          p+=vec2(sin(p.y*.8+uPondTime*.23),cos(p.x*.7-uPondTime*.19))*.40;
          float caustic=lightCells(p);
          float focus=.25+.75*pow(.5+.5*sin(vBed.x*.75+sin(vBed.z*.72)),2.);
          reflectedLight.directDiffuse*=1.+caustic*focus*.65*exp(-waterDepth*.70)*(1.-smoothstep(-.15,.19,vBed.y));
        }`,
          )));
      }),
        (e.material.customProgramCacheKey = () => `mill-island-bed-v17`));
    }));
  let _ = new Pn();
  e.add(_);
  let v = new Map(),
    y = [],
    b = [],
    x = [],
    S = xh.placements.find((e) => e.asset === `mill`),
    C = { ...S, asset: `architecture` },
    w = { ...S, asset: `millinterior` },
    T = { ...S, asset: `bridgepath`, x: 0, y: 0, z: 0 };
  for (let e of [...m, C, w, T]) {
    let t =
      e.asset === `tree1` && e.x === -16 && e.z === -8
        ? `tree1_bridge`
        : e.asset === `tree1` && e.x > 17
          ? `tree1_crown`
          : e.asset;
    (v.has(t) || v.set(t, []), v.get(t).push(e));
  }
  for (let [n, r] of v) {
    if (
      (/^(mill|architecture|bridge|rock\d+)$/.test(n) && y.push(...W_(t[n], r)),
      n === `wheel`)
    ) {
      let e = r[0];
      (_.position.set(e.x, e.y, e.z), _.add(t.wheel.clone(!0)));
      continue;
    }
    if (n.startsWith(`tree`))
      for (let i of r) {
        let r = t_(t[n], i),
          a =
            n === `tree3`
              ? t
              : { [n]: n_(t[n], r), [n + `_lod`]: n_(t[n + `_lod`], r) };
        b.push(...W_(a[n], [i]));
        let o = bh(e, a, n, n + `_lod`, [{ ...i, leafTint: r.leafTint }], {
          distance: 44,
          cellSize: 1,
          wind: !0,
          fade: !0,
          waterClass: n === `tree3` ? `crossing` : `above`,
        });
        if (
          (o.traverse((e) => {
            e.isLOD && x.push(e);
          }),
          n === `tree3`)
        ) {
          o.updateWorldMatrix(!0, !0);
          let e = new ir();
          o.traverse((t) => {
            t.isInstancedMesh &&
              (t.computeBoundingBox(),
              e.copy(t.boundingBox).applyMatrix4(t.matrixWorld),
              (t.userData.aboveWater = e.min.y > q + 0.3));
          });
        }
      }
    else {
      let o = /fern|bankcover|grass|foxglove|flowers|reeds|waterplant/.test(n);
      yh(
        e,
        n === `meadowgrass`
          ? i
          : n === `bankgrass`
            ? a
            : n === `clearinggrass`
              ? l
              : t[n],
        r,
        { wind: o, cast: !o, cellSize: o ? 8 : n === `clearinggrass` ? 10 : 0 },
      );
    }
  }
  let E = [...r_(xh.placements), ...o.litter];
  (t.leafLitter &&
    yh(e, t.leafLitter, E, {
      cast: !1,
      receive: !0,
      waterClass: `above`,
    }).traverse((e) => {
      e.isMesh && (e.userData.skipAO = !0);
    }),
    tp(xh.solids));
  let D = f_(e, t);
  for (let t of e.children) n.has(t) || (a_(t), t !== _ && o_(t, q));
  _.matrixAutoUpdate = !0;
  let O = Xg(t);
  O && e.add(O.root);
  let k = xg(),
    A = kg(e, t, k);
  A?.update();
  let j = {
    trees: xh.counts.tree,
    backgroundTrees: D.treeCount,
    rocks: xh.counts.rock,
    plants:
      xh.counts.fern +
      xh.counts.plants +
      xh.counts.reeds +
      d.length +
      f.length +
      r.length +
      o.plants.length +
      c.plants.length +
      p.filter((e) => e.kind === `foundationplant`).length,
    fallenLeaves: E.length,
    lilies: xh.counts.lilies,
    pebbles:
      xh.counts.pebbles +
      u.length +
      c.stones.length +
      p.filter((e) => e.kind === `foundationstone`).length,
    assetTypes: $_.length,
    solidDetails: xh.solids.length,
  };
  return {
    ground: g,
    wheel: _,
    millDrive: O,
    power: k,
    sluice: A,
    cameraObstacles: y,
    followCameraObstacles: b,
    solidDetails: xh.solids,
    counts: j,
    setLow(e) {
      for (let t of x) t.levels[1].distance = e ? 28 : 44;
    },
    update(e, t, n, r) {
      ((h.value = e),
        k.update(e),
        A?.update(),
        (_.rotation.x = k.state.angle),
        O?.update(_.rotation.x),
        hh(e, r ?? t));
    },
  };
}
var iv = class e extends vi {
  constructor(t, n = {}) {
    (super(t),
      (this.isReflector = !0),
      (this.type = `Reflector`),
      (this.forceUpdate = !1),
      (this._reflectionCameras = new WeakMap()));
    let r = this,
      i = n.color === void 0 ? new G(8355711) : new G(n.color),
      a = n.textureWidth || 512,
      o = n.textureHeight || 512,
      s = n.clipBias || 0,
      c = n.shader || e.ReflectorShader,
      l = n.multisample === void 0 ? 4 : n.multisample,
      u = new Yr(),
      d = new U(),
      f = new U(),
      p = new U(),
      m = new W(),
      h = new U(0, 0, -1),
      g = new tn(),
      _ = new U(),
      v = new U(),
      b = new tn(),
      x = new W(),
      S = new rn(a, o, { samples: l, type: y }),
      C = new ts({
        name: c.name === void 0 ? `unspecified` : c.name,
        uniforms: Qo.clone(c.uniforms),
        fragmentShader: c.fragmentShader,
        vertexShader: c.vertexShader,
      });
    ((C.uniforms.tDiffuse.value = S.texture),
      (C.uniforms.color.value = i),
      (C.uniforms.textureMatrix.value = x),
      (this.material = C),
      (this.onBeforeRender = function (e, t, n) {
        let i = this.getReflectionCamera(n);
        if (
          (f.setFromMatrixPosition(r.matrixWorld),
          p.setFromMatrixPosition(n.matrixWorld),
          m.extractRotation(r.matrixWorld),
          d.set(0, 0, 1),
          d.applyMatrix4(m),
          _.subVectors(f, p),
          _.dot(d) > 0 && this.forceUpdate === !1)
        )
          return;
        (_.reflect(d).negate(),
          _.add(f),
          m.extractRotation(n.matrixWorld),
          h.set(0, 0, -1),
          h.applyMatrix4(m),
          h.add(p),
          v.subVectors(f, h),
          v.reflect(d).negate(),
          v.add(f),
          i.position.copy(_),
          i.up.set(0, 1, 0),
          i.up.applyMatrix4(m),
          i.up.reflect(d),
          i.lookAt(v),
          (i.far = n.far),
          i.updateMatrixWorld(),
          i.projectionMatrix.copy(n.projectionMatrix),
          x.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
          x.multiply(i.projectionMatrix),
          x.multiply(i.matrixWorldInverse),
          x.multiply(r.matrixWorld),
          u.setFromNormalAndCoplanarPoint(d, f),
          u.applyMatrix4(i.matrixWorldInverse),
          g.set(u.normal.x, u.normal.y, u.normal.z, u.constant));
        let a = i.projectionMatrix;
        (i.isOrthographicCamera
          ? ((b.x = (Math.sign(g.x) + a.elements[8]) / a.elements[0]),
            (b.y = (Math.sign(g.y) + a.elements[9]) / a.elements[5]),
            (b.z = -n.far),
            (b.w = 1))
          : ((b.x = (Math.sign(g.x) + a.elements[8]) / a.elements[0]),
            (b.y = (Math.sign(g.y) + a.elements[9]) / a.elements[5]),
            (b.z = -1),
            (b.w = (1 + a.elements[10]) / a.elements[14])),
          g.multiplyScalar(2 / g.dot(b)),
          (a.elements[2] = g.x),
          (a.elements[6] = g.y),
          i.isOrthographicCamera
            ? ((a.elements[10] = g.z - s), (a.elements[14] = g.w - 1))
            : ((a.elements[10] = g.z + 1 - s), (a.elements[14] = g.w)),
          (r.visible = !1));
        let o = e.getRenderTarget(),
          c = e.xr.enabled,
          l = e.shadowMap.autoUpdate;
        ((e.xr.enabled = !1),
          (e.shadowMap.autoUpdate = !1),
          e.setRenderTarget(S),
          e.state.buffers.depth.setMask(!0),
          e.autoClear === !1 && e.clear(),
          e.render(t, i),
          (e.xr.enabled = c),
          (e.shadowMap.autoUpdate = l),
          e.setRenderTarget(o));
        let y = n.viewport;
        (y !== void 0 && e.state.viewport(y),
          (r.visible = !0),
          (this.forceUpdate = !1));
      }),
      (this.getRenderTarget = function () {
        return S;
      }),
      (this.dispose = function () {
        (S.dispose(), r.material.dispose());
      }),
      (this.getReflectionCamera = function (e) {
        let t = this._reflectionCameras.get(e);
        return (
          t === void 0 && ((t = e.clone()), this._reflectionCameras.set(e, t)),
          t
        );
      }));
  }
};
