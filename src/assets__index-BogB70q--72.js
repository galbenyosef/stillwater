// assets__index-BogB70q- 72 — addeventlistener
// Lines 64532-64875 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function dT() {
  if (!(!OC || cT() || QC || Dw.active)) {
    if (gC.active) {
      gC.leave() && _T();
      return;
    }
    if (Q.mode === `foot` && hC.interact(Q.state)) {
      (_T(), vT(), lT(), cC.focus({ preventScroll: !0 }));
      return;
    }
    if (Q.mode === `foot` && $?.interact(Q.state)) {
      (_T(), vT(), lT(), cC.focus({ preventScroll: !0 }));
      return;
    }
    if (PC?.sluice && bg(Q.state, Q.mode, PC.power.state)) {
      let e = PC.power.toggle();
      (_T(),
        vT(),
        lw(e ? `The sluice is opening.` : `The sluice is closing.`),
        uT(),
        cC.focus({ preventScroll: !0 }));
      return;
    }
    if (Q.interact(CC)) {
      if ((_T(), Xw(!1), Q.leaving)) {
        let e = Fw;
        (tT(!1, { announce: !1 }), (Fw = e), e || (Mw = 9.5));
      } else Fw || vT();
      Q.swimming ? ((Mw = 6.8), lT(), cC.focus({ preventScroll: !0 })) : uT();
    }
  }
}
function fT() {
  if (!OC || cT() || QC || $?.active || Dw.active) return;
  if (gC.active) {
    (gC.action(), uT());
    return;
  }
  let e = { aboard: Tw.active, size: Mw, angle: Pw };
  if (!gC.start(Q.mode, Q.state, CC)) {
    let e = uS(Q.mode, Q.state, CC);
    e === `slow`
      ? lw(`Let the boat settle before casting.`)
      : e === `water` && lw(`Find a little open water beside the boat.`);
    return;
  }
  ((SC = e),
    _T(),
    Xw(!1),
    vT(),
    (CC.speed = CC.turnRate = CC.acceleration = 0),
    TC.reset(),
    (wC = { ...CC }),
    tT(!1, { announce: !1 }),
    (Mw = 6));
  let t = gC.setting === `chair` ? -0.93 : CC.heading + 0.4;
  ((Pw = Nw + Math.atan2(Math.sin(t - Nw), Math.cos(t - Nw))),
    lT(),
    cC.focus({ preventScroll: !0 }));
}
function pT(e, t) {
  let n = !Z(e + `-panel`).hidden;
  if (
    ((Z(e + `-panel`).hidden = !t),
    Z(e + `-button`).setAttribute(`aria-expanded`, String(t)),
    t)
  ) {
    for (let t of oC)
      t !== e &&
        ((Z(t + `-panel`).hidden = !0),
        Z(t + `-button`).setAttribute(`aria-expanded`, `false`));
    (e === `map` && Yw(),
      _T(),
      Z(e + `-panel`)
        .querySelector(`[data-close]`)
        .focus({ preventScroll: !0 }));
  } else n && Z(e + `-button`).focus({ preventScroll: !0 });
}
Z(`begin`).addEventListener(`click`, oT);
function mT() {
  let e = rw.on;
  (Z(`sound`).setAttribute(`aria-pressed`, String(e)),
    Z(`sound`).setAttribute(`aria-busy`, String(e && !rw.layers)),
    (Z(`sound`).querySelector(`span`).textContent = e
      ? `Sound on`
      : `Sound off`),
    (Z(`sound`).title = e ? `Turn ambient sound off` : `Turn ambient sound on`),
    Z(`sound`).setAttribute(`aria-label`, Z(`sound`).title),
    (Z(`volume-note`).textContent = e
      ? `Water, birds and the sounds around you.`
      : `Use Sound above to listen.`));
}
async function hT() {
  try {
    let e = rw.toggle();
    (mT(), (aC.sound = await e), mf(aC));
  } catch {
    lw(`Sound could not load. You can try the Sound button again.`);
  } finally {
    mT();
  }
}
(Z(`sound`).addEventListener(`click`, hT),
  Z(`drift`).addEventListener(`click`, () => Xw(!kC)),
  Z(`view-button`).addEventListener(`click`, iT),
  Z(`interact`).addEventListener(`click`, dT),
  Z(`fish`).addEventListener(`click`, fT),
  Z(`look-ahead`).addEventListener(`click`, () => {
    ((hC.active ? hC : $?.active ? $ : Tw).recenter(),
      cC.focus({ preventScroll: !0 }));
  }),
  Z(`map-button`).addEventListener(`click`, () =>
    pT(`map`, Z(`map-panel`).hidden),
  ),
  Z(`help-button`).addEventListener(`click`, () =>
    pT(`help`, Z(`help-panel`).hidden),
  ),
  Z(`settings-button`).addEventListener(`click`, () =>
    pT(`settings`, Z(`settings-panel`).hidden),
  ),
  document
    .querySelectorAll(`[data-close]`)
    .forEach((e) => e.addEventListener(`click`, () => pT(e.dataset.close, !1))),
  Z(`return`).addEventListener(`click`, () => {
    (sT(), pT(`map`, !1));
  }),
  Z(`home-link`).addEventListener(`click`, (e) => {
    (e.preventDefault(), OC && sT());
  }),
  (Z(`quality`).value = aC.quality),
  (Z(`volume`).value = String(Math.round(aC.volume * 100))),
  (Z(`volume-value`).textContent = Z(`volume`).value + `%`),
  Z(`volume`).addEventListener(`input`, () => {
    ((aC.volume = Number(Z(`volume`).value) / 100),
      rw.setVolume(aC.volume),
      mf(aC),
      (Z(`volume-value`).textContent = Z(`volume`).value + `%`));
  }),
  Z(`quality`).addEventListener(`change`, () => {
    jC = Z(`quality`).value === `balanced`;
    let e = jC ? 1536 : 2048;
    (hw.shadow.mapSize.set(e, e),
      hw.shadow.map?.setSize(e, e),
      dw.setLow(jC),
      Vw(),
      NC?.setLow(jC),
      PC?.setLow(jC),
      eE(),
      (aC.quality = jC ? `balanced` : `high`),
      mf(aC),
      lw(jC ? `A lighter touch.` : `All the little details.`));
  }));
var gT = new Set([
  `KeyW`,
  `KeyA`,
  `KeyS`,
  `KeyD`,
  `ArrowUp`,
  `ArrowDown`,
  `ArrowLeft`,
  `ArrowRight`,
  `Space`,
]);
(window.addEventListener(`keydown`, (e) => {
  if (e.code === `Escape`) {
    for (let e of oC) pT(e, !1);
    _T();
    return;
  }
  if (
    !(
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.target.closest?.(`input,select,textarea,[contenteditable=true]`)
    ) &&
    OC &&
    !cT()
  ) {
    if (e.code === `KeyV`) {
      (e.preventDefault(), e.repeat || iT());
      return;
    }
    if (Dw.active) {
      if (e.shiftKey && e.code.startsWith(`Arrow`)) {
        (e.preventDefault(),
          Dw.orbit(
            e.code === `ArrowLeft` ? 0.06 : e.code === `ArrowRight` ? -0.06 : 0,
            e.code === `ArrowUp` ? 0.06 : e.code === `ArrowDown` ? -0.06 : 0,
          ));
        return;
      }
      if (e.code === `PageUp` || e.code === `PageDown`) {
        (e.preventDefault(), Dw.zoom(e.code === `PageUp` ? 1.12 : 1 / 1.12));
        return;
      }
      gT.has(e.code) && (e.preventDefault(), VC.add(e.code));
      return;
    }
    if (e.code === `KeyE`) {
      (e.preventDefault(), e.repeat || dT());
      return;
    }
    if (e.code === `KeyF`) {
      (e.preventDefault(), e.repeat || fT());
      return;
    }
    if ((gC.active || $?.resting || hC.active) && gT.has(e.code)) {
      e.preventDefault();
      return;
    }
    if (OC && Tw.active && e.code === `KeyR`) {
      (e.preventDefault(), Tw.recenter());
      return;
    }
    if (OC && hC.active && e.code === `KeyR`) {
      (e.preventDefault(), hC.recenter());
      return;
    }
    if (OC && $?.active && e.code === `KeyR`) {
      (e.preventDefault(), $.recenter());
      return;
    }
    OC &&
      gT.has(e.code) &&
      ((e.target instanceof HTMLButtonElement && e.code === `Space`) ||
        (e.preventDefault(), VC.add(e.code), vT(), (UC = null), kC && Xw(!1)));
  }
}),
  window.addEventListener(`keyup`, (e) => VC.delete(e.code)));
function _T() {
  (VC.clear(),
    HC.clear(),
    (UC = null),
    (WC = null),
    (GC = null),
    document
      .querySelectorAll(`[data-drive].pressed`)
      .forEach((e) => e.classList.remove(`pressed`)));
}
function vT() {
  ((jT = null),
    MT && (MT.textContent = `Walk bridge route`),
    (zT = `live`),
    (VT = !1),
    (HT = !1),
    Z(`boat-water-motion`) && (Z(`boat-water-motion`).value = `live`),
    Fw &&
      ((Mw = Q.swimming ? 6.8 : Q.mode === `foot` ? 9.5 : 20),
      Q.mode === `foot` && (Pw = Q.state.x < -17.25 ? 1 : 0.37)),
    (Fw = null),
    (QC = !1),
    Z(`keeper-motion`) && (Z(`keeper-motion`).value = `player`),
    (AT = null),
    Z(`tiller-pose`) && (Z(`tiller-pose`).value = `live`));
}
for (let e of document.querySelectorAll(`[data-drive]`)) {
  e.addEventListener(`pointerdown`, (t) => {
    !OC ||
      cT() ||
      Dw.active ||
      gC.active ||
      $?.resting ||
      hC.active ||
      t.button !== 0 ||
      (t.preventDefault(),
      e.setPointerCapture(t.pointerId),
      HC.set(t.pointerId, e.dataset.drive),
      e.classList.add(`pressed`),
      vT(),
      kC && Xw(!1));
  });
  let t = (t) => {
    (HC.delete(t.pointerId), e.classList.remove(`pressed`));
  };
  for (let n of [`pointerup`, `pointercancel`, `lostpointercapture`])
    e.addEventListener(n, t);
}
(window.addEventListener(`blur`, _T),
  document.addEventListener(`visibilitychange`, () => {
    ((AC = document.hidden),
      _T(),
      AC
        ? rw.pause()
        : ((qC = performance.now()), DC.reset(), TC.reset(), rw.resume()));
  }),
  window.addEventListener(`resize`, Vw),
  cC.addEventListener(`contextmenu`, (e) => e.preventDefault()));
function yT(e) {
  (iw.set((e.clientX / innerWidth) * 2 - 1, (-e.clientY / innerHeight) * 2 + 1),
    aw.setFromCamera(iw, Cw),
    (ow.constant = -(Q.mode === `foot` ? Q.state.y : q)),
    aw.ray.intersectPlane(ow, sw) && (UC = { x: sw.x, z: sw.z }));
}
(cC.addEventListener(`pointerdown`, (e) => {
  if (Dw.active) {
    cT() || cC.focus({ preventScroll: !0 });
    return;
  }
  if (!(!OC || cT() || GC)) {
    if (
      (cC.focus({ preventScroll: !0 }),
      cC.setPointerCapture(e.pointerId),
      hC.active)
    ) {
      (e.button === 0 || e.button === 2) &&
        (GC = { id: e.pointerId, x: e.clientX, y: e.clientY, bank: !0 });
      return;
    }
    if ($?.active) {
      (e.button === 0 || e.button === 2) &&
        (GC = { id: e.pointerId, x: e.clientX, y: e.clientY, room: !0 });
      return;
    }
    if (Tw.active) {
      (e.button === 0 || e.button === 2) &&
        (GC = { id: e.pointerId, x: e.clientX, y: e.clientY });
      return;
    }
    if (e.button === 2) {
      WC = { x: e.clientX, angle: Pw };
      return;
    }
    gC.active || (vT(), kC && Xw(!1), yT(e));
  }
}),
  cC.addEventListener(`pointermove`, (e) => {
    if (GC) {
      e.pointerId === GC.id &&
        ((GC.bank ? hC : GC.room ? $ : Tw).drag(
          e.clientX - GC.x,
          e.clientY - GC.y,
        ),
        (GC.x = e.clientX),
        (GC.y = e.clientY));
      return;
    }
    if (WC) {
      let t = WC.angle - (e.clientX - WC.x) * 0.004;
      Pw = Q.mode === `foot` ? J(t, -1.25, 1.25) : t;
      return;
    }
    UC && e.buttons && yT(e);
  }));
