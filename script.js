const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const closeBtn = document.getElementById('closeBtn');

// 🔥 7-Second Delay: Show envelope and start floating
setTimeout(() => {
    envelope.classList.add('appear');
}, 7000); // 7000ms = 7 seconds

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    
    // Optional: Stop the floating animation once clicked/opened
    envelope.style.animation = 'none';
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



     window.addEventListener('DOMContentLoaded', () => {
        const audio = document.getElementById('bgMusic');
        
        // Subukang i-play agad (baka gumana sa ibang lumang browser)
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Kung na-block ng browser, maghihintay ng first click para mag-play
                console.log("Autoplay blocked. Waiting for interaction.");
                
                // Mag-play kapag nag-click ang user kahit saan sa page
                document.body.addEventListener('click', () => {
                    audio.play();
                }, { once: true }); // { once: true } para isang beses lang mag-trigger
            });
        }
    });

