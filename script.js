const topFlap = document.querySelector(".envelope-top");
const paper = document.querySelector(".paper");
const openSound = document.getElementById("openSound");

let opened = false;

topFlap.addEventListener("click", () => {
  if (opened) return; // once opened, do nothing

  // Animate flap open
  topFlap.style.transform = "rotateX(180deg)";

  // Reveal paper
  paper.style.opacity = "1";
  paper.style.transform = "translateX(-50%) translateY(0)";

  // Play sound
  openSound.play();

  opened = true;
});

// Button click → go to landing page
document.getElementById("openLanding").addEventListener("click", () => {
  window.location.href = "landing.html";
});
