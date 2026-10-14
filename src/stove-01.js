// stove-01.js — the stove fire (shader, mesh and the contained wood fire)
// Lines 62724-62852 of readable/assets__index-BogB70q-.pretty.js (cluster stove, statement-aligned).
function JS(e, t, n) {
  return (
    (e.onBeforeCompile = (e) => {
      ((e.vertexShader =
        `varying vec3 vStoveFinish;
` + e.vertexShader),
        (e.vertexShader = e.vertexShader.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
vStoveFinish=position;`,
        )),
        (e.fragmentShader =
          `varying vec3 vStoveFinish;
` +
          qS +
          e.fragmentShader),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <map_fragment>`,
          `#include <map_fragment>
      float stoveGrain=stoveNoise(vStoveFinish*${t.toFixed(1)});
      diffuseColor.rgb*=.86+stoveGrain*.22;`,
        )),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <roughnessmap_fragment>`,
          `#include <roughnessmap_fragment>
      roughnessFactor=clamp(roughnessFactor+(stoveGrain-.5)*.14,.28,1.);`,
        )),
        (e.fragmentShader = e.fragmentShader.replace(
          `#include <normal_fragment_maps>`,
          `#include <normal_fragment_maps>
      vec3 stoveDx=dFdx(-vViewPosition),stoveDy=dFdy(-vViewPosition);
      vec3 stoveR1=cross(stoveDy,normal),stoveR2=cross(normal,stoveDx);
      float stoveD=dot(stoveDx,stoveR1),stoveHeight=stoveGrain*${n.toFixed(5)};
      normal=normalize(abs(stoveD)*normal-sign(stoveD)*(dFdx(stoveHeight)*stoveR1+dFdy(stoveHeight)*stoveR2));`,
        )));
    }),
    (e.customProgramCacheKey = () => `stove-finish-${t}-${n}`),
    e
  );
}
function YS(e, t, n, r) {
  let i = new e(),
    a = -t / 2,
    o = -n / 2,
    s = r;
  return (
    i.moveTo(a + s, o),
    i.lineTo(a + t - s, o),
    i.quadraticCurveTo(a + t, o, a + t, o + s),
    i.lineTo(a + t, o + n - s),
    i.quadraticCurveTo(a + t, o + n, a + t - s, o + n),
    i.lineTo(a + s, o + n),
    i.quadraticCurveTo(a, o + n, a, o + n - s),
    i.lineTo(a, o + s),
    i.quadraticCurveTo(a, o, a + s, o),
    i
  );
}
function buildStoveFire() {
  let e = new ts({
      name: `Fire behind the stove glass`,
      transparent: !0,
      depthWrite: !1,
      side: 1,
      clipping: !0,
      uniforms: { uFireTime: { value: 0 }, uFireEye: { value: new U() } },
      vertexShader: `
      #include <common>
      #include <clipping_planes_pars_vertex>
      varying vec3 vFirePosition;
      void main(){vFirePosition=position;vec4 mvPosition=modelViewMatrix*vec4(position,1.);
        gl_Position=projectionMatrix*mvPosition;
        #include <clipping_planes_vertex>
      }`,
      fragmentShader: `
      #include <clipping_planes_pars_fragment>
      ${qS}
      uniform float uFireTime;uniform vec3 uFireEye;varying vec3 vFirePosition;
      void main(){
        #include <clipping_planes_fragment>
        vec3 ray=normalize(vFirePosition-uFireEye),inv=1./(ray+vec3(.000001));
        vec3 a=(-.5-uFireEye)*inv,b=(.5-uFireEye)*inv;
        vec3 lo=min(a,b),hi=max(a,b);
        float near=max(0.,max(lo.x,max(lo.y,lo.z))),far=min(hi.x,min(hi.y,hi.z));
        if(far<=near)discard;
        float stepSize=(far-near)/28.;vec4 fire=vec4(0.);
        for(int i=0;i<28;i++){
          vec3 p=uFireEye+ray*(near+(float(i)+.5)*stepSize);float h=p.y+.5;
          vec3 flow=p*vec3(6.,4.,5.)-vec3(0.,uFireTime*2.25,0.);
          float turbulence=stoveNoise(flow)*.65+stoveNoise(flow*2.1+4.7)*.35;
          float curl=sin(h*5.-uFireTime*2.1)*h*.075;
          float tongues=0.;
          for(int j=0;j<3;j++){
            float seed=float(j),x=(seed-1.)*.235+curl+(stoveNoise(flow*.7+seed*3.)-.5)*h*.2;
            float width=mix(.14,.015,smoothstep(.08,.88,h));
            float tip=.56+.22*sin(uFireTime*1.4+seed*2.8)+turbulence*.17;
            float body=exp(-pow((p.x-x)/width,2.)-pow((p.z+.015)/(.22-h*.13),2.));
            tongues+=body*(1.-smoothstep(tip-.24,tip+.03,h));
          }
          float density=max(0.,tongues*(.5+turbulence)-.12)*smoothstep(0.,.08,h);
          density*=1.-smoothstep(.84,1.,h);
          float alpha=1.-exp(-density*stepSize*6.);
          vec3 color=mix(vec3(1.7,.20,.012),vec3(3.8,1.65,.27),clamp(density*.7,0.,1.));
          color=mix(color,vec3(4.6,3.5,1.45),smoothstep(1.1,1.8,density)*(1.-h));
          fire.rgb+=(1.-fire.a)*color*alpha;fire.a+=(1.-fire.a)*alpha;
        }
        if(fire.a<.005)discard;
        gl_FragColor=vec4(fire.rgb/max(fire.a,.001),fire.a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    }),
    t = new vi(new ba(1, 1, 1), e),
    n = new W();
  return (
    (t.name = `A small contained wood fire`),
    t.scale.set(0.43, 0.39, 0.28),
    t.position.set(0, 0.62, 0),
    (t.userData.skipAO = !0),
    (t.renderOrder = 2),
    (t.onBeforeRender = (r, i, a) => {
      (n.copy(t.matrixWorld).invert(),
        e.uniforms.uFireEye.value
          .setFromMatrixPosition(a.matrixWorld)
          .applyMatrix4(n));
    }),
    t
  );
}
