// assets__index-BogB70q- 31 — state
// Lines 52365-52610 of readable/assets__index-BogB70q-.pretty.js (statement-aligned).
function j_(e) {
  this.enabled !== !1 &&
    (this._pointers.length === 0 &&
      (this.domElement.setPointerCapture(e.pointerId),
      this.domElement.ownerDocument.addEventListener(
        `pointermove`,
        this._onPointerMove,
      ),
      this.domElement.ownerDocument.addEventListener(
        `pointerup`,
        this._onPointerUp,
      )),
    !this._isTrackingPointer(e) &&
      (this._addPointer(e),
      e.pointerType === `touch` ? this._onTouchStart(e) : this._onMouseDown(e),
      this._cursorStyle === `grab` &&
        (this.domElement.style.cursor = `grabbing`)));
}
function M_(e) {
  this.enabled !== !1 &&
    (e.pointerType === `touch` ? this._onTouchMove(e) : this._onMouseMove(e));
}
function N_(e) {
  switch ((this._removePointer(e), this._pointers.length)) {
    case 0:
      (this.domElement.releasePointerCapture(e.pointerId),
        this.domElement.ownerDocument.removeEventListener(
          `pointermove`,
          this._onPointerMove,
        ),
        this.domElement.ownerDocument.removeEventListener(
          `pointerup`,
          this._onPointerUp,
        ),
        this.dispatchEvent(S_),
        (this.state = O_.NONE),
        this._cursorStyle === `grab` &&
          (this.domElement.style.cursor = `grab`));
      break;
    case 1:
      let t = this._pointers[0],
        n = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: n.x, pageY: n.y });
  }
}
function P_(t) {
  let n;
  switch (t.button) {
    case 0:
      n = this.mouseButtons.LEFT;
      break;
    case 1:
      n = this.mouseButtons.MIDDLE;
      break;
    case 2:
      n = this.mouseButtons.RIGHT;
      break;
    default:
      n = -1;
  }
  switch (n) {
    case e.DOLLY:
      if (this.enableZoom === !1) return;
      (this._handleMouseDownDolly(t), (this.state = O_.DOLLY));
      break;
    case e.ROTATE:
      if (t.ctrlKey || t.metaKey || t.shiftKey) {
        if (this.enablePan === !1) return;
        (this._handleMouseDownPan(t), (this.state = O_.PAN));
      } else {
        if (this.enableRotate === !1) return;
        (this._handleMouseDownRotate(t), (this.state = O_.ROTATE));
      }
      break;
    case e.PAN:
      if (t.ctrlKey || t.metaKey || t.shiftKey) {
        if (this.enableRotate === !1) return;
        (this._handleMouseDownRotate(t), (this.state = O_.ROTATE));
      } else {
        if (this.enablePan === !1) return;
        (this._handleMouseDownPan(t), (this.state = O_.PAN));
      }
      break;
    default:
      this.state = O_.NONE;
  }
  this.state !== O_.NONE && this.dispatchEvent(x_);
}
function F_(e) {
  switch (this.state) {
    case O_.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(e);
      break;
    case O_.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(e);
      break;
    case O_.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(e);
  }
}
function I_(e) {
  this.enabled !== !1 &&
    this.enableZoom !== !1 &&
    this.state === O_.NONE &&
    (e.preventDefault(),
    this.dispatchEvent(x_),
    this._handleMouseWheel(this._customWheelEvent(e)),
    this.dispatchEvent(S_));
}
function L_(e) {
  this.enabled !== !1 && this._handleKeyDown(e);
}
function R_(e) {
  switch ((this._trackPointer(e), this._pointers.length)) {
    case 1:
      switch (this.touches.ONE) {
        case t.ROTATE:
          if (this.enableRotate === !1) return;
          (this._handleTouchStartRotate(e), (this.state = O_.TOUCH_ROTATE));
          break;
        case t.PAN:
          if (this.enablePan === !1) return;
          (this._handleTouchStartPan(e), (this.state = O_.TOUCH_PAN));
          break;
        default:
          this.state = O_.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case t.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          (this._handleTouchStartDollyPan(e),
            (this.state = O_.TOUCH_DOLLY_PAN));
          break;
        case t.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          (this._handleTouchStartDollyRotate(e),
            (this.state = O_.TOUCH_DOLLY_ROTATE));
          break;
        default:
          this.state = O_.NONE;
      }
      break;
    default:
      this.state = O_.NONE;
  }
  this.state !== O_.NONE && this.dispatchEvent(x_);
}
function z_(e) {
  switch ((this._trackPointer(e), this.state)) {
    case O_.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      (this._handleTouchMoveRotate(e), this.update());
      break;
    case O_.TOUCH_PAN:
      if (this.enablePan === !1) return;
      (this._handleTouchMovePan(e), this.update());
      break;
    case O_.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      (this._handleTouchMoveDollyPan(e), this.update());
      break;
    case O_.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      (this._handleTouchMoveDollyRotate(e), this.update());
      break;
    default:
      this.state = O_.NONE;
  }
}
function B_(e) {
  this.enabled !== !1 && e.preventDefault();
}
function V_(e) {
  e.key === `Control` &&
    ((this._controlActive = !0),
    this.domElement
      .getRootNode()
      .addEventListener(`keyup`, this._interceptControlUp, {
        passive: !0,
        capture: !0,
      }));
}
function H_(e) {
  e.key === `Control` &&
    ((this._controlActive = !1),
    this.domElement
      .getRootNode()
      .removeEventListener(`keyup`, this._interceptControlUp, {
        passive: !0,
        capture: !0,
      }));
}
function U_(e, { aboard: t = !1, fishing: n = !1, immersive: r = !1 } = {}) {
  let i = r
    ? [`keeper`, `explore`]
    : t && !n
      ? [`follow`, `keeper`, `explore`]
      : [`follow`, `explore`];
  return i[(i.indexOf(e) + 1) % i.length];
}
function W_(e, t) {
  e.updateMatrixWorld(!0);
  let n = [],
    r = new Nn(),
    i = [];
  e.traverse((e) => {
    e.isMesh &&
      (e.geometry.computeBoundingBox(),
      n.push(e.geometry.boundingBox.clone().applyMatrix4(e.matrixWorld)));
  });
  for (let e of t) {
    (r.position.set(e.x, e.y, e.z),
      r.rotation.set(e.rx || 0, e.angle || 0, e.rz || 0),
      Array.isArray(e.s) ? r.scale.set(...e.s) : r.scale.setScalar(e.s || 1),
      r.updateMatrix());
    for (let e of n)
      e.isEmpty() ||
        i.push(e.clone().applyMatrix4(r.matrix).expandByScalar(0.3));
  }
  return i;
}
var G_ = new ai(),
  K_ = new U(),
  q_ = new U(),
  J_ = new U(0, 1, 0);
function Y_(e, t, { groundHeight: n, water: r, obstacles: i = [] }) {
  if (t) {
    K_.subVectors(e, t);
    let n = K_.length();
    if (n > 1e-7) {
      G_.set(t, K_.divideScalar(n));
      for (let e of i)
        e.containsPoint(t) ||
          (G_.intersectBox(e, q_) &&
            (n = Math.min(n, Math.max(0, q_.distanceTo(t) - 0.015))));
      e.copy(t).addScaledVector(G_.direction, n);
    }
  }
  for (let t of i) t.containsPoint(e) && (e.y = t.max.y + 0.015);
  return ((e.y = Math.max(e.y, r + 0.45, n(e.x, e.z) + 0.45)), e);
}
