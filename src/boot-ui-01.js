// boot-ui-01.js — boot ui: DOM refs, the loading screen hookup, panel wiring and the error toast
// Lines 63750-63830 of readable/assets__index-BogB70q-.pretty.js (cluster boot-ui, statement-aligned).
var byId = (e) => document.getElementById(e);
Fs.setURLModifier(revisionUrlModifier);
var loadingScreen = createLoadingScreen(document, Fs, $_.length),
  preferences = loadPreferences(),
  panelIds = [`map`, `help`, `settings`],
  anyPanelOpen = () => panelIds.some((e) => !byId(e + `-panel`).hidden),
  canvasEl = byId(`world`),
  reducedMotion = matchMedia(`(prefers-reduced-motion: reduce)`).matches,
  coarsePointer = matchMedia(`(pointer:coarse), (max-width:800px)`),
  syncKeyboardHelp = () => {
    byId(`keyboard-help`).open = !coarsePointer.matches;
  };
(coarsePointer.addEventListener(`change`, syncKeyboardHelp), syncKeyboardHelp());
var cloudShadows = createCloudShadows({ reducedMotion: reducedMotion }),
  breezeState = createBreezeState({ reducedMotion: reducedMotion }),
  queryParams = new URLSearchParams(location.search),
  playerState = createPlayerState(),
  hC = $S(),
  fishingState = createChairPath({ chairPath: xS }),
  _C,
  vC,
  yC,
  bC,
  xC,
  SC = null,
  boatState = { ...dockSpec.boat, speed: 0, turnRate: 0, acceleration: 0 },
  wC = { ...boatState },
  TC = createSpringState(boatState, xT),
  EC = Qv(),
  DC = $v(),
  experienceStarted = !1,
  kC = !1,
  loading = !1,
  balancedQuality = preferences.quality === `balanced`,
  worldReady = !1,
  NC,
  PC,
  FC,
  IC,
  LC,
  RC,
  $,
  zC,
  BC,
  VC = new Set(),
  HC = new Map(),
  UC = null,
  WC = null,
  GC = null,
  KC = 0,
  qC = performance.now(),
  JC = 0,
  YC = ``,
  XC = 0,
  ZC,
  QC = !1,
  $C = ``,
  ew = ``,
  tw = new U(),
  nw = { walk: 0, gait: 0, seated: !0 },
  rw = new AudioEngine();
rw.setVolume(preferences.volume);
var iw = new V(),
  aw = new Ic(),
  ow = new Yr(new U(0, 1, 0), -q),
  sw = new U();
function cw(e) {
  (loadingScreen.stop(),
    console.error(e),
    (byId(`error`).hidden = !1),
    (byId(`error-message`).textContent =
      e instanceof Error
        ? e.message
        : `The scene could not load. Please refresh to try again.`));
}
function lw(e) {
  ((byId(`toast`).textContent = e),
    byId(`toast`).classList.add(`visible`),
    clearTimeout(ZC),
    (ZC = setTimeout(() => byId(`toast`).classList.remove(`visible`), 3200)));
}
