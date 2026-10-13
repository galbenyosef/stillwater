// assets__index-BogB70q- 37 — max
// Lines 53975-54056 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function Wv(e) {
  let t = [],
    n = new Nn(),
    r = (e, n, r, i, a, o) => {
      let s = Math.ceil(a / 0.62),
        c = a / s;
      for (let a = 0; a < s; a++) {
        let l = (a - (s - 1) / 2) * c * 2,
          u = e - i * l,
          d = n + r * l;
        Y(u + r * 0.15, d + i * 0.15) > 0.145 ||
          t.push({
            x: u + r * 0.018,
            z: d + i * 0.018,
            nx: r,
            nz: i,
            halfWidth: c,
            height: Math.min(0.34, o - 0.018),
          });
      }
    },
    i = e.stoneblock && new ir().setFromObject(e.stoneblock);
  for (let e of i ? xh.placements : []) {
    if (e.kind !== `masonry`) continue;
    (n.position.set(e.x, e.y, e.z),
      (n.rotation.y = e.angle || 0),
      Array.isArray(e.s) ? n.scale.fromArray(e.s) : n.scale.setScalar(e.s || 1),
      n.updateMatrix());
    let t = i.clone().applyMatrix4(n.matrix);
    if (t.min.y >= 0.18 || t.max.y <= 0.18) continue;
    let a = (t.min.x + t.max.x) / 2,
      o = (t.min.z + t.max.z) / 2;
    e.z < -8
      ? r(a, t.min.z, 0, -1, (t.max.x - t.min.x) / 2, t.max.y - q)
      : r(
          e.x < -3 ? t.min.x : t.max.x,
          o,
          e.x < -3 ? -1 : 1,
          0,
          (t.max.z - t.min.z) / 2,
          t.max.y - q,
        );
  }
  if (e.dockprops)
    for (let e of Jf.footings) {
      let t = Jf.origin.x + e.x,
        n = Jf.origin.z - e.y,
        i = Jf.origin.y + e.top - q;
      r(t, n + e.depth / 2, 0, 1, e.width / 2, i);
      let a = Math.sign(e.x);
      r(t + (a * e.width) / 2, n, a, 0, e.depth / 2, i);
    }
  return t.slice(0, Uv);
}
var Gv = `
uniform float uMillAmount;uniform vec4 uMillImpacts[6],uMillWalls[${Uv}],uMillWash[${Uv}];
vec4 millWater(vec2 p){
  if(uMillAmount==0.||p.x< -9.2||p.x>4.3||p.y< -9.6||p.y>2.)return vec4(0.);
  vec2 slope=vec2(0.);float foam=0.;
  for(int i=0;i<6;i++){
    vec4 hit=uMillImpacts[i];if(hit.w==0.)continue;
    vec2 delta=p-hit.xy;float r=length(delta),age=hit.z;
    float front=.12+age*.84,offset=r-front;
    float envelope=exp(-pow(offset/.19,2.));
    float fade=(1.-smoothstep(2.1,${Pv},age))*(1.-smoothstep(2.45,2.85,r))*hit.w/(1.+age*.55);
    slope+=delta/max(r,.025)*sin(offset*19.)*envelope*fade*.24;
    foam+=exp(-r*r/(.07+age*.24))*exp(-age*3.4)*hit.w*.85;
  }
  for(int i=0;i<${Uv};i++){
    vec4 wall=uMillWalls[i],state=uMillWash[i];if(state.x==0.)continue;
    vec2 delta=p-wall.xy,normal=wall.zw;
    float d=dot(delta,normal),along=dot(delta,vec2(-normal.y,normal.x));
    if(d<0.||d>1.25||abs(along)>state.x+.2)continue;
    float edge=1.-smoothstep(state.x*.65,state.x+.2,abs(along));
    float wash=state.y*exp(-d*7.)*edge;
    float front=.06+max(0.,state.z-.65)*.45,offset=d-front;
    float returning=exp(-pow(offset/.16,2.))*edge*state.w*smoothstep(0.,.55,state.z)*(1.-smoothstep(1.6,2.8,state.z));
    slope+=normal*(sin(offset*22.)*returning*.11-wash*.16);
    foam+=wash*.36+returning*.06;
  }
  return vec4(slope,foam,0.)*uMillAmount;
}`;
