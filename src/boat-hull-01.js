// boat-hull-01.js — the boat hull: profile, hull width functions, contact shader and the hull mesh
// Lines 53228-53379 of readable/assets__index-BogB70q-.pretty.js (cluster boat-hull, statement-aligned).
var hullProfile = [
  [-1.8, 0.48],
  [-1.4, 0.595],
  [-0.7, 0.675],
  [0, 0.67],
  [0.7, 0.59],
  [1.3, 0.39],
  [1.6, 0.2],
  [1.8, 0.009],
];
function hullSegmentAt(segment) {
  let profile = hullProfile,
    last = profile.length - 1,
    [x0, y0] = profile[segment],
    [x1, y1] = profile[segment + 1],
    slopeIn =
      (profile[Math.min(segment + 1, last)][1] - profile[Math.max(segment - 1, 0)][1]) /
      (profile[Math.min(segment + 1, last)][0] - profile[Math.max(segment - 1, 0)][0]),
    slopeOut = (profile[Math.min(segment + 2, last)][1] - y0) / (profile[Math.min(segment + 2, last)][0] - x0);
  return { a: x0, b: x1, x: y0, y: y1, m: slopeIn * (x1 - x0), n: slopeOut * (x1 - x0) };
}
function hullWaterlineWidth(along) {
  let segIndex = Math.min(
      hullProfile.length - 2,
      hullProfile.findIndex((t, n) => n > 0 && along <= t[0]) - 1,
    ),
    segment = hullSegmentAt(segIndex < 0 ? hullProfile.length - 2 : segIndex),
    u01 = Math.max(0, Math.min(1, (along - segment.a) / (segment.b - segment.a)));
  return Math.max(
    0.008,
    (2 * u01 ** 3 - 3 * u01 * u01 + 1) * segment.x +
      (u01 ** 3 - 2 * u01 * u01 + u01) * segment.m +
      (-2 * u01 ** 3 + 3 * u01 * u01) * segment.y +
      (u01 ** 3 - u01 * u01) * segment.n,
  );
}
var hullSectionBase = (along) =>
    0.025 + 0.065 * (Math.abs(along) / 1.8) ** 2 + 0.1 * Math.max(0, along / 1.8) ** 5,
  hullSectionSheer = (along) =>
    0.655 + 0.055 * (Math.abs(along) / 1.8) ** 2 + 0.1 * Math.max(0, along / 1.8) ** 3;
function hullSectionWidth(along, height = 0.34) {
  return (
    hullWaterlineWidth(along) *
    Math.max(0, Math.min(1, (height - hullSectionBase(along)) / (hullSectionSheer(along) - hullSectionBase(along)))) ** (1 / 2.55)
  );
}
function hullSectionWidthDry(along, height = 0.34) {
  return Math.max(0, hullSectionWidth(along, height) - 0.026);
}
var fixed8 = (value) => value.toFixed(8),
  hullWidthGlsl = `float hullWidth(float y){${hullProfile.slice(0, -1).map((e, t) => {
    let n = hullSegmentAt(t);
    return `${t === hullProfile.length - 2 ? `` : `if(y<=${fixed8(n.b)})`} {float t=clamp((y-(${fixed8(n.a)}))/${fixed8(n.b - n.a)},0.,1.);float t2=t*t,t3=t2*t;return max(.008,(2.*t3-3.*t2+1.)*${fixed8(n.x)}+(t3-2.*t2+t)*(${fixed8(n.m)})+(-2.*t3+3.*t2)*${fixed8(n.y)}+(t3-t2)*(${fixed8(n.n)}));}`;
  }).join(`
`)}}
float hullSectionWidth(float along,float height){
  float y=along/1.8,bow=max(0.,y);
  float base=.025+.065*y*y+.10*pow(bow,5.);
  float sheer=.655+.055*y*y+.10*pow(bow,3.);
  return hullWidth(along)*pow(clamp((height-base)/(sheer-base),0.,1.),1./2.55);
}`;
function hullContactDistance(x, height, along) {
  let alongNeg = -along,
    clamped = Math.max(-1.8, Math.min(1.8, alongNeg)),
    lo = Math.max(-1.8, clamped - 0.012),
    hi = Math.min(1.8, clamped + 0.012),
    halfWidth = hullSectionWidth(clamped, height),
    slope = (hullSectionWidth(hi, height) - hullSectionWidth(lo, height)) / (hi - lo),
    norm = Math.hypot(1, slope),
    across = (Math.abs(x) - halfWidth) / norm,
    beyond = Math.abs(alongNeg) - 1.8;
  return {
    distance:
      Math.hypot(Math.max(across, 0), Math.max(beyond, 0)) + Math.min(Math.max(across, beyond), 0),
    nx: across >= beyond ? (x < 0 ? -1 : 1) / norm : 0,
    nz: across >= beyond ? slope / norm : along < 0 ? -1 : 1,
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
      f = smoothStep(0.05, 0.78, Math.sin(t * n.group + a * 0.32 + n.phase)),
      p =
        0.42 + 0.58 * (0.5 + 0.5 * Math.sin(a * 2.6 - t * 0.23 + n.phase)) ** 2,
      m = Math.max(0, Math.cos(o)) ** 3,
      h = Math.max(0, Math.cos(o + 0.8)) ** 4,
      g = Math.max(0, Math.cos(o + 2 * n.k * r * i + 1.1)) ** 3,
      _ = i * p * n.weight;
    ((l +=
      _ *
      (m * (0.018 + 0.014 * f + (0.016 + 0.075 * f) * Math.exp(-r * 8)) +
        g * (0.006 + 0.009 * f) * Math.exp(-r * 4) * smoothStep(0.07, 0.22, r))),
      (u += _ * f * f * (m * 0.48 + h * 0.52) * Math.exp(-r * 7) * 0.85),
      (d = Math.max(d, _ * f * m)));
  }
  return { height: l, foam: u, impact: d };
}
