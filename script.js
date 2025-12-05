// script.js
const envelope = document.querySelector('.envelope');
const invitation = document.querySelector('.invitation');
const clickCue = document.querySelector('.click-cue');

let envelopeOpened = false;

envelope.addEventListener('click', () => {
  invitation.style.transform = 'translateY(0)'; // Half comes out
  envelopeOpened = true;
  clickCue.textContent = "⬆ Click the invitation";
});

invitation.addEventListener('click', () => {
  if (!envelopeOpened) return;
  invitation.classList.add('full');
  clickCue.style.display = 'none';
});
