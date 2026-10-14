// mill-interior-02.js — the mill interior (constants, palette, daylight bake, doors and the mill rug)
// Lines 50292-50356 of readable/assets__index-BogB70q-.pretty.js (cluster mill-interior, statement-aligned).
async function Hg(
  e,
  {
    loader: t = new Us(),
    createCanvas: n = () => document.createElement(`canvas`),
  } = {},
) {
  let r, i, a;
  if (
    (e.traverse((e) => {
      if (!e.isMesh || e.material.name !== `Mill interior | Oak • weathered`)
        return;
      let t = e.geometry;
      if (!t.userData.millBeamGrain || t.userData.frontBeamScar || !t.index)
        return;
      let n = t.getAttribute(`position`),
        o = [],
        s = [];
      for (let e = 0; e < t.index.count; e += 3) {
        let r = [0, 1, 2].map((n) => t.index.getX(e + n)),
          i = r.map((e) => n.getX(e));
        (Math.max(...i) - Math.min(...i) > 6.3 &&
        r.every(
          (e) =>
            n.getY(e) >= millLayout.ceiling - 0.241 &&
            n.getY(e) <= millLayout.ceiling + 0.001 &&
            Math.abs(n.getZ(e) - 0.1) < 0.081,
        )
          ? s
          : o
        ).push(...r);
      }
      s.length && ((r = e), (i = o), (a = s));
    }),
    !r)
  )
    return;
  let o = r.material,
    s = o.clone(),
    c = [`map`, `normalMap`, `roughnessMap`],
    l = await t.loadAsync(`/textures/mill-front-beam-scar.webp`);
  (c.forEach((e, t) => {
    let r = o[e].image,
      i = n();
    ((i.width = r.width), (i.height = r.height));
    let a = i.getContext(`2d`);
    ((a.imageSmoothingEnabled = !1),
      a.drawImage(r, 0, 0),
      a.drawImage(l.image, 0, t * 134, 264, 134, 206, 1011, 264, 134));
    let c = o[e].clone();
    ((c.source = new Xt(i)), (c.needsUpdate = !0), (s[e] = c));
  }),
    (s.onBeforeCompile = o.onBeforeCompile),
    (s.customProgramCacheKey = o.customProgramCacheKey),
    (s.name = o.name + ` • front beam scar repair`));
  let u = r.geometry.clone();
  (u.setIndex(i),
    u.clearGroups(),
    (u.userData = { ...r.geometry.userData, frontBeamScar: !0 }));
  let d = new Hr();
  for (let [e, t] of Object.entries(u.attributes)) d.setAttribute(e, t);
  d.setIndex(a);
  let f = new vi(d, s);
  ((f.name = `Front ceiling beam long faces`), (r.geometry = u), r.add(f));
}
