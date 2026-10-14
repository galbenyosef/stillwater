// input-01.js — input: the keyboard map, pointer/wheel/drag handling and the drive buttons
// Lines 64610-65072 of readable/assets__index-BogB70q-.pretty.js (cluster input, statement-aligned).
byId(`begin`).addEventListener(`click`, oT);
function mT() {
  let e = rw.on;
  (byId(`sound`).setAttribute(`aria-pressed`, String(e)),
    byId(`sound`).setAttribute(`aria-busy`, String(e && !rw.layers)),
    (byId(`sound`).querySelector(`span`).textContent = e
      ? `Sound on`
      : `Sound off`),
    (byId(`sound`).title = e ? `Turn ambient sound off` : `Turn ambient sound on`),
    byId(`sound`).setAttribute(`aria-label`, byId(`sound`).title),
    (byId(`volume-note`).textContent = e
      ? `Water, birds and the sounds around you.`
      : `Use Sound above to listen.`));
}
async function hT() {
  try {
    let e = rw.toggle();
    (mT(), (preferences.sound = await e), savePreferences(preferences));
  } catch {
    lw(`Sound could not load. You can try the Sound button again.`);
  } finally {
    mT();
  }
}
(byId(`sound`).addEventListener(`click`, hT),
  byId(`drift`).addEventListener(`click`, () => Xw(!kC)),
  byId(`view-button`).addEventListener(`click`, iT),
  byId(`interact`).addEventListener(`click`, dT),
  byId(`fish`).addEventListener(`click`, fT),
  byId(`look-ahead`).addEventListener(`click`, () => {
    ((hC.active ? hC : $?.active ? $ : Tw).recenter(),
      canvasEl.focus({ preventScroll: !0 }));
  }),
  byId(`map-button`).addEventListener(`click`, () =>
    pT(`map`, byId(`map-panel`).hidden),
  ),
  byId(`help-button`).addEventListener(`click`, () =>
    pT(`help`, byId(`help-panel`).hidden),
  ),
  byId(`settings-button`).addEventListener(`click`, () =>
    pT(`settings`, byId(`settings-panel`).hidden),
  ),
  document
    .querySelectorAll(`[data-close]`)
    .forEach((e) => e.addEventListener(`click`, () => pT(e.dataset.close, !1))),
  byId(`return`).addEventListener(`click`, () => {
    (sT(), pT(`map`, !1));
  }),
  byId(`home-link`).addEventListener(`click`, (e) => {
    (e.preventDefault(), experienceStarted && sT());
  }),
  (byId(`quality`).value = preferences.quality),
  (byId(`volume`).value = String(Math.round(preferences.volume * 100))),
  (byId(`volume-value`).textContent = byId(`volume`).value + `%`),
  byId(`volume`).addEventListener(`input`, () => {
    ((preferences.volume = Number(byId(`volume`).value) / 100),
      rw.setVolume(preferences.volume),
      savePreferences(preferences),
      (byId(`volume-value`).textContent = byId(`volume`).value + `%`));
  }),
  byId(`quality`).addEventListener(`change`, () => {
    balancedQuality = byId(`quality`).value === `balanced`;
    let e = balancedQuality ? 1536 : 2048;
    (hw.shadow.mapSize.set(e, e),
      hw.shadow.map?.setSize(e, e),
      dw.setLow(balancedQuality),
      Vw(),
      NC?.setLow(balancedQuality),
      PC?.setLow(balancedQuality),
      eE(),
      (preferences.quality = balancedQuality ? `balanced` : `high`),
      savePreferences(preferences),
      lw(balancedQuality ? `A lighter touch.` : `All the little details.`));
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
    for (let e of panelIds) pT(e, !1);
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
    experienceStarted &&
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
    if ((fishingState.active || $?.resting || hC.active) && gT.has(e.code)) {
      e.preventDefault();
      return;
    }
    if (experienceStarted && Tw.active && e.code === `KeyR`) {
      (e.preventDefault(), Tw.recenter());
      return;
    }
    if (experienceStarted && hC.active && e.code === `KeyR`) {
      (e.preventDefault(), hC.recenter());
      return;
    }
    if (experienceStarted && $?.active && e.code === `KeyR`) {
      (e.preventDefault(), $.recenter());
      return;
    }
    experienceStarted &&
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
    byId(`boat-water-motion`) && (byId(`boat-water-motion`).value = `live`),
    Fw &&
      ((Mw = playerState.swimming ? 6.8 : playerState.mode === `foot` ? 9.5 : 20),
      playerState.mode === `foot` && (Pw = playerState.state.x < -17.25 ? 1 : 0.37)),
    (Fw = null),
    (QC = !1),
    byId(`keeper-motion`) && (byId(`keeper-motion`).value = `player`),
    (AT = null),
    byId(`tiller-pose`) && (byId(`tiller-pose`).value = `live`));
}
for (let e of document.querySelectorAll(`[data-drive]`)) {
  e.addEventListener(`pointerdown`, (t) => {
    !experienceStarted ||
      cT() ||
      Dw.active ||
      fishingState.active ||
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
    ((loading = document.hidden),
      _T(),
      loading
        ? rw.pause()
        : ((qC = performance.now()), DC.reset(), TC.reset(), rw.resume()));
  }),
  window.addEventListener(`resize`, Vw),
  canvasEl.addEventListener(`contextmenu`, (e) => e.preventDefault()));
function yT(e) {
  (iw.set((e.clientX / innerWidth) * 2 - 1, (-e.clientY / innerHeight) * 2 + 1),
    aw.setFromCamera(iw, Cw),
    (ow.constant = -(playerState.mode === `foot` ? playerState.state.y : q)),
    aw.ray.intersectPlane(ow, sw) && (UC = { x: sw.x, z: sw.z }));
}
(canvasEl.addEventListener(`pointerdown`, (e) => {
  if (Dw.active) {
    cT() || canvasEl.focus({ preventScroll: !0 });
    return;
  }
  if (!(!experienceStarted || cT() || GC)) {
    if (
      (canvasEl.focus({ preventScroll: !0 }),
      canvasEl.setPointerCapture(e.pointerId),
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
    fishingState.active || (vT(), kC && Xw(!1), yT(e));
  }
}),
  canvasEl.addEventListener(`pointermove`, (e) => {
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
      Pw = playerState.mode === `foot` ? clampValue(t, -1.25, 1.25) : t;
      return;
    }
    UC && e.buttons && yT(e);
  }));
var bT = (e) => {
  (GC && e.pointerId !== GC.id) ||
    ((playerState.mode === `boat` || e.type === `pointercancel` || WC || GC) &&
      (UC = null),
    (WC = null),
    (GC = null));
};
for (let e of [`pointerup`, `pointercancel`, `lostpointercapture`])
  canvasEl.addEventListener(e, bT);
(canvasEl.addEventListener(
  `wheel`,
  (e) => {
    if (
      (e.preventDefault(), !Dw.active && !Tw.active && !$?.active && !hC.active)
    ) {
      let t = playerState.mode !== `boat` || fishingState.active;
      Mw = clampValue(
        Mw + e.deltaY * 0.006,
        t ? 4.8 : 13,
        playerState.mode !== `boat` && !fishingState.active ? 18 : t ? 11 : 29,
      );
    }
  },
  { passive: !1 },
),
  canvasEl.addEventListener(`dblclick`, (e) => {
    if (!Dw.active || cT()) return;
    let t = canvasEl.getBoundingClientRect();
    (kw.set(
      ((e.clientX - t.left) / t.width) * 2 - 1,
      1 - ((e.clientY - t.top) / t.height) * 2,
    ),
      aw.setFromCamera(kw, Cw));
    let n = aw.intersectObjects(Aw, !1)[0];
    n
      ? Dw.focusOn(n.point)
      : aw.ray.intersectPlane(ow.set(new U(0, 1, 0), -0.18), sw) &&
        Dw.focusOn(sw);
  }),
  canvasEl.addEventListener(`webglcontextlost`, (e) => {
    (e.preventDefault(),
      (loading = !0),
      cw(
        Error(
          `The graphics context was interrupted. Refresh to return to the pond.`,
        ),
      ));
  }));
function xT(e) {
  if (!experienceStarted || playerState.mode !== `boat` || fishingState.active || Dw.active || cT()) {
    ((boatState.speed = 0), (boatState.turnRate = 0), (boatState.acceleration = 0));
    return;
  }
  if (
    (kC &&
      zT !== `live` &&
      ((zT = `live`), (byId(`boat-water-motion`).value = `live`)),
    zT !== `live`)
  ) {
    ((BT += e),
      gb(
        boatState,
        {
          throttle: zT === `forward` ? 1 : zT === `reverse` ? -0.55 : 0,
          turn: zT === `left` ? 1 : zT === `right` ? -1 : 0,
          cruise: Xf,
        },
        e,
      ));
    return;
  }
  let t = 0,
    n = 0,
    r = (e) => VC.has(e) || [...HC.values()].includes(e);
  ((r(`KeyW`) || r(`ArrowUp`)) && (t = 1),
    (r(`KeyS`) || r(`ArrowDown`)) && (t = -0.55),
    (r(`KeyA`) || r(`ArrowLeft`)) && (n = 1),
    (r(`KeyD`) || r(`ArrowRight`)) && (n = -1));
  let i = UC;
  (kC && ((i = Zw.target(boatState)), (Qw = $w + Zw.laps)),
    i && ({ turn: n, throttle: t } = hb(boatState, i, { arrive: !kC })),
    gb(
      boatState,
      { turn: n, throttle: t, cruise: kC ? 1.32 : 2.46, brake: r(`Space`) },
      e,
    ) &&
      (kC
        ? (Xw(!1), lw(`A quiet bank. Take the helm to turn away.`))
        : KC - XC > 12 &&
          Math.abs(t) > 0.1 &&
          (lw(`Turn gently away from the bank.`), (XC = KC))));
}
var ST = queryParams.has(`inspect`),
  CT,
  wT = !1,
  TT,
  ET,
  DT,
  OT,
  kT,
  AT = null,
  jT = null,
  MT,
  NT,
  PT = [
    [-3, -0.8, `enter`],
    [-3, -2.1],
    [-5.38, -2.1, null, `Passage entrance`],
    [-5.38, -5.98, `open-side`, `Bridge doorway`],
    [-7.1, -5.98],
    [-7.6, -6.45],
    [-11.65, -6.45, null, `Bridge crown`],
    [-17.55, -6.45, null, `Far bank`],
    ...shorePath.points
      .slice(1)
      .map(([e, t], n, r) => [
        e,
        t,
        null,
        n === r.length - 1 ? `Pond bench` : null,
      ]),
  ],
  FT = [
    [-3, -0.8, `enter`],
    [-3, -2.1],
    [-0.8, -2.1, null, `Room stairs`],
    [-0.8, -6.22],
    [-1.94, -6.22, null, `Upstairs room`],
    [-1.94, -4.15],
    [-1.94, -2.12],
    [Jy.x, Jy.z, null, `Window seat`],
  ],
  IT = [
    [-3, 3.2],
    [-3, 0.6, null, `Straight walk`],
    [-3, 2.15],
    [-2.25, 2.15],
    [-3, 2.15, null, `Walk and turn complete`],
  ],
  LT = [
    ...shorePath.points.slice(0, -1).reverse(),
    [-11.65, -6.45],
    [-7.6, -6.45],
    [-7.22, -5.98, `open-side`, `Return doorway`],
    [-5.38, -5.98],
    [-5.38, -2.1],
    [-3, -2.1, null, `Back in the hall`],
    [-3, -0.8],
    [-3, 2.15, null, `Back at the landing`],
  ];
function RT() {
  if (!jT || jT.paused || hC.active || $.resting) return null;
  let e = jT.route ?? PT,
    [t, n, r, i] = e[jT.index],
    a = t - playerState.state.x,
    o = n - playerState.state.z;
  if (Math.hypot(a, o) < 0.095) {
    if (r === `enter` && !$.passable)
      return ($.open || ($.interact(playerState.state), lT()), { x: t, z: n });
    if (r === `open-side` && !$.bridgePassable)
      return ($.bridgeOpen || $.interact(playerState.state), { x: t, z: n });
    if (
      (jT.index++,
      (jT.looking = !1),
      i &&
        ((jT.paused = !0),
        (NT.textContent = i),
        (MT.textContent = `Continue bridge walk`)),
      i && $.active && e[jT.index])
    ) {
      let [t, n] = e[jT.index],
        r = Math.atan2(
          Math.sin(Math.atan2(playerState.state.x - t, playerState.state.z - n) - $.angle),
          Math.cos(Math.atan2(playerState.state.x - t, playerState.state.z - n) - $.angle),
        );
      $.drag(-r / 0.0032, 0);
    }
    return (
      jT.index === e.length &&
        ((jT = null), (MT.textContent = `Walk bridge route`)),
      null
    );
  }
  if ($.active && !jT.looking) {
    let e = Math.atan2(
      Math.sin(Math.atan2(-a, -o) - $.angle),
      Math.cos(Math.atan2(-a, -o) - $.angle),
    );
    ($.drag(-e / 0.0032, 0), (jT.looking = !0));
  }
  return { x: t, z: n };
}
var zT = `live`,
  BT = 0,
  VT = !1,
  HT = !1,
  UT = { x: 0, z: 9, heading: Math.PI / 2 };
