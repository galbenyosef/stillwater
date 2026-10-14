// boot-utils-01.js — asset URL resolver, preferences and the loading overlay
// Lines 29498-29588 of readable/assets__index-BogB70q-.pretty.js (cluster boot-utils, statement-aligned).
function resolveAssetUrl(url, assetRevisions, base) {
  if (/^(data|blob):/i.test(url)) return url;
  let parsed = new URL(url, base),
    origin = new URL(base).origin,
    revision = parsed.origin === origin && assetRevisions[parsed.pathname];
  return revision ? (parsed.searchParams.set(`v`, revision), parsed.href) : url;
}
function revisionUrlModifier(url) {
  return typeof document > `u` || !document.querySelector
    ? url
    : ((cf ??= JSON.parse(
        document.querySelector(`meta[name="stillwater-assets"]`)?.content ??
          `{}`,
      )),
      Object.keys(cf).length ? resolveAssetUrl(url, cf, document.baseURI) : url);
}
var preferencesKey = `stillwater.preferences.v1`;
function normalizePreferences(prefs) {
  return {
    quality: prefs?.quality === `balanced` ? `balanced` : `high`,
    volume: Number.isFinite(prefs?.volume) ? Math.max(0, Math.min(1, prefs.volume)) : 1,
    sound: prefs?.sound === !0,
  };
}
function loadPreferences(storage) {
  try {
    return normalizePreferences(
      JSON.parse((storage ?? globalThis.localStorage)?.getItem(preferencesKey) ?? `null`),
    );
  } catch {
    return normalizePreferences(null);
  }
}
function savePreferences(prefs, storage) {
  try {
    (storage ?? globalThis.localStorage)?.setItem(preferencesKey, JSON.stringify(normalizePreferences(prefs)));
  } catch {}
}
function createLoadingScreen(doc, loader, totalParts) {
  let messageEl = doc.getElementById(`loading-message`),
    detailEl = doc.getElementById(`loading-detail`),
    progressEl = doc.getElementById(`loading-progress`),
    recoveryEl = doc.getElementById(`loading-recovery`),
    ready = 0,
    extra = 0,
    recoveryTimer,
    done = !1;
  progressEl.max = totalParts + 5;
  let armRecovery = () => {
      done ||
        ((recoveryEl.hidden = !0),
        clearTimeout(recoveryTimer),
        (recoveryTimer = setTimeout(() => {
          recoveryEl.hidden = !1;
        }, 45e3)));
    },
    paint = () => {
      ((progressEl.value = ready + extra),
        (detailEl.textContent = `${ready + extra} of ${progressEl.max} parts ready`),
        armRecovery());
    };
  return (
    (loader.onStart = armRecovery),
    (loader.onProgress = armRecovery),
    doc
      .getElementById(`loading-retry`)
      .addEventListener(`click`, () => location.reload()),
    paint(),
    {
      models(e) {
        ((ready = Math.round(e * totalParts)), paint());
      },
      async track(e) {
        let t = await e;
        return (extra++, paint(), t);
      },
      stage(e) {
        ((messageEl.textContent = e),
          (detailEl.textContent = `Almost there. Finding the light.`),
          progressEl.removeAttribute(`value`),
          armRecovery());
      },
      stop() {
        ((done = !0),
          clearTimeout(recoveryTimer),
          (loader.onStart = loader.onProgress = null),
          (recoveryEl.hidden = !0));
      },
    }
  );
}
