// assets__index-BogB70q- 65 — math
// Lines 62436-62781 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function VS(e, t) {
  let n = 0;
  for (; n < e.length - 2 && t > e[n + 1][0];) n++;
  let [r, i] = e[n],
    [a, o] = e[n + 1],
    s = (t - r) / (a - r),
    c = e[Math.max(0, n - 1)],
    l = e[Math.min(e.length - 1, n + 2)],
    u =
      n === 0
        ? new U()
        : o
            .clone()
            .sub(c[1])
            .multiplyScalar((a - r) / (a - c[0])),
    d =
      n === e.length - 2
        ? new U()
        : l[1]
            .clone()
            .sub(i)
            .multiplyScalar((a - r) / (l[0] - r));
  return i
    .clone()
    .multiplyScalar(2 * s ** 3 - 3 * s * s + 1)
    .addScaledVector(u, s ** 3 - 2 * s * s + s)
    .addScaledVector(o, -2 * s ** 3 + 3 * s * s)
    .addScaledVector(d, s ** 3 - s * s);
}
function HS(e, t, { leaving: n = !1 } = {}) {
  let r = e.root,
    i = [];
  r.traverse((e) => {
    e.isBone && i.push(e);
  });
  let a = (e) => r.getObjectByName(e),
    o = { l: a(`foot_l`), r: a(`foot_r`) },
    s = null;
  return {
    reset() {
      s = null;
    },
    update(c, l, u, d) {
      ((!s || (n && c < 0.04)) &&
        (e.update(l, u, { grounded: !0 }),
        r.updateWorldMatrix(!0, !0),
        (s = {
          root: RS(r),
          joints: i.map(RS),
          feet: { l: zS(o.l), r: zS(o.r) },
        })),
        e.update(l, d),
        r.updateWorldMatrix(!0, !0),
        t.updateWorldMatrix(!0, !1));
      let f = RS(r),
        p = { l: zS(o.l), r: zS(o.r) },
        m = (e, n, r) => new U(-e, n, -r).applyMatrix4(t.matrixWorld),
        h = LS(0.66, 1, c);
      i.forEach((e, t) => {
        (e.position.lerpVectors(s.joints[t].position, e.position, h),
          e.quaternion.copy(
            s.joints[t].quaternion.clone().slerp(e.quaternion, h),
          ));
      });
      let g = [
        [0, s.root.position],
        [0.14, m(-1.1, 0.55, -0.67)],
        [0.36, m(-0.76, 0.15, -0.62)],
        [0.46, m(-0.6, 0.19, -0.58)],
        [0.68, m(-0.03, 0.1, -0.48)],
        [0.84, m(0.1, 0, -0.55)],
        [1, f.position],
      ];
      (r.position.copy(VS(g, c)),
        r.quaternion
          .copy(s.root.quaternion)
          .slerp(f.quaternion, LS(0.45, 0.84, c)));
      let _ = 0.26 * LS(0, 0.16, c) * (1 - LS(0.76, 1, c));
      a(`spine_01`).quaternion.multiply(
        new H().setFromAxisAngle(new U(1, 0, 0), _),
      );
      let v = LS(0, 0.12, c) * (1 - LS(0.62, 0.94, c));
      (a(`neck_01`).quaternion.multiply(
        new H().setFromAxisAngle(new U(1, 0, 0), 0.1 * v),
      ),
        a(`head`).quaternion.multiply(
          new H().setFromAxisAngle(new U(1, 0, 0), 0.24 * v),
        ),
        r.updateWorldMatrix(!0, !0));
      let y = m(-0.34, 0.377, -0.38),
        b = f.quaternion
          .clone()
          .multiply(new H().setFromAxisAngle(BS, ((n ? -1 : 1) * Math.PI) / 2))
          .multiply(s.root.quaternion.clone().invert())
          .multiply(s.feet.r.quaternion),
        x = {},
        S = [];
      for (let e of [`r`, `l`]) {
        let t = s.feet[e],
          i = p[e],
          l,
          u;
        if (e === `r`) {
          let e = LS(0.07, 0.36, c);
          if (
            ((l = t.position.clone().lerp(y, e)),
            (l.y += 0.42 * Math.sin(Math.PI * e)),
            (u = t.quaternion.clone().slerp(b, e)),
            c > 0.7)
          ) {
            let e = LS(0.7, 0.84, c);
            (l.lerp(i.position, e),
              (l.y += 0.11 * Math.sin(Math.PI * e)),
              u.slerp(i.quaternion, e));
          }
        } else {
          let e = LS(0.43, n ? 0.76 : 0.69, c);
          ((l = t.position.clone().lerp(i.position, e)),
            (l.y += 0.34 * Math.sin(Math.PI * e)),
            (u = t.quaternion.clone().slerp(i.quaternion, e)),
            l.addScaledVector(
              new U(0, 0, -1).applyQuaternion(f.quaternion),
              (n ? -0.12 : 0.42) * Math.sin(Math.PI * e),
            ));
        }
        x[e] = l.clone();
        let d = a(`thigh_${e}`),
          m = a(`calf_${e}`),
          h = m.getWorldPosition(new U()).sub(d.getWorldPosition(new U())),
          g = new U(e === `l` ? 0.08 : -0.08, 0, 1).applyQuaternion(
            r.quaternion,
          ),
          _ = LS(0, 0.07, c) * (1 - LS(0.84, 1, c));
        (h.lerp(g, _),
          S.push({ upper: d, lower: m, foot: o[e], p: l, q: u, pole: h }));
      }
      let C = 0;
      for (let { upper: e, lower: t, foot: n, p: r } of S) {
        let i = e.getWorldPosition(new U()),
          a = t.getWorldPosition(new U()),
          o = n.getWorldPosition(new U()),
          s = i.distanceTo(a) + a.distanceTo(o) - 0.002,
          c = Math.hypot(r.x - i.x, r.z - i.z);
        C = Math.max(C, i.y - r.y - Math.sqrt(Math.max(0, s * s - c * c)));
      }
      ((a(`pelvis`).position.y -=
        Math.min(0.15, C) * LS(0, 0.07, c) * (1 - LS(0.84, 1, c))),
        r.updateWorldMatrix(!0, !0));
      for (let { upper: e, lower: t, foot: n, p: r, q: i, pole: a } of S)
        bx(e, t, n, r, i, a);
      let w = LS(0.03, 0.16, c) * (1 - LS(0.68, 0.94, c)),
        T = LS(0.4, 0.68, c);
      if (w > 0)
        for (let [e, t] of [
          [`l`, 1],
          [`r`, -1],
        ]) {
          let n = a(`upperarm_${e}`),
            i = a(`lowerarm_${e}`),
            o = a(`hand_${e}`),
            s = zS(o),
            c = o.quaternion.clone(),
            l =
              e === `l`
                ? new U(0.34, 1.1, 0.28).lerp(new U(0.4, 1, 0.08), T)
                : new U(-0.38, 1.16, 0.16).lerp(new U(-0.32, 1.1, 0.26), T);
          r.localToWorld(l);
          let u = new U(t * 0.3, -0.4, -0.1).applyQuaternion(r.quaternion);
          (bx(n, i, o, s.position.lerp(l, w), s.quaternion, u),
            o.quaternion.slerp(c, w));
          for (let t of [`index`, `middle`, `ring`, `pinky`])
            for (let [n, r] of [
              [1, 0.14],
              [2, 0.26],
            ])
              a(`${t}_0${n}_${e}`).quaternion.multiply(
                new H().setFromAxisAngle(new U(1, 0, 0), -r * w),
              );
        }
      return (r.updateWorldMatrix(!0, !0), x);
    },
  };
}
var US = new U();
function WS(e, t, n, r, i, a) {
  let o = (2 * Math.PI * i) / 4,
    s = Math.max(a - 2 * i, 0),
    c = Math.PI / 4;
  (US.copy(t), (US[r] = 0), US.normalize());
  let l = (0.5 * o) / (o + s),
    u = 1 - US.angleTo(e) / c;
  return Math.sign(US[n]) === 1 ? u * l : s / (o + s) + l + l * (1 - u);
}
var GS = class e extends ba {
    constructor(e = 1, t = 1, n = 1, r = 2, i = 0.1) {
      let a = r * 2 + 1;
      if (
        ((i = Math.min(e / 2, t / 2, n / 2, i)),
        super(1, 1, 1, a, a, a),
        (this.type = `RoundedBoxGeometry`),
        (this.parameters = {
          width: e,
          height: t,
          depth: n,
          segments: r,
          radius: i,
        }),
        a === 1)
      )
        return;
      let o = this.toNonIndexed();
      ((this.index = null),
        (this.attributes.position = o.attributes.position),
        (this.attributes.normal = o.attributes.normal),
        (this.attributes.uv = o.attributes.uv));
      let s = new U(),
        c = new U(),
        l = new U(e, t, n).divideScalar(2).subScalar(i),
        u = this.attributes.position.array,
        d = this.attributes.normal.array,
        f = this.attributes.uv.array,
        p = u.length / 6,
        m = new U(),
        h = 0.5 / a;
      for (let r = 0, a = 0; r < u.length; r += 3, a += 2)
        switch (
          (s.fromArray(u, r),
          c.copy(s),
          (c.x -= Math.sign(c.x) * h),
          (c.y -= Math.sign(c.y) * h),
          (c.z -= Math.sign(c.z) * h),
          c.normalize(),
          (u[r + 0] = l.x * Math.sign(s.x) + c.x * i),
          (u[r + 1] = l.y * Math.sign(s.y) + c.y * i),
          (u[r + 2] = l.z * Math.sign(s.z) + c.z * i),
          (d[r + 0] = c.x),
          (d[r + 1] = c.y),
          (d[r + 2] = c.z),
          Math.floor(r / p))
        ) {
          case 0:
            (m.set(1, 0, 0),
              (f[a + 0] = WS(m, c, `z`, `y`, i, n)),
              (f[a + 1] = 1 - WS(m, c, `y`, `z`, i, t)));
            break;
          case 1:
            (m.set(-1, 0, 0),
              (f[a + 0] = 1 - WS(m, c, `z`, `y`, i, n)),
              (f[a + 1] = 1 - WS(m, c, `y`, `z`, i, t)));
            break;
          case 2:
            (m.set(0, 1, 0),
              (f[a + 0] = 1 - WS(m, c, `x`, `z`, i, e)),
              (f[a + 1] = WS(m, c, `z`, `x`, i, n)));
            break;
          case 3:
            (m.set(0, -1, 0),
              (f[a + 0] = 1 - WS(m, c, `x`, `z`, i, e)),
              (f[a + 1] = 1 - WS(m, c, `z`, `x`, i, n)));
            break;
          case 4:
            (m.set(0, 0, 1),
              (f[a + 0] = 1 - WS(m, c, `x`, `y`, i, e)),
              (f[a + 1] = 1 - WS(m, c, `y`, `x`, i, t)));
            break;
          case 5:
            (m.set(0, 0, -1),
              (f[a + 0] = WS(m, c, `x`, `y`, i, e)),
              (f[a + 1] = 1 - WS(m, c, `y`, `x`, i, t)));
        }
    }
    static fromJSON(t) {
      return new e(t.width, t.height, t.depth, t.segments, t.radius);
    }
  },
  KS = (e) =>
    0.94 +
    0.035 * Math.sin(e * 1.73) +
    0.018 * Math.sin(e * 3.17 + 0.8) +
    0.012 * Math.sin(e * 5.31 + 2.1),
  qS = `
  float stoveHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
  float stoveNoise(vec3 p){
    vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(mix(stoveHash(i),stoveHash(i+vec3(1,0,0)),f.x),mix(stoveHash(i+vec3(0,1,0)),stoveHash(i+vec3(1,1,0)),f.x),f.y),
      mix(mix(stoveHash(i+vec3(0,0,1)),stoveHash(i+vec3(1,0,1)),f.x),mix(stoveHash(i+vec3(0,1,1)),stoveHash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
`;
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
