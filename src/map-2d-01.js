// map-2d-01.js — the 2D minimap (canvas, projection and the drawn island map)
// Lines 64015-64107 of readable/assets__index-BogB70q-.pretty.js (cluster map-2d, statement-aligned).
var Ww = byId(`map`).getContext(`2d`),
  Gw = document.createElement(`canvas`);
((Gw.width = 460), (Gw.height = 380));
var Kw = Gw.getContext(`2d`),
  qw = (e, t) => [(e / 48 + 0.5) * 460, ((t - 0.4) / 40 + 0.5) * 380];
function Jw() {
  let e = Kw.createImageData(460, 380);
  for (let t = 0; t < 380; t++)
    for (let n = 0; n < 460; n++) {
      let r = (n / 460 - 0.5) * 48,
        i = (t / 380 - 0.5) * 40 + 0.4,
        a = islandHeight(r, i),
        o = (t * 460 + n) * 4,
        s =
          a > 0.18
            ? [106, 123, 79]
            : a > -0.45
              ? [154, 175, 141]
              : [178, 201, 176],
        c = Math.sin(r * 0.6) * Math.sin(i * 0.5) * 3;
      ((e.data[o] = s[0] + c),
        (e.data[o + 1] = s[1] + c),
        (e.data[o + 2] = s[2] + c),
        (e.data[o + 3] = 255));
    }
  (Kw.putImageData(e, 0, 0),
    (Kw.strokeStyle = `#ede7d366`),
    (Kw.lineWidth = 1));
  for (let e = 0; e < 460; e += 46)
    (Kw.beginPath(), Kw.moveTo(e, 0), Kw.lineTo(e, 380), Kw.stroke());
  for (let e = 0; e < 380; e += 46)
    (Kw.beginPath(), Kw.moveTo(0, e), Kw.lineTo(460, e), Kw.stroke());
  ((Kw.fillStyle = `#354a34`),
    (Kw.font = `italic 17px Georgia`),
    (Kw.textAlign = `center`));
  for (let [e, t, n] of [
    [9, 5, `Willow bank`],
    [-8, 7, `Lily shallows`],
  ])
    Kw.fillText(n, ...qw(e, t));
  ((Kw.strokeStyle = `#efe8ca`),
    (Kw.lineWidth = 3),
    Kw.setLineDash([5, 4]),
    Kw.beginPath(),
    [
      [-3, 1.78],
      [-3, -2.1],
      [-5.38, -2.1],
      [-5.38, -6.45],
      ...shorePath.points,
    ].forEach(([e, t], n) => Kw[n ? `lineTo` : `moveTo`](...qw(e, t))),
    Kw.stroke(),
    Kw.setLineDash([]));
  for (let [e, t] of [
    [-3, -4.2],
    [dockSpec.shore.x, dockSpec.shore.z],
    [-11.65, -6.45],
    [benchArea.x, benchArea.z],
  ].entries()) {
    let [n, r] = qw(...t);
    (Kw.beginPath(),
      Kw.arc(n, r, 11, 0, Math.PI * 2),
      (Kw.fillStyle = `#3c5741`),
      Kw.fill(),
      (Kw.strokeStyle = `#efe8ca`),
      (Kw.lineWidth = 2),
      Kw.stroke(),
      (Kw.fillStyle = `#f3edd9`),
      (Kw.font = `12px Arial`),
      (Kw.textBaseline = `middle`),
      Kw.fillText(String(e + 1), n, r + 1));
  }
}
function Yw() {
  let e = playerState.mode === `boat` ? boatState : playerState.state;
  Ww.drawImage(Gw, 0, 0);
  let [t, n] = qw(e.x, e.z);
  (Ww.save(),
    Ww.translate(t, n),
    Ww.rotate(-e.heading),
    Ww.beginPath(),
    Ww.moveTo(0, 8),
    Ww.lineTo(-4, -5),
    Ww.lineTo(4, -5),
    Ww.closePath(),
    (Ww.fillStyle = `#d08b43`),
    (Ww.strokeStyle = `#f8f0d5`),
    (Ww.lineWidth = 2),
    Ww.fill(),
    Ww.stroke(),
    Ww.restore());
}
(Jw(), Yw());
