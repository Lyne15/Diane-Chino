const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const closeBtn = document.getElementById('closeBtn');

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
});

card.addEventListener('click', (e) => {
    // Check if the click was NOT on the close button itself
    if (e.target.id === 'closeBtn') {
        return; 
    }
    
    if (envelope.classList.contains('open') && !card.classList.contains('full-screen')) {
        // Add full-screen class to card
        card.classList.add('full-screen');
    }
});

closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the click from propagating to the card/envelope
    card.classList.remove('full-screen');
});