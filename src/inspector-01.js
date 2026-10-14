// inspector-01.js — the render inspector (debug panel, GPU timer queries, frame counters)
// Lines 65073-65681 of readable/assets__index-BogB70q-.pretty.js (cluster inspector, statement-aligned).
if (ST) {
  let e = document.createElement(`details`);
  ((e.id = `render-inspector`),
    (e.open = !0),
    Object.assign(e.style, {
      position: `absolute`,
      left: `12px`,
      top: `90px`,
      zIndex: 10,
      width: `350px`,
      maxWidth: `calc(100vw - 24px)`,
      maxHeight: `calc(100dvh - 110px)`,
      overflowY: `auto`,
      background: `#102e28df`,
      font: `10px monospace`,
      padding: `8px`,
    }));
  let t = document.createElement(`summary`);
  ((t.textContent = `Rendering inspector`),
    (t.style.cursor = `pointer`),
    e.append(t),
    document.body.append(e),
    (CT = document.createElement(`output`)),
    (CT.id = `diagnostics`),
    Object.assign(CT.style, {
      display: `block`,
      padding: `8px 0`,
      whiteSpace: `pre-wrap`,
      pointerEvents: `none`,
    }),
    e.append(CT));
  let n = document.createElement(`select`);
  ((n.id = `audit-view`),
    n.setAttribute(`aria-label`, `Inspection viewpoint`),
    Object.assign(n.style, {
      color: `#eee8d3`,
      background: `#183e33`,
      padding: `5px`,
      font: `11px monospace`,
    }));
  let r = [
    [`Mill island`, -7, 8, 0.37, 24],
    [`Boat and landing`, 0.5, 7.3, 0.25, 15],
    [`Waterwheel`, 5, -2, 1.1, 18],
    [`Under the bridge`, -11, -6, -0.4, 20],
    [`Behind the mill`, 0, -12, 3.3, 25],
    [`Woodland spring`, 3, -11, 2, 15],
    [`Lily shallows`, -7, 9, -0.15, 20],
    [`Fish shoals`, 3.6, 8, 0.25, 13],
    [`Dragonfly bank`, 10, 8, 1.15, 13],
    [`Birch roots`, 13.8, -4.9, -1.5, 10, [17.5, 1.9, -5.2]],
    [`Dock props`, 0.5, 7.3, 0.38, 6.2, [-3, 0.8, 2.8]],
    [`Eastern birches`, 13.8, -4.9, -1.5, 18, [17.5, 6.4, -2.8]],
  ];
  (r.push([`Far bank bench`, -20.25, -3, 1, 6.5, [-19.6, 2.7, -3.8], 0.4]),
    r.push([`Sunlit leaf`, -20.25, -3, 1, 7.2, [-19.7, 4, -2.5], 0.32]),
    r.push([`Bridge birch`, -20.25, -3, 1, 15, [-16, 6.8, -8], 0.24]),
    r.push([`Bridge birch side`, -20.25, -3, 0.45, 15, [-16, 6.8, -8], 0.35]),
    r.push([`Wheel water contact`, 7, 5, 1.12, 7.2, [1.25, 1, -3.4], 0.42]),
    r.push([`Shoreline lapping`, 7, 5, -1.5, 7.2, [16.8, 0.3, -5.2], 0.42]),
    r.push(
      [`Willow crown`, 11.4, 4.8, -1.18, 17, [16.4, 4.4, 4.8]],
      [`Northern woodland`, -1, -12, 3, 25, [-1, 4.6, -17]],
      [`Mill windows`, 0.5, 7.3, 0.15, 7, [-3, 4.4, -1.3], 0],
    ),
    r.push([`Surface activity`, -7, 8, 0.25, 9, [3.6, 0.3, 7.8], 0.45]),
    r.push([`Mill keeper`, 0.5, 7.3, 0.42, 3.4, [-3, 1.4, 2.65], 0.12]),
    r.push([
      `Chair fishing close-up`,
      0.5,
      7.3,
      -0.93,
      2.8,
      [-4.33, 1, chairSpec.z + 0.12],
      0.53,
    ]),
    r.push([
      `Swim ladder`,
      0.5,
      7.3,
      -0.65,
      3.6,
      [-4.95, 0.65, keeperMotionSpec.water.z],
      0.25,
    ]),
    r.push([
      `Keeper at the helm`,
      dockSpec.boat.x,
      dockSpec.boat.z,
      -0.5,
      2.7,
      [dockSpec.boat.x, 0.7, dockSpec.boat.z - 0.55],
      0.3,
    ]),
    r.push([
      `Boat boarding close-up`,
      dockSpec.boat.x,
      dockSpec.boat.z,
      -0.65,
      4.2,
      [-1.1, 0.95, 2.15],
      0.42,
    ]),
    r.push([
      `Boat boarding front`,
      dockSpec.boat.x,
      dockSpec.boat.z,
      0.65,
      3.4,
      [-1.1, 1.05, 2.15],
      0.42,
    ]),
    r.push([
      `Tiller grip`,
      dockSpec.boat.x,
      dockSpec.boat.z,
      -1.2,
      1.6,
      [dockSpec.boat.x - 0.24, 0.9, dockSpec.boat.z - 1],
      0.5,
    ]),
    r.push([`Keeper face`, 0.5, 7.3, 1.45, 0.48, [-3, 2.1, 2.15], 0.02]),
    r.push([`Keeper hair side`, 0.5, 7.3, -1.45, 0.6, [-3, 2.1, 2.15], 0.04]),
    r.push([
      `Keeper hair back`,
      0.5,
      7.3,
      Math.PI,
      0.65,
      [-3, 2.1, 2.15],
      0.08,
    ]),
    r.push([`Keeper wardrobe`, 0.5, 7.3, 0.18, 2.4, [-3, 1.35, 2.15], 0.38]),
    r.push([
      `Keeper shirt detail`,
      0.5,
      7.3,
      0.32,
      0.67,
      [-3, 1.91, 2.15],
      0.06,
    ]),
    r.push([`Keeper shirt front`, 0.5, 7.3, 1.3, 1.15, [-3, 1.83, 2.15], 0.06]),
    r.push([`Keeper sleeves`, 0.5, 7.3, 0, 1.05, [-3, 1.6, 2.15], 0.08]),
    r.push([`Keeper boots`, 0.5, 7.3, 0.48, 0.65, [-3, 0.64, 2.19], 0.48]),
    r.push([`Keeper stride side`, 0.5, 7.3, 1.4, 1.1, [-3, 0.8, 2.15], 0.18]));
  for (let [e, t] of r.entries()) {
    let r = document.createElement(`option`);
    ((r.value = String(e)), (r.textContent = t[0]), n.append(r));
  }
  (n.addEventListener(`change`, () => {
    let [e, t, i, a, o, s, c] = r[Number(n.value)];
    (vT(),
      tT(!1, { announce: !1 }),
      playerState.mode === `boat` &&
        eT({
          x: t,
          z: i,
          heading: [
            `Keeper at the helm`,
            `Tiller grip`,
            `Boat boarding close-up`,
            `Boat boarding front`,
          ].includes(e)
            ? dockSpec.boat.heading
            : Yf.heading,
        }),
      Xw(!1),
      _T(),
      (Fw = s ? new U(...s) : new U(t * 0.5, 1.6, i * 0.5)),
      (Iw = c ?? 0.68),
      (Pw = a),
      (Mw = o),
      eE());
  }),
    e.append(n),
    (MT = document.createElement(`button`)),
    (MT.textContent = `Walk bridge route`),
    (MT.style.cssText = `display:block;background:#285344;padding:6px;margin-top:6px;font:11px monospace`),
    (NT = document.createElement(`output`)),
    (NT.style.display = `block`),
    MT.addEventListener(`click`, () => {
      if (worldReady) {
        if (jT?.paused) {
          ((jT.paused = !1), (MT.textContent = `Walking bridge route…`));
          return;
        }
        ((wT = !1),
          (TT.checked = !1),
          sT(),
          oT(),
          (jT = { index: 0, paused: !1, looking: !1 }),
          (NT.textContent = `Walking to the mill`),
          (MT.textContent = `Walking bridge route…`));
      }
    }),
    e.append(MT, NT));
  for (let [t, n, r] of [
    [`Walk upstairs route`, FT, !1],
    [`Walk back from bank`, LT, !0],
    [`Walk and turn study`, IT, !1],
  ]) {
    let i = document.createElement(`button`);
    ((i.textContent = t),
      (i.style.cssText = MT.style.cssText),
      i.addEventListener(`click`, () => {
        if (worldReady && !hC.transitioning) {
          if (
            r &&
            Math.hypot(
              playerState.state.x - shorePath.points.at(-1)[0],
              playerState.state.z - shorePath.points.at(-1)[1],
            ) > 1.3
          ) {
            NT.textContent = `Walk to the pond bench first`;
            return;
          }
          ((wT = !1),
            (TT.checked = !1),
            r ? (hC.active && hC.interact(playerState.state), _T(), vT()) : (sT(), oT()),
            n === IT &&
              ((Fw = new U(-2.9, 1.2, 1.9)),
              (Iw = 0.2),
              (Pw = 1.25),
              (Mw = 3.4)),
            (jT = { route: n, index: 0, paused: !1, looking: !1 }),
            (NT.textContent = t),
            (MT.textContent = `Walking bridge route…`));
        }
      }),
      e.append(i));
  }
  let i = document.createElement(`label`),
    a = document.createElement(`input`);
  ((a.type = `checkbox`),
    (i.style.display = `block`),
    (i.style.paddingTop = `8px`),
    i.append(a, ` Show wake field`),
    a.addEventListener(`change`, () => NC?.setWakeDebug(a.checked)),
    e.append(i));
  let o = document.createElement(`label`),
    s = document.createElement(`input`);
  ((s.type = `checkbox`),
    (s.checked = !0),
    (o.style.display = `block`),
    (o.style.paddingTop = `8px`),
    o.append(s, ` Wake light on pond bed`),
    s.addEventListener(`change`, () => NC?.setWakeLighting(s.checked)),
    e.append(o));
  let c = document.createElement(`label`),
    l = document.createElement(`input`);
  ((l.type = `checkbox`),
    (TT = l),
    (c.style.display = `block`),
    (c.style.paddingTop = `8px`),
    c.append(l, ` Freeze motion for comparison`),
    l.addEventListener(`change`, () => {
      wT = l.checked;
    }),
    e.append(c));
  let u = document.createElement(`label`),
    d = document.createElement(`input`);
  ((d.type = `checkbox`),
    (d.checked = !0),
    (u.style.cssText = `display:block;padding-top:8px`),
    u.append(d, ` Woodland sunbeams`),
    d.addEventListener(`change`, () => {
      (dw.setWoodlandLight(d.checked), eE());
    }),
    e.append(u));
  let f = document.createElement(`select`);
  (f.setAttribute(`aria-label`, `Cloud shadow preview`),
    (f.disabled = reducedMotion),
    (f.style.cssText = `display:block;margin-top:8px;color:#eee8d3;background:#183e33;padding:5px;font:11px monospace`));
  for (let [e, t] of [
    [`live`, `Cloud: natural passing shadow`],
    [`clear`, `Cloud: clear sunlight`],
    [`crossing`, `Cloud: crossing the bank`],
    [`shade`, `Cloud: shade over the mill`],
    [`leaving`, `Cloud: sunlight returning`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), f.append(n));
  }
  (f.addEventListener(`change`, () => cloudShadows.preview(f.value)), e.append(f));
  let p = document.createElement(`button`);
  ((p.textContent = `Preview passing cloud`),
    (p.disabled = reducedMotion),
    (p.style.cssText = `display:block;background:#285344;padding:6px;margin-top:6px;font:11px monospace`),
    p.addEventListener(`click`, () => {
      worldReady &&
        (oT(),
        (wT = !1),
        (TT.checked = !1),
        (f.value = `live`),
        cloudShadows.preview(`play`));
    }),
    e.append(p));
  let m = document.createElement(`select`);
  (m.setAttribute(`aria-label`, `Breeze preview`),
    (m.disabled = reducedMotion),
    (m.style.cssText = f.style.cssText));
  for (let [e, t] of [
    [`live`, `Breeze: natural rhythm`],
    [`play`, `Breeze: replay now`],
    [`calm`, `Breeze: calm air`],
    [`bank`, `Breeze: through the trees`],
    [`pond`, `Breeze: across the pond`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), m.append(n));
  }
  (m.addEventListener(`change`, () => {
    if (!worldReady) return;
    let e = m.value;
    (e === `play` && (oT(), (wT = !1), (TT.checked = !1), (m.value = `live`)),
      breezeState.preview(e));
  }),
    e.append(m));
  let h = document.createElement(`select`);
  (h.setAttribute(`aria-label`, `Rain shower preview`),
    (h.disabled = reducedMotion),
    (h.style.cssText = f.style.cssText));
  for (let [e, t] of [
    [`live`, `Rain: natural passing showers`],
    [`play`, `Rain: replay shower now`],
    [`clear`, `Rain: clear and dry`],
    [`arriving`, `Rain: first drops`],
    [`shower`, `Rain: gentle shower`],
    [`clearing`, `Rain: sunlight returning`],
    [`drying`, `Rain: drying surfaces`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), h.append(n));
  }
  (h.addEventListener(`change`, () => {
    if (!worldReady) return;
    let e = h.value;
    (oT(),
      (wT = !1),
      (TT.checked = !1),
      zC.preview(e),
      e === `play` && (h.value = `live`));
  }),
    e.append(h));
  let g = document.createElement(`select`);
  (g.setAttribute(`aria-label`, `Sunlit leaf preview`),
    (g.disabled = reducedMotion),
    (g.style.cssText = `display:block;margin-top:8px;color:#eee8d3;background:#183e33;padding:5px;font:11px monospace`));
  for (let [e, t] of [
    [`live`, `Leaf: quiet natural cycle`],
    [`hidden`, `Leaf: hidden for comparison`],
    [`before`, `Leaf: before the light`],
    [`light`, `Leaf: catching the light`],
    [`shade`, `Leaf: back in shade`],
    [`landed`, `Leaf: settled on the bank`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), g.append(n));
  }
  (g.addEventListener(`change`, () => FC?.previewLeaf(g.value)), e.append(g));
  let _ = document.createElement(`button`);
  ((_.textContent = `Preview falling leaf`),
    (_.disabled = reducedMotion),
    (_.style.cssText = `display:block;background:#285344;padding:6px;margin-top:6px;font:11px monospace`),
    _.addEventListener(`click`, () => {
      worldReady &&
        ((wT = !1),
        (TT.checked = !1),
        (g.value = `live`),
        FC.previewLeaf(`play`));
    }),
    e.append(_),
    (ET = document.createElement(`select`)),
    ET.setAttribute(`aria-label`, `Pause fish preview`),
    (ET.style.cssText = `display:block;margin-top:8px;color:#eee8d3;background:#183e33;padding:5px;font:11px monospace`));
  for (let [e, t] of [
    [``, `Keep playing`],
    [`feed`, `Pause at feeding`],
    [`apex`, `Pause at jump peak`],
    [`splash`, `Pause at re-entry splash`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), ET.append(n));
  }
  (e.append(ET),
    (DT = document.createElement(`select`)),
    DT.setAttribute(`aria-label`, `Pause fishing preview`),
    (DT.style.cssText = ET.style.cssText));
  for (let [e, t] of [
    [``, `Keep fishing live`],
    [`aligning:.5`, `Pause turning to sit`],
    [`pickup:.3`, `Pause reaching for the rod`],
    [`pickup:.65`, `Pause lifting the rod`],
    [`sitting:.55`, `Pause while sitting down`],
    [`ready:0`, `Pause fishing at grip`],
    [`casting:.43`, `Pause fishing at cast`],
    [`waiting:0`, `Pause fishing at float`],
    [`reeling:.47`, `Pause fishing at reel`],
    [`standing:.5`, `Pause while standing up`],
    [`putdown:.5`, `Pause putting the rod away`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), DT.append(n));
  }
  (e.append(DT),
    (OT = document.createElement(`select`)),
    OT.setAttribute(`aria-label`, `Pause boarding preview`),
    (OT.style.cssText = ET.style.cssText));
  for (let [e, t] of [
    [``, `Keep boarding live`],
    [`.22`, `Pause stepping over the side`],
    [`.40`, `Pause with one foot aboard`],
    [`.57`, `Pause bringing the second foot aboard`],
    [`.79`, `Pause turning into the seat`],
    [`.94`, `Pause taking the tiller`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), OT.append(n));
  }
  e.append(OT);
  let v = document.createElement(`button`);
  ((v.textContent = `Preview boarding`),
    (v.style.cssText = `background:#285344;padding:6px;margin-top:6px;font:11px monospace`),
    v.addEventListener(`click`, () => {
      worldReady &&
        ((wT = !1),
        (TT.checked = !1),
        sT(),
        playerState.place({ ...dockSpec.shore, walk: 0, gait: 0 }),
        (n.value = String(
          r.findIndex((e) => e[0] === `Boat boarding close-up`),
        )),
        n.dispatchEvent(new Event(`change`)),
        dT());
    }),
    e.append(v),
    (kT = document.createElement(`select`)),
    kT.setAttribute(`aria-label`, `Pause leaving preview`),
    (kT.style.cssText = ET.style.cssText));
  for (let [e, t] of [
    [``, `Keep leaving live`],
    [`.18`, `Pause standing from the helm`],
    [`.43`, `Pause stepping onto the dock`],
    [`.60`, `Pause with one foot ashore`],
    [`.82`, `Pause bringing the second foot ashore`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), kT.append(n));
  }
  e.append(kT);
  let y = document.createElement(`button`);
  ((y.textContent = `Preview leaving`),
    (y.style.cssText = v.style.cssText),
    y.addEventListener(`click`, () => {
      worldReady &&
        ((wT = !1),
        (TT.checked = !1),
        sT(),
        playerState.reset({ aboard: !0 }),
        (n.value = String(r.findIndex((e) => e[0] === `Boat boarding front`))),
        n.dispatchEvent(new Event(`change`)),
        dT());
    }),
    e.append(y));
  let b = document.createElement(`div`);
  b.style.paddingTop = `8px`;
  for (let [e, t] of [
    [`feed`, `Preview feeding`],
    [`jump`, `Preview fish jump`],
  ]) {
    let n = document.createElement(`button`);
    ((n.textContent = t),
      (n.style.cssText = `background:#285344;padding:6px;margin-right:6px;font:11px monospace`),
      n.addEventListener(`click`, () => {
        FC?.previewFish(e) || lw(`Let the current fish finish first.`);
      }),
      b.append(n));
  }
  e.append(b);
  let x = document.createElement(`label`),
    S = document.createElement(`input`);
  ((S.type = `checkbox`),
    (S.checked = !0),
    (x.style.cssText = `display:block;padding-top:8px`),
    x.append(S, ` Show mill keeper`),
    S.addEventListener(`change`, () => {
      (RC?.setEnabled(S.checked), eE());
    }),
    e.append(x));
  let C = document.createElement(`select`);
  ((C.id = `keeper-motion`),
    C.setAttribute(`aria-label`, `Keeper motion`),
    (C.style.cssText = `display:block;margin-top:8px;color:#eee8d3;background:#183e33;padding:5px;font:11px monospace`));
  for (let [e, t] of [
    [`player`, `Player control`],
    [`routine`, `Keeper routine`],
    [`idle`, `Idle study`],
    [`walk`, `Walking study`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), C.append(n));
  }
  (C.addEventListener(`change`, () => {
    (_T(),
      (QC = C.value !== `player` && playerState.mode === `foot`),
      RC?.setMode(C.value));
  }),
    e.append(C));
  let w = document.createElement(`select`);
  ((w.id = `tiller-pose`),
    w.setAttribute(`aria-label`, `Tiller pose`),
    (w.style.cssText = C.style.cssText));
  for (let [e, t] of [
    [`live`, `Live steering`],
    [`.85`, `Left turn grip study`],
    [`0`, `Centered grip study`],
    [`-.85`, `Right turn grip study`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), w.append(n));
  }
  (w.addEventListener(`change`, () => {
    AT = w.value === `live` ? null : Number(w.value);
  }),
    e.append(w));
  let T = document.createElement(`select`);
  ((T.id = `boat-water-motion`),
    T.setAttribute(`aria-label`, `Boat water contact preview`),
    (T.style.cssText = C.style.cssText));
  for (let [e, t] of [
    [`live`, `Live boat control`],
    [`rest`, `Water contact: resting`],
    [`forward`, `Water contact: forward`],
    [`reverse`, `Water contact: reverse`],
    [`left`, `Water contact: left pivot`],
    [`right`, `Water contact: right pivot`],
  ]) {
    let n = document.createElement(`option`);
    ((n.value = e), (n.textContent = t), T.append(n));
  }
  (T.addEventListener(`change`, () => {
    if (!worldReady || fishingState.active) {
      T.value = zT;
      return;
    }
    let e = T.value;
    (vT(),
      _T(),
      (BT = 0),
      e !== `live` &&
        (oT(),
        playerState.reset({ aboard: !0 }),
        tT(!1, { announce: !1 }),
        Xw(!1),
        (zT = e),
        (T.value = e),
        eT(UT),
        (Fw = new U(0, 0.48, 9)),
        (Iw = 0.3),
        (Pw = -0.65),
        (Mw = 7)),
      eE(),
      lT());
  }),
    e.append(T));
  let E = document.createElement(`label`),
    D = document.createElement(`input`);
  ((D.type = `checkbox`),
    (D.checked = !0),
    (E.style.cssText = `display:block;padding-top:8px`),
    E.append(D, ` Hull contact waves`),
    D.addEventListener(`change`, () => {
      (NC?.setBoatContact(D.checked),
        (VT = !1),
        (O.disabled = reducedMotion || !D.checked),
        eE());
    }),
    e.append(E));
  let O = document.createElement(`button`);
  ((O.textContent = `Pause at a hull splash`),
    (O.disabled = reducedMotion),
    (O.style.cssText = `display:block;background:#285344;padding:6px;margin-top:8px;font:11px monospace`),
    O.addEventListener(`click`, () => {
      ((VT = !0), (HT = !1), (wT = !1), (TT.checked = !1));
    }),
    e.append(O));
  let k = document.createElement(`label`),
    A = document.createElement(`input`);
  ((A.type = `checkbox`),
    (A.checked = !0),
    (k.style.cssText = `display:block;padding-top:8px`),
    k.append(A, ` Mill water contact`),
    A.addEventListener(`change`, () => {
      (NC?.setMillContact(A.checked),
        (HT = !1),
        (j.disabled = reducedMotion || !A.checked),
        eE());
    }),
    e.append(k));
  let j = document.createElement(`button`);
  ((j.textContent = `Pause at a wheel splash`),
    (j.disabled = reducedMotion),
    (j.style.cssText = O.style.cssText),
    j.addEventListener(`click`, () => {
      ((HT = !0), (VT = !1), (wT = !1), (TT.checked = !1));
    }),
    e.append(j));
}
