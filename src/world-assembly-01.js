// world-assembly-01.js — world assembly: the LOD name list and the island build order
// Lines 52754-53052 of readable/assets__index-BogB70q-.pretty.js (cluster world-assembly, statement-aligned).
var Z_ = [
    `tree1`,
    `tree2`,
    `tree3`,
    `tree1_lod`,
    `tree2_lod`,
    `tree3_lod`,
    `tree1_crown`,
    `tree1_crown_lod`,
    `tree1_bridge`,
    `tree1_bridge_lod`,
  ],
  Q_ = [
    `boat`,
    `terrain`,
    `springwater`,
    `pondlife`,
    `architecture`,
    `millinterior`,
    `milldoor`,
    `millsidedoor`,
    `bridgepath`,
  ],
  $_ = [...new Set([...worldData.placements.map((e) => e.asset), ...Z_, ...Q_])],
  ev = new Set([
    ...Z_,
    ...Q_,
    `mill`,
    `spring`,
    `bridge`,
    `dockprops`,
    `milldetails`,
  ]),
  tv = (e) =>
    `/${ev.has(e) ? `compact/` : ``}models/${e.replace(/^tree3(?=_|$)/, `tree3_crown`)}.glb`,
  nv = async (e) => {
    let [t, n] = await Promise.all([
      mh(e, {
        names: $_,
        canopies: !1,
        groundTextures: !1,
        urls: Object.fromEntries($_.map((e) => [e, tv(e)])),
      }),
      p_(),
    ]);
    ((t.distantWoodland = n), Zg(t));
    let r = new Set([
      `mill`,
      `architecture`,
      `dockprops`,
      `milldetails`,
      `milldoor`,
    ]);
    for (let e of [
      `mill`,
      `bridge`,
      `architecture`,
      `dockprops`,
      `milldetails`,
      `millinterior`,
      `milldoor`,
      `millsidedoor`,
      `bridgepath`,
    ])
      buildMillInterior(t[e], { naturalDaylight: r.has(e) });
    for (let e of [`mill`, `architecture`, `milldoor`, `millsidedoor`])
      Rg(t[e], e);
    (jg(t.millinterior),
      Ag(t.millinterior),
      Vg(t.millinterior),
      await Hg(t.millinterior),
      buildSluiceGate(t));
    for (let e of Z_) buildGroundCover(t[e]);
    for (let e of [`fern0`, `fern1`, `shrub`, `bankcover0`, `bankcover1`])
      buildGroundCover(t[e], { groundCover: !0 });
    return ((t.leafLitter = i_(t.tree1)), t);
  };
function assembleWorld(e, t) {
  let n = new Set(e.children),
    r = scatterRocks(worldData.placements),
    i = buildMeadowTuft(),
    a = buildMeadowTuft({ rootColor: `#365b2c`, tipColor: `#779650` }),
    o = scatterShrubs(worldData.placements),
    s = c_().map((e) => ({ ...e, kind: `tree` })),
    c = scatterFlowers([...worldData.placements, ...s]),
    l = buildMeadowTuft({ rootColor: `#355025`, tipColor: `#8ba051`, blades: 16 }),
    u = scatterPebbles(),
    d = scatterTrees(worldData.placements),
    f = scatterUndergrowth(worldData.placements),
    p = scatterMillRocks(worldData.placements),
    m = [
      ...worldData.placements,
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
      e.x > pathPlan.landing.x - 0.8 &&
      e.x < pathPlan.approach.x1 &&
      Math.abs(e.z - pathPlan.landing.z) < 0.55
        ? !1
        : !(
            /bankcover|fern|grass|foxglove|flowers|shrub/.test(e.asset) &&
            (onPath(e.x, e.z) || Math.hypot(e.x - benchArea.x, e.z - benchArea.z) < 1.3)
          ),
    ),
    h = { value: 0 },
    g = t.terrain.clone(!0);
  (e.add(g),
    flattenTerrain(g, [...m, ...s, ...o.patches]),
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
    S = worldData.placements.find((e) => e.asset === `mill`),
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
      (/^(mill|architecture|bridge|rock\d+)$/.test(n) && y.push(...buildCollisionBoxes(t[n], r)),
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
        b.push(...buildCollisionBoxes(a[n], [i]));
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
      populateWorld(
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
  let E = [...r_(worldData.placements), ...o.litter];
  (t.leafLitter &&
    populateWorld(e, t.leafLitter, E, {
      cast: !1,
      receive: !0,
      waterClass: `above`,
    }).traverse((e) => {
      e.isMesh && (e.userData.skipAO = !0);
    }),
    setDynamicObstacles(worldData.solids));
  let D = buildDistantHills(e, t);
  for (let t of e.children) n.has(t) || (a_(t), t !== _ && o_(t, q));
  _.matrixAutoUpdate = !0;
  let O = Xg(t);
  O && e.add(O.root);
  let k = xg(),
    A = buildSluiceWinch(e, t, k);
  A?.update();
  let j = {
    trees: worldData.counts.tree,
    backgroundTrees: D.treeCount,
    rocks: worldData.counts.rock,
    plants:
      worldData.counts.fern +
      worldData.counts.plants +
      worldData.counts.reeds +
      d.length +
      f.length +
      r.length +
      o.plants.length +
      c.plants.length +
      p.filter((e) => e.kind === `foundationplant`).length,
    fallenLeaves: E.length,
    lilies: worldData.counts.lilies,
    pebbles:
      worldData.counts.pebbles +
      u.length +
      c.stones.length +
      p.filter((e) => e.kind === `foundationstone`).length,
    assetTypes: $_.length,
    solidDetails: worldData.solids.length,
  };
  return {
    ground: g,
    wheel: _,
    millDrive: O,
    power: k,
    sluice: A,
    cameraObstacles: y,
    followCameraObstacles: b,
    solidDetails: worldData.solids,
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
