// assets__index-BogB70q- 34 — math
// Lines 53174-53473 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
iv.ReflectorShader = {
  name: `ReflectorShader`,
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
  },
  vertexShader: `
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,
  fragmentShader: `
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`,
};
var av = [
  [-1.8, 0.48],
  [-1.4, 0.595],
  [-0.7, 0.675],
  [0, 0.67],
  [0.7, 0.59],
  [1.3, 0.39],
  [1.6, 0.2],
  [1.8, 0.009],
];
function ov(e) {
  let t = av,
    n = t.length - 1,
    [r, i] = t[e],
    [a, o] = t[e + 1],
    s =
      (t[Math.min(e + 1, n)][1] - t[Math.max(e - 1, 0)][1]) /
      (t[Math.min(e + 1, n)][0] - t[Math.max(e - 1, 0)][0]),
    c = (t[Math.min(e + 2, n)][1] - i) / (t[Math.min(e + 2, n)][0] - r);
  return { a: r, b: a, x: i, y: o, m: s * (a - r), n: c * (a - r) };
}
function sv(e) {
  let t = Math.min(
      av.length - 2,
      av.findIndex((t, n) => n > 0 && e <= t[0]) - 1,
    ),
    n = ov(t < 0 ? av.length - 2 : t),
    r = Math.max(0, Math.min(1, (e - n.a) / (n.b - n.a)));
  return Math.max(
    0.008,
    (2 * r ** 3 - 3 * r * r + 1) * n.x +
      (r ** 3 - 2 * r * r + r) * n.m +
      (-2 * r ** 3 + 3 * r * r) * n.y +
      (r ** 3 - r * r) * n.n,
  );
}
var cv = (e) =>
    0.025 + 0.065 * (Math.abs(e) / 1.8) ** 2 + 0.1 * Math.max(0, e / 1.8) ** 5,
  lv = (e) =>
    0.655 + 0.055 * (Math.abs(e) / 1.8) ** 2 + 0.1 * Math.max(0, e / 1.8) ** 3;
function uv(e, t = 0.34) {
  return (
    sv(e) *
    Math.max(0, Math.min(1, (t - cv(e)) / (lv(e) - cv(e)))) ** (1 / 2.55)
  );
}
function dv(e, t = 0.34) {
  return Math.max(0, uv(e, t) - 0.026);
}
var fv = (e) => e.toFixed(8),
  pv = `float hullWidth(float y){${av.slice(0, -1).map((e, t) => {
    let n = ov(t);
    return `${t === av.length - 2 ? `` : `if(y<=${fv(n.b)})`} {float t=clamp((y-(${fv(n.a)}))/${fv(n.b - n.a)},0.,1.);float t2=t*t,t3=t2*t;return max(.008,(2.*t3-3.*t2+1.)*${fv(n.x)}+(t3-2.*t2+t)*(${fv(n.m)})+(-2.*t3+3.*t2)*${fv(n.y)}+(t3-t2)*(${fv(n.n)}));}`;
  }).join(`
`)}}
float hullSectionWidth(float along,float height){
  float y=along/1.8,bow=max(0.,y);
  float base=.025+.065*y*y+.10*pow(bow,5.);
  float sheer=.655+.055*y*y+.10*pow(bow,3.);
  return hullWidth(along)*pow(clamp((height-base)/(sheer-base),0.,1.),1./2.55);
}`;
function mv(e, t, n) {
  let r = -n,
    i = Math.max(-1.8, Math.min(1.8, r)),
    a = Math.max(-1.8, i - 0.012),
    o = Math.min(1.8, i + 0.012),
    s = uv(i, t),
    c = (uv(o, t) - uv(a, t)) / (o - a),
    l = Math.hypot(1, c),
    u = (Math.abs(e) - s) / l,
    d = Math.abs(r) - 1.8;
  return {
    distance:
      Math.hypot(Math.max(u, 0), Math.max(d, 0)) + Math.min(Math.max(u, d), 0),
    nx: u >= d ? (e < 0 ? -1 : 1) / l : 0,
    nz: u >= d ? c / l : n < 0 ? -1 : 1,
  };
}
function hv(e) {
  let t = Math.hypot(e.x, e.y, e.z),
    n = e.x / t,
    r = e.z / t,
    i = 1 / 1.333,
    a = Math.sqrt(1 - i * i * (n * n + r * r));
  return { x: (n * i) / a, z: (r * i) / a };
}
function gv(e, t) {
  let n = hv(t),
    r = Math.max(0, e);
  return { x: (n.x - t.x / t.y) * r, z: (n.z - t.z / t.y) * r };
}
var _v = `
vec3 hullContact(vec3 hull){
  float along=-hull.z,a=clamp(along,-1.8,1.8);
  float lo=max(-1.8,a-.012),hi=min(1.8,a+.012);
  float width=hullSectionWidth(a,hull.y);
  float slope=(hullSectionWidth(hi,hull.y)-hullSectionWidth(lo,hull.y))/(hi-lo);
  float norm=length(vec2(1.,slope));
  float side=(abs(hull.x)-width)/norm,end=abs(along)-1.8;
  float distance=length(max(vec2(side,end),vec2(0.)))+min(max(side,end),0.);
  vec2 outward=side>=end?vec2(hull.x<0.?-1.:1.,slope)/norm:vec2(0.,hull.z<0.?-1.:1.);
  return vec3(outward,distance);
}`,
  vv = 0.92,
  yv = [
    {
      x: 0.82,
      z: -0.572364,
      k: 7.4,
      omega: 3.25,
      phase: 0.8,
      group: 0.57,
      weight: 1,
    },
    {
      x: -0.61,
      z: 0.792401,
      k: 9.1,
      omega: 3.8,
      phase: 3.7,
      group: 0.43,
      weight: 0.72,
    },
  ];
function bv(e, t, n, r, i) {
  let a = Math.sin(i),
    o = Math.cos(i),
    s = -o * n.nx - a * n.nz,
    c = a * n.nx - o * n.nz,
    l = 0,
    u = 0,
    d = 0;
  for (let n of yv) {
    let i = Math.max(0, -(s * n.x + c * n.z)),
      a = -e.x * n.z + e.z * n.x,
      o = (e.x * n.x + e.z * n.z) * n.k - t * n.omega + n.phase,
      f = Zf(0.05, 0.78, Math.sin(t * n.group + a * 0.32 + n.phase)),
      p =
        0.42 + 0.58 * (0.5 + 0.5 * Math.sin(a * 2.6 - t * 0.23 + n.phase)) ** 2,
      m = Math.max(0, Math.cos(o)) ** 3,
      h = Math.max(0, Math.cos(o + 0.8)) ** 4,
      g = Math.max(0, Math.cos(o + 2 * n.k * r * i + 1.1)) ** 3,
      _ = i * p * n.weight;
    ((l +=
      _ *
      (m * (0.018 + 0.014 * f + (0.016 + 0.075 * f) * Math.exp(-r * 8)) +
        g * (0.006 + 0.009 * f) * Math.exp(-r * 4) * Zf(0.07, 0.22, r))),
      (u += _ * f * f * (m * 0.48 + h * 0.52) * Math.exp(-r * 7) * 0.85),
      (d = Math.max(d, _ * f * m)));
  }
  return { height: l, foam: u, impact: d };
}
function xv() {
  let e = (e, t) => [
      -84,
      -8,
      ...Array.from({ length: t + 1 }, (n, r) => -e + (2 * e * r) / t),
      8,
      84,
    ],
    t = e(2.25, 90),
    n = e(3, 120),
    r = [],
    i = [],
    a = [];
  for (let e of n) for (let n of t) (r.push(n, e, 0), i.push(0, 0, 1));
  for (let e = 0; e < n.length - 1; e++)
    for (let n = 0; n < t.length - 1; n++) {
      let r = e * t.length + n,
        i = r + 1,
        o = i + t.length,
        s = r + t.length;
      a.push(r, i, s, i, o, s);
    }
  let o = new Hr();
  return (
    o.setAttribute(`position`, new Ar(r, 3)),
    o.setAttribute(`normal`, new Ar(i, 3)),
    o.setIndex(a),
    o.computeBoundingSphere(),
    o
  );
}
function Sv() {
  return {
    uWaveTime: { value: 0 },
    uWaveSpeed: { value: 0 },
    uWaveTurn: { value: 0 },
    uWaveAmount: { value: 1 },
    uWaveInverse: { value: new W() },
  };
}
function Cv(e, t, n, r, i = !1) {
  ((e.uWaveTime.value = i ? t * 0.35 : t),
    (e.uWaveSpeed.value = n.speed || 0),
    (e.uWaveTurn.value = n.turnRate || 0),
    (e.uWaveAmount.value = i ? 0.35 : 1),
    r && e.uWaveInverse.value.copy(r.matrixWorld).invert());
}
function wv(e, t, n, r = 0, i = 0, a = 1, o = 0) {
  if (Math.abs(e.x) > 1.7 || Math.abs(e.z) > 2.9)
    return {
      height: 0,
      foam: 0,
      pressure: 0,
      pulse: 0,
      impact: 0,
      distance: 2,
    };
  let s = mv(e.x, e.y, e.z),
    c = Math.max(0, s.distance);
  if (c >= 0.92)
    return {
      height: 0,
      foam: 0,
      pressure: 0,
      pulse: 0,
      impact: 0,
      distance: s.distance,
    };
  let l = J((i * e.z * s.nx + (-r - i * e.x) * s.nz) / 1.65, 0, 1),
    u = -e.z,
    d = e.x < 0 ? -1 : 1,
    f = u * 3.7 + n * (2.5 + Math.abs(r) * 0.65) + d * 1.2,
    p = (0.5 + 0.5 * Math.sin(f)) ** 3,
    m = (0.5 + 0.5 * Math.sin(t.x * 1.65 + t.z * 0.94 - n * 2.1)) ** 2,
    h = 1 - Zf(0.58, vv, c),
    g = Math.exp(-(((c - 0.075 - 0.025 * p) / 0.105) ** 2)),
    _ = (0.006 + 0.022 * m + 0.043 * l * (0.45 + 0.55 * p)) * Math.exp(-c * 12),
    v = g * (0.012 * m + 0.07 * l * (0.35 + 0.65 * p)),
    y =
      Math.sin(c * 16 - n * 3.6 + u * 2.3) *
      Math.exp(-c * 4.8) *
      Zf(0.1, 0.28, c) *
      (0.008 + 0.021 * l),
    b = bv(t, n, s, c, o),
    x = 1 - l * 0.55;
  return {
    height: (_ + v + y + b.height * x) * h * a,
    foam: (g * l * Zf(0.36, 0.9, p) + b.foam * x) * h * a,
    pressure: l,
    pulse: p,
    impact: b.impact * h * a,
    distance: s.distance,
  };
}
