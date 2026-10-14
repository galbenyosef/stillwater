// waterwheel-kinematics-01.js — the waterwheel kinematics: the wheel spec (paddles, angular speed), gate flow and the element times
// Lines 49267-49345 of readable/assets__index-BogB70q-.pretty.js (cluster waterwheel-kinematics, statement-aligned).
var waterwheelSpec = {
    x: 1.16,
    y: 1.88,
    z: -4.2,
    radius: 1.965,
    paddles: 28,
    angularSpeed: 0.105,
  },
  wheelAngleAt = (time, machine = null) => (machine ? machine.angleAt(time) : time * waterwheelSpec.angularSpeed),
  TAU = Math.PI * 2,
  paddlePhaseAt = (time, paddle, machine) => (((wheelAngleAt(time, machine) + (paddle * TAU) / waterwheelSpec.paddles) % TAU) + TAU) % TAU,
  wheelRimClearance = waterwheelSpec.y + waterwheelSpec.radius + 0.008 - q - 0.022,
  wheelRimSpeed = (waterwheelSpec.radius + 0.008) * waterwheelSpec.angularSpeed + 0.48 + 0.14,
  wheelFallTime = (wheelRimSpeed + Math.sqrt(wheelRimSpeed ** 2 + 19.62 * wheelRimClearance)) / 9.81;
function paddleInWater(time, paddle, machine = null) {
  let phase = paddlePhaseAt(time, paddle, machine);
  return phase >= 0.45 && phase <= 2.28 + waterwheelSpec.angularSpeed * wheelFallTime;
}
function wheelSpillElement(time, paddle, lateral = 0, machine = null) {
  let phase = paddlePhaseAt(time, paddle, machine),
    speed = machine ? machine.speedAt(time) : waterwheelSpec.angularSpeed,
    sinPhase = Math.sin(phase),
    cosPhase = Math.cos(phase),
    rimRadius = waterwheelSpec.radius + 0.008,
    origin = [waterwheelSpec.x + lateral, waterwheelSpec.y + cosPhase * rimRadius, waterwheelSpec.z + sinPhase * rimRadius],
    velocity = [0, -sinPhase * (rimRadius * speed + 0.48) - 0.14, cosPhase * rimRadius * speed + 0.1];
  return {
    start: origin,
    velocity: velocity,
    life: Math.max(
      0,
      (velocity[1] + Math.sqrt(Math.max(0, velocity[1] ** 2 + 19.62 * (origin[1] - q - 0.022)))) /
        9.81,
    ),
    amount: smoothStep(0.45, 0.88, phase) * (1 - smoothStep(1.65, 2.28, phase)) * (machine ? machine.flowAt(time) : 1),
    angle: phase,
  };
}
function ballisticPointAt(element, age) {
  return {
    x: element.start[0] + element.velocity[0] * age,
    y: element.start[1] + element.velocity[1] * age - 4.905 * age * age,
    z: element.start[2] + element.velocity[2] * age,
    vx: element.velocity[0],
    vy: element.velocity[1] - 9.81 * age,
    vz: element.velocity[2],
  };
}
function spillElementAt(time, paddle, lateral, gateFlow, machine = null) {
  let flow = clampValue(gateFlow, 0, 1),
    element = wheelSpillElement(time, paddle, lateral, machine),
    age = element.life * flow;
  for (let r = 0; r < 3; r++) ((element = wheelSpillElement(time - age, paddle, lateral, machine)), (age = element.life * flow));
  return { ...ballisticPointAt(element, age), amount: element.amount, age: age };
}
function og(e, t) {
  let n = [0],
    r = [0],
    i = 0.35 + t * 1.1,
    a = e[0][1];
  for (let t = 1; t < e.length; t++) {
    let o = e[t - 1],
      s = e[t],
      c = Math.hypot(...s.map((e, t) => e - o[t])),
      l = Math.sqrt(i * i + 19.62 * Math.max(0, a - o[1])),
      u = Math.sqrt(i * i + 19.62 * Math.max(0, a - s[1]));
    (n.push(n.at(-1) + c), r.push(r.at(-1) + c / ((l + u) * 0.5)));
  }
  return { distances: n, times: r, duration: r.at(-1), length: n.at(-1) };
}
function sg(e, t) {
  let n = clampValue(t, 0, 1) * (e.times.length - 1),
    r = Math.min(e.times.length - 2, Math.floor(n)),
    i = n - r;
  return {
    time: e.times[r] + (e.times[r + 1] - e.times[r]) * i,
    distance: e.distances[r] + (e.distances[r + 1] - e.distances[r]) * i,
  };
}
