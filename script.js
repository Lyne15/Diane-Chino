// --- Element Definitions ---
const landingScreen = document.getElementById('landingScreen');
const startButton = document.getElementById('startButton');
const mainContent = document.getElementById('mainContent');
const bgVideo = document.getElementById('bgVideo');
const bgMusic = document.getElementById('bgMusic');

const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const closeBtn = document.getElementById('closeBtn');
const detailsContainer = document.getElementById('fullDetailsContainer');
const cursorHint = document.getElementById('cursorHint'); 

const nameInputContainer = document.getElementById('nameInputContainer');
const nameInput = document.getElementById('guestNameInput');
const submitButton = document.getElementById('submitNameButton');
const nameError = document.getElementById('nameError');

// --- State Variables ---
let detailsLoaded = false;
let personalizedMessageShown = false; 
let guestData = []; 
let personalizedGreeting = {}; 
let nameVerified = false; 
let hintTimer;

const DEFAULT_MESSAGE = {
    message: "We appreciate you visiting our invitation. While we couldn't find a special note, please enjoy the details below. We are so happy to have you!",
    name: "Esteemed Guest"
};


// --- Helper Functions (Normalization/Lookup) ---

function normalizeName(input) {
    if (!input) return "";
    return input
        .trim()
        .replace(/[-\s]/g, '')
        .toUpperCase();
}

function findMatchingGuest(input) {
    if (!input) return null;
    
    for (const guest of guestData) {
        if (guest.names.includes(input)) {
            return {
                message: guest.message,
                name: guest.names[0] 
            };
        }
    }
    return null;
}

async function loadDataAndDetails() {
    if (detailsLoaded) return; 
    
    // 1. Load Guest Data
    try {
        const response = await fetch('./guestData.json');
        guestData = await response.json();
    } catch (error) {
        console.error('Error loading guest list:', error);
    }
    
    // 2. Load Invitation Details (HTML)
    try {
        const response = await fetch('./invitationDetails.html');
        detailsContainer.innerHTML = await response.text();
        detailsLoaded = true;
        
        // Target the content inside the invitationDetails.html 
        const messageDiv = document.createElement('div');
        messageDiv.id = 'personalizedGreeting';
        // Apply necessary inline styles (overridden by CSS, but good practice)
        messageDiv.style.marginTop = '40px';
        messageDiv.style.marginBottom = '20px';
        messageDiv.style.padding = '20px';
        messageDiv.style.backgroundColor = '#E5E7E4';
        messageDiv.style.borderTop = '2px dashed #757C6A';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.fontSize = '1.1rem';
        messageDiv.style.fontStyle = 'italic';
        messageDiv.style.maxWidth = '600px';
        messageDiv.style.margin = '40px auto 20px auto';
        
        detailsContainer.appendChild(messageDiv); 
        
    } catch (error) {
        console.error('Error loading details:', error);
    }
}

function showPersonalizedMessage() {
    if (!detailsLoaded || personalizedMessageShown) return;
    
    const messageElement = document.getElementById('personalizedGreeting');
    if (messageElement) {
        const rawName = nameInput.value.trim();
        const actualName = personalizedGreeting.name || rawName || DEFAULT_MESSAGE.name;
        const messageToShow = personalizedGreeting.message || DEFAULT_MESSAGE.message;
        
        messageElement.innerHTML = `<strong>A Special Message for ${actualName}:</strong><br>${messageToShow}`;
        personalizedMessageShown = true;
    }
}

// --- Motion Effect Helper (Glitter/Confetti) ---
function triggerBridgertonConfetti(element) {
    const rect = element.getBoundingClientRect();
    const count = 30; // Number of "glitters"
    
    for (let i = 0; i < count; i++) {
        const glitter = document.createElement('div');
        glitter.classList.add('bridgerton-glitter');
        
        // Random position near the center of the element
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.3;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.3;
        
        glitter.style.left = `${x}px`;
        glitter.style.top = `${y}px`;
        glitter.style.backgroundColor = Math.random() > 0.5 ? '#D4AF37' : '#939A88'; // Gold or Sage Green
        
        // Random size and rotation
        const size = Math.random() * 5 + 3;
        glitter.style.width = `${size}px`;
        glitter.style.height = `${size}px`;
        
        document.body.appendChild(glitter);

        // Random trajectory
        const finalX = x + (Math.random() - 0.5) * 400;
        const finalY = y - 50 + (Math.random() - 0.5) * 200; // Mostly upward/outward
        
        glitter.animate([
            { transform: `scale(${Math.random() * 0.8 + 0.2}) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0 },
            { transform: `translate(${finalX - x}px, ${finalY - y}px) rotate(${Math.random() * 720}deg)`, opacity: 0, offset: 1 }
        ], {
            duration: 1500 + Math.random() * 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Clean up
        setTimeout(() => glitter.remove(), 2500);
    }
}


// --- Step 1: Landing Screen Click Handler ---

startButton.addEventListener('click', () => {
    landingScreen.classList.add('hidden');
    
    mainContent.classList.add('active');
    document.querySelector('.video-background').classList.add('active');
    
    bgVideo.muted = true;
    bgVideo.play();
    bgMusic.play();
    
    // Envelope appears after 6 seconds
    setTimeout(showEnvelope, 6000); 
});

// --- Step 2: Envelope Display and Hint ---

function showEnvelope() {
    envelope.classList.add('visible');
    
    // After 2 seconds, show the glow and cursor hint
    hintTimer = setTimeout(() => {
        envelope.classList.add('glowing');
        cursorHint.classList.add('active');
    }, 2000); 
    
    loadDataAndDetails(); 
}

// --- Step 3: First Click (Show Name Input ONLY) ---

envelope.addEventListener('click', () => {
    // Kung verified na ang pangalan, huwag nang gawin ito
    if (nameVerified) return; 
    
    // Kung active na ang input container, huwag nang i-trigger ulit
    if (nameInputContainer.classList.contains('active')) return; 

    // Stop hint/glow animations and floating
    clearTimeout(hintTimer);
    envelope.classList.remove('glowing');
    cursorHint.classList.remove('active');
    envelope.classList.add('input-active'); // Stops float animation

    // Show the name input box over everything
    nameInputContainer.classList.add('active');
    nameInput.focus();
});


// --- Step 4/5: Name Submission (Open Envelope and Expand Card) ---

submitButton.addEventListener('click', () => {
    const rawInput = nameInput.value;
    const normalized = normalizeName(rawInput);
    
    if (normalized.length === 0) {
        nameError.textContent = "Please enter your first name.";
        return;
    }

    const match = findMatchingGuest(normalized);
    
    if (match) {
        personalizedGreeting = match;
        nameVerified = true;
        nameError.textContent = "";
        
        // Itago ang input box
        nameInputContainer.classList.remove('active'); 
        
        // 1. Open Envelope Animation (Lid rotates, card slides up)
        envelope.classList.add('open');
        
        // 2. Trigger the magical effect!
        // (Ginagawa ito sa envelope wrapper para sa mas malawak na spread)
        triggerBridgertonConfetti(envelope); 
        
        // 3. Expand Card to Full Screen (Wait for the envelope to open first)
        setTimeout(() => {
            card.classList.add('full-screen');
            document.body.style.overflow = 'hidden'; 
            
            // 4. Show Personalized Message
            showPersonalizedMessage();
        }, 1000); 

    } else {
        nameError.textContent = "Name not found. Please check your spelling or contact the host.";
    }
});


// 5. Close Button Handler
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    card.classList.remove('full-screen');
    document.body.style.overflow = 'hidden'; 
});