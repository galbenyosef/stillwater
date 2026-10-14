// grass-meadow-01.js — the meadow: canopy loading, curved tufts and the grass clusters
// Lines 51387-51549 of readable/assets__index-BogB70q-.pretty.js (cluster grass-meadow, statement-aligned).
async function p_() {
  let e = await Promise.all(
    [`alder`, `birch`].map(async (e) => {
      let t = `/textures/${e}-canopy`,
        [n, r] = await Promise.all([
          new Us().loadAsync(`${t}.webp`),
          fetch(revisionUrlModifier(`${t}.json`)),
        ]);
      if (!r.ok) throw Error(`The distant ${e} metadata could not load.`);
      let i = await r.json();
      if (i.frames.length !== 8)
        throw Error(`The distant ${e} atlas is incomplete.`);
      return ((n.colorSpace = We), (n.anisotropy = 4), [e, buildCanopyInstance(n, i, e)]);
    }),
  );
  return Object.fromEntries(e);
}
function buildCanopyInstance(e, t, n) {
  let r = n === `birch` ? 11 : 9,
    i = (t.span * r) / t.height,
    a = new V(...t.frames[0].root),
    o = new Wo(i, i);
  (o.translate(0, (0.5 - a.y) * i, 0),
    (o.boundingSphere = new Pr(
      new U(0, (0.5 - a.y) * i, 0),
      i / Math.sqrt(2),
    )));
  let s = n === `birch` ? [0.51, 0.6, 0.46] : [0.68, 0.78, 0.61],
    c = new oi({
      map: e,
      color: new G().setRGB(...s),
      alphaTest: 0.32,
      side: 2,
      fog: !0,
    });
  ((c.name = `Distant ${n} canopy`),
    (c.alphaToCoverage = !0),
    (c.onBeforeCompile = (e) => {
      ((e.uniforms.uWoodlandSpan = { value: i }),
        (e.uniforms.uWoodlandRoot = { value: a }),
        (e.vertexShader =
          `uniform float uWoodlandSpan;uniform vec2 uWoodlandRoot;varying float vWoodlandDistance;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <uv_vertex>`,
          `#include <uv_vertex>
      vec4 treeOrigin=modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
      vWoodlandDistance=length(cameraPosition-treeOrigin.xyz);
      float viewAngle=atan(cameraPosition.x-treeOrigin.x,cameraPosition.z-treeOrigin.z);
      float treeYaw=atan(instanceMatrix[2].x,instanceMatrix[2].z);
      float frame=floor(mod(viewAngle-treeYaw+0.392699,6.283185)/0.785398);
      vMapUv=vec2((uv.x+mod(frame,4.))*.25,(uv.y+1.-floor(frame*.25))*.5);`,
        )),
        (e.vertexShader = e.vertexShader.replace(
          `#include <project_vertex>`,
          `
      vec2 card=(uv-uWoodlandRoot)*uWoodlandSpan;
      card*=vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz));
      vec3 right=vec3(cos(viewAngle),0.,-sin(viewAngle));
      treeOrigin.xyz+=right*card.x+vec3(0.,card.y,0.);
      vec4 mvPosition=viewMatrix*treeOrigin;
      gl_Position=projectionMatrix*mvPosition;`,
        )),
        (e.fragmentShader =
          `varying float vWoodlandDistance;
` + e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <opaque_fragment>`,
          `
      float woodlandAir=mix(.12,.48,smoothstep(35.,145.,vWoodlandDistance));
      outgoingLight=mix(outgoingLight*vec3(.92,1.,1.10),vec3(.30,.405,.43),woodlandAir);
      #include <opaque_fragment>`,
        )));
    }),
    (c.customProgramCacheKey = () => `distant-woodland-v2`));
  let l = new Pn();
  return (l.add(new vi(o, c)), l);
}
function buildMeadowTuft({
  rootColor: e = `#607146`,
  tipColor: t = `#9da06b`,
  blades: n = 24,
} = {}) {
  let r = createRandom(32619),
    i = [],
    a = [],
    o = [],
    s = new G(e),
    c = new G(t),
    l = new G();
  for (let e = 0; e < n; e++) {
    let e = r() * Math.PI * 2,
      t = r() * Math.PI * 2,
      n = Math.sqrt(r()) * 0.19,
      u = Math.cos(t) * n,
      d = Math.sin(t) * n,
      f = 0.18 + r() * 0.25,
      p = 0.07 + r() * 0.19,
      m = 0.014 + r() * 0.008,
      h = 0.79 + r() * 0.28,
      g = i.length / 3;
    for (let t = 0; t <= 4; t++) {
      let n = t / 4,
        r = p * n * n,
        _ = m * (0.025 + 0.975 * (1 - n) ** 0.65) * 0.5,
        v = e + n * 0.32,
        y = f * (n - 0.16 * n * n * n);
      l.copy(s)
        .lerp(c, n * 0.8)
        .multiplyScalar(h);
      for (let t of [-1, 1])
        (i.push(
          u + Math.sin(e) * r + Math.cos(v) * _ * t,
          y,
          d + Math.cos(e) * r - Math.sin(v) * _ * t,
        ),
          a.push(l.r, l.g, l.b));
      if (t < 4) {
        let e = g + t * 2;
        o.push(e, e + 1, e + 2, e + 1, e + 3, e + 2);
      }
    }
  }
  let u = new Hr();
  (u.setAttribute(`position`, new Ar(i, 3)),
    u.setAttribute(`color`, new Ar(a, 3)),
    u.setIndex(o),
    u.computeVertexNormals());
  let d = new rs({
    name: `Leaves | meadow grass`,
    vertexColors: !0,
    roughness: 0.94,
    side: 2,
    envMapIntensity: 0.75,
  });
  tuneMaterial(d);
  let f = new vi(u, d);
  return ((f.name = `Curved meadow tuft`), f);
}
var g_ = [
  [-23.8, -3.1, 2.7, 2],
  [-26.8, -3.9, 2.5, 2.2],
  [-23.8, -0.6, 2.4, 1.7],
  [-22.5, 1.9, 2, 1.8],
  [-25, -7.2, 2.8, 2],
  [-21.4, -6.3, 1.8, 2.1],
  [-19.8, -8.2, 2.1, 1.7],
  [-17.5, -9.4, 1.6, 1.4],
  [-18.3, -1.1, 1.3, 1.6],
  [-19.8, 1.9, 1.8, 1.6],
  [-27.5, 0, 2.3, 2.1],
  [-27, -9.9, 2.4, 1.8],
];
function __(e, t, n) {
  let r = Th;
  return (
    distanceToPath(e, t) > shorePath.width / 2 + n + 0.08 &&
    Math.hypot(e - benchApproach.x, t - benchApproach.z) > benchArea.clearingRadius + n &&
    !insideBenchArea(e, t, n + 0.12) &&
    Math.hypot(e - wh.x, t - wh.z) > wh.radius + n &&
    !(e > r.x0 - n && e < r.x1 + n && Math.abs(t - r.z) < r.width / 2 + n)
  );
}
