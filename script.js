const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const closeBtn = document.getElementById('closeBtn');

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
});

card.addEventListener('click', (e) => {
    // ...
    if (envelope.classList.contains('open')) {
        // Add full-screen class to both card AND wrapper
        envelope.classList.add('card-expanded'); 
        card.classList.add('full-screen');
    }
});

closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.remove('full-screen');
});
