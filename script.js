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
        // Assuming invitationDetails.html contains a scrollable container or is directly fillable
        // We'll append the personalized message at the end of the detailsContainer content.
        
        const messageDiv = document.createElement('div');
        messageDiv.id = 'personalizedGreeting';
        // Apply necessary inline styles for visibility
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
        // Use the verified name if available, otherwise use the raw input (if not empty), else default.
        const rawName = nameInput.value.trim();
        const actualName = personalizedGreeting.name || rawName || DEFAULT_MESSAGE.name;
        const messageToShow = personalizedGreeting.message || DEFAULT_MESSAGE.message;
        
        messageElement.innerHTML = `<strong>A Special Message for ${actualName}:</strong><br>${messageToShow}`;
        personalizedMessageShown = true;
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
        
        // 2. Expand Card to Full Screen (Wait for the envelope to open first)
        setTimeout(() => {
            card.classList.add('full-screen');
            document.body.style.overflow = 'hidden'; 
            
            // 3. Show Personalized Message
            showPersonalizedMessage();
        }, 1000); // <-- Tiniyak ang 1000ms delay para sa smooth full-screen transition

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