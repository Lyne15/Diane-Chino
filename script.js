let startY = 0;
let isDragging = false;
const topFlap = document.querySelector(".envelope-top");
const paper = document.querySelector(".paper");
const openSound = document.getElementById("openSound");

document.addEventListener("touchstart", (e) => {
  isDragging = true;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  let currentY = e.touches[0].clientY;
  let dragAmount = startY - currentY;

  let rotation = Math.min(dragAmount / 2, 180);
  if (rotation > 0) {
    topFlap.style.transform = `rotateX(${rotation}deg)`;
  }

  if (rotation >= 150) {
    showPaper();
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

function showPaper() {
  paper.style.opacity = "1";
  paper.style.transform = "translateX(-50%) translateY(0)";
  openSound.play();
}

document.getElementById("openLanding").addEventListener("click", () => {
  window.location.href = "landing.html";
});
