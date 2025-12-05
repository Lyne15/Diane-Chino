// script.js
(() => {
  const flap = document.getElementById('flap');
  const envelope = document.getElementById('envelope');

  let dragging = false;
  let startY = 0;
  let lastY = 0;
  let currentDeg = 0; // current rotation (deg)
  const MAX_OPEN_DEG = -160; // fully open (negative = rotating back)
  const MIN_DEG = 0; // closed
  const THRESHOLD_PERCENT = 0.35; // threshold to snap open on release

  // helper to set transform (and clamp)
  function setFlapDeg(deg) {
    const clamped = Math.max(MAX_OPEN_DEG, Math.min(MIN_DEG, deg));
    currentDeg = clamped;
    flap.style.transform = `rotateX(${clamped}deg)`;
  }

  // when user starts dragging (mouse or touch)
  function startDrag(clientY) {
    dragging = true;
    // disable transition during direct dragging
    flap.style.transition = 'none';
    startY = clientY;
    lastY = clientY;
  }

  function moveDrag(clientY) {
    if (!dragging) return;
    // compute how much upward drag relative to start
    // if user drags up, clientY decreases → positive delta
    const delta = startY - clientY;
    // map delta (pixels) to degrees:
    // pick mapping: 1 px -> 0.6 deg (tunable)
    const pxToDeg = 0.6;
    const targetDeg = Math.min(MIN_DEG, 0 - delta * pxToDeg);
    setFlapDeg(targetDeg);
    lastY = clientY;
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    // restore smooth transition
    flap.style.transition = 'transform 300ms cubic-bezier(.2,.9,.25,1)';
    // decide to snap fully open or closed depending on how far opened
    const openRatio = Math.abs(currentDeg / Math.abs(MAX_OPEN_DEG)); // 0..1
    if (openRatio > THRESHOLD_PERCENT) {
      // snap open
      animateTo(MAX_OPEN_DEG);
    } else {
      // snap closed
      animateTo(MIN_DEG);
    }
  }

  function animateTo(targetDeg) {
    setFlapDeg(targetDeg);
  }

  /* Mouse events */
  flap.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientY);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    moveDrag(e.clientY);
  }
  function onMouseUp(e) {
    endDrag();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  /* Touch events */
  flap.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) return;
    const t = e.touches[0];
    startDrag(t.clientY);
  }, {passive:false});

  flap.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    moveDrag(t.clientY);
    e.preventDefault(); // prevent scrolling while dragging flap
  }, {passive:false});

  flap.addEventListener('touchend', (e) => {
    endDrag();
  });

  /* Optional: click toggle to open/close */
  flap.addEventListener('click', (e) => {
    // if not dragging, toggle
    if (dragging) return;
    flap.style.transition = 'transform 350ms cubic-bezier(.2,.9,.25,1)';
    if (currentDeg === MIN_DEG) {
      animateTo(MAX_OPEN_DEG);
    } else {
      animateTo(MIN_DEG);
    }
  });

  // initialize closed
  setFlapDeg(0);
})();
