// assets__index-BogB70q- 01 — math
// Lines 29498-29835 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function lf(e, t, n) {
  if (/^(data|blob):/i.test(e)) return e;
  let r = new URL(e, n),
    i = new URL(n).origin,
    a = r.origin === i && t[r.pathname];
  return a ? (r.searchParams.set(`v`, a), r.href) : e;
}
function uf(e) {
  return typeof document > `u` || !document.querySelector
    ? e
    : ((cf ??= JSON.parse(
        document.querySelector(`meta[name="stillwater-assets"]`)?.content ??
          `{}`,
      )),
      Object.keys(cf).length ? lf(e, cf, document.baseURI) : e);
}
var df = `stillwater.preferences.v1`;
function ff(e) {
  return {
    quality: e?.quality === `balanced` ? `balanced` : `high`,
    volume: Number.isFinite(e?.volume) ? Math.max(0, Math.min(1, e.volume)) : 1,
    sound: e?.sound === !0,
  };
}
function pf(e) {
  try {
    return ff(
      JSON.parse((e ?? globalThis.localStorage)?.getItem(df) ?? `null`),
    );
  } catch {
    return ff(null);
  }
}
function mf(e, t) {
  try {
    (t ?? globalThis.localStorage)?.setItem(df, JSON.stringify(ff(e)));
  } catch {}
}
function hf(e, t, n) {
  let r = e.getElementById(`loading-message`),
    i = e.getElementById(`loading-detail`),
    a = e.getElementById(`loading-progress`),
    o = e.getElementById(`loading-recovery`),
    s = 0,
    c = 0,
    l,
    u = !1;
  a.max = n + 5;
  let d = () => {
      u ||
        ((o.hidden = !0),
        clearTimeout(l),
        (l = setTimeout(() => {
          o.hidden = !1;
        }, 45e3)));
    },
    f = () => {
      ((a.value = s + c),
        (i.textContent = `${s + c} of ${a.max} parts ready`),
        d());
    };
  return (
    (t.onStart = d),
    (t.onProgress = d),
    e
      .getElementById(`loading-retry`)
      .addEventListener(`click`, () => location.reload()),
    f(),
    {
      models(e) {
        ((s = Math.round(e * n)), f());
      },
      async track(e) {
        let t = await e;
        return (c++, f(), t);
      },
      stage(e) {
        ((r.textContent = e),
          (i.textContent = `Almost there. Finding the light.`),
          a.removeAttribute(`value`),
          d());
      },
      stop() {
        ((u = !0),
          clearTimeout(l),
          (t.onStart = t.onProgress = null),
          (o.hidden = !0));
      },
    }
  );
}
var gf = class extends Hs {
    constructor(e) {
      (super(e), (this.type = y));
    }
    parse(e) {
      let t = function (e, t) {
          switch (e) {
            case 1:
              throw Error(`THREE.HDRLoader: Read Error: ` + (t || ``));
            case 2:
              throw Error(`THREE.HDRLoader: Write Error: ` + (t || ``));
            case 3:
              throw Error(`THREE.HDRLoader: Bad File Format: ` + (t || ``));
            default:
            case 4:
              throw Error(`THREE.HDRLoader: Memory Error: ` + (t || ``));
          }
        },
        n = function (e, t, n) {
          t ||= 1024;
          let r = e.pos,
            i = -1,
            a = 0,
            o = ``,
            s = String.fromCharCode.apply(
              null,
              new Uint16Array(e.subarray(r, r + 128)),
            );
          for (
            ;
            0 >
              (i = s.indexOf(`
`)) &&
            a < t &&
            r < e.byteLength;
          )
            ((o += s),
              (a += s.length),
              (r += 128),
              (s = String.fromCharCode.apply(
                null,
                new Uint16Array(e.subarray(r, r + 128)),
              )));
          return (
            -1 < i && (!1 !== n && (e.pos += a + i + 1), o + s.slice(0, i))
          );
        },
        r = function (e) {
          let r = /^#\?(\S+)/,
            i = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
            a = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
            o = /^\s*FORMAT=(\S+)\s*$/,
            s = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,
            c = {
              valid: 0,
              string: ``,
              comments: ``,
              programtype: `RGBE`,
              format: ``,
              gamma: 1,
              exposure: 1,
              width: 0,
              height: 0,
            },
            l,
            u;
          for (
            (e.pos >= e.byteLength || !(l = n(e))) && t(1, `no header found`),
              (u = l.match(r)) || t(3, `bad initial token`),
              c.valid |= 1,
              c.programtype = u[1],
              c.string +=
                l +
                `
`;
            (l = n(e)), !1 !== l;
          ) {
            if (
              ((c.string +=
                l +
                `
`),
              l.charAt(0) === `#`)
            ) {
              c.comments +=
                l +
                `
`;
              continue;
            }
            if (
              ((u = l.match(i)) && (c.gamma = parseFloat(u[1])),
              (u = l.match(a)) && (c.exposure = parseFloat(u[1])),
              (u = l.match(o)) && ((c.valid |= 2), (c.format = u[1])),
              (u = l.match(s)) &&
                ((c.valid |= 4),
                (c.height = parseInt(u[1], 10)),
                (c.width = parseInt(u[2], 10))),
              c.valid & 2 && c.valid & 4)
            )
              break;
          }
          return (
            c.valid & 2 || t(3, `missing format specifier`),
            c.valid & 4 || t(3, `missing image size specifier`),
            c
          );
        },
        i = function (e, n, r) {
          let i = n;
          if (i < 8 || i > 32767 || e[0] !== 2 || e[1] !== 2 || e[2] & 128)
            return new Uint8Array(e);
          i !== ((e[2] << 8) | e[3]) && t(3, `wrong scanline width`);
          let a = new Uint8Array(4 * n * r);
          a.length || t(4, `unable to allocate buffer space`);
          let o = 0,
            s = 0,
            c = 4 * i,
            l = new Uint8Array(4),
            u = new Uint8Array(c),
            d = r;
          for (; d > 0 && s < e.byteLength;) {
            (s + 4 > e.byteLength && t(1),
              (l[0] = e[s++]),
              (l[1] = e[s++]),
              (l[2] = e[s++]),
              (l[3] = e[s++]),
              (l[0] != 2 || l[1] != 2 || ((l[2] << 8) | l[3]) != i) &&
                t(3, `bad rgbe scanline format`));
            let n = 0,
              r;
            for (; n < c && s < e.byteLength;) {
              r = e[s++];
              let i = r > 128;
              if (
                (i && (r -= 128),
                (r === 0 || n + r > c) && t(3, `bad scanline data`),
                i)
              ) {
                let t = e[s++];
                for (let e = 0; e < r; e++) u[n++] = t;
              } else (u.set(e.subarray(s, s + r), n), (n += r), (s += r));
            }
            let f = i;
            for (let e = 0; e < f; e++) {
              let t = 0;
              ((a[o] = u[e + t]),
                (t += i),
                (a[o + 1] = u[e + t]),
                (t += i),
                (a[o + 2] = u[e + t]),
                (t += i),
                (a[o + 3] = u[e + t]),
                (o += 4));
            }
            d--;
          }
          return a;
        },
        a = function (e, t, n, r) {
          let i = 2 ** (e[t + 3] - 128) / 255;
          ((n[r + 0] = e[t + 0] * i),
            (n[r + 1] = e[t + 1] * i),
            (n[r + 2] = e[t + 2] * i),
            (n[r + 3] = 1));
        },
        o = function (e, t, n, r) {
          let i = 2 ** (e[t + 3] - 128) / 255;
          ((n[r + 0] = Cr.toHalfFloat(Math.min(e[t + 0] * i, 65504))),
            (n[r + 1] = Cr.toHalfFloat(Math.min(e[t + 1] * i, 65504))),
            (n[r + 2] = Cr.toHalfFloat(Math.min(e[t + 2] * i, 65504))),
            (n[r + 3] = Cr.toHalfFloat(1)));
        },
        s = new Uint8Array(e);
      s.pos = 0;
      let c = r(s),
        u = c.width,
        d = c.height,
        f = i(s.subarray(s.pos), u, d),
        p,
        m,
        h;
      switch (this.type) {
        case v:
          h = f.length / 4;
          let e = new Float32Array(h * 4);
          for (let t = 0; t < h; t++) a(f, t * 4, e, t * 4);
          ((p = e), (m = v));
          break;
        case y:
          h = f.length / 4;
          let t = new Uint16Array(h * 4);
          for (let e = 0; e < h; e++) o(f, e * 4, t, e * 4);
          ((p = t), (m = y));
          break;
        default:
          throw Error(`THREE.HDRLoader: Unsupported type: ` + this.type);
      }
      return {
        width: u,
        height: d,
        data: p,
        header: c.string,
        gamma: c.gamma,
        exposure: c.exposure,
        type: m,
        colorSpace: Ge,
        minFilter: l,
        magFilter: l,
        generateMipmaps: !1,
        flipY: !0,
      };
    }
    setDataType(e) {
      return ((this.type = e), this);
    }
  },
  _f = new U(-12, 30, 25),
  vf = _f
    .toArray()
    .map((e) => e.toFixed(1))
    .join(`,`),
  yf = Object.freeze([
    Object.freeze({
      foot: Object.freeze([-18.85, 2.14, -4.3]),
      width: 0.7,
      strength: 1,
    }),
    Object.freeze({
      foot: Object.freeze([-14.8, 3, -7.9]),
      width: 0.55,
      strength: 0.8,
    }),
  ]),
  bf = _f.clone().normalize();
function xf(e, t, n) {
  let r = 0;
  for (let i of yf) {
    let a = e - i.foot[0],
      o = t - i.foot[1],
      s = n - i.foot[2],
      c = a * bf.x + o * bf.y + s * bf.z,
      l = Math.max(0, a * a + o * o + s * s - c * c);
    r += i.strength * Math.exp(-l / (i.width * i.width));
  }
  return Math.min(1, r);
}
