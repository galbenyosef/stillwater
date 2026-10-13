// assets__index-BogB70q- 17 — material
// Lines 35869-36082 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
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
              th(e),
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
function vh(e, t) {
  (e.position.set(t.x, t.y, t.z),
    e.rotation.set(t.rx || 0, t.angle || 0, t.rz || 0),
    t.normal &&
      (e.quaternion.setFromUnitVectors(gh, _h.fromArray(t.normal)),
      e.rotateY(t.angle || 0)),
    Array.isArray(t.s) ? e.scale.set(...t.s) : e.scale.setScalar(t.s || 1),
    e.updateMatrix());
}
