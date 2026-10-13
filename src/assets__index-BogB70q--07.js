// assets__index-BogB70q- 07 — uniforms
// Lines 31204-31970 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
var Ep = {
    name: `CopyShader`,
    uniforms: { tDiffuse: { value: null }, opacity: { value: 1 } },
    vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
    fragmentShader: `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`,
  },
  Dp = class {
    constructor(e = Math) {
      ((this.grad3 = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
        [0, 1, 1],
        [0, -1, 1],
        [0, 1, -1],
        [0, -1, -1],
      ]),
        (this.grad4 = [
          [0, 1, 1, 1],
          [0, 1, 1, -1],
          [0, 1, -1, 1],
          [0, 1, -1, -1],
          [0, -1, 1, 1],
          [0, -1, 1, -1],
          [0, -1, -1, 1],
          [0, -1, -1, -1],
          [1, 0, 1, 1],
          [1, 0, 1, -1],
          [1, 0, -1, 1],
          [1, 0, -1, -1],
          [-1, 0, 1, 1],
          [-1, 0, 1, -1],
          [-1, 0, -1, 1],
          [-1, 0, -1, -1],
          [1, 1, 0, 1],
          [1, 1, 0, -1],
          [1, -1, 0, 1],
          [1, -1, 0, -1],
          [-1, 1, 0, 1],
          [-1, 1, 0, -1],
          [-1, -1, 0, 1],
          [-1, -1, 0, -1],
          [1, 1, 1, 0],
          [1, 1, -1, 0],
          [1, -1, 1, 0],
          [1, -1, -1, 0],
          [-1, 1, 1, 0],
          [-1, 1, -1, 0],
          [-1, -1, 1, 0],
          [-1, -1, -1, 0],
        ]),
        (this.p = []));
      for (let t = 0; t < 256; t++) this.p[t] = Math.floor(e.random() * 256);
      this.perm = [];
      for (let e = 0; e < 512; e++) this.perm[e] = this.p[e & 255];
      this.simplex = [
        [0, 1, 2, 3],
        [0, 1, 3, 2],
        [0, 0, 0, 0],
        [0, 2, 3, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 3, 0],
        [0, 2, 1, 3],
        [0, 0, 0, 0],
        [0, 3, 1, 2],
        [0, 3, 2, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 3, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 0, 3],
        [0, 0, 0, 0],
        [1, 3, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 3, 0, 1],
        [2, 3, 1, 0],
        [1, 0, 2, 3],
        [1, 0, 3, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 3, 1],
        [0, 0, 0, 0],
        [2, 1, 3, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 1, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [3, 0, 1, 2],
        [3, 0, 2, 1],
        [0, 0, 0, 0],
        [3, 1, 2, 0],
        [2, 1, 0, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [3, 1, 0, 2],
        [0, 0, 0, 0],
        [3, 2, 0, 1],
        [3, 2, 1, 0],
      ];
    }
    noise(e, t) {
      let n,
        r,
        i,
        a = 0.5 * (Math.sqrt(3) - 1),
        o = (e + t) * a,
        s = Math.floor(e + o),
        c = Math.floor(t + o),
        l = (3 - Math.sqrt(3)) / 6,
        u = (s + c) * l,
        d = s - u,
        f = c - u,
        p = e - d,
        m = t - f,
        h,
        g;
      p > m ? ((h = 1), (g = 0)) : ((h = 0), (g = 1));
      let _ = p - h + l,
        v = m - g + l,
        y = p - 1 + 2 * l,
        b = m - 1 + 2 * l,
        x = s & 255,
        S = c & 255,
        C = this.perm[x + this.perm[S]] % 12,
        w = this.perm[x + h + this.perm[S + g]] % 12,
        T = this.perm[x + 1 + this.perm[S + 1]] % 12,
        E = 0.5 - p * p - m * m;
      E < 0
        ? (n = 0)
        : ((E *= E), (n = E * E * this._dot(this.grad3[C], p, m)));
      let D = 0.5 - _ * _ - v * v;
      D < 0
        ? (r = 0)
        : ((D *= D), (r = D * D * this._dot(this.grad3[w], _, v)));
      let O = 0.5 - y * y - b * b;
      return (
        O < 0
          ? (i = 0)
          : ((O *= O), (i = O * O * this._dot(this.grad3[T], y, b))),
        70 * (n + r + i)
      );
    }
    noise3d(e, t, n) {
      let r,
        i,
        a,
        o,
        s = (e + t + n) * (1 / 3),
        c = Math.floor(e + s),
        l = Math.floor(t + s),
        u = Math.floor(n + s),
        d = 1 / 6,
        f = (c + l + u) * d,
        p = c - f,
        m = l - f,
        h = u - f,
        g = e - p,
        _ = t - m,
        v = n - h,
        y,
        b,
        x,
        S,
        C,
        w;
      g >= _
        ? _ >= v
          ? ((y = 1), (b = 0), (x = 0), (S = 1), (C = 1), (w = 0))
          : g >= v
            ? ((y = 1), (b = 0), (x = 0), (S = 1), (C = 0), (w = 1))
            : ((y = 0), (b = 0), (x = 1), (S = 1), (C = 0), (w = 1))
        : _ < v
          ? ((y = 0), (b = 0), (x = 1), (S = 0), (C = 1), (w = 1))
          : g < v
            ? ((y = 0), (b = 1), (x = 0), (S = 0), (C = 1), (w = 1))
            : ((y = 0), (b = 1), (x = 0), (S = 1), (C = 1), (w = 0));
      let T = g - y + d,
        E = _ - b + d,
        D = v - x + d,
        O = g - S + 2 * d,
        k = _ - C + 2 * d,
        A = v - w + 2 * d,
        j = g - 1 + 3 * d,
        M = _ - 1 + 3 * d,
        N = v - 1 + 3 * d,
        P = c & 255,
        F = l & 255,
        I = u & 255,
        ee = this.perm[P + this.perm[F + this.perm[I]]] % 12,
        te = this.perm[P + y + this.perm[F + b + this.perm[I + x]]] % 12,
        ne = this.perm[P + S + this.perm[F + C + this.perm[I + w]]] % 12,
        re = this.perm[P + 1 + this.perm[F + 1 + this.perm[I + 1]]] % 12,
        ie = 0.6 - g * g - _ * _ - v * v;
      ie < 0
        ? (r = 0)
        : ((ie *= ie), (r = ie * ie * this._dot3(this.grad3[ee], g, _, v)));
      let ae = 0.6 - T * T - E * E - D * D;
      ae < 0
        ? (i = 0)
        : ((ae *= ae), (i = ae * ae * this._dot3(this.grad3[te], T, E, D)));
      let oe = 0.6 - O * O - k * k - A * A;
      oe < 0
        ? (a = 0)
        : ((oe *= oe), (a = oe * oe * this._dot3(this.grad3[ne], O, k, A)));
      let L = 0.6 - j * j - M * M - N * N;
      return (
        L < 0
          ? (o = 0)
          : ((L *= L), (o = L * L * this._dot3(this.grad3[re], j, M, N))),
        32 * (r + i + a + o)
      );
    }
    noise4d(e, t, n, r) {
      let i = this.grad4,
        a = this.simplex,
        o = this.perm,
        s = (Math.sqrt(5) - 1) / 4,
        c = (5 - Math.sqrt(5)) / 20,
        l,
        u,
        d,
        f,
        p,
        m = (e + t + n + r) * s,
        h = Math.floor(e + m),
        g = Math.floor(t + m),
        _ = Math.floor(n + m),
        v = Math.floor(r + m),
        y = (h + g + _ + v) * c,
        b = h - y,
        x = g - y,
        S = _ - y,
        C = v - y,
        w = e - b,
        T = t - x,
        E = n - S,
        D = r - C,
        O = w > T ? 32 : 0,
        k = w > E ? 16 : 0,
        A = T > E ? 8 : 0,
        j = w > D ? 4 : 0,
        M = T > D ? 2 : 0,
        N = +(E > D),
        P = O + k + A + j + M + N,
        F = +(a[P][0] >= 3),
        I = +(a[P][1] >= 3),
        ee = +(a[P][2] >= 3),
        te = +(a[P][3] >= 3),
        ne = +(a[P][0] >= 2),
        re = +(a[P][1] >= 2),
        ie = +(a[P][2] >= 2),
        ae = +(a[P][3] >= 2),
        oe = +(a[P][0] >= 1),
        L = +(a[P][1] >= 1),
        se = +(a[P][2] >= 1),
        ce = +(a[P][3] >= 1),
        le = w - F + c,
        ue = T - I + c,
        de = E - ee + c,
        fe = D - te + c,
        pe = w - ne + 2 * c,
        me = T - re + 2 * c,
        he = E - ie + 2 * c,
        ge = D - ae + 2 * c,
        _e = w - oe + 3 * c,
        ve = T - L + 3 * c,
        ye = E - se + 3 * c,
        be = D - ce + 3 * c,
        xe = w - 1 + 4 * c,
        Se = T - 1 + 4 * c,
        Ce = E - 1 + 4 * c,
        we = D - 1 + 4 * c,
        Te = h & 255,
        Ee = g & 255,
        De = _ & 255,
        Oe = v & 255,
        ke = o[Te + o[Ee + o[De + o[Oe]]]] % 32,
        Ae = o[Te + F + o[Ee + I + o[De + ee + o[Oe + te]]]] % 32,
        R = o[Te + ne + o[Ee + re + o[De + ie + o[Oe + ae]]]] % 32,
        je = o[Te + oe + o[Ee + L + o[De + se + o[Oe + ce]]]] % 32,
        Me = o[Te + 1 + o[Ee + 1 + o[De + 1 + o[Oe + 1]]]] % 32,
        Ne = 0.6 - w * w - T * T - E * E - D * D;
      Ne < 0
        ? (l = 0)
        : ((Ne *= Ne), (l = Ne * Ne * this._dot4(i[ke], w, T, E, D)));
      let z = 0.6 - le * le - ue * ue - de * de - fe * fe;
      z < 0
        ? (u = 0)
        : ((z *= z), (u = z * z * this._dot4(i[Ae], le, ue, de, fe)));
      let Pe = 0.6 - pe * pe - me * me - he * he - ge * ge;
      Pe < 0
        ? (d = 0)
        : ((Pe *= Pe), (d = Pe * Pe * this._dot4(i[R], pe, me, he, ge)));
      let Fe = 0.6 - _e * _e - ve * ve - ye * ye - be * be;
      Fe < 0
        ? (f = 0)
        : ((Fe *= Fe), (f = Fe * Fe * this._dot4(i[je], _e, ve, ye, be)));
      let Ie = 0.6 - xe * xe - Se * Se - Ce * Ce - we * we;
      return (
        Ie < 0
          ? (p = 0)
          : ((Ie *= Ie), (p = Ie * Ie * this._dot4(i[Me], xe, Se, Ce, we))),
        27 * (l + u + d + f + p)
      );
    }
    _dot(e, t, n) {
      return e[0] * t + e[1] * n;
    }
    _dot3(e, t, n, r) {
      return e[0] * t + e[1] * n + e[2] * r;
    }
    _dot4(e, t, n, r, i) {
      return e[0] * t + e[1] * n + e[2] * r + e[3] * i;
    }
  },
  Op = class e extends pp {
    constructor(e, t, n = 512, r = 512, i, a, o) {
      (super(),
        (this.width = n),
        (this.height = r),
        (this.clear = !0),
        (this.camera = t),
        (this.scene = e),
        (this.output = 0),
        (this._renderGBuffer = !0),
        (this._visibilityCache = []),
        (this.blendIntensity = 1),
        (this.pdRings = 2),
        (this.pdRadiusExponent = 2),
        (this.pdSamples = 16),
        (this.gtaoNoiseTexture = xp()),
        (this.pdNoiseTexture = this._generateNoise()),
        (this.gtaoRenderTarget = new rn(this.width, this.height, {
          type: y,
          depthBuffer: !1,
        })),
        (this.pdRenderTarget = this.gtaoRenderTarget.clone()),
        (this.gtaoMaterial = new ts({
          defines: Object.assign({}, vp.defines),
          uniforms: Qo.clone(vp.uniforms),
          vertexShader: vp.vertexShader,
          fragmentShader: vp.fragmentShader,
          blending: 0,
          depthTest: !1,
          depthWrite: !1,
        })),
        (this.gtaoMaterial.defines.PERSPECTIVE_CAMERA =
          +!!this.camera.isPerspectiveCamera),
        (this.gtaoMaterial.uniforms.tNoise.value = this.gtaoNoiseTexture),
        this.gtaoMaterial.uniforms.resolution.value.set(
          this.width,
          this.height,
        ),
        (this.gtaoMaterial.uniforms.cameraNear.value = this.camera.near),
        (this.gtaoMaterial.uniforms.cameraFar.value = this.camera.far),
        (this.normalMaterial = new as()),
        (this.normalMaterial.blending = 0),
        (this.pdMaterial = new ts({
          defines: Object.assign({}, Cp.defines),
          uniforms: Qo.clone(Cp.uniforms),
          vertexShader: Cp.vertexShader,
          fragmentShader: Cp.fragmentShader,
          depthTest: !1,
          depthWrite: !1,
        })),
        (this.pdMaterial.uniforms.tDiffuse.value =
          this.gtaoRenderTarget.texture),
        (this.pdMaterial.uniforms.tNoise.value = this.pdNoiseTexture),
        this.pdMaterial.uniforms.resolution.value.set(this.width, this.height),
        (this.pdMaterial.uniforms.lumaPhi.value = 10),
        (this.pdMaterial.uniforms.depthPhi.value = 2),
        (this.pdMaterial.uniforms.normalPhi.value = 3),
        (this.pdMaterial.uniforms.radius.value = 8),
        (this.depthRenderMaterial = new ts({
          defines: Object.assign({}, yp.defines),
          uniforms: Qo.clone(yp.uniforms),
          vertexShader: yp.vertexShader,
          fragmentShader: yp.fragmentShader,
          blending: 0,
        })),
        (this.depthRenderMaterial.uniforms.cameraNear.value = this.camera.near),
        (this.depthRenderMaterial.uniforms.cameraFar.value = this.camera.far),
        (this.copyMaterial = new ts({
          uniforms: Qo.clone(Ep.uniforms),
          vertexShader: Ep.vertexShader,
          fragmentShader: Ep.fragmentShader,
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blendSrc: 208,
          blendDst: 200,
          blendEquation: 100,
          blendSrcAlpha: 206,
          blendDstAlpha: 200,
          blendEquationAlpha: 100,
        })),
        (this.blendMaterial = new ts({
          uniforms: Qo.clone(bp.uniforms),
          vertexShader: bp.vertexShader,
          fragmentShader: bp.fragmentShader,
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: 5,
          blendSrc: 208,
          blendDst: 200,
          blendEquation: 100,
          blendSrcAlpha: 206,
          blendDstAlpha: 200,
          blendEquationAlpha: 100,
        })),
        (this._fsQuad = new gp(null)),
        (this._originalClearColor = new G()),
        this.setGBuffer(
          i ? i.depthTexture : void 0,
          i ? i.normalTexture : void 0,
        ),
        a !== void 0 && this.updateGtaoMaterial(a),
        o !== void 0 && this.updatePdMaterial(o));
    }
    setSize(e, t) {
      ((this.width = e),
        (this.height = t),
        this.gtaoRenderTarget.setSize(e, t),
        this.normalRenderTarget.setSize(e, t),
        this.pdRenderTarget.setSize(e, t),
        this.gtaoMaterial.uniforms.resolution.value.set(e, t),
        this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(
          this.camera.projectionMatrix,
        ),
        this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(
          this.camera.projectionMatrixInverse,
        ),
        this.pdMaterial.uniforms.resolution.value.set(e, t),
        this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(
          this.camera.projectionMatrixInverse,
        ));
    }
    dispose() {
      (this.gtaoNoiseTexture.dispose(),
        this.pdNoiseTexture.dispose(),
        this.normalRenderTarget.dispose(),
        this.gtaoRenderTarget.dispose(),
        this.pdRenderTarget.dispose(),
        this.normalMaterial.dispose(),
        this.pdMaterial.dispose(),
        this.copyMaterial.dispose(),
        this.depthRenderMaterial.dispose(),
        this._fsQuad.dispose());
    }
    get gtaoMap() {
      return this.pdRenderTarget.texture;
    }
    setGBuffer(e, t) {
      e === void 0
        ? ((this.depthTexture = new _a()),
          (this.depthTexture.format = k),
          (this.depthTexture.type = S),
          (this.normalRenderTarget = new rn(this.width, this.height, {
            minFilter: o,
            magFilter: o,
            type: y,
            depthTexture: this.depthTexture,
          })),
          (this.normalTexture = this.normalRenderTarget.texture),
          (this._renderGBuffer = !0))
        : ((this.depthTexture = e),
          (this.normalTexture = t),
          (this._renderGBuffer = !1));
      let n = +!!this.normalTexture,
        r = this.depthTexture === this.normalTexture ? `w` : `x`;
      ((this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE = n),
        (this.gtaoMaterial.defines.DEPTH_SWIZZLING = r),
        (this.gtaoMaterial.uniforms.tNormal.value = this.normalTexture),
        (this.gtaoMaterial.uniforms.tDepth.value = this.depthTexture),
        (this.pdMaterial.defines.NORMAL_VECTOR_TYPE = n),
        (this.pdMaterial.defines.DEPTH_SWIZZLING = r),
        (this.pdMaterial.uniforms.tNormal.value = this.normalTexture),
        (this.pdMaterial.uniforms.tDepth.value = this.depthTexture),
        (this.depthRenderMaterial.uniforms.tDepth.value =
          this.normalRenderTarget.depthTexture));
    }
    setSceneClipBox(e) {
      e
        ? ((this.gtaoMaterial.needsUpdate =
            this.gtaoMaterial.defines.SCENE_CLIP_BOX !== 1),
          (this.gtaoMaterial.defines.SCENE_CLIP_BOX = 1),
          this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),
          this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max))
        : ((this.gtaoMaterial.needsUpdate =
            this.gtaoMaterial.defines.SCENE_CLIP_BOX === 0),
          (this.gtaoMaterial.defines.SCENE_CLIP_BOX = 0));
    }
    updateGtaoMaterial(e) {
      (e.radius !== void 0 &&
        (this.gtaoMaterial.uniforms.radius.value = e.radius),
        e.distanceExponent !== void 0 &&
          (this.gtaoMaterial.uniforms.distanceExponent.value =
            e.distanceExponent),
        e.thickness !== void 0 &&
          (this.gtaoMaterial.uniforms.thickness.value = e.thickness),
        e.distanceFallOff !== void 0 &&
          ((this.gtaoMaterial.uniforms.distanceFallOff.value =
            e.distanceFallOff),
          (this.gtaoMaterial.needsUpdate = !0)),
        e.scale !== void 0 &&
          (this.gtaoMaterial.uniforms.scale.value = e.scale),
        e.samples !== void 0 &&
          e.samples !== this.gtaoMaterial.defines.SAMPLES &&
          ((this.gtaoMaterial.defines.SAMPLES = e.samples),
          (this.gtaoMaterial.needsUpdate = !0)),
        e.screenSpaceRadius !== void 0 &&
          +!!e.screenSpaceRadius !==
            this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS &&
          ((this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS =
            +!!e.screenSpaceRadius),
          (this.gtaoMaterial.needsUpdate = !0)));
    }
    updatePdMaterial(e) {
      let t = !1;
      (e.lumaPhi !== void 0 &&
        (this.pdMaterial.uniforms.lumaPhi.value = e.lumaPhi),
        e.depthPhi !== void 0 &&
          (this.pdMaterial.uniforms.depthPhi.value = e.depthPhi),
        e.normalPhi !== void 0 &&
          (this.pdMaterial.uniforms.normalPhi.value = e.normalPhi),
        e.radius !== void 0 &&
          e.radius !== this.radius &&
          (this.pdMaterial.uniforms.radius.value = e.radius),
        e.radiusExponent !== void 0 &&
          e.radiusExponent !== this.pdRadiusExponent &&
          ((this.pdRadiusExponent = e.radiusExponent), (t = !0)),
        e.rings !== void 0 &&
          e.rings !== this.pdRings &&
          ((this.pdRings = e.rings), (t = !0)),
        e.samples !== void 0 &&
          e.samples !== this.pdSamples &&
          ((this.pdSamples = e.samples), (t = !0)),
        t &&
          ((this.pdMaterial.defines.SAMPLES = this.pdSamples),
          (this.pdMaterial.defines.SAMPLE_VECTORS = wp(
            this.pdSamples,
            this.pdRings,
            this.pdRadiusExponent,
          )),
          (this.pdMaterial.needsUpdate = !0)));
    }
    render(t, n, r) {
      switch (
        (this._renderGBuffer &&
          (this._overrideVisibility(),
          this._renderOverride(
            t,
            this.normalMaterial,
            this.normalRenderTarget,
            7829503,
            1,
          ),
          this._restoreVisibility()),
        (this.gtaoMaterial.uniforms.cameraNear.value = this.camera.near),
        (this.gtaoMaterial.uniforms.cameraFar.value = this.camera.far),
        this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(
          this.camera.projectionMatrix,
        ),
        this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(
          this.camera.projectionMatrixInverse,
        ),
        this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(
          this.camera.matrixWorld,
        ),
        this._renderPass(
          t,
          this.gtaoMaterial,
          this.gtaoRenderTarget,
          16777215,
          1,
        ),
        this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(
          this.camera.projectionMatrixInverse,
        ),
        this._renderPass(t, this.pdMaterial, this.pdRenderTarget, 16777215, 1),
        this.output)
      ) {
        case e.OUTPUT.Off:
          break;
        case e.OUTPUT.Diffuse:
          ((this.copyMaterial.uniforms.tDiffuse.value = r.texture),
            (this.copyMaterial.blending = 0),
            this._renderPass(
              t,
              this.copyMaterial,
              this.renderToScreen ? null : n,
            ));
          break;
        case e.OUTPUT.AO:
          ((this.copyMaterial.uniforms.tDiffuse.value =
            this.gtaoRenderTarget.texture),
            (this.copyMaterial.blending = 0),
            this._renderPass(
              t,
              this.copyMaterial,
              this.renderToScreen ? null : n,
            ));
          break;
        case e.OUTPUT.Denoise:
          ((this.copyMaterial.uniforms.tDiffuse.value =
            this.pdRenderTarget.texture),
            (this.copyMaterial.blending = 0),
            this._renderPass(
              t,
              this.copyMaterial,
              this.renderToScreen ? null : n,
            ));
          break;
        case e.OUTPUT.Depth:
          ((this.depthRenderMaterial.uniforms.cameraNear.value =
            this.camera.near),
            (this.depthRenderMaterial.uniforms.cameraFar.value =
              this.camera.far),
            this._renderPass(
              t,
              this.depthRenderMaterial,
              this.renderToScreen ? null : n,
            ));
          break;
        case e.OUTPUT.Normal:
          ((this.copyMaterial.uniforms.tDiffuse.value =
            this.normalRenderTarget.texture),
            (this.copyMaterial.blending = 0),
            this._renderPass(
              t,
              this.copyMaterial,
              this.renderToScreen ? null : n,
            ));
          break;
        case e.OUTPUT.Default:
          ((this.copyMaterial.uniforms.tDiffuse.value = r.texture),
            (this.copyMaterial.blending = 0),
            this._renderPass(
              t,
              this.copyMaterial,
              this.renderToScreen ? null : n,
            ),
            (this.blendMaterial.uniforms.intensity.value = this.blendIntensity),
            (this.blendMaterial.uniforms.tDiffuse.value =
              this.pdRenderTarget.texture),
            this._renderPass(
              t,
              this.blendMaterial,
              this.renderToScreen ? null : n,
            ));
          break;
        default:
          console.warn(`THREE.GTAOPass: Unknown output type.`);
      }
    }
    _renderPass(e, t, n, r, i) {
      e.getClearColor(this._originalClearColor);
      let a = e.getClearAlpha(),
        o = e.autoClear;
      (e.setRenderTarget(n),
        (e.autoClear = !1),
        r != null && (e.setClearColor(r), e.setClearAlpha(i || 0), e.clear()),
        (this._fsQuad.material = t),
        this._fsQuad.render(e),
        (e.autoClear = o),
        e.setClearColor(this._originalClearColor),
        e.setClearAlpha(a));
    }
    _renderOverride(e, t, n, r, i) {
      e.getClearColor(this._originalClearColor);
      let a = e.getClearAlpha(),
        o = e.autoClear;
      (e.setRenderTarget(n),
        (e.autoClear = !1),
        (r = t.clearColor || r),
        (i = t.clearAlpha || i),
        r != null && (e.setClearColor(r), e.setClearAlpha(i || 0), e.clear()),
        (this.scene.overrideMaterial = t),
        e.render(this.scene, this.camera),
        (this.scene.overrideMaterial = null),
        (e.autoClear = o),
        e.setClearColor(this._originalClearColor),
        e.setClearAlpha(a));
    }
    _overrideVisibility() {
      let e = this.scene,
        t = this._visibilityCache;
      e.traverse(function (e) {
        (e.isPoints || e.isLine || e.isLine2) &&
          e.visible &&
          ((e.visible = !1), t.push(e));
      });
    }
    _restoreVisibility() {
      let e = this._visibilityCache;
      for (let t = 0; t < e.length; t++) e[t].visible = !0;
      e.length = 0;
    }
    _generateNoise(e = 64) {
      let t = new Dp(),
        n = e * e * 4,
        i = new Uint8Array(n);
      for (let n = 0; n < e; n++)
        for (let r = 0; r < e; r++) {
          let a = n,
            o = r;
          ((i[(n * e + r) * 4] = (t.noise(a, o) * 0.5 + 0.5) * 255),
            (i[(n * e + r) * 4 + 1] = (t.noise(a + e, o) * 0.5 + 0.5) * 255),
            (i[(n * e + r) * 4 + 2] = (t.noise(a, o + e) * 0.5 + 0.5) * 255),
            (i[(n * e + r) * 4 + 3] =
              (t.noise(a + e, o + e) * 0.5 + 0.5) * 255));
        }
      let a = new Mi(i, e, e, D, f);
      return ((a.wrapS = r), (a.wrapT = r), (a.needsUpdate = !0), a);
    }
  };
