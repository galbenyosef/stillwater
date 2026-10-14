// view-mode-01.js — the view-cycle helper (follow/keeper/explore)
// Lines 52562-52569 of readable/assets__index-BogB70q-.pretty.js (cluster view-mode, statement-aligned).
function U_(e, { aboard: t = !1, fishing: n = !1, immersive: r = !1 } = {}) {
  let i = r
    ? [`keeper`, `explore`]
    : t && !n
      ? [`follow`, `keeper`, `explore`]
      : [`follow`, `explore`];
  return i[(i.indexOf(e) + 1) % i.length];
}
