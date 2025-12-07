const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const closeBtn = document.getElementById('closeBtn');
const detailsContainer = document.getElementById('fullDetailsContainer'); 

// Variable para malaman kung na-load na ang details mula sa external file
let detailsLoaded = false; 

// 🔥 Function para i-load ang HTML content mula sa external file
async function loadInvitationDetails() {
    if (detailsLoaded) return; // Hindi na kailangan i-load ulit
    
    try {
        // Gamitin ang Fetch API para kunin ang content ng invitationDetails.html
        const response = await fetch('./invitationDetails.html');
        if (!response.ok) {
            throw new Error('Failed to load invitationDetails.html');
        }
        const htmlContent = await response.text();
        detailsContainer.innerHTML = htmlContent;
        detailsLoaded = true;
    } catch (error) {
        console.error('Error loading details:', error);
        detailsContainer.innerHTML = '<p style="color:red; text-align:center;">Could not load wedding details.</p>';
    }
}

// 7-Second Delay: Ipakita ang envelope at simulan ang floating animation
setTimeout(() => {
    envelope.classList.add('appear');
}, 7000); 

// 1. Click envelope to open it
envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    envelope.style.animation = 'none';
});

// 2. Click the card to go full screen
card.addEventListener('click', (e) => {
    // Siguraduhin na hindi ang close button ang na-click
    if (e.target.id === 'closeBtn') {
        return; 
    }
    
    // Tiyakin na naka-open muna ang envelope bago mag-full screen
    if (envelope.classList.contains('open') && !card.classList.contains('full-screen')) {
        // I-load ang scrollable details
        loadInvitationDetails(); 
        
        card.classList.add('full-screen');
        document.body.style.overflow = 'hidden'; 

        // 🔥 NEW LINE: Siguraduhin na ang card ay naka-scroll sa pinaka-itaas
        card.scrollTop = 0; 
    }
});

// 3. Click the close button to exit full screen
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Pigilan ang pag-propagate ng click sa card
    card.classList.remove('full-screen');
    // Ibalik ang scroll settings ng body (still hidden because of video background)
    document.body.style.overflow = 'hidden'; 
});


// --- Audio Autoplay Logic ---
window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgMusic');
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Maghihintay ng first user interaction para mag-play
            document.body.addEventListener('click', () => {
                audio.play();
            }, { once: true }); 
        });
    }
});