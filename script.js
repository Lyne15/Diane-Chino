// script.js - drag / swipe flap to open (mouse + touch)
(() => {
  const flap = document.getElementById('flap');
  const envelope = document.getElementById('envelope');

  let isDragging = false;
  let startY = 0;
  let currentDeg = 0;
  const MIN_DEG = 0;        // closed
  const MAX_OPEN_DEG = -155; // fully open (negative rotates back toward viewer)
  const SENS = 0.65;        // sensitivity px -> deg
  const SNAP_THRESHOLD = 0.38; // portion to snap open

  function setDeg(d) {
    // clamp
    const clamped = Math.max(MAX_OPEN_DEG, Math.min(MIN_DEG, d));
    currentDeg = clamped;
    flap.style.transform = `rotateX(${clamped}deg) translateZ(1px)`;
  }

  function start(clientY) {
    isDragging = true;
    startY = clientY;
    flap.style.transition = 'none';
  }

  function move(clientY) {
    if (!isDragging) return;
    const delta = startY - clientY; // upward drag => positive
    let deg = Math.min(MIN_DEG, -delta * SENS);
    if (deg < MAX_OPEN_DEG) deg = MAX_OPEN_DEG;
    if (deg > MIN_DEG) deg = MIN_DEG;
    setDeg(deg);
  }

  function end() {
    if (!isDragging) return;
    isDragging = false;
    flap.style.transition = 'transform 360ms cubic-bezier(.2,.9,.25,1)';
    const ratio = Math.abs(currentDeg / Math.abs(MAX_OPEN_DEG));
    if (ratio > SNAP_THRESHOLD) {
      // snap fully open
      setDeg(MAX_OPEN_DEG);
    } else {
      // snap closed
      setDeg(MIN_DEG);
    }
  }

  // mouse
  flap.addEventListener('mousedown', (e) => {
    e.preventDefault();
    start(e.clientY);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) { move(e.clientY); }
  function onMouseUp(e) {
    end();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  // touch
  flap.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) return;
    start(e.touches[0].clientY);
  }, {passive:false});

  flap.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    move(e.touches[0].clientY);
    e.preventDefault();
  }, {passive:false});

  flap.addEventListener('touchend', (e) => {
    end();
  });

  // click to toggle (only when not dragging)
  flap.addEventListener('click', (e) => {
    if (isDragging) return;
    flap.style.transition = 'transform 360ms cubic-bezier(.2,.9,.25,1)';
    if (currentDeg === MIN_DEG) setDeg(MAX_OPEN_DEG);
    else setDeg(MIN_DEG);
  });

  // init closed
  setDeg(0);
})();
