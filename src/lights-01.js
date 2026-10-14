// lights-01.js — the lighting rig (sun, hemisphere, fill and sky)
// Lines 30559-30607 of readable/assets__index-BogB70q-.pretty.js (cluster lights, statement-aligned).
function setupLighting(
  renderer,
  scene,
  { sun: sun, hemisphere: hemisphere, fill: fill, sky: sky, reducedMotion: reducedMotion = !1 },
) {
  let weather = createWeather({ reducedMotion: reducedMotion }),
    shadow = lp(renderer, scene),
    uniforms = { ...weather.uniforms, uRainCover: { value: shadow.depthTexture } };
  applyWeatherMaterials(scene, uniforms);
  let grass = scatterGrassPoints(scene, uniforms),
    baseline = {
      sun: sun.intensity,
      sunColor: sun.color.clone(),
      hemi: hemisphere.intensity,
      fill: fill.intensity,
      environment: scene.environmentIntensity,
      fogColor: scene.fog.color.clone(),
      near: scene.fog.near,
      far: scene.fog.far,
    },
    sunCool = new G(`#dbe6ed`),
    fogShade = new G(`#a1b5bb`);
  function applyWeather() {
    let { cloud: e, rain: o } = weather.state;
    ((grass.visible = o > 0.001),
      (sun.intensity = baseline.sun * (1 - e * 0.72)),
      sun.color.copy(baseline.sunColor).lerp(sunCool, e * 0.7),
      (hemisphere.intensity = baseline.hemi + e * 0.24),
      (fill.intensity = baseline.fill + e * 0.13),
      (scene.environmentIntensity = baseline.environment * (1 - e * 0.15)),
      scene.fog.color.copy(baseline.fogColor).lerp(fogShade, e * 0.65),
      (scene.fog.near = baseline.near - e * 22),
      (scene.fog.far = baseline.far - e * 45),
      sky.setWeather(e));
  }
  return {
    uniforms: uniforms,
    state: weather.state,
    update(e) {
      (weather.update(e), applyWeather());
    },
    preview(e) {
      (weather.preview(e), applyWeather());
    },
    seek(e, t, n) {
      (weather.seek(e, t, n), applyWeather());
    },
  };
}
