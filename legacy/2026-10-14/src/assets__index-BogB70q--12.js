// assets__index-BogB70q- 12 — skeleton
// Lines 32987-33014 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Gp(e) {
  let t = new Map(),
    n = new Map(),
    r = e.clone();
  return (
    Kp(e, r, function (e, r) {
      (t.set(r, e), n.set(e, r));
    }),
    r.traverse(function (e) {
      if (!e.isSkinnedMesh) return;
      let r = e,
        i = t.get(e),
        a = i.skeleton.bones;
      ((r.skeleton = i.skeleton.clone()),
        r.bindMatrix.copy(i.bindMatrix),
        (r.skeleton.bones = a.map(function (e) {
          return n.get(e);
        })),
        r.bind(r.skeleton, r.bindMatrix));
    }),
    r
  );
}
function Kp(e, t, n) {
  n(e, t);
  for (let r = 0; r < e.children.length; r++)
    Kp(e.children[r], t.children[r], n);
}
