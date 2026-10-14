// landmarks-01.js — the landmark table of the island (named places and their lore lines)
// Lines 30310-30357 of readable/assets__index-BogB70q-.pretty.js (cluster landmarks, statement-aligned).
var landmarks = [
    {
      x: -3,
      z: 4,
      name: `The old landing`,
      line: `A little way around. Nowhere to rush.`,
    },
    {
      x: 2,
      z: -1,
      name: `The watermill`,
      line: `The wheel keeps its own time.`,
    },
    {
      x: 10,
      z: 5,
      name: `Willow bank`,
      line: `Watch the light move on the water.`,
    },
    {
      x: -7,
      z: 9,
      name: `The lily shallows`,
      line: `Old stones beneath the surface.`,
    },
    {
      x: -11,
      z: -6,
      name: `The little footbridge`,
      line: `A quiet passage to the other side.`,
    },
    {
      x: -20.25,
      z: -3,
      name: `The quiet bank`,
      line: `A place to sit and watch the pond.`,
    },
    {
      x: 0,
      z: -12,
      name: `The woodland spring`,
      line: `A small spring sets the mill in motion.`,
    },
  ],
  sp = (e, t) =>
    landmarks.reduce((n, r) =>
      Math.hypot(e - n.x, t - n.z) < Math.hypot(e - r.x, t - r.z) ? n : r,
    );
