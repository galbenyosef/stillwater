// assets__index-BogB70q- 09 — uniforms
// Lines 31980-32323 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var kp = {
    name: `LuminosityHighPassShader`,
    uniforms: {
      tDiffuse: { value: null },
      luminosityThreshold: { value: 1 },
      smoothWidth: { value: 1 },
      defaultColor: { value: new G(0) },
      defaultOpacity: { value: 0 },
    },
    vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
    fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`,
  },
  Ap = class e extends pp {
    constructor(e, t = 1, n, r) {
      (super(),
        (this.strength = t),
        (this.radius = n),
        (this.threshold = r),
        (this.resolution = e === void 0 ? new V(256, 256) : new V(e.x, e.y)),
        (this.clearColor = new G(0, 0, 0)),
        (this.needsSwap = !1),
        (this.renderTargetsHorizontal = []),
        (this.renderTargetsVertical = []),
        (this.nMips = 5));
      let i = Math.round(this.resolution.x / 2),
        a = Math.round(this.resolution.y / 2);
      ((this.renderTargetBright = new rn(i, a, { type: y, depthBuffer: !1 })),
        (this.renderTargetBright.texture.name = `UnrealBloomPass.bright`),
        (this.renderTargetBright.texture.generateMipmaps = !1));
      for (let e = 0; e < this.nMips; e++) {
        let t = new rn(i, a, { type: y, depthBuffer: !1 });
        ((t.texture.name = `UnrealBloomPass.h` + e),
          (t.texture.generateMipmaps = !1),
          this.renderTargetsHorizontal.push(t));
        let n = new rn(i, a, { type: y, depthBuffer: !1 });
        ((n.texture.name = `UnrealBloomPass.v` + e),
          (n.texture.generateMipmaps = !1),
          this.renderTargetsVertical.push(n),
          (i = Math.round(i / 2)),
          (a = Math.round(a / 2)));
      }
      let o = kp;
      ((this.highPassUniforms = Qo.clone(o.uniforms)),
        (this.highPassUniforms.luminosityThreshold.value = r),
        (this.highPassUniforms.smoothWidth.value = 0.01),
        (this.materialHighPassFilter = new ts({
          uniforms: this.highPassUniforms,
          vertexShader: o.vertexShader,
          fragmentShader: o.fragmentShader,
        })),
        (this.separableBlurMaterials = []));
      let s = [6, 10, 14, 18, 22];
      ((i = Math.round(this.resolution.x / 2)),
        (a = Math.round(this.resolution.y / 2)));
      for (let e = 0; e < this.nMips; e++)
        (this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),
          (this.separableBlurMaterials[e].uniforms.invSize.value = new V(
            1 / i,
            1 / a,
          )),
          (i = Math.round(i / 2)),
          (a = Math.round(a / 2)));
      ((this.compositeMaterial = this._getCompositeMaterial(this.nMips)),
        (this.compositeMaterial.uniforms.blurTexture1.value =
          this.renderTargetsVertical[0].texture),
        (this.compositeMaterial.uniforms.blurTexture2.value =
          this.renderTargetsVertical[1].texture),
        (this.compositeMaterial.uniforms.blurTexture3.value =
          this.renderTargetsVertical[2].texture),
        (this.compositeMaterial.uniforms.blurTexture4.value =
          this.renderTargetsVertical[3].texture),
        (this.compositeMaterial.uniforms.blurTexture5.value =
          this.renderTargetsVertical[4].texture),
        (this.compositeMaterial.uniforms.bloomStrength.value = t),
        (this.compositeMaterial.uniforms.bloomRadius.value = 0.1));
      let c = [1, 0.8, 0.6, 0.4, 0.2];
      ((this.compositeMaterial.uniforms.bloomFactors.value = c),
        (this.bloomTintColors = [
          new U(1, 1, 1),
          new U(1, 1, 1),
          new U(1, 1, 1),
          new U(1, 1, 1),
          new U(1, 1, 1),
        ]),
        (this.compositeMaterial.uniforms.bloomTintColors.value =
          this.bloomTintColors),
        (this.copyUniforms = Qo.clone(Ep.uniforms)),
        (this.blendMaterial = new ts({
          uniforms: this.copyUniforms,
          vertexShader: Ep.vertexShader,
          fragmentShader: Ep.fragmentShader,
          premultipliedAlpha: !0,
          blending: 2,
          depthTest: !1,
          depthWrite: !1,
          transparent: !0,
        })),
        (this._oldClearColor = new G()),
        (this._oldClearAlpha = 1),
        (this._basic = new oi()),
        (this._fsQuad = new gp(null)));
    }
    dispose() {
      for (let e = 0; e < this.renderTargetsHorizontal.length; e++)
        this.renderTargetsHorizontal[e].dispose();
      for (let e = 0; e < this.renderTargetsVertical.length; e++)
        this.renderTargetsVertical[e].dispose();
      this.renderTargetBright.dispose();
      for (let e = 0; e < this.separableBlurMaterials.length; e++)
        this.separableBlurMaterials[e].dispose();
      (this.compositeMaterial.dispose(),
        this.blendMaterial.dispose(),
        this._basic.dispose(),
        this._fsQuad.dispose());
    }
    setSize(e, t) {
      let n = Math.round(e / 2),
        r = Math.round(t / 2);
      this.renderTargetBright.setSize(n, r);
      for (let e = 0; e < this.nMips; e++)
        (this.renderTargetsHorizontal[e].setSize(n, r),
          this.renderTargetsVertical[e].setSize(n, r),
          (this.separableBlurMaterials[e].uniforms.invSize.value = new V(
            1 / n,
            1 / r,
          )),
          (n = Math.round(n / 2)),
          (r = Math.round(r / 2)));
    }
    render(t, n, r, i, a) {
      (t.getClearColor(this._oldClearColor),
        (this._oldClearAlpha = t.getClearAlpha()));
      let o = t.autoClear;
      ((t.autoClear = !1),
        t.setClearColor(this.clearColor, 0),
        a && t.state.buffers.stencil.setTest(!1),
        this.renderToScreen &&
          ((this._fsQuad.material = this._basic),
          (this._basic.map = r.texture),
          t.setRenderTarget(null),
          t.clear(),
          this._fsQuad.render(t)),
        (this.highPassUniforms.tDiffuse.value = r.texture),
        (this.highPassUniforms.luminosityThreshold.value = this.threshold),
        (this._fsQuad.material = this.materialHighPassFilter),
        t.setRenderTarget(this.renderTargetBright),
        t.clear(),
        this._fsQuad.render(t));
      let s = this.renderTargetBright;
      for (let n = 0; n < this.nMips; n++)
        ((this._fsQuad.material = this.separableBlurMaterials[n]),
          (this.separableBlurMaterials[n].uniforms.colorTexture.value =
            s.texture),
          (this.separableBlurMaterials[n].uniforms.direction.value =
            e.BlurDirectionX),
          t.setRenderTarget(this.renderTargetsHorizontal[n]),
          t.clear(),
          this._fsQuad.render(t),
          (this.separableBlurMaterials[n].uniforms.colorTexture.value =
            this.renderTargetsHorizontal[n].texture),
          (this.separableBlurMaterials[n].uniforms.direction.value =
            e.BlurDirectionY),
          t.setRenderTarget(this.renderTargetsVertical[n]),
          t.clear(),
          this._fsQuad.render(t),
          (s = this.renderTargetsVertical[n]));
      ((this._fsQuad.material = this.compositeMaterial),
        (this.compositeMaterial.uniforms.bloomStrength.value = this.strength),
        (this.compositeMaterial.uniforms.bloomRadius.value = this.radius),
        (this.compositeMaterial.uniforms.bloomTintColors.value =
          this.bloomTintColors),
        t.setRenderTarget(this.renderTargetsHorizontal[0]),
        t.clear(),
        this._fsQuad.render(t),
        (this._fsQuad.material = this.blendMaterial),
        (this.copyUniforms.tDiffuse.value =
          this.renderTargetsHorizontal[0].texture),
        a && t.state.buffers.stencil.setTest(!0),
        this.renderToScreen
          ? (t.setRenderTarget(null), this._fsQuad.render(t))
          : (t.setRenderTarget(r), this._fsQuad.render(t)),
        t.setClearColor(this._oldClearColor, this._oldClearAlpha),
        (t.autoClear = o));
    }
    _getSeparableBlurMaterial(e) {
      let t = [],
        n = e / 3;
      for (let r = 0; r < e; r++)
        t.push((0.39894 * Math.exp((-0.5 * r * r) / (n * n))) / n);
      let r = [],
        i = [];
      for (let n = 1; n < e; n += 2) {
        let a = t[n],
          o = n + 1 < e ? t[n + 1] : 0,
          s = a + o;
        (r.push((n * a + (n + 1) * o) / s), i.push(s));
      }
      return new ts({
        defines: { KERNEL_PAIRS: r.length },
        uniforms: {
          colorTexture: { value: null },
          invSize: { value: new V(0.5, 0.5) },
          direction: { value: new V(0.5, 0.5) },
          centerWeight: { value: t[0] },
          gaussianOffsets: { value: r },
          gaussianWeights: { value: i },
        },
        vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,
        fragmentShader: `

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`,
      });
    }
    _getCompositeMaterial(e) {
      return new ts({
        defines: { NUM_MIPS: e },
        uniforms: {
          blurTexture1: { value: null },
          blurTexture2: { value: null },
          blurTexture3: { value: null },
          blurTexture4: { value: null },
          blurTexture5: { value: null },
          bloomStrength: { value: 1 },
          bloomFactors: { value: null },
          bloomTintColors: { value: null },
          bloomRadius: { value: 0 },
        },
        vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,
        fragmentShader: `

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`,
      });
    }
  };
((Ap.BlurDirectionX = new V(1, 0)), (Ap.BlurDirectionY = new V(0, 1)));
