// assets__index-BogB70q- 10 — uniforms
// Lines 32324-32654 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var jp = {
    name: `OutputShader`,
    uniforms: { tDiffuse: { value: null }, toneMappingExposure: { value: 1 } },
    vertexShader: `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
    fragmentShader: `

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`,
  },
  Mp = class extends pp {
    constructor() {
      (super(),
        (this.isOutputPass = !0),
        (this.uniforms = Qo.clone(jp.uniforms)),
        (this.material = new ns({
          name: jp.name,
          uniforms: this.uniforms,
          vertexShader: jp.vertexShader,
          fragmentShader: jp.fragmentShader,
        })),
        (this._fsQuad = new gp(this.material)),
        (this._outputColorSpace = null),
        (this._toneMapping = null));
    }
    render(e, t, n) {
      ((this.uniforms.tDiffuse.value = n.texture),
        (this.uniforms.toneMappingExposure.value = e.toneMappingExposure),
        (this._outputColorSpace !== e.outputColorSpace ||
          this._toneMapping !== e.toneMapping) &&
          ((this._outputColorSpace = e.outputColorSpace),
          (this._toneMapping = e.toneMapping),
          (this.material.defines = {}),
          Wt.getTransfer(this._outputColorSpace) === `srgb` &&
            (this.material.defines.SRGB_TRANSFER = ``),
          this._toneMapping === 1
            ? (this.material.defines.LINEAR_TONE_MAPPING = ``)
            : this._toneMapping === 2
              ? (this.material.defines.REINHARD_TONE_MAPPING = ``)
              : this._toneMapping === 3
                ? (this.material.defines.CINEON_TONE_MAPPING = ``)
                : this._toneMapping === 4
                  ? (this.material.defines.ACES_FILMIC_TONE_MAPPING = ``)
                  : this._toneMapping === 6
                    ? (this.material.defines.AGX_TONE_MAPPING = ``)
                    : this._toneMapping === 7
                      ? (this.material.defines.NEUTRAL_TONE_MAPPING = ``)
                      : this._toneMapping === 5 &&
                        (this.material.defines.CUSTOM_TONE_MAPPING = ``),
          (this.material.needsUpdate = !0)),
        this.renderToScreen === !0
          ? (e.setRenderTarget(null), this._fsQuad.render(e))
          : (e.setRenderTarget(t),
            this.clear &&
              e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
            this._fsQuad.render(e)));
    }
    dispose() {
      (this.material.dispose(), this._fsQuad.dispose());
    }
  },
  Np = class extends pp {
    constructor(e, t = `tDiffuse`) {
      (super(),
        (this.textureID = t),
        (this.uniforms = null),
        (this.material = null),
        e instanceof ts
          ? ((this.uniforms = e.uniforms), (this.material = e))
          : e &&
            ((this.uniforms = Qo.clone(e.uniforms)),
            (this.material = new ts({
              name: e.name === void 0 ? `unspecified` : e.name,
              defines: Object.assign({}, e.defines),
              uniforms: this.uniforms,
              vertexShader: e.vertexShader,
              fragmentShader: e.fragmentShader,
            }))),
        (this._fsQuad = new gp(this.material)));
    }
    render(e, t, n) {
      (this.uniforms[this.textureID] &&
        (this.uniforms[this.textureID].value = n.texture),
        (this._fsQuad.material = this.material),
        this.renderToScreen
          ? (e.setRenderTarget(null), this._fsQuad.render(e))
          : (e.setRenderTarget(t),
            this.clear &&
              e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
            this._fsQuad.render(e)));
    }
    dispose() {
      (this.material.dispose(), this._fsQuad.dispose());
    }
  },
  Pp = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  Fp = yf
    .map(
      (e) =>
        `${e.strength.toFixed(2)}*shaft(p,vec3(${e.foot.map((e) => e.toFixed(2)).join(`,`)}),${e.width.toFixed(2)})`,
    )
    .join(`+`),
  Ip = new ir(new U(-30, 1.6, -15), new U(-10, 11, 7)),
  Lp = Ip.min
    .toArray()
    .map((e) => e.toFixed(1))
    .join(`,`),
  Rp = Ip.max
    .toArray()
    .map((e) => e.toFixed(1))
    .join(`,`),
  zp = Ip.clone().expandByScalar(0.001);
function Bp(e, t, n, r = null) {
  let i = new Ji(),
    a = new W(),
    s = new U(),
    c = new rn(1, 1, { type: y, depthBuffer: !1, minFilter: o, magFilter: o }),
    l = !0,
    u = new Np({
      uniforms: {
        tDepth: { value: null },
        tShadow: { value: null },
        uInvProjection: { value: new W() },
        uCameraWorld: { value: new W() },
        uShadowMatrix: { value: new W() },
        uEye: { value: new U() },
        uSunDirection: { value: new U() },
        uShadowPixel: { value: new V() },
        uSteps: { value: 40 },
      },
      vertexShader: Pp,
      fragmentShader: `precision highp sampler2DShadow;
      ${Af}
      uniform sampler2D tDepth;uniform sampler2DShadow tShadow;
      uniform mat4 uInvProjection,uCameraWorld,uShadowMatrix;
      uniform vec3 uEye,uSunDirection;uniform vec2 uShadowPixel;uniform int uSteps;varying vec2 vUv;
      float shaft(vec3 p,vec3 foot,float width){
        vec3 offset=p-foot;offset-=uSunDirection*dot(offset,uSunDirection);
        return exp(-dot(offset,offset)/(width*width));
      }
      float sunlight(vec3 p){
        vec4 q=uShadowMatrix*vec4(p,1.);q.xyz/=q.w;
        if(any(lessThan(q.xyz,vec3(0.)))||any(greaterThan(q.xyz,vec3(1.))))return 0.;
        vec2 r=uShadowPixel*2.;
        return .25*cloudSunlight(p)*(texture(tShadow,vec3(q.xy+vec2(-r.x,-r.y),q.z-.00015))+
          texture(tShadow,vec3(q.xy+vec2(r.x,-r.y),q.z-.00015))+
          texture(tShadow,vec3(q.xy+vec2(-r.x,r.y),q.z-.00015))+
          texture(tShadow,vec3(q.xy+r,q.z-.00015)));
      }
      void main(){
        float depth=texture2D(tDepth,vUv).r;
        vec4 view=uInvProjection*vec4(vUv*2.-1.,depth*2.-1.,1.);view/=view.w;
        vec3 end=(uCameraWorld*view).xyz,ray=normalize(end-uEye);
        float distanceToSurface=length(end-uEye);
        // Safe slab intersection also covers cameras inside the volume.
        vec3 invRay=mix(vec3(-1.),vec3(1.),step(vec3(0.),ray))/max(abs(ray),vec3(.000001));
        vec3 a=(vec3(${Lp})-uEye)*invRay,b=(vec3(${Rp})-uEye)*invRay;
        vec3 entry=min(a,b),leave=max(a,b);
        float start=max(0.,max(entry.x,max(entry.y,entry.z)));
        float stop=min(distanceToSurface,min(leave.x,min(leave.y,leave.z)));
        float stepSize=max(0.,stop-start)/float(uSteps),transmittance=1.,light=0.;
        if(stop>start){
          for(int i=0;i<56;i++){
            if(i>=uSteps)break;
            vec3 p=uEye+ray*(start+(float(i)+.5)*stepSize);
            vec2 bank=(p.xz-vec2(-20.,-4.))/vec2(10.,11.);
            float beams=${Fp};
            float density=(.0003+.032*beams)*(1.-smoothstep(.25,1.,dot(bank,bank)))*
              smoothstep(1.6,3.8,p.y)*(1.-smoothstep(7.5,11.,p.y));
            float opacity=1.-exp(-density*stepSize);
            light+=transmittance*opacity*sunlight(p);
            transmittance*=1.-opacity;
          }
        }
        gl_FragColor=vec4(light,1.-transmittance,-view.z,1.);
      }`,
    });
  ((u.uniforms.tDepth.value = n),
    (u.uniforms.uCloudShadow = r?.uniforms.uCloudShadow ?? { value: new V() }),
    (u.material.name = `woodland light field`));
  let d = new Np({
    uniforms: {
      tDiffuse: { value: null },
      tField: { value: null },
      tDepth: { value: null },
      uPixel: { value: new V() },
      uNear: { value: e.near },
      uFar: { value: e.far },
      uLight: { value: new G() },
    },
    vertexShader: Pp,
    fragmentShader: `#include <packing>
      uniform sampler2D tDiffuse,tField,tDepth;uniform vec2 uPixel;
      uniform float uNear,uFar;uniform vec3 uLight;varying vec2 vUv;
      void main(){
        float depth=-perspectiveDepthToViewZ(texture2D(tDepth,vUv).r,uNear,uFar);
        vec2 air=vec2(0.);float weight=0.;
        // Depth-aware reconstruction keeps the soft field off foreground edges.
        for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
          vec3 sampleAir=texture2D(tField,vUv+vec2(float(x),float(y))*uPixel).rgb;
          float w=exp(-abs(sampleAir.b-depth)*4.)*exp(-float(x*x+y*y)*.7);
          air+=sampleAir.rg*w;weight+=w;
        }
        air/=max(weight,.0001);
        vec3 base=texture2D(tDiffuse,vUv).rgb;
        gl_FragColor=vec4(base*(1.-air.y)+uLight*air.x+vec3(.12,.15,.16)*air.y,1.);
      }`,
  });
  return (
    (d.uniforms.tField.value = c.texture),
    (d.uniforms.tDepth.value = n),
    (d.material.name = `woodland light composite`),
    {
      render(n, r, o) {
        if (
          !t.visible ||
          !t.castShadow ||
          !t.shadow.map?.depthTexture ||
          (i.setFromProjectionMatrix(
            a.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
          ),
          s.setFromMatrixPosition(e.matrixWorld),
          i.planes[5].setFromNormalAndCoplanarPoint(i.planes[5].normal, s),
          !i.intersectsBox(zp))
        )
          return !1;
        let l = u.uniforms;
        return (
          (l.tShadow.value = t.shadow.map.depthTexture),
          l.uInvProjection.value.copy(e.projectionMatrixInverse),
          l.uCameraWorld.value.copy(e.matrixWorld),
          l.uEye.value.setFromMatrixPosition(e.matrixWorld),
          l.uShadowMatrix.value.copy(t.shadow.matrix),
          l.uSunDirection.value
            .subVectors(t.position, t.target.position)
            .normalize(),
          l.uShadowPixel.value.set(
            1 / t.shadow.mapSize.x,
            1 / t.shadow.mapSize.y,
          ),
          (d.uniforms.uNear.value = e.near),
          (d.uniforms.uFar.value = e.far),
          d.uniforms.uLight.value
            .copy(t.color)
            .multiplyScalar(t.intensity * 0.24),
          u.render(n, c, r),
          d.render(n, o, r),
          !0
        );
      },
      resize(e, t) {
        let n = Math.min(0.5, (l ? 480 : 640) / e, (l ? 270 : 360) / t);
        (c.setSize(
          Math.max(1, Math.round(e * n)),
          Math.max(1, Math.round(t * n)),
        ),
          d.uniforms.uPixel.value.set(1 / c.width, 1 / c.height));
      },
      setLow(e) {
        ((l = e), (u.uniforms.uSteps.value = e ? 24 : 56));
      },
    }
  );
}
