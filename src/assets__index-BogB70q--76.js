// assets__index-BogB70q- 76 — active
// Lines 65851-66160 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function gE(e) {
  let t = ST ? performance.now() : 0,
    n = e - qC,
    r = Math.min(n / 1e3, 0.1);
  if (((qC = e), wT || (KC += r), sE.push(n), !wT)) {
    let e = (e) => VC.has(e) || [...HC.values()].includes(e),
      t = $.active,
      n = hC.active,
      i = hC.update(!OC || AC || sC() ? 0 : r);
    (hC.seat.actor ? Q.place(hC.seat.actor) : i && Q.place(i),
      n !== hC.active && (_T(), lT()));
    let a = $.update(!OC || AC || sC() ? 0 : r, Q.state);
    ($.seat.actor ? Q.place($.seat.actor) : a && Q.place(a),
      t !== $.active && (_T(), lT()));
    let o = RT();
    (gC.update(r, { blocked: !OC || AC || Dw.active || sC() }),
      gC.chairActor && Q.place(gC.chairActor));
    let s = Q.swimming,
      c = gC.chairActor
        ? null
        : Q.update(r, {
            x:
              Number(e(`KeyD`) || e(`ArrowRight`)) -
              Number(e(`KeyA`) || e(`ArrowLeft`)),
            z:
              Number(e(`KeyW`) || e(`ArrowUp`)) -
              Number(e(`KeyS`) || e(`ArrowDown`)),
            angle: $.active ? $.angle : Nw,
            target: $.entryTarget ?? o ?? UC,
            boat: CC,
            brake: e(`Space`),
            millOpen: $.passable,
            bridgeOpen: $.bridgePassable,
            blocked:
              !OC ||
              AC ||
              Dw.active ||
              sC() ||
              gC.active ||
              $.resting ||
              hC.active ||
              QC ||
              jT?.paused ||
              (!Q.swimming && e(`Space`)),
          }),
      l = Q.mode === `foot` && Q.state.x < -17.25;
    if (
      (l !== Lw && ((Lw = l), Fw || (Pw = l ? 1 : 0.37)),
      Q.leaving &&
        (Object.assign(CC, Q.leaving.mooring, {
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
              uC.matches
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
    let e = EC.update(wC, KC, r, lC);
    (IC.position.set(wC.x, e.height, wC.z),
      IC.rotation.set(e.pitch, wC.heading + Math.PI, e.roll, `YXZ`));
    let t = Q.mode === `boat` ? wC.turnRate : 0;
    LC.update(KC, r, wC.speed, lC, Q.mode === `boat` ? (AT ?? t) : 0, t);
  }
  if (RC && !wT) {
    let e = QC ? null : Q.state;
    if ((Q.mode === `boat` || Q.boarding?.phase === `step`) && IC) {
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
    if (Q.boarding?.phase === `step`)
      bC.update(Q.boarding.progress, KC, Q.state, nw);
    else if (Q.leaving?.phase === `step`)
      xC.update(1 - Q.leaving.progress, KC, Q.state, nw);
    else {
      let t =
        [`approach`, `align`].includes(Q.boarding?.phase) ||
        gC.setting === `chair`;
      (bC.reset(),
        xC.reset(),
        RC.update(KC, e, {
          grounded:
            Q.mode === `foot` &&
            !$.resting &&
            !hC.active &&
            (t || (!Q.transitioning && !gC.active)),
        }));
    }
  }
  if (_C && !wT) {
    let e = !OC || AC || Dw.active || sC() ? 0 : r;
    (vC.restore(),
      yC.restore(),
      _C.update(gC, e),
      vC.update(gC),
      yC.update(gC));
    for (let e of gC.events.splice(0))
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
        !(gC.seated && gC.phase !== `leaving`) &&
        (Dw.active ||
          (!(Q.mode === `boat` && Tw.blend > 0.85) &&
            $.blend < 0.72 &&
            hC.blend < 0.72))),
    wT ||
      (PC?.update(KC, wC, Nw, Dw.active ? Dw.target : null),
      FC?.update(KC, r, wC, cC.height),
      fC.update(OC && !AC ? r : 0),
      pC.update(OC && !AC ? r : 0),
      zC?.update(OC && !AC ? r : 0),
      rw.update(KC, wC, {
        listener: Q.mode === `boat` ? wC : Q.state,
        forward: Ew,
        wheelAngle: PC?.wheel.rotation.x,
        millFlow: PC?.power.state.flow,
        active: OC && !!PC?.millDrive,
        doorOpen: $.passable,
        bridgeOpen: $.bridgePassable,
        earHeight: Q.swimming
          ? 0.25
          : Q.mode === `boat` || $.resting || hC.active
            ? 1.1
            : 1.55,
        rain: zC?.state.rain ?? 0,
        indoors: !Dw.active && $.active && Q.state.z < -1.3 && Q.state.x > -6.6,
        motorActive: OC && Q.mode === `boat` && !Q.transitioning && !gC.active,
      })),
    uT(),
    pw.updateMatrixWorld(),
    wT ||
      (BC?.update(Q, RC, !OC || AC || Dw.active || sC() ? 0 : r),
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
    gC.phase === e &&
      gC.progress >= Number(t) &&
      ((wT = !0), (TT.checked = !0), (DT.value = ``));
  }
  if (
    (OT?.value &&
      Q.boarding?.phase === `step` &&
      Q.boarding.progress >= Number(OT.value) &&
      ((wT = !0), (TT.checked = !0), (OT.value = ``)),
    kT?.value &&
      Q.leaving?.phase === `step` &&
      Q.leaving.progress >= Number(kT.value) &&
      ((wT = !0), (TT.checked = !0), (kT.value = ``)),
    KC - JC > 0.35)
  ) {
    (Z(`map-panel`).hidden || Yw(), (JC = KC));
    let e = Q.mode === `boat` ? CC : Q.state,
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
    (t.name !== YC || t.line !== Z(`place-caption`).textContent) &&
      ((Z(`place-name`).textContent = t.name.toUpperCase()),
      (Z(`place-caption`).textContent = t.line),
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
    let t = ip(CC.x, CC.z, CC.heading);
    CT &&
      (CT.textContent = `${rE} fps · CPU render ${(iE / tE).toFixed(1)} ms · GPU ${ZT ? ZT.toFixed(1) : `—`} ms\n${Math.round(aE / tE).toLocaleString()} tris · ${Math.round(oE / tE)} calls (mean/frame)\nBoat ${CC.x.toFixed(2)}, ${CC.z.toFixed(2)} · ${CC.speed.toFixed(2)} m/s\n${t ? `Hull clear` : `Hull near bank`} · ${kC ? `Drifting` : `Manual`} · ${Qw} laps\n${JSON.stringify(PC?.counts)}`);
    let n = sE.slice().sort((e, t) => e - t),
      r = n[Math.floor(n.length * 0.95)] || 0;
    if (
      (CT &&
        (CT.textContent += `\nView ${rT()} · eye ${Cw.position.y.toFixed(2)} m · FOV ${Cw.fov.toFixed(0)}°\nWildlife ${FC?.counts.fish ?? 0} fish · ${FC?.counts.dragonflies ?? 0} dragonflies\nFrame p95 ${r.toFixed(1)} ms · >25ms ${sE.filter((e) => e > 25).length}/${tE}\nShadows ${cE}/${tE} · reflections ${NC.reflectionFrames}/${tE}\n${cC.width} × ${cC.height} buffer · ${innerWidth} × ${innerHeight} view\n${JT()}\n${qT}`),
      CT)
    ) {
      ((CT.textContent += `\nFish activity: ${FC?.fishActivity ?? `quiet`}`),
        (CT.textContent += gC.active
          ? `\nFishing: ${gC.setting} · ${gC.phase} · frame ${gC.frame.toFixed(1)}`
          : `\nKeeper: ${RC?.state ?? `loading`} · ${RC?.counts.triangles.toLocaleString() ?? 0} tris · ${RC?.counts.bones ?? 0} bones`),
        (CT.textContent += `\nControl: ${Q.mode} · Keeper ${Q.state.x.toFixed(2)}, ${Q.state.z.toFixed(2)} · ${Q.state.speed.toFixed(2)} m/s`),
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
    ((document.documentElement.dataset.boat = `${CC.x.toFixed(2)},${CC.z.toFixed(2)}`),
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
mE().catch((e) =>
  cw(
    Error(
      `The woodland could not finish loading. Check your connection, then try again.`,
      { cause: e },
    ),
  ),
);
