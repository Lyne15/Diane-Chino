// Button to reveal special message
const revealBtn = document.getElementById('revealBtn');
const specialMessage = document.getElementById('specialMessage');

revealBtn.addEventListener('click', () => {
    specialMessage.classList.toggle('hidden');
});
