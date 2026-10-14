// canopy-01.js — the canopy data loader, the leaf shader chunks/materials and the forest instancing
// Lines 35745-36073 of readable/assets__index-BogB70q-.pretty.js (cluster canopy, statement-aligned).
async function nh() {
  let e = {};
  await Promise.all(
    [`alder-canopy`, `birch-canopy`, `fern0-views`, `fern1-views`].map(
      async (t) => {
        let [n, r] = await Promise.all([
          new Us().loadAsync(`/textures/${t}.webp`),
          fetch(`/textures/${t}.json`),
        ]);
        if (!r.ok) throw Error(`The ${t} metadata could not load.`);
        let i = await r.json();
        if (i.frames.length !== 8) throw Error(`The ${t} atlas is incomplete.`);
        ((n.colorSpace = We),
          (n.anisotropy = 4),
          (e[t] = { texture: n, metadata: i }));
      },
    ),
  );
  let t = { value: 0.62 },
    n = { value: 0 },
    r = {};
  for (let [i, a, o, s] of [
    [`tree0`, `alder-canopy`, 7.2, 1],
    [`tree1`, `birch-canopy`, null, 1],
    [`tree2`, `alder-canopy`, 5.9, 1.04],
    [`fern0`, `fern0-views`, null, 1],
    [`fern1`, `fern1-views`, null, 1],
  ]) {
    let { texture: c, metadata: l } = e[a],
      u = o ?? l.height,
      d = new V(...l.frames[0].root),
      f = i.startsWith(`fern`),
      p = (l.span * u) / l.height,
      m = new Wo(p * s, p);
    (m.translate(0, (0.5 - d.y) * p, 0),
      (m.boundingSphere = new Pr(new U(0, u * 0.5, 0), Math.max(u, p) * 1.25)));
    let h = f
        ? [1.12, 1.15, 0.93]
        : i === `tree1`
          ? [0.18, 0.22, 0.14]
          : [0.62, 0.68, 0.56],
      g = new oi({
        map: c,
        color: new G().setRGB(...h),
        alphaTest: 0.27,
        side: 2,
        fog: !0,
      });
    ((g.name = f
      ? `Distant woodland fern`
      : i === `tree1`
        ? `Distant birch canopy`
        : `Distant alder canopy`),
      (g.alphaToCoverage = !0),
      (g.onBeforeCompile = (e) => {
        ((e.uniforms.uCanopyAngle = t),
          (e.uniforms.uCanopyTime = n),
          (e.uniforms.uCanopySpan = { value: new V(p * s, p) }),
          (e.uniforms.uCanopyRoot = { value: d }),
          (e.vertexShader =
            `uniform float uCanopyAngle,uCanopyTime;uniform vec2 uCanopySpan,uCanopyRoot;
` + e.vertexShader),
          (e.vertexShader = e.vertexShader.replace(
            `#include <uv_vertex>`,
            `#include <uv_vertex>
        float treeYaw=atan(instanceMatrix[2].x/length(instanceMatrix[2].xyz),instanceMatrix[0].x/length(instanceMatrix[0].xyz));
        float frame=floor(mod(uCanopyAngle-treeYaw+0.392699,6.283185)/0.785398);
        vMapUv=vec2((uv.x+mod(frame,4.))*.25,(uv.y+1.-floor(frame*.25))*.5);`,
          )),
          (e.vertexShader = e.vertexShader.replace(
            `#include <project_vertex>`,
            `
        vec4 canopyWorld=modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
        vec2 card=(uv-uCanopyRoot)*uCanopySpan;
        card*=vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));
        card.x+=sin(uCanopyTime*.65+canopyWorld.x*.5)*${f ? `.008` : `.022`}*uv.y*uv.y;
        vec3 right=vec3(cos(uCanopyAngle),0.,-sin(uCanopyAngle));
        vec3 up=vec3(-sin(uCanopyAngle)*.628793,.777573,-cos(uCanopyAngle)*.628793);
        canopyWorld.xyz+=right*card.x+up*card.y;
        vec4 mvPosition=viewMatrix*canopyWorld;
        gl_Position=projectionMatrix*mvPosition;`,
          )));
      }),
      (g.customProgramCacheKey = () => `distant-canopy-${i}`));
    let _ = new Pn();
    ((_.userData.canopy = !0), _.add(new vi(m, g)), (r[i] = _));
  }
  return {
    variants: r,
    update(e, r) {
      ((t.value = e), (n.value = r));
    },
  };
}
var rh = `
  attribute vec3 _leaf_anchor;
  attribute float _leaf_phase;
  float treeBreeze(vec3 origin){
    return .5+.5*sin(uWorldTime*.22-origin.x*.14-origin.z*.11);
  }
  vec3 leafRotation(vec3 p,vec3 origin){
    float phase=_leaf_phase;
    if(phase<.5)return p;
    float angle=(sin(uWorldTime*(.85+fract(phase)*.60)+phase*2.)*.070
      +sin(uWorldTime*2.1+phase*3.1)*.008)*(.38+.62*treeBreeze(origin))*(1.+1.6*passingBreeze(origin.xz));
    vec3 axis=normalize(vec3(sin(phase),.38,cos(phase)));
    float s=sin(angle),c=cos(angle);
    return p*c+cross(axis,p)*s+axis*dot(axis,p)*(1.-c);
  }
`,
  ih = `
  vec3 treeOrigin=(modelMatrix*instanceMatrix[3]).xyz;
  transformed=_leaf_anchor+leafRotation(transformed-_leaf_anchor,treeOrigin);
  float height=max(0.,position.y);
  float branchPhase=treeOrigin.x*.37+treeOrigin.z*.29;
  float breeze=.55+.45*treeBreeze(treeOrigin);
  transformed.x+=sin(uWorldTime*.28+branchPhase+height*.55)*min(height*height*.003,.075)*breeze;
  transformed.z+=sin(uWorldTime*.22+branchPhase*.83+height*.41)*min(height*height*.002,.055)*breeze;
  transformed+=breezeBend(position,.54,64.);
`;
function ah(e) {
  ((e.uniforms.uPassingBreeze = breezeUniform),
    (e.vertexShader = zf + breezeShaderChunk + e.vertexShader));
}
function oh(e, { normals: t = !1 } = {}) {
  (ah(e),
    (e.vertexShader = e.vertexShader.replace(
      `uniform float uWorldTime;`,
      `uniform float uWorldTime;
` + rh,
    )),
    (e.vertexShader = e.vertexShader.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
` + ih,
    )),
    t &&
      (e.vertexShader = e.vertexShader.replace(
        `#include <beginnormal_vertex>`,
        `
    #include <beginnormal_vertex>
    objectNormal=leafRotation(objectNormal,(modelMatrix*instanceMatrix[3]).xyz);
    objectNormal=breezeBendNormal(objectNormal,position,.54,64.);
  `,
      )));
}
function sh(e, { normals: t = !1 } = {}) {
  (ah(e),
    (e.vertexShader = e.vertexShader.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
    float h=max(0.,position.y);float phase=instanceMatrix[3].x*.6+instanceMatrix[3].z*.5;
    transformed.x+=sin(uWorldTime*.75+phase+h*1.3)*min(h*h*.006,.11);
    transformed.z+=cos(uWorldTime*.63+phase+h)*min(h*h*.003,.08);
    transformed+=breezeBend(position,.24,.32);`,
    )),
    t &&
      (e.vertexShader = e.vertexShader.replace(
        `#include <beginnormal_vertex>`,
        `#include <beginnormal_vertex>
    objectNormal=breezeBendNormal(objectNormal,position,.24,.32);`,
      )));
}
var ch = { value: 0 },
  lh = { value: new U() },
  uh = new Nn(),
  dh = new WeakMap(),
  fh = new WeakMap(),
  ph =
    `mill.wheel.boat.oar.bridge.arch.rock0.rock1.rock2.rock0_hero.rock1_hero.rock2_hero.tree0.tree1.tree2.tree3.tree0_lod.tree1_lod.tree2_lod.tree3_lod.fern0.fern1.fern0_lod.fern1_lod.reeds.grass.lily.lilypad.shrub.waterplant.stoneblock.flowers.log.crate.bucket.basket.fence.mushrooms.foxglove.milldetails.wheelbarrow.bankcover0.bankcover1.pebble0.pebble1.pebble2`.split(
      `.`,
    );
async function mh(
  e,
  {
    names: t = ph,
    urls: n = {},
    canopies: i = !0,
    groundTextures: a = !0,
  } = {},
) {
  Ns.enabled = !0;
  let o = new qp().setMeshoptDecoder(qm),
    s = {},
    c = new Map(),
    l = 0;
  await Promise.all(
    t.map(async (i) => {
      let a = await o.loadAsync(n[i] || `/models/${i}.glb`);
      ((s[i] = a.scene),
        (a.scene.userData.lod = i.endsWith(`_lod`)),
        a.scene.traverse((e) => {
          if (!e.isMesh) return;
          let t = Array.isArray(e.material),
            n = t ? e.material : [e.material];
          for (let e of n) {
            if (
              ((e.envMapIntensity = 0.75),
              /Leaves|growth|Fern|flowers|Moss/.test(e.name) && (e.side = 2),
              tuneMaterial(e),
              i === `wheel` &&
                e.name.startsWith(`Oak`) &&
                (e.color.multiplyScalar(0.62), (e.roughness = 0.6)),
              i === `boat`)
            ) {
              let t = e.onBeforeCompile;
              ((e.onBeforeCompile = (e, n) => {
                (t(e, n),
                  (e.uniforms.uWaterPassMode = eh),
                  (e.fragmentShader =
                    `uniform float uWaterPassMode;
` + e.fragmentShader),
                  (e.fragmentShader = e.fragmentShader.replace(
                    `#include <clipping_planes_fragment>`,
                    `if(uWaterPassMode<.5){
#include <clipping_planes_fragment>
}`,
                  )));
              }),
                (e.customProgramCacheKey = () => `dry-boat-interior`));
            }
            let t = /Leaves|growth|Fern|fern|leaves/.test(e.name);
            for (let n of [e.map, e.normalMap, e.roughnessMap, e.aoMap])
              n && ((n.anisotropy = t ? 4 : 12), (n.wrapS = n.wrapT = r));
          }
          let a = n.map((e) =>
            e.aoMap
              ? ((e.aoMapIntensity = 0.9), e)
              : c.has(e.name)
                ? c.get(e.name)
                : (c.set(e.name, e), e),
          );
          ((e.material = t ? a : a[0]),
            (e.castShadow = !0),
            (e.receiveShadow = !0));
        }),
        e(++l / t.length));
    }),
  );
  let u = c.get(`Scanned alder leaves`),
    d = new Map();
  for (let e of [
    `mill`,
    `milldetails`,
    `tree1`,
    `tree1_lod`,
    `shrub`,
    `bankcover0`,
    `bankcover1`,
  ])
    s[e]?.traverse((e) => {
      if (
        !e.isMesh ||
        ![`Leaves`, `New growth`, `Fern shadow`].includes(e.material.name)
      )
        return;
      let t = e.material,
        n = t.aoMap ? t.uuid : t.name;
      if (!d.has(n)) {
        let e = t.clone();
        ((e.name = t.name + ` • scanned foliage`),
          (e.onBeforeCompile = t.onBeforeCompile),
          (e.customProgramCacheKey = t.customProgramCacheKey));
        for (let t of [`map`, `normalMap`])
          ((e[t] = u[t].clone()),
            (e[t].matrixAutoUpdate = !1),
            e[t].matrix.set(
              1 / 3.9,
              0,
              0.15 / 3.9,
              0,
              1 / 1.1,
              0.05 / 1.1,
              0,
              0,
              1,
            ),
            (e[t].anisotropy = 4));
        (e.color.setRGB(
          ...(t.name === `New growth`
            ? [1.42, 1.52, 1.05]
            : t.name === `Fern shadow`
              ? [0.7, 0.9, 0.64]
              : [1.18, 1.32, 1.02]),
        ),
          e.normalScale.set(0.38, 0.38),
          (e.alphaTest = 0.12),
          (e.roughness = 0.81),
          d.set(n, e));
      }
      e.material = d.get(n);
    });
  for (let e of [`tree3`, `tree3_lod`])
    s[e]?.traverse((e) => {
      if (!e.isMesh || ![`Leaves`, `New growth`].includes(e.material.name))
        return;
      let t = e.material,
        n = t.clone();
      ((n.onBeforeCompile = t.onBeforeCompile),
        (n.customProgramCacheKey = t.customProgramCacheKey),
        (n.name = `Willow ` + t.name),
        n.color.multiplyScalar(0.76),
        (e.material = n));
    });
  let f = new Us();
  return (
    (s.textures = { pebbles: {}, sand: {} }),
    a &&
      (await Promise.all(
        [`ground`, `pebbles`, `sand`].flatMap((e) =>
          [`albedo`, `normal`, `roughness`].map(async (t) => {
            let n = await f.loadAsync(`/textures/scan-${e}-${t}.webp`);
            ((n.wrapS = n.wrapT = r),
              (n.anisotropy = 8),
              e === `ground` && n.repeat.set(48, 48),
              t === `albedo` && (n.colorSpace = We),
              ((e === `ground` ? s.textures : s.textures[e])[t] = n));
          }),
        ),
      )),
    i && (s.canopies = await nh()),
    s
  );
}
function hh(e, t) {
  ((ch.value = e), ($m.value = e), lh.value.set(t.x, t.y ?? 0.5, t.z));
}
var gh = new U(0, 1, 0),
  _h = new U();
