// assets__index-BogB70q- 16 — fragmentshader
// Lines 35527-35868 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Xm(e, t, n = [], r = Y) {
  let i = r(e, t),
    a = 0.22,
    o = (r(e + a, t) - r(e - a, t)) / (2 * a),
    s = (r(e, t + a) - r(e, t - a)) / (2 * a),
    c = Math.hypot(o, s),
    l = J((q - i) / Math.max(0.08, c), 0, 12),
    u = c > 1e-5 ? -o / c : 0,
    d = c > 1e-5 ? -s / c : 0;
  for (let r of n) {
    let n = (e - r.x) / r.rx,
      i = (t - r.z) / r.rz,
      a = Math.max(0, (Math.hypot(n, i) - 1) * Math.min(r.rx, r.rz));
    if (a < l) {
      l = a;
      let e = n / r.rx,
        t = i / r.rz,
        o = Math.hypot(e, t);
      ((u = o > 1e-5 ? e / o : 0), (d = o > 1e-5 ? t / o : 0));
    }
  }
  return [i, l, u, d];
}
function Zm(e = [], t = 256, n = 42) {
  let r = new Float32Array(t * t * 4);
  for (let i = 0; i < t; i++)
    for (let a = 0; a < t; a++) {
      let o = ((a / (t - 1)) * 2 - 1) * n,
        s = ((i / (t - 1)) * 2 - 1) * n;
      r.set(Xm(o, s, e), (i * t + a) * 4);
    }
  return r;
}
function Qm(e) {
  if (e.min.y >= 0.18 || e.max.y <= 0.18) return null;
  let t = (e.min.y + e.max.y) * 0.5,
    n = (e.max.y - e.min.y) * 0.5,
    r = Math.sqrt(Math.max(0, 1 - ((q - t) / n) ** 2)),
    i = (e.max.x - e.min.x) * 0.5 * r,
    a = (e.max.z - e.min.z) * 0.5 * r;
  return Math.min(i, a) < 0.1
    ? null
    : {
        x: (e.min.x + e.max.x) * 0.5,
        z: (e.min.z + e.max.z) * 0.5,
        rx: i,
        rz: a,
      };
}
var $m = { value: 0 },
  eh = { value: 0 };
function th(e) {
  let t = /Oak|Honey oak|Cedar shingles|Alder bark/.test(e.name),
    n = t && e.name !== `Honey oak | varnished timber`;
  (t && e.normalScale?.multiplyScalar(1.15),
    e.name === `Cedar shingles` &&
      e.color.multiply(new G().setRGB(1.13, 0.94, 0.75)),
    e.name === `Lily pads` &&
      ((e.roughnessMap = null),
      (e.roughness = 0.5),
      e.color.setRGB(0.44, 0.63, 0.25),
      e.normalScale?.set(0.85, 0.85),
      (e.onBeforeCompile = (e) => {
        e.fragmentShader = e.fragmentShader.replace(
          `#include <lights_physical_fragment>`,
          `#include <lights_physical_fragment>
material.specularColor*=.42;material.specularColorBlended*=.42;`,
        );
      }),
      (e.customProgramCacheKey = () => `waxy-lily-surface`)));
  let r =
      /^(Leaves|New growth|Fern shadow)|Scanned (fern_02|tree_small_02_leaves|alder leaves|birch leaves|birch new growth)/.test(
        e.name,
      ),
    i = /Limestone|Bedrock|Scanned (boulder_01|rock_moss_set_01)/.test(e.name);
  (t &&
    ((e.onBeforeCompile = (e) => {
      (Object.assign(e.uniforms, Jm),
        (e.vertexShader =
          `varying vec3 vTimberWorld;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <worldpos_vertex>`,
          `#include <worldpos_vertex>
        vec4 timberPosition=vec4(transformed,1.);
        #ifdef USE_INSTANCING
          timberPosition=instanceMatrix*timberPosition;
        #endif
        vTimberWorld=(modelMatrix*timberPosition).xyz;`,
        )),
        (e.fragmentShader =
          `varying vec3 vTimberWorld;
` +
          Ym +
          e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <roughnessmap_fragment>`,
          `#include <roughnessmap_fragment>
        float timberWeather=.5+.5*sin(vTimberWorld.x*8.7+sin(vTimberWorld.z*5.2)+vTimberWorld.y*3.1);
        float timberWet=1.-smoothstep(.18,.67,vTimberWorld.y);
        roughnessFactor=clamp(roughnessFactor+timberWeather*.12-timberWet*.18,.29,1.);
        roughnessFactor=mix(roughnessFactor,min(roughnessFactor,.24+timberWeather*.04),timberShore.y*.80);`,
        )),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <map_fragment>`,
          `#include <map_fragment>
        float dampTimber=1.-smoothstep(.17,.52,vTimberWorld.y);
        vec2 timberShore=${n ? `shoreWetness(vTimberWorld,.16)` : `vec2(0.)`};
        diffuseColor.rgb*=mix(vec3(.72,.77,.74),vec3(1.),1.-dampTimber);
        diffuseColor.rgb*=mix(vec3(1.),vec3(.86,.91,.88),timberShore.x);`,
        )));
    }),
    (e.customProgramCacheKey = () =>
      n ? `weathered-timber-v15` : `weathered-timber-v14`)),
    (r || i) &&
      (e.name.startsWith(`Limestone`) &&
        e.color.multiply(new G().setRGB(1.3, 1.75, 2)),
      r && ((e.side = 2), (e.roughnessMap = null), (e.roughness = 0.91)),
      (e.name === `Scanned tree_small_02_leaves` ||
        e.name === `Scanned alder leaves`) &&
        (e.color.multiplyScalar(1.18),
        e.normalScale.set(0.42, 0.42),
        (e.alphaTest = 0.16)),
      e.name.startsWith(`Scanned birch`) &&
        (e.color.setRGB(
          ...(e.name.endsWith(`new growth`)
            ? [1.42, 1.52, 1.05]
            : [1.18, 1.32, 1.02]),
        ),
        e.normalScale.set(0.38, 0.38),
        (e.alphaTest = 0.12),
        (e.roughness = 0.81)),
      (e.onBeforeCompile = (t) => {
        (i &&
          ((t.uniforms.uSurfaceTime = $m),
          Object.assign(t.uniforms, Jm),
          (t.vertexShader =
            `varying vec3 vSurfaceWorld;varying vec3 vSurfaceNormal;
` + t.vertexShader),
          (t.vertexShader = t.vertexShader.replace(
            `#include <worldpos_vertex>`,
            `#include <worldpos_vertex>
        vec4 surfacePosition=vec4(transformed,1.);vec3 surfaceNormal=normal;
        #ifdef USE_INSTANCING
          surfacePosition=instanceMatrix*surfacePosition;surfaceNormal=mat3(instanceMatrix)*surfaceNormal;
        #endif
        vSurfaceWorld=(modelMatrix*surfacePosition).xyz;
        vSurfaceNormal=normalize(mat3(modelMatrix)*surfaceNormal);`,
          )),
          (t.fragmentShader =
            `uniform float uSurfaceTime;varying vec3 vSurfaceWorld;varying vec3 vSurfaceNormal;
        float surfaceHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
        float surfaceNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
          return mix(mix(mix(surfaceHash(i),surfaceHash(i+vec3(1,0,0)),f.x),mix(surfaceHash(i+vec3(0,1,0)),surfaceHash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(surfaceHash(i+vec3(0,0,1)),surfaceHash(i+vec3(1,0,1)),f.x),mix(surfaceHash(i+vec3(0,1,1)),surfaceHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
        ` +
            Ym +
            t.fragmentShader),
          (t.fragmentShader = t.fragmentShader.replace(
            `#include <map_fragment>`,
            `#include <map_fragment>
        ${
          e.name.startsWith(`Scanned`)
            ? `float mineralLuma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(mineralLuma)*vec3(1.05,1.07,1.09),.46);`
            : ``
        }
        float growth=surfaceNoise(vSurfaceWorld*1.9)+surfaceNoise(vSurfaceWorld*9.)*.23;
        float moss=smoothstep(.49,.74,growth)*smoothstep(-.08,.62,vSurfaceNormal.y);
        float flecks=surfaceNoise(vSurfaceWorld*27.);
        diffuseColor.rgb*=.93+.12*flecks;
        diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.39,.66,.16),moss*.88);
        vec2 stoneShore=shoreWetness(vSurfaceWorld,.21);
        diffuseColor.rgb*=mix(.61,1.,smoothstep(.14,.68,vSurfaceWorld.y));
        diffuseColor.rgb*=mix(vec3(1.),vec3(.79,.85,.82),stoneShore.x);`,
          )),
          (t.fragmentShader = t.fragmentShader.replace(
            `#include <shadowmap_pars_fragment>`,
            `#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>`,
          )),
          (t.fragmentShader = t.fragmentShader.replace(
            `#include <roughnessmap_fragment>`,
            `#include <roughnessmap_fragment>
        float wetEdge=1.-smoothstep(.16,.62,vSurfaceWorld.y);
        roughnessFactor=mix(roughnessFactor,max(.28,roughnessFactor*.57),wetEdge);
        roughnessFactor=mix(roughnessFactor,min(roughnessFactor,.23+flecks*.05),stoneShore.y*.80);`,
          )),
          (t.fragmentShader = t.fragmentShader.replace(
            `#include <opaque_fragment>`,
            `
        if(vSurfaceWorld.y<.16){
          float submerged=(1.-smoothstep(-.25,.16,vSurfaceWorld.y))*exp(min(0.,vSurfaceWorld.y)*.27);
          vec3 cp=vSurfaceWorld*vec3(4.,.3,4.);
          cp.x+=sin(cp.z*.7+uSurfaceTime*.3)*.65;
          float ripple=abs(surfaceNoise(cp+vec3(uSurfaceTime*.13,0.,0.))-.52);
          float caustic=1.-smoothstep(.008,.045,ripple);
          outgoingLight+=vec3(.13,.18,.095)*caustic*submerged*max(.15,vSurfaceNormal.y)*getShadowMask();
        }
        #include <opaque_fragment>`,
          ))),
          r &&
            ((t.fragmentShader = t.fragmentShader.replace(
              `#include <shadowmap_pars_fragment>`,
              `#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>`,
            )),
            (t.fragmentShader = t.fragmentShader.replace(
              `#include <lights_fragment_end>`,
              `#include <lights_fragment_end>
        vec3 sunDirection=normalize((viewMatrix*vec4(${vf},0.)).xyz);
        float translucency=pow(max(dot(-geometryViewDir,sunDirection),0.),2.)*.6+max(dot(-normal,sunDirection),0.)*.24;
        reflectedLight.directDiffuse+=diffuseColor.rgb*vec3(1.9,1.6,.85)*translucency*(.25+.75*getShadowMask());`,
            ))));
      }),
      (e.customProgramCacheKey = () =>
        `surface-${r ? `v15-leaves` : e.name.startsWith(`Scanned`) ? `v16-mineral-stone` : `v16-stone`}`)));
}
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
  ((e.uniforms.uPassingBreeze = Rf),
    (e.vertexShader = zf + Vf + e.vertexShader));
}
