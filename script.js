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
    message: "We appreciate you visiting our invitation. We are so happy to have you!",
    name: "Esteemed Guest"
};

// --- Helper Functions ---

function normalizeName(input) {
    if (!input) return "";
    return input.trim().replace(/[-\s]/g, '').toUpperCase();
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

// FIX: Function para patakbuhin ang script sa loob ng invitationDetails.html
function executeInjectedScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        newScript.text = oldScript.text;
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
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
        const html = await response.text();
        detailsContainer.innerHTML = html;
        
        // Patakbuhin ang scripts para sa video, timer, at cube
        executeInjectedScripts(detailsContainer);
        
        detailsLoaded = true;
        
        // Create Personalized Greeting placeholder
        const messageDiv = document.createElement('div');
        messageDiv.id = 'personalizedGreeting';
        messageDiv.className = 'invitation-scrollable-content'; // Match your CSS class
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

function triggerBridgertonConfetti(element) {
    const rect = element.getBoundingClientRect();
    const count = 30; 
    for (let i = 0; i < count; i++) {
        const glitter = document.createElement('div');
        glitter.classList.add('bridgerton-glitter');
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.3;
        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.3;
        glitter.style.left = `${x}px`;
        glitter.style.top = `${y}px`;
        glitter.style.backgroundColor = Math.random() > 0.5 ? '#D4AF37' : '#939A88'; 
        const size = Math.random() * 5 + 3;
        glitter.style.width = `${size}px`;
        glitter.style.height = `${size}px`;
        document.body.appendChild(glitter);
        const finalX = x + (Math.random() - 0.5) * 400;
        const finalY = y - 50 + (Math.random() - 0.5) * 200; 
        glitter.animate([
            { transform: `scale(${Math.random() * 0.8 + 0.2}) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0 },
            { transform: `translate(${finalX - x}px, ${finalY - y}px) rotate(${Math.random() * 720}deg)`, opacity: 0, offset: 1 }
        ], { duration: 1500 + Math.random() * 1000, easing: 'ease-out', fill: 'forwards' });
        setTimeout(() => glitter.remove(), 2500);
    }
}

// --- Event Handlers ---

startButton.addEventListener('click', () => {
    landingScreen.style.display = 'none';
    mainContent.classList.add('active');
    document.querySelector('.video-background').classList.add('active');
    bgVideo.play().catch(e => console.log("Video play blocked"));
    bgMusic.play().catch(e => console.log("Music play blocked"));
    setTimeout(showEnvelope, 6000); 
});

function showEnvelope() {
    envelope.classList.add('visible');
    hintTimer = setTimeout(() => {
        envelope.classList.add('glowing');
        cursorHint.classList.add('active');
    }, 2000); 
    loadDataAndDetails(); 
}

envelope.addEventListener('click', () => {
    if (nameVerified || nameInputContainer.classList.contains('active')) return; 
    clearTimeout(hintTimer);
    envelope.classList.remove('glowing');
    cursorHint.classList.remove('active');
    envelope.classList.add('input-active');
    nameInputContainer.classList.add('active');
    nameInput.focus();
});

submitButton.addEventListener('click', () => {
    const rawInput = nameInput.value;
    const normalized = normalizeName(rawInput);
    
    if (normalized.length === 0) {
        nameError.textContent = "Please enter your first name.";
        return;
    }

    const match = findMatchingGuest(normalized);
    
    if (match || normalized === "GUEST") { // Allow "GUEST" for testing
        personalizedGreeting = match || DEFAULT_MESSAGE;
        nameVerified = true;
        nameError.textContent = "";
        nameInputContainer.classList.remove('active'); 
        envelope.classList.add('open');
        triggerBridgertonConfetti(envelope); 
        
        setTimeout(() => {
            card.classList.add('full-screen');
            // IMPORTANT: Allow scrolling inside the card
            document.body.style.overflow = 'hidden'; 
            showPersonalizedMessage();
        }, 1000); 
    } else {
        nameError.textContent = "Name not found. Please check spelling.";
    }
});

closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    card.classList.remove('full-screen');
    // IMPORTANT: Return scrolling to the main body
    document.body.style.overflow = 'auto'; 
});