// boot-01.js — the boot sequence and the frame loop (load, warm-up, error fallback)
// Lines 65734-66160 of readable/assets__index-BogB70q-.pretty.js (cluster boot, statement-aligned).
async function bootGame() {
  let [e, t, n, r, i] = await Promise.all([
    loadingScreen.track(nv((e) => loadingScreen.models(e))),
    loadingScreen.track(new gf().loadAsync(`/textures/forest-light.hdr`)),
    loadingScreen.track(new Us().loadAsync(`/textures/water-normal.jpg`)),
    loadingScreen.track(iS()),
    loadingScreen.track(NS()),
  ]);
  (loadingScreen.stage(`Bringing the woodland to life…`),
    await new Promise((e) => requestAnimationFrame(() => setTimeout(e, 0))));
  let a = new pl(uw);
  ((pw.environment = a.fromEquirectangular(t).texture),
    (pw.environmentIntensity = 0.4));
  let o = Vb(uw);
  ((pw.background = o.texture),
    (pw.backgroundIntensity = 0.48),
    t.dispose(),
    a.dispose(),
    (PC = assembleWorld(pw, e)),
    PC.setLow(balancedQuality),
    (zC = setupLighting(uw, pw, {
      sun: hw,
      hemisphere: mw,
      fill: Sw,
      sky: o,
      reducedMotion: reducedMotion,
    })),
    (NC = buildPondSurface(pw, reducedMotion, n, e, cloudShadows, zC, PC.power)),
    NC.setLow(balancedQuality),
    (FC = buildPondLife(pw, reducedMotion, n, e, PC.power)),
    Dw.setObstacles(PC.cameraObstacles),
    Ow.setObstacles(PC.followCameraObstacles),
    pw.traverse((e) => {
      e.isMesh && e.visible && !e.customDepthMaterial && Aw.push(e);
    }),
    ($ = buildKeeperRoom(pw, e, { reducedMotion: reducedMotion })),
    (IC = e.boat.clone(!0)),
    pw.add(IC),
    IC.traverse((e) => {
      e.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
    }),
    (LC = createBoatState(IC)),
    (RC = buildMillKeeper(pw, r, { reducedMotion: reducedMotion, surface: yS })),
    (BC = buildSwimLadder(pw, e, { reducedMotion: reducedMotion, surface: yS })),
    NC.setSwimmer(BC.uniforms),
    (bC = HS(RC, IC)),
    (xC = HS(RC, IC, { leaving: !0 })),
    (_C = buildFishingLine(pw, IC, i, { reducedMotion: reducedMotion })),
    _C.update(fishingState, 0),
    (vC = FS(_C.models.chair, RC)),
    (yC = IS(_C.models.boat, RC)),
    Pb(pw),
    cloudShadows.install(pw),
    xw(),
    pw.updateMatrixWorld(!0),
    (pw.matrixAutoUpdate = !1),
    (pw.matrixWorldAutoUpdate = !1),
    loadingScreen.stage(`Warming the water and light…`),
    await new Promise((e) => requestAnimationFrame(() => setTimeout(e, 0))),
    await NC.renderSurface(uw, () => dw.compile()),
    (qC = performance.now()),
    frameLoop(qC),
    (nE = performance.now()),
    (tE = 0),
    (iE = 0),
    (aE = 0),
    (oE = 0),
    (sE = []),
    (cE = 0),
    NC.resetCounters(),
    (worldReady = !0),
    (byId(`begin`).disabled = !1),
    (byId(`begin-label`).textContent = `Step outside`),
    (byId(`load-status`).textContent = `Best enjoyed slowly · sound optional`),
    loadingScreen.stop(),
    lT(),
    byId(`loading-screen`).setAttribute(`aria-busy`, `false`),
    byId(`loading-screen`).setAttribute(`aria-hidden`, `true`),
    (document.documentElement.dataset.ready = `true`),
    queryParams.has(`explore`) && oT(),
    queryParams.has(`rain`) && (oT(), zC.preview(`play`)),
    queryParams.has(`fireside`) &&
      (oT(),
      $.interact({ x: -3, y: 0.97, z: -0.8 }),
      playerState.place({ ...Jy, x: -1.9, z: -4.9, heading: Math.PI / 2 }),
      $.drag(Math.atan2(1.67, 1.33) / 0.0032, 95),
      lT()),
    queryParams.has(`spring`) &&
      (oT(),
      playerState.reset({ aboard: !0 }),
      tT(!1, { announce: !1 }),
      eT({ ...Yf, x: 3, z: -11 }),
      (Pw = Nw = 2),
      (Mw = jw = 15),
      Hw(1)),
    queryParams.has(`aboard`) &&
      (playerState.reset({ aboard: !0 }),
      tT(!0, { instant: !0, announce: !1 }),
      (Mw = 20)),
    (qC = performance.now()),
    warmup(qC));
}
function warmup(e) {
  if (loading) {
    requestAnimationFrame(warmup);
    return;
  }
  if ((ST && (uE && dE.push(e - uE), (uE = e)), !DC.ready(e, experienceStarted ? 60 : 30))) {
    (fE++, requestAnimationFrame(warmup));
    return;
  }
  try {
    (frameLoop(e), requestAnimationFrame(warmup));
  } catch (e) {
    cw(e);
  }
}
function frameLoop(e) {
  let t = ST ? performance.now() : 0,
    n = e - qC,
    r = Math.min(n / 1e3, 0.1);
  if (((qC = e), wT || (KC += r), sE.push(n), !wT)) {
    let e = (e) => VC.has(e) || [...HC.values()].includes(e),
      t = $.active,
      n = hC.active,
      i = hC.update(!experienceStarted || loading || anyPanelOpen() ? 0 : r);
    (hC.seat.actor ? playerState.place(hC.seat.actor) : i && playerState.place(i),
      n !== hC.active && (_T(), lT()));
    let a = $.update(!experienceStarted || loading || anyPanelOpen() ? 0 : r, playerState.state);
    ($.seat.actor ? playerState.place($.seat.actor) : a && playerState.place(a),
      t !== $.active && (_T(), lT()));
    let o = RT();
    (fishingState.update(r, { blocked: !experienceStarted || loading || Dw.active || anyPanelOpen() }),
      fishingState.chairActor && playerState.place(fishingState.chairActor));
    let s = playerState.swimming,
      c = fishingState.chairActor
        ? null
        : playerState.update(r, {
            x:
              Number(e(`KeyD`) || e(`ArrowRight`)) -
              Number(e(`KeyA`) || e(`ArrowLeft`)),
            z:
              Number(e(`KeyW`) || e(`ArrowUp`)) -
              Number(e(`KeyS`) || e(`ArrowDown`)),
            angle: $.active ? $.angle : Nw,
            target: $.entryTarget ?? o ?? UC,
            boat: boatState,
            brake: e(`Space`),
            millOpen: $.passable,
            bridgeOpen: $.bridgePassable,
            blocked:
              !experienceStarted ||
              loading ||
              Dw.active ||
              anyPanelOpen() ||
              fishingState.active ||
              $.resting ||
              hC.active ||
              QC ||
              jT?.paused ||
              (!playerState.swimming && e(`Space`)),
          }),
      l = playerState.mode === `foot` && playerState.state.x < -17.25;
    if (
      (l !== Lw && ((Lw = l), Fw || (Pw = l ? 1 : 0.37)),
      playerState.leaving &&
        (Object.assign(boatState, playerState.leaving.mooring, {
          speed: 0,
          turnRate: 0,
          acceleration: 0,
        }),
        TC.reset()),
      c)
    ) {
      let e = Fw;
      (tT(!1, { announce: !1 }),
        (Fw = e),
        c === `swim`
          ? lw(
              coarsePointer.matches
                ? `Use the arrows or tap the water to swim. Release to float; tap the ladder action to climb out.`
                : `WASD to swim. Release to float. E near the ladder to climb out.`,
            )
          : c === `foot` && s && ((Mw = 9.5), lw(`Back on the landing.`)));
    }
  }
  if (
    (wT ||
      ([`forward`, `reverse`].includes(zT) &&
        BT > 5 &&
        (eT(UT), (BT = 0), (Fw = new U(0, 0.48, 9)), zw.copy(Fw)),
      (wC = TC.step(r)),
      zT !== `live` && Fw && Fw.set(wC.x, 0.48, wC.z)),
    IC && !wT)
  ) {
    let e = EC.update(wC, KC, r, reducedMotion);
    (IC.position.set(wC.x, e.height, wC.z),
      IC.rotation.set(e.pitch, wC.heading + Math.PI, e.roll, `YXZ`));
    let t = playerState.mode === `boat` ? wC.turnRate : 0;
    LC.update(KC, r, wC.speed, reducedMotion, playerState.mode === `boat` ? (AT ?? t) : 0, t);
  }
  if (RC && !wT) {
    let e = QC ? null : playerState.state;
    if ((playerState.mode === `boat` || playerState.boarding?.phase === `step`) && IC) {
      let t = tw.copy(yb).applyQuaternion(IC.quaternion).add(IC.position);
      (Object.assign(nw, {
        x: t.x,
        y: t.y,
        z: t.z,
        heading: wC.heading,
        pitch: -IC.rotation.x,
        roll: -IC.rotation.z,
        grip: LC.grip,
      }),
        (e = nw));
    }
    if (playerState.boarding?.phase === `step`)
      bC.update(playerState.boarding.progress, KC, playerState.state, nw);
    else if (playerState.leaving?.phase === `step`)
      xC.update(1 - playerState.leaving.progress, KC, playerState.state, nw);
    else {
      let t =
        [`approach`, `align`].includes(playerState.boarding?.phase) ||
        fishingState.setting === `chair`;
      (bC.reset(),
        xC.reset(),
        RC.update(KC, e, {
          grounded:
            playerState.mode === `foot` &&
            !$.resting &&
            !hC.active &&
            (t || (!playerState.transitioning && !fishingState.active)),
        }));
    }
  }
  if (_C && !wT) {
    let e = !experienceStarted || loading || Dw.active || anyPanelOpen() ? 0 : r;
    (vC.restore(),
      yC.restore(),
      _C.update(fishingState, e),
      vC.update(fishingState),
      yC.update(fishingState));
    for (let e of fishingState.events.splice(0))
      if ((e === `splash` && _C.splash(), e === `left`)) {
        if ((_T(), SC)) {
          let e = SC;
          ((SC = null),
            tT(e.aboard, { announce: !1 }),
            (Mw = e.size),
            (Pw = e.angle));
        }
        lT();
      }
  }
  if (
    (Hw(r),
    RC &&
      (RC.root.visible =
        RC.enabled &&
        !(fishingState.seated && fishingState.phase !== `leaving`) &&
        (Dw.active ||
          (!(playerState.mode === `boat` && Tw.blend > 0.85) &&
            $.blend < 0.72 &&
            hC.blend < 0.72))),
    wT ||
      (PC?.update(KC, wC, Nw, Dw.active ? Dw.target : null),
      FC?.update(KC, r, wC, canvasEl.height),
      cloudShadows.update(experienceStarted && !loading ? r : 0),
      breezeState.update(experienceStarted && !loading ? r : 0),
      zC?.update(experienceStarted && !loading ? r : 0),
      rw.update(KC, wC, {
        listener: playerState.mode === `boat` ? wC : playerState.state,
        forward: Ew,
        wheelAngle: PC?.wheel.rotation.x,
        millFlow: PC?.power.state.flow,
        active: experienceStarted && !!PC?.millDrive,
        doorOpen: $.passable,
        bridgeOpen: $.bridgePassable,
        earHeight: playerState.swimming
          ? 0.25
          : playerState.mode === `boat` || $.resting || hC.active
            ? 1.1
            : 1.55,
        rain: zC?.state.rain ?? 0,
        indoors: !Dw.active && $.active && playerState.state.z < -1.3 && playerState.state.x > -6.6,
        motorActive: experienceStarted && playerState.mode === `boat` && !playerState.transitioning && !fishingState.active,
      })),
    uT(),
    pw.updateMatrixWorld(),
    wT ||
      (BC?.update(playerState, RC, !experienceStarted || loading || Dw.active || anyPanelOpen() ? 0 : r),
      NC?.update(KC, wC, IC, [
        ...(FC?.surfaceRipples ?? []),
        ...(_C?.ripples ?? []),
        ...(BC?.ripples ?? []),
      ])),
    VT && NC?.atLakeSplash && ((wT = !0), (TT.checked = !0), (VT = !1)),
    HT && NC?.atMillSplash && ((wT = !0), (TT.checked = !0), (HT = !1)),
    ET?.value &&
      FC?.fishPreviewMoment === ET.value &&
      ((wT = !0), (TT.checked = !0), (ET.value = ``)),
    DT?.value)
  ) {
    let [e, t] = DT.value.split(`:`);
    fishingState.phase === e &&
      fishingState.progress >= Number(t) &&
      ((wT = !0), (TT.checked = !0), (DT.value = ``));
  }
  if (
    (OT?.value &&
      playerState.boarding?.phase === `step` &&
      playerState.boarding.progress >= Number(OT.value) &&
      ((wT = !0), (TT.checked = !0), (OT.value = ``)),
    kT?.value &&
      playerState.leaving?.phase === `step` &&
      playerState.leaving.progress >= Number(kT.value) &&
      ((wT = !0), (TT.checked = !0), (kT.value = ``)),
    KC - JC > 0.35)
  ) {
    (byId(`map-panel`).hidden || Yw(), (JC = KC));
    let e = playerState.mode === `boat` ? boatState : playerState.state,
      t =
        $.active && e.z < -1.3 && e.x > -6.6
          ? {
              name: e.y > 2.9 ? `The keeper’s room` : `Inside the old mill`,
              line:
                PC.power.state.speed < 0.01
                  ? `The old mill rests beside the water.`
                  : `The water keeps turning outside.`,
            }
          : sp(e.x, e.z);
    (t.name !== YC || t.line !== byId(`place-caption`).textContent) &&
      ((byId(`place-name`).textContent = t.name.toUpperCase()),
      (byId(`place-caption`).textContent = t.line),
      (YC = t.name));
  }
  let i = performance.now();
  ((uw.info.autoReset = !1), uw.info.reset(), ST && (lE += i - t));
  let a;
  GT &&
    QT++ % 31 == 0 &&
    ((a = WT.createQuery()), WT.beginQuery(GT.TIME_ELAPSED_EXT, a));
  let o = ST ? performance.now() : 0;
  if ((NC.prepareWake(uw), ST)) {
    let e = performance.now();
    ((pE.wake += e - o), (o = e));
  }
  if (((uw.shadowMap.needsUpdate = !0), NC.prepareShadows(uw, Cw), cE++, ST)) {
    let e = performance.now();
    ((pE.shadow += e - o), (o = e));
  }
  if ((NC?.prepare(uw, Cw), ST)) {
    let e = performance.now();
    ((pE.refraction += e - o), (o = e));
  }
  if (
    (NC.renderSurface(uw, () => dw.render()),
    (iE += performance.now() - i),
    ST && (pE.view += performance.now() - o),
    a && (WT.endQuery(GT.TIME_ELAPSED_EXT), YT.push({ query: a, epoch: $T })),
    YT.length && WT.getQueryParameter(YT[0].query, WT.QUERY_RESULT_AVAILABLE))
  ) {
    let { query: e, epoch: t } = YT.shift();
    (WT.getParameter(GT.GPU_DISJOINT_EXT)
      ? eE()
      : ((ZT = WT.getQueryParameter(e, WT.QUERY_RESULT) / 1e6),
        t === $T && (XT.push(ZT), XT.length > 30 && XT.shift())),
      WT.deleteQuery(e));
  }
  if (
    (tE++,
    (aE += uw.info.render.triangles),
    (oE += uw.info.render.calls),
    e - nE > 1500)
  ) {
    rE = Math.round((tE * 1e3) / (e - nE));
    let t = walkableFacing(boatState.x, boatState.z, boatState.heading);
    CT &&
      (CT.textContent = `${rE} fps · CPU render ${(iE / tE).toFixed(1)} ms · GPU ${ZT ? ZT.toFixed(1) : `—`} ms\n${Math.round(aE / tE).toLocaleString()} tris · ${Math.round(oE / tE)} calls (mean/frame)\nBoat ${boatState.x.toFixed(2)}, ${boatState.z.toFixed(2)} · ${boatState.speed.toFixed(2)} m/s\n${t ? `Hull clear` : `Hull near bank`} · ${kC ? `Drifting` : `Manual`} · ${Qw} laps\n${JSON.stringify(PC?.counts)}`);
    let n = sE.slice().sort((e, t) => e - t),
      r = n[Math.floor(n.length * 0.95)] || 0;
    if (
      (CT &&
        (CT.textContent += `\nView ${rT()} · eye ${Cw.position.y.toFixed(2)} m · FOV ${Cw.fov.toFixed(0)}°\nWildlife ${FC?.counts.fish ?? 0} fish · ${FC?.counts.dragonflies ?? 0} dragonflies\nFrame p95 ${r.toFixed(1)} ms · >25ms ${sE.filter((e) => e > 25).length}/${tE}\nShadows ${cE}/${tE} · reflections ${NC.reflectionFrames}/${tE}\n${canvasEl.width} × ${canvasEl.height} buffer · ${innerWidth} × ${innerHeight} view\n${JT()}\n${qT}`),
      CT)
    ) {
      ((CT.textContent += `\nFish activity: ${FC?.fishActivity ?? `quiet`}`),
        (CT.textContent += fishingState.active
          ? `\nFishing: ${fishingState.setting} · ${fishingState.phase} · frame ${fishingState.frame.toFixed(1)}`
          : `\nKeeper: ${RC?.state ?? `loading`} · ${RC?.counts.triangles.toLocaleString() ?? 0} tris · ${RC?.counts.bones ?? 0} bones`),
        (CT.textContent += `\nControl: ${playerState.mode} · Keeper ${playerState.state.x.toFixed(2)}, ${playerState.state.z.toFixed(2)} · ${playerState.state.speed.toFixed(2)} m/s`),
        (CT.textContent += `\nSluice ${PC.power.state.target ? `open` : `closed`} · gate ${Math.round(PC.power.state.gate * 100)}% · wheel flow ${Math.round(PC.power.state.flow * 100)}% · wheel ${Math.round(PC.power.state.speed * 100)}%`));
      let e = XT.slice().sort((e, t) => e - t);
      e.length &&
        (CT.textContent += `\nGPU window: median ${e[Math.floor(e.length / 2)].toFixed(2)} ms · p95 ${e[Math.floor(e.length * 0.95)].toFixed(2)} ms · ${e.length} samples`);
      let t = dE.reduce((e, t) => e + t, 0) / Math.max(1, dE.length);
      CT.textContent += `\nUpdate ${(lE / tE).toFixed(1)} ms · rAF ${t.toFixed(1)} ms · limiter skipped ${fE}\nPass CPU: ${Object.entries(
        pE,
      )
        .map(([e, t]) => `${e} ${(t / tE).toFixed(1)}`)
        .join(` · `)} ms`;
    }
    ((document.documentElement.dataset.boat = `${boatState.x.toFixed(2)},${boatState.z.toFixed(2)}`),
      (document.documentElement.dataset.fps = String(rE)),
      (document.documentElement.dataset.navigation = t ? `clear` : `blocked`),
      (nE = e),
      (tE = 0),
      (iE = 0),
      (aE = 0),
      (oE = 0),
      (sE = []),
      (cE = 0),
      NC.resetCounters(),
      (lE = 0),
      (dE = []),
      (fE = 0));
    for (let e in pE) pE[e] = 0;
  }
}
bootGame().catch((e) =>
  cw(
    Error(
      `The woodland could not finish loading. Check your connection, then try again.`,
      { cause: e },
    ),
  ),
);
