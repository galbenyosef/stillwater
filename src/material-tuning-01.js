// material-tuning-01.js — the material tuning pass for the mill timber, leaves and lily pads
// Lines 35578-35744 of readable/assets__index-BogB70q-.pretty.js (cluster material-tuning, statement-aligned).
function tuneMaterial(material) {
  let isTimber = /Oak|Honey oak|Cedar shingles|Alder bark/.test(material.name),
    timberWet = isTimber && material.name !== `Honey oak | varnished timber`;
  (isTimber && material.normalScale?.multiplyScalar(1.15),
    material.name === `Cedar shingles` &&
      material.color.multiply(new G().setRGB(1.13, 0.94, 0.75)),
    material.name === `Lily pads` &&
      ((material.roughnessMap = null),
      (material.roughness = 0.5),
      material.color.setRGB(0.44, 0.63, 0.25),
      material.normalScale?.set(0.85, 0.85),
      (material.onBeforeCompile = (e) => {
        e.fragmentShader = e.fragmentShader.replace(
          `#include <lights_physical_fragment>`,
          `#include <lights_physical_fragment>
material.specularColor*=.42;material.specularColorBlended*=.42;`,
        );
      }),
      (material.customProgramCacheKey = () => `waxy-lily-surface`)));
  let isFoliage =
      /^(Leaves|New growth|Fern shadow)|Scanned (fern_02|tree_small_02_leaves|alder leaves|birch leaves|birch new growth)/.test(
        material.name,
      ),
    isRock = /Limestone|Bedrock|Scanned (boulder_01|rock_moss_set_01)/.test(material.name);
  (isTimber &&
    ((material.onBeforeCompile = (e) => {
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
        vec2 timberShore=${timberWet ? `shoreWetness(vTimberWorld,.16)` : `vec2(0.)`};
        diffuseColor.rgb*=mix(vec3(.72,.77,.74),vec3(1.),1.-dampTimber);
        diffuseColor.rgb*=mix(vec3(1.),vec3(.86,.91,.88),timberShore.x);`,
        )));
    }),
    (material.customProgramCacheKey = () =>
      timberWet ? `weathered-timber-v15` : `weathered-timber-v14`)),
    (isFoliage || isRock) &&
      (material.name.startsWith(`Limestone`) &&
        material.color.multiply(new G().setRGB(1.3, 1.75, 2)),
      isFoliage && ((material.side = 2), (material.roughnessMap = null), (material.roughness = 0.91)),
      (material.name === `Scanned tree_small_02_leaves` ||
        material.name === `Scanned alder leaves`) &&
        (material.color.multiplyScalar(1.18),
        material.normalScale.set(0.42, 0.42),
        (material.alphaTest = 0.16)),
      material.name.startsWith(`Scanned birch`) &&
        (material.color.setRGB(
          ...(material.name.endsWith(`new growth`)
            ? [1.42, 1.52, 1.05]
            : [1.18, 1.32, 1.02]),
        ),
        material.normalScale.set(0.38, 0.38),
        (material.alphaTest = 0.12),
        (material.roughness = 0.81)),
      (material.onBeforeCompile = (t) => {
        (isRock &&
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
          material.name.startsWith(`Scanned`)
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
          isFoliage &&
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
      (material.customProgramCacheKey = () =>
        `surface-${isFoliage ? `v15-leaves` : material.name.startsWith(`Scanned`) ? `v16-mineral-stone` : `v16-stone`}`)));
}
