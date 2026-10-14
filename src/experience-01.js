// experience-01.js — the experience state machine (begin overlay, modes, transitions, HUD/panels)
// Lines 64108-64609 of readable/assets__index-BogB70q-.pretty.js (cluster experience, statement-aligned).
function Xw(e) {
  ((kC = !!e && playerState.mode === `boat` && !playerState.transitioning && !fishingState.active),
    byId(`drift`).setAttribute(`aria-pressed`, String(kC)),
    (byId(`drift`).querySelector(`span`).textContent = kC
      ? `Take the helm`
      : `Just drift`),
    kC &&
      ((Fw = null),
      (UC = null),
      (Zw = buildBoatRoute(boatState)),
      ($w = Qw),
      lw(`A gentle way around. Steer whenever you like.`)));
}
var Zw,
  Qw = 0,
  $w = 0;
function eT(e) {
  ((Fw = null),
    Object.assign(boatState, { ...e, speed: 0, turnRate: 0, acceleration: 0 }),
    TC.reset(),
    EC.reset(),
    NC?.resetWake(),
    (wC = { ...boatState }),
    Tw.recenter({ instant: !0 }));
}
function tT(e, { instant: t = !1, announce: n = !0 } = {}) {
  worldReady &&
    (experienceStarted || oT(),
    Dw.leave(Cw, { instant: t, inside: $?.active }),
    (e = !!e && playerState.mode === `boat` && !fishingState.active),
    _T(),
    (Fw = null),
    Tw.recenter({ instant: !0 }),
    Tw.setActive(e, { instant: t }),
    (byId(`look-ahead`).hidden = !e),
    (byId(`boat-controls`).hidden = !e),
    (byId(`pointer-hint`).textContent = e
      ? `drag to look · V to change view`
      : `or hold on the water`),
    (byId(`view-help`).innerHTML = e
      ? `Drag to look around. Press R to look ahead.<br>WASD steers the boat; on touch screens, hold the arrow buttons. Just drift takes you around the lake.`
      : `Or press and hold on the water to steer.<br>Scroll to move closer. Drag with the right mouse button to look around.`),
    canvasEl.setAttribute(
      `aria-label`,
      e
        ? `View from inside the boat. W or up arrow moves forward. A and D turn. S reverses. Space brakes. Drag to look around, R looks ahead, and V switches to Explore.`
        : `Explore by boat. W or up arrow moves forward. A and D or left and right arrows turn. S reverses. Space slows down. Hold on the water to steer. V switches to the Keeper’s view.`,
    ),
    canvasEl.focus({ preventScroll: !0 }),
    lT(),
    n &&
      lw(
        e
          ? coarsePointer.matches
            ? `Aboard. Drag to look around; tap Look ahead to recenter.`
            : `Aboard. Drag to look around; R looks ahead.`
          : `A little perspective.`,
      ));
}
function nT() {
  return {
    aboard: playerState.mode === `boat`,
    fishing: fishingState.active,
    immersive: !!($?.active || hC.active),
  };
}
function rT() {
  return Dw.active
    ? `explore`
    : Tw.active || nT().immersive
      ? `keeper`
      : `follow`;
}
function iT() {
  if (!worldReady || cT()) return;
  experienceStarted || oT();
  let e = rT(),
    t = U_(e, nT());
  (t === `explore`
    ? (Dw.enter(Cw, ww, zw, { immersive: e === `keeper`, inside: $?.active }),
      _T(),
      Xw(!1),
      vT(),
      Tw.setActive(!1, { instant: !0 }),
      (boatState.speed = boatState.turnRate = boatState.acceleration = 0),
      TC.reset(),
      (wC = { ...boatState }),
      lw(
        coarsePointer.matches
          ? `Explore. One finger orbits, two fingers pan; pinch to zoom. Tap the view button to return.`
          : `Explore. Drag to pan, right-drag to orbit, scroll to zoom. V returns to the Keeper.`,
      ))
    : (Dw.leave(Cw, { inside: $?.active }),
      nT().immersive || tT(t === `keeper`, { announce: !1 }),
      _T(),
      lw(t === `keeper` ? `Keeper’s view.` : `Following the Keeper.`)),
    lT(),
    canvasEl.focus({ preventScroll: !0 }));
}
function aT() {
  let e = rT(),
    t = e === `explore`,
    n = U_(e, nT()),
    r = { follow: `Follow`, keeper: `Keeper’s view`, explore: `Explore` },
    i = byId(`view-button`);
  ((i.disabled =
    !worldReady ||
    playerState.transitioning ||
    fishingState.transitioning ||
    $?.transitioning ||
    hC.transitioning),
    i.removeAttribute(`aria-pressed`),
    (i.querySelector(`span`).textContent = r[e]),
    i.setAttribute(`aria-label`, `View: ${r[e]}. Switch to ${r[n]} (V)`),
    (i.title = `Switch to ${r[n]} (V)`),
    (document.documentElement.dataset.view = t
      ? `explore`
      : Tw.active
        ? `boat`
        : `overhead`),
    (document.documentElement.dataset.camera = e),
    byId(`experience`).classList.toggle(`free-view`, t),
    byId(`experience`).classList.toggle(`aboard`, e === `keeper`),
    (byId(`look-ahead`).hidden = t || !(Tw.active || $?.active || hC.active)),
    (byId(`forward-help`).textContent = t ? `Pan forward` : `Forward`));
  for (let e of document.querySelectorAll(`[data-keeper-control]`))
    e.hidden = t;
  for (let e of document.querySelectorAll(`[data-explore-control]`))
    e.hidden = !t;
  (t &&
    ((byId(`boat-controls`).hidden = !0),
    (byId(`drift`).hidden = !0),
    (byId(`interact`).hidden = !0),
    (byId(`fish`).hidden = !0),
    (byId(`move-hint`).textContent = `to pan`),
    (byId(`pointer-hint`).textContent =
      `right-drag to orbit · scroll to zoom · V to return`),
    (byId(`turn-help`).textContent = `Pan left / right`),
    (byId(`reverse-help`).textContent = `Pan back`),
    (byId(`view-help`).textContent =
      `Drag to pan. Right-drag to orbit and tilt; scroll to zoom. Double-click a surface to focus. On touch screens, one finger orbits; two fingers pan and pinch to zoom. The Keeper waits while you explore.`),
    canvasEl.setAttribute(
      `aria-label`,
      `Explore the island camera. Drag to pan, right-drag to orbit and tilt, scroll to zoom. Double-click to focus. WASD or arrows pan; Shift and arrows orbit; Page Up and Down zoom. V returns to the Keeper.`,
    )),
    (byId(`touch-help`).textContent = t
      ? `One finger orbits the island. Two fingers pan; pinch to zoom. Tap the view button to return to the Keeper.`
      : fishingState.active
        ? `Tap Cast the line, watch the float, then tap Reel in. The other action button finishes fishing. Switch to Explore to orbit or pinch to zoom.`
        : $?.active || hC.active
          ? `Drag to look around. Hold the arrow buttons to walk. Tap the action button to open doors, sit or stand. The map can always return you to the landing.`
          : playerState.mode === `boat`
            ? `Hold the arrow buttons to steer; the middle button stops. Just drift follows the pond. In Keeper’s view, drag to look around. Switch to Explore to orbit or pinch to zoom.`
            : playerState.mode === `swim`
              ? `Tap the water or hold the arrow buttons to swim. The middle button stops. Return to the wooden ladder and tap Climb onto the landing.`
              : `Tap a path or hold the arrow buttons to walk. Tap the action button near the boat, mill door, bench or swim ladder. Switch to Explore to orbit or pinch to zoom.`));
}
function oT(e) {
  worldReady &&
    !experienceStarted &&
    ((experienceStarted = !0),
    byId(`experience`).classList.add(`exploring`),
    byId(`welcome`).classList.add(`leaving`),
    setTimeout(() => {
      byId(`welcome`).hidden = !0;
    }, 950),
    (byId(`hud`).hidden = !1),
    (Mw = 9.5),
    lT(),
    canvasEl.focus({ preventScroll: !0 }),
    e?.isTrusted && preferences.sound && !rw.on && hT());
}
function sT() {
  (fishingState.reset(),
    _C?.reset(),
    (SC = null),
    $?.reset(),
    hC.reset(),
    BC?.reset(),
    playerState.reset(),
    eT(dockSpec.boat),
    _T(),
    Xw(!1),
    vT(),
    tT(!1, { announce: !1 }),
    (Pw = Nw + Math.atan2(Math.sin(0.37 - Nw), Math.cos(0.37 - Nw))),
    (Mw = 9.5),
    byId(`keeper-motion`) && (byId(`keeper-motion`).value = `player`),
    lw(`Back at the old landing.`),
    Yw());
}
function cT() {
  return (
    loading ||
    wT ||
    playerState.transitioning ||
    fishingState.transitioning ||
    $?.transitioning ||
    hC.transitioning ||
    anyPanelOpen()
  );
}
function lT() {
  let e = playerState.mode === `foot`,
    t = playerState.swimming;
  (byId(`experience`).classList.toggle(`on-foot`, e || t),
    (byId(`look-ahead`).hidden = !(Tw.active || $?.active || hC.active)),
    (document.documentElement.dataset.control = playerState.mode));
  let n = fishingState.active;
  (byId(`experience`).classList.toggle(`fishing`, n),
    (byId(`drift`).hidden = e || t || n || playerState.transitioning),
    (byId(`boat-controls`).hidden = n || playerState.transitioning),
    (byId(`move-hint`).textContent = t ? `to swim` : e ? `to walk` : `to steer`),
    (byId(`turn-help`).textContent = t
      ? `Swim left / right`
      : e
        ? `Walk left / right`
        : `Turn the boat`),
    (byId(`reverse-help`).textContent = t
      ? `Swim back`
      : e
        ? `Walk back`
        : `Reverse`));
  for (let [n, r] of [
    [`KeyA`, t ? `Swim left` : e ? `Walk left` : `Turn left`],
    [`KeyD`, t ? `Swim right` : e ? `Walk right` : `Turn right`],
    [`KeyS`, t ? `Swim back` : e ? `Walk back` : `Reverse`],
    [`KeyW`, t ? `Swim forward` : e ? `Walk forward` : `Forward`],
    [`Space`, t ? `Stop and float` : `Stop`],
  ])
    document.querySelector(`[data-drive="${n}"]`).setAttribute(`aria-label`, r);
  (byId(`boat-controls`).setAttribute(
    `aria-label`,
    t ? `Swimming controls` : e ? `Keeper movement` : `Boat steering`,
  ),
    e &&
      ((byId(`pointer-hint`).textContent = `or hold on the path`),
      (byId(`view-help`).textContent =
        `WASD or arrows walk relative to the camera. Hold on the path to walk there. Right-drag to orbit; scroll to zoom. E interacts with the boat, mill doors, bench, or swim ladder. E beside the porch winch opens or closes the sluice.`),
      canvasEl.setAttribute(
        `aria-label`,
        `Explore as the mill keeper. WASD or arrows walk. Hold on the dock or bridge to walk there. E boards the boat, enters the mill, or operates the porch sluice winch. Right-drag to orbit.`,
      )),
    t &&
      ((byId(`pointer-hint`).textContent =
        `or click on the water · E near the ladder to climb out`),
      (byId(`view-help`).textContent =
        `WASD or arrows swim relative to the camera. Click or tap on the water to swim there. Release the movement keys to float; Space stops. Return to the wooden ladder and press E to climb out. Right-drag to orbit, scroll to zoom, V to explore.`),
      canvasEl.setAttribute(
        `aria-label`,
        `Swimming in the pond. WASD or arrows swim. Click the water to swim there. Release movement keys to float, Space stops. E near the ladder climbs out. Right-drag to orbit.`,
      )),
    n &&
      (canvasEl.setAttribute(
        `aria-label`,
        `Fishing. F casts or reels in. E stands up or returns to the helm. Scroll to zoom and right-drag to orbit.`,
      ),
      (byId(`view-help`).textContent =
        `F casts the line. Watch the float, then press F to reel in. E finishes fishing. Scroll to zoom and right-drag to look around.`)),
    e &&
      $?.active &&
      ((byId(`pointer-hint`).textContent = `drag to look · E to interact`),
      (byId(`view-help`).textContent =
        `WASD or arrows walk in the direction you are looking. Drag to look around. The left passage leads to the bridge; the right stairs lead to the room. E opens doors or sits by the upstairs window. Press E again to stand.`),
      canvasEl.setAttribute(
        `aria-label`,
        `Inside the mill. WASD or arrows walk. Drag to look. E opens the door, sits by the upstairs window, or stands up.`,
      )),
    e &&
      hC.active &&
      ((byId(`pointer-hint`).textContent = `drag to look · E to stand`),
      (byId(`view-help`).textContent =
        `Drag to look across the pond. R looks ahead. Press E to stand up and return along the path.`),
      canvasEl.setAttribute(
        `aria-label`,
        `Resting on the bank bench. Drag to look across the pond. R looks ahead. E stands up.`,
      )),
    uT(),
    aT());
}
function uT() {
  let e = playerState.mode === `foot` && !fishingState.active ? $?.action(playerState.state) : null,
    t = playerState.mode === `foot` && !fishingState.active ? hC.action(playerState.state) : null,
    n = !fishingState.active && PC?.sluice ? bg(playerState.state, playerState.mode, PC.power.state) : null,
    r = t || e || n || CS(playerState.mode, playerState.state, boatState) || Wx(playerState.mode, playerState.state),
    i = byId(`interact`),
    a = uS(playerState.mode, playerState.state, boatState),
    o = byId(`fish`),
    s = fishingState.active,
    c = fishingState.phase,
    l = $?.transitioning || hC.transitioning,
    u = `${experienceStarted}/${playerState.mode}/${r}/${playerState.transitioning}/${playerState.swimPhase}/${QC}/${a}/${c}/${fishingState.transitioning}/${$?.active}/${$?.entering}/${$?.seat.phase}/${hC.seat.phase}/${Dw.active}`;
  u !== $C &&
    (($C = u),
    (i.hidden =
      !experienceStarted || (s && fishingState.transitioning) || (!s && !l && !playerState.transitioning && !r)),
    (i.disabled =
      playerState.transitioning ||
      fishingState.transitioning ||
      l ||
      QC ||
      (!s &&
        ![
          `swim`,
          `climb`,
          `board`,
          `leave`,
          `enter`,
          `open`,
          `close`,
          `sit`,
          `stand`,
          `sit-bank`,
          `open-side`,
          `close-side`,
          `enter-side`,
          `open-sluice`,
          `close-sluice`,
        ].includes(r))),
    (i.querySelector(`span`).textContent = $?.entering
      ? `Entering the mill…`
      : l
        ? (hC.transitioning ? hC.seat.phase : $.seat.phase) === `sitting`
          ? `Taking a seat…`
          : `Standing up…`
        : t
          ? t === `sit-bank`
            ? `Sit by the pond`
            : `Stand up`
          : e
            ? {
                enter: `Enter the mill`,
                open: `Open the door`,
                close: `Close the door`,
                "open-side": `Open the bridge door`,
                "close-side": `Close the bridge door`,
                "enter-side": `Enter the mill`,
                sit: `Sit by the window`,
                stand: `Stand up`,
              }[e]
            : playerState.boarding
              ? `Boarding…`
              : playerState.leaving
                ? `Going ashore…`
                : playerState.transitioning || fishingState.transitioning
                  ? `One moment…`
                  : s
                    ? fishingState.setting === `chair`
                      ? `Stand up`
                      : `Return to the helm`
                    : r === `board`
                      ? `Board the boat`
                      : r === `leave`
                        ? `Leave the boat`
                        : r === `slow`
                          ? `Slow down to dock`
                          : r === `align`
                            ? `Face along the dock`
                            : `Return to the dock to go ashore`),
    playerState.swimming && playerState.transitioning
      ? (i.querySelector(`span`).textContent = [`return`, `exiting`].includes(
          playerState.swimPhase,
        )
          ? `Climbing out…`
          : `Entering the water…`)
      : r === `swim`
        ? (i.querySelector(`span`).textContent = `Go for a swim`)
        : r === `climb`
          ? (i.querySelector(`span`).textContent = `Climb onto the landing`)
          : n &&
            !e &&
            !t &&
            (i.querySelector(`span`).textContent =
              n === `close-sluice` ? `Close the sluice` : `Open the sluice`),
    (o.hidden =
      !experienceStarted ||
      QC ||
      playerState.transitioning ||
      playerState.swimming ||
      $?.active ||
      $?.entering ||
      (!s && ![`chair`, `boat`].includes(a))),
    (o.disabled =
      playerState.transitioning ||
      fishingState.transitioning ||
      (s ? ![`ready`, `waiting`].includes(c) : ![`chair`, `boat`].includes(a))),
    (o.querySelector(`span`).textContent = s
      ? {
          approaching: `Walking to the chair…`,
          aligning: `Turning to sit…`,
          pickup: `Taking the rod…`,
          putdown: `Putting the rod away…`,
          entering: `Taking a seat…`,
          sitting: `Sitting down…`,
          ready: `Cast the line`,
          casting: `Casting…`,
          waiting: `Reel in`,
          reeling: `Reeling in…`,
          stowing: `Lifting the float…`,
          standing: `Standing up…`,
          leaving: `Putting the rod away…`,
        }[c]
      : ({
          chair: `Fish from the chair`,
          boat: `Fish from the boat`,
          slow: `Stop the boat to fish`,
          water: `Find open water beside the boat`,
        }[a] ?? `Fish`)),
    (document.documentElement.dataset.fishing = s
      ? `${fishingState.setting}:${c}`
      : `off`),
    (document.documentElement.dataset.mill = $?.entering
      ? `entering`
      : $?.active
        ? $.resting
          ? $.seat.phase
          : `walking`
        : `outside`),
    (document.documentElement.dataset.bank = hC.seat.phase),
    byId(`experience`).classList.toggle(`resting`, !!($?.resting || hC.active)),
    aT());
  let d = reducedMotion ? `0` : Math.max(playerState.fade, fishingState.fade).toFixed(3);
  d !== ew && ((ew = d), (byId(`transition`).style.opacity = d));
}
function dT() {
  if (!(!experienceStarted || cT() || QC || Dw.active)) {
    if (fishingState.active) {
      fishingState.leave() && _T();
      return;
    }
    if (playerState.mode === `foot` && hC.interact(playerState.state)) {
      (_T(), vT(), lT(), canvasEl.focus({ preventScroll: !0 }));
      return;
    }
    if (playerState.mode === `foot` && $?.interact(playerState.state)) {
      (_T(), vT(), lT(), canvasEl.focus({ preventScroll: !0 }));
      return;
    }
    if (PC?.sluice && bg(playerState.state, playerState.mode, PC.power.state)) {
      let e = PC.power.toggle();
      (_T(),
        vT(),
        lw(e ? `The sluice is opening.` : `The sluice is closing.`),
        uT(),
        canvasEl.focus({ preventScroll: !0 }));
      return;
    }
    if (playerState.interact(boatState)) {
      if ((_T(), Xw(!1), playerState.leaving)) {
        let e = Fw;
        (tT(!1, { announce: !1 }), (Fw = e), e || (Mw = 9.5));
      } else Fw || vT();
      playerState.swimming ? ((Mw = 6.8), lT(), canvasEl.focus({ preventScroll: !0 })) : uT();
    }
  }
}
function fT() {
  if (!experienceStarted || cT() || QC || $?.active || Dw.active) return;
  if (fishingState.active) {
    (fishingState.action(), uT());
    return;
  }
  let e = { aboard: Tw.active, size: Mw, angle: Pw };
  if (!fishingState.start(playerState.mode, playerState.state, boatState)) {
    let e = uS(playerState.mode, playerState.state, boatState);
    e === `slow`
      ? lw(`Let the boat settle before casting.`)
      : e === `water` && lw(`Find a little open water beside the boat.`);
    return;
  }
  ((SC = e),
    _T(),
    Xw(!1),
    vT(),
    (boatState.speed = boatState.turnRate = boatState.acceleration = 0),
    TC.reset(),
    (wC = { ...boatState }),
    tT(!1, { announce: !1 }),
    (Mw = 6));
  let t = fishingState.setting === `chair` ? -0.93 : boatState.heading + 0.4;
  ((Pw = Nw + Math.atan2(Math.sin(t - Nw), Math.cos(t - Nw))),
    lT(),
    canvasEl.focus({ preventScroll: !0 }));
}
function pT(e, t) {
  let n = !byId(e + `-panel`).hidden;
  if (
    ((byId(e + `-panel`).hidden = !t),
    byId(e + `-button`).setAttribute(`aria-expanded`, String(t)),
    t)
  ) {
    for (let t of panelIds)
      t !== e &&
        ((byId(t + `-panel`).hidden = !0),
        byId(t + `-button`).setAttribute(`aria-expanded`, `false`));
    (e === `map` && Yw(),
      _T(),
      byId(e + `-panel`)
        .querySelector(`[data-close]`)
        .focus({ preventScroll: !0 }));
  } else n && byId(e + `-button`).focus({ preventScroll: !0 });
}
