// assets__index-BogB70q- 58 — math
// Lines 60550-60822 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
async function iS() {
  let [e, t] = await Promise.all([hx(), gx()]);
  return (
    _x(e),
    (e.animations = t.filter((e) => e.name !== `ResidentBoatFishing`)),
    e
  );
}
function aS(e, t, { reducedMotion: n = !1, surface: r = null } = {}) {
  let i = new Pn();
  ((i.name = `Mill keeper`),
    (i.userData.aboveWater = !0),
    i.add(t.scene),
    e.add(i));
  let a = new Pc(t.scene),
    o = (e) => {
      let n = As.findByName(t.animations, e);
      if (!n) throw Error(`Keeper animation missing: ${e}`);
      return a.clipAction(n).play();
    },
    s = o(`KeeperIdle`),
    c = o(`KeeperWalk`),
    l = new Map(
      t.animations
        .filter((e) => e.name.startsWith(`KeeperTurn`))
        .map((e) => {
          let t = a.clipAction(e);
          return (
            t.setLoop(Me, 1),
            (t.clampWhenFinished = !0),
            t.play(),
            t.setEffectiveWeight(0),
            [e.name, t]
          );
        }),
    ),
    u = 0,
    d = 0,
    f = 0,
    p = `routine`,
    m = !0,
    h = { value: 0 },
    g = { value: 0 };
  t.scene.traverse((e) => {
    if ((e.isBone && d++, !e.isMesh)) return;
    (f++,
      (u +=
        (e.geometry.index?.count ?? e.geometry.attributes.position.count) / 3));
    let n = [`ResidentHoodie`, `ResidentClothes`].includes(e.name);
    if (n || e.name === `ResidentSkin`) {
      let t = e.material,
        r = t.onBeforeCompile,
        i = t.customProgramCacheKey();
      ((e.material = t.clone()),
        (e.material.onBeforeCompile = (e, t) => {
          (r(e, t),
            (e.uniforms.uKeeperWet = h),
            (e.uniforms.uKeeperImmersion = g),
            (e.vertexShader =
              `varying vec3 vKeeperWaterWorld;
` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <worldpos_vertex>`,
              `#include <worldpos_vertex>
vKeeperWaterWorld=(modelMatrix*vec4(transformed,1.)).xyz;`,
            )),
            (e.fragmentShader =
              `uniform float uKeeperWet,uKeeperImmersion;varying vec3 vKeeperWaterWorld;
          float keeperWet(){return max(uKeeperWet,uKeeperImmersion*(1.-smoothstep(${q - 0.006},${q + 0.025},vKeeperWaterWorld.y)));}
        ` + e.fragmentShader),
            n &&
              ((e.fragmentShader = e.fragmentShader.replace(
                `#include <map_fragment>`,
                `#include <map_fragment>
diffuseColor.rgb*=mix(1.,.60,keeperWet());`,
              )),
              (e.fragmentShader = e.fragmentShader.replace(
                `#include <roughnessmap_fragment>`,
                `#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,max(.44,roughnessFactor*.70),keeperWet());`,
              ))),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <opaque_fragment>`,
              `
          float keeperDepth=max(0.,${q}-vKeeperWaterWorld.y);
          float keeperHaze=(1.-exp(-keeperDepth*1.8))*uKeeperImmersion;
          outgoingLight=mix(outgoingLight,outgoingLight*vec3(.68,.88,.82),keeperHaze);
          outgoingLight=mix(outgoingLight,vec3(.035,.052,.043),keeperHaze*.58);
          #include <opaque_fragment>`,
            )));
        }),
        (e.material.customProgramCacheKey = () =>
          i + `-immersed-keeper-v2-` + n));
    }
    ((e.castShadow = ![
      `ResidentGroom`,
      `ResidentScalp`,
      `ResidentCornea`,
      `ResidentTearline`,
    ].includes(e.name)),
      (e.receiveShadow = !0),
      (e.material.envMapIntensity = 0.75),
      (e.boundingSphere = t.scene.userData.resident
        ? new Pr(new U(0, 1, 0), 1.8)
        : new Pr(new U(0, 0.9, 0), 1.2)),
      (e.boundingBox = t.scene.userData.resident
        ? new ir(new U(-1.1, -0.1, -1.2), new U(1.1, 2.1, 1.2))
        : new ir(new U(-0.76, -0.08, -0.7), new U(0.65, 1.92, 1.04))),
      (e.frustumCulled = !0));
  });
  let _ = {},
    v = [];
  t.scene.traverse((e) => {
    e.isBone && v.push(e);
  });
  let y = v.map((e) => ({
      position: e.position.clone(),
      rotation: e.quaternion.clone(),
    })),
    b = ux(t.scene, i, t.animations),
    x = rS(t.scene, i, t.animations),
    S = r ? Dx(i, r, { reducedMotion: n, period: c.getClip().duration }) : null;
  b.clear();
  let C = !1,
    w = !1,
    T = 0;
  function E(e, t = null, { grounded: r = !1 } = {}) {
    if (!m) return;
    (S?.restore(),
      t
        ? Object.assign(_, { pivot: null, stride: 1 }, t, {
            state: t.swim
              ? t.swim.phase === `surface`
                ? t.swim.effort > 0.15
                  ? `Swimming`
                  : `Floating`
                : `At the swim ladder`
              : t.seated
                ? `At the helm`
                : t.pivot
                  ? `Turning`
                  : t.walk > 0.08
                    ? `Walking`
                    : `On foot`,
          })
        : lx(e, { reducedMotion: n, mode: p }, _),
      i.position.set(_.x, _.y, _.z),
      i.rotation.set(t?.pitch ?? 0, _.heading, t?.roll ?? 0, `YXZ`));
    let o = !!t?.seated,
      u = !!t?.swim;
    if (((g.value = +!!u), w && !u && x.clear(), u)) {
      let n =
        t.swim.phase === `entering`
          ? It.smoothstep(t.swim.progress, 0.76, 1)
          : 1;
      ((h.value = Math.max(h.value, n)), (T = e));
    } else h.value = Math.min(h.value, Math.max(0, 1 - (e - T) / 55));
    if (((i.userData.aboveWater = !u), u)) (b.clear(), x.update(t), S?.reset());
    else if (o) b.update(t.grip);
    else {
      if (C || w) {
        a.stopAllAction();
        for (let e = 0; e < v.length; e++)
          (v[e].position.copy(y[e].position),
            v[e].quaternion.copy(y[e].rotation));
        (s.play(), c.play(), b.clear());
      }
      let i = _.pivot?.stage === `turn` ? _.pivot : null,
        o = i ? l.get(qb(i.angle)) : null,
        u = i ? Kb(i.angle) : 0,
        d = o
          ? Ub((i.progress * u) / 0.1) *
            Ub(((1 - i.progress) * u) / 0.1) *
            (i.fade ?? 1)
          : 0;
      for (let e of l.values()) e.setEffectiveWeight(e === o ? d : 0);
      (o &&
        (o.play(),
        (o.paused = !1),
        (o.enabled = !0),
        (o.time = Math.min(
          o.getClip().duration - 1e-7,
          i.progress * o.getClip().duration,
        ))),
        s.setEffectiveWeight(o ? 1 - d : 1 - _.walk),
        c.setEffectiveWeight(o ? 0 : _.walk),
        (s.time = (n ? 0 : e) % s.getClip().duration),
        (c.time = _.gait % c.getClip().duration),
        a.update(0),
        r ? S?.update(e, _, { lockFeet: !!t || p !== `walk` }) : S?.reset());
    }
    (o && S?.reset(), (C = o), (w = u));
  }
  return (
    E(0),
    S?.calibrate(),
    {
      root: i,
      update: E,
      counts: { triangles: u, bones: d, meshes: f },
      get state() {
        return m ? _.state : `Hidden`;
      },
      get enabled() {
        return m;
      },
      setEnabled(e) {
        ((m = !!e), (i.visible = m));
      },
      setMode(e) {
        [`routine`, `idle`, `walk`].includes(e) && (p = e);
      },
    }
  );
}
var oS = Object.freeze({
    x: -3.68,
    y: 0.468714,
    z: 0.94,
    pitch: 0.02302,
    reach: 1.15,
    approach: Object.freeze({
      x: -4.2041,
      y: 0.482,
      z: 1.032,
      heading: (-80 * Math.PI) / 180,
    }),
  }),
  sS = Object.freeze({ cast: 95 / 24, reel: 94 / 24, stow: 1.2 }),
  cS = Object.freeze({
    chair: Object.freeze({
      sitting: [1, 85],
      casting: [86, 150],
      reeling: [151, 231],
      standing: [232, 332],
      ready: 86,
      water: 134,
    }),
    boat: Object.freeze({
      casting: [1, 96],
      reeling: [146, 240],
      ready: 1,
      water: 83,
    }),
  });
function lS(e) {
  if (Math.abs(e.speed ?? 0) > 0.06 || Math.abs(e.turnRate ?? 0) > 0.06)
    return !1;
  let t = e.heading + Math.PI,
    n = Math.sin(t),
    r = Math.cos(t);
  for (let [t, i] of [
    [-1.25, -0.15],
    [-2.1, -0.8],
    [-3.15, -1.78],
    [-2.8, -1.6],
  ])
    if (!rp(e.x + t * r + i * n, e.z - t * n + i * r, 0.18, 0.28)) return !1;
  return !0;
}
function uS(e, t, n) {
  return e === `foot`
    ? Math.hypot(t.x - oS.x, t.z - oS.z) <= oS.reach
      ? `chair`
      : null
    : e === `boat`
      ? Math.abs(n.speed ?? 0) > 0.06 || Math.abs(n.turnRate ?? 0) > 0.06
        ? `slow`
        : lS(n)
          ? `boat`
          : `water`
      : null;
}
