// assets__index-BogB70q- 71 — textcontent
// Lines 64207-64531 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function aT() {
  let e = rT(),
    t = e === `explore`,
    n = U_(e, nT()),
    r = { follow: `Follow`, keeper: `Keeper’s view`, explore: `Explore` },
    i = Z(`view-button`);
  ((i.disabled =
    !MC ||
    Q.transitioning ||
    gC.transitioning ||
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
    Z(`experience`).classList.toggle(`free-view`, t),
    Z(`experience`).classList.toggle(`aboard`, e === `keeper`),
    (Z(`look-ahead`).hidden = t || !(Tw.active || $?.active || hC.active)),
    (Z(`forward-help`).textContent = t ? `Pan forward` : `Forward`));
  for (let e of document.querySelectorAll(`[data-keeper-control]`))
    e.hidden = t;
  for (let e of document.querySelectorAll(`[data-explore-control]`))
    e.hidden = !t;
  (t &&
    ((Z(`boat-controls`).hidden = !0),
    (Z(`drift`).hidden = !0),
    (Z(`interact`).hidden = !0),
    (Z(`fish`).hidden = !0),
    (Z(`move-hint`).textContent = `to pan`),
    (Z(`pointer-hint`).textContent =
      `right-drag to orbit · scroll to zoom · V to return`),
    (Z(`turn-help`).textContent = `Pan left / right`),
    (Z(`reverse-help`).textContent = `Pan back`),
    (Z(`view-help`).textContent =
      `Drag to pan. Right-drag to orbit and tilt; scroll to zoom. Double-click a surface to focus. On touch screens, one finger orbits; two fingers pan and pinch to zoom. The Keeper waits while you explore.`),
    cC.setAttribute(
      `aria-label`,
      `Explore the island camera. Drag to pan, right-drag to orbit and tilt, scroll to zoom. Double-click to focus. WASD or arrows pan; Shift and arrows orbit; Page Up and Down zoom. V returns to the Keeper.`,
    )),
    (Z(`touch-help`).textContent = t
      ? `One finger orbits the island. Two fingers pan; pinch to zoom. Tap the view button to return to the Keeper.`
      : gC.active
        ? `Tap Cast the line, watch the float, then tap Reel in. The other action button finishes fishing. Switch to Explore to orbit or pinch to zoom.`
        : $?.active || hC.active
          ? `Drag to look around. Hold the arrow buttons to walk. Tap the action button to open doors, sit or stand. The map can always return you to the landing.`
          : Q.mode === `boat`
            ? `Hold the arrow buttons to steer; the middle button stops. Just drift follows the pond. In Keeper’s view, drag to look around. Switch to Explore to orbit or pinch to zoom.`
            : Q.mode === `swim`
              ? `Tap the water or hold the arrow buttons to swim. The middle button stops. Return to the wooden ladder and tap Climb onto the landing.`
              : `Tap a path or hold the arrow buttons to walk. Tap the action button near the boat, mill door, bench or swim ladder. Switch to Explore to orbit or pinch to zoom.`));
}
function oT(e) {
  MC &&
    !OC &&
    ((OC = !0),
    Z(`experience`).classList.add(`exploring`),
    Z(`welcome`).classList.add(`leaving`),
    setTimeout(() => {
      Z(`welcome`).hidden = !0;
    }, 950),
    (Z(`hud`).hidden = !1),
    (Mw = 9.5),
    lT(),
    cC.focus({ preventScroll: !0 }),
    e?.isTrusted && aC.sound && !rw.on && hT());
}
function sT() {
  (gC.reset(),
    _C?.reset(),
    (SC = null),
    $?.reset(),
    hC.reset(),
    BC?.reset(),
    Q.reset(),
    eT(mS.boat),
    _T(),
    Xw(!1),
    vT(),
    tT(!1, { announce: !1 }),
    (Pw = Nw + Math.atan2(Math.sin(0.37 - Nw), Math.cos(0.37 - Nw))),
    (Mw = 9.5),
    Z(`keeper-motion`) && (Z(`keeper-motion`).value = `player`),
    lw(`Back at the old landing.`),
    Yw());
}
function cT() {
  return (
    AC ||
    wT ||
    Q.transitioning ||
    gC.transitioning ||
    $?.transitioning ||
    hC.transitioning ||
    sC()
  );
}
function lT() {
  let e = Q.mode === `foot`,
    t = Q.swimming;
  (Z(`experience`).classList.toggle(`on-foot`, e || t),
    (Z(`look-ahead`).hidden = !(Tw.active || $?.active || hC.active)),
    (document.documentElement.dataset.control = Q.mode));
  let n = gC.active;
  (Z(`experience`).classList.toggle(`fishing`, n),
    (Z(`drift`).hidden = e || t || n || Q.transitioning),
    (Z(`boat-controls`).hidden = n || Q.transitioning),
    (Z(`move-hint`).textContent = t ? `to swim` : e ? `to walk` : `to steer`),
    (Z(`turn-help`).textContent = t
      ? `Swim left / right`
      : e
        ? `Walk left / right`
        : `Turn the boat`),
    (Z(`reverse-help`).textContent = t
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
  (Z(`boat-controls`).setAttribute(
    `aria-label`,
    t ? `Swimming controls` : e ? `Keeper movement` : `Boat steering`,
  ),
    e &&
      ((Z(`pointer-hint`).textContent = `or hold on the path`),
      (Z(`view-help`).textContent =
        `WASD or arrows walk relative to the camera. Hold on the path to walk there. Right-drag to orbit; scroll to zoom. E interacts with the boat, mill doors, bench, or swim ladder. E beside the porch winch opens or closes the sluice.`),
      cC.setAttribute(
        `aria-label`,
        `Explore as the mill keeper. WASD or arrows walk. Hold on the dock or bridge to walk there. E boards the boat, enters the mill, or operates the porch sluice winch. Right-drag to orbit.`,
      )),
    t &&
      ((Z(`pointer-hint`).textContent =
        `or click on the water · E near the ladder to climb out`),
      (Z(`view-help`).textContent =
        `WASD or arrows swim relative to the camera. Click or tap on the water to swim there. Release the movement keys to float; Space stops. Return to the wooden ladder and press E to climb out. Right-drag to orbit, scroll to zoom, V to explore.`),
      cC.setAttribute(
        `aria-label`,
        `Swimming in the pond. WASD or arrows swim. Click the water to swim there. Release movement keys to float, Space stops. E near the ladder climbs out. Right-drag to orbit.`,
      )),
    n &&
      (cC.setAttribute(
        `aria-label`,
        `Fishing. F casts or reels in. E stands up or returns to the helm. Scroll to zoom and right-drag to orbit.`,
      ),
      (Z(`view-help`).textContent =
        `F casts the line. Watch the float, then press F to reel in. E finishes fishing. Scroll to zoom and right-drag to look around.`)),
    e &&
      $?.active &&
      ((Z(`pointer-hint`).textContent = `drag to look · E to interact`),
      (Z(`view-help`).textContent =
        `WASD or arrows walk in the direction you are looking. Drag to look around. The left passage leads to the bridge; the right stairs lead to the room. E opens doors or sits by the upstairs window. Press E again to stand.`),
      cC.setAttribute(
        `aria-label`,
        `Inside the mill. WASD or arrows walk. Drag to look. E opens the door, sits by the upstairs window, or stands up.`,
      )),
    e &&
      hC.active &&
      ((Z(`pointer-hint`).textContent = `drag to look · E to stand`),
      (Z(`view-help`).textContent =
        `Drag to look across the pond. R looks ahead. Press E to stand up and return along the path.`),
      cC.setAttribute(
        `aria-label`,
        `Resting on the bank bench. Drag to look across the pond. R looks ahead. E stands up.`,
      )),
    uT(),
    aT());
}
function uT() {
  let e = Q.mode === `foot` && !gC.active ? $?.action(Q.state) : null,
    t = Q.mode === `foot` && !gC.active ? hC.action(Q.state) : null,
    n = !gC.active && PC?.sluice ? bg(Q.state, Q.mode, PC.power.state) : null,
    r = t || e || n || CS(Q.mode, Q.state, CC) || Wx(Q.mode, Q.state),
    i = Z(`interact`),
    a = uS(Q.mode, Q.state, CC),
    o = Z(`fish`),
    s = gC.active,
    c = gC.phase,
    l = $?.transitioning || hC.transitioning,
    u = `${OC}/${Q.mode}/${r}/${Q.transitioning}/${Q.swimPhase}/${QC}/${a}/${c}/${gC.transitioning}/${$?.active}/${$?.entering}/${$?.seat.phase}/${hC.seat.phase}/${Dw.active}`;
  u !== $C &&
    (($C = u),
    (i.hidden =
      !OC || (s && gC.transitioning) || (!s && !l && !Q.transitioning && !r)),
    (i.disabled =
      Q.transitioning ||
      gC.transitioning ||
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
            : Q.boarding
              ? `Boarding…`
              : Q.leaving
                ? `Going ashore…`
                : Q.transitioning || gC.transitioning
                  ? `One moment…`
                  : s
                    ? gC.setting === `chair`
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
    Q.swimming && Q.transitioning
      ? (i.querySelector(`span`).textContent = [`return`, `exiting`].includes(
          Q.swimPhase,
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
      !OC ||
      QC ||
      Q.transitioning ||
      Q.swimming ||
      $?.active ||
      $?.entering ||
      (!s && ![`chair`, `boat`].includes(a))),
    (o.disabled =
      Q.transitioning ||
      gC.transitioning ||
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
      ? `${gC.setting}:${c}`
      : `off`),
    (document.documentElement.dataset.mill = $?.entering
      ? `entering`
      : $?.active
        ? $.resting
          ? $.seat.phase
          : `walking`
        : `outside`),
    (document.documentElement.dataset.bank = hC.seat.phase),
    Z(`experience`).classList.toggle(`resting`, !!($?.resting || hC.active)),
    aT());
  let d = lC ? `0` : Math.max(Q.fade, gC.fade).toFixed(3);
  d !== ew && ((ew = d), (Z(`transition`).style.opacity = d));
}
