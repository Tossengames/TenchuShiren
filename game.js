// ===========================================
// TENCHU SHIREN - GAME ENGINE
// ===========================================

// Global variables
let playerName = "Shadow Warrior";
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let gameActive = false;

// Fallback questions (in case JSON doesn't load)
const fallbackQuestions = [
    {
        question: "A figure stands in the moonlight with silver hair. Identify this shadow.",
        options: ["Rikimaru", "Onikage", "Tatsumaru", "Lord Gohda"],
        answer: "Rikimaru",
        commentator: "rikimaru"
    },
    {
        question: "Which tool is essential for reaching high castle rooftops?",
        options: ["Shuriken", "Grappling Hook", "Caltrops", "Smoke Bomb"],
        answer: "Grappling Hook",
        commentator: "ayame"
    },
    {
        question: "A guard is patrolling alone. He stops to investigate a noise. What is your move?",
        options: ["Stealth Kill", "Wait in shadows", "Distract with stone", "Open Combat"],
        answer: "Wait in shadows",
        commentator: "rikimaru"
    },
    {
        question: "Is it honorable to kill a sleeping enemy to complete a mission?",
        options: ["Yes", "No", "Depends", "Only if spotted"],
        answer: "Yes",
        commentator: "tatsumaru"
    },
    {
        question: "What is the primary law of the Azuma Shinobi?",
        options: ["Serve in shadow", "Kill for gold", "Seek glory", "Rule the land"],
        answer: "Serve in shadow",
        commentator: "rikimaru"
    }
];

// ==================== SCREEN FUNCTIONS ====================

// Show player name screen
function showPlayerNameScreen() {
    console.log("showPlayerNameScreen called");
    hideAllScreens();
    document.getElementById('player-name-screen').classList.remove('hidden');
    document.getElementById('player-name-input').focus();
}

// Show info screen
function showInfo() {
    console.log("showInfo called");
    hideAllScreens();
    document.getElementById('info').classList.remove('hidden');
}

// Show supporters screen
function showSupporters() {
    console.log("showSupporters called");
    hideAllScreens();
    document.getElementById('supporters-screen').classList.remove('hidden');
    
    // Update supporter message
    const messageEl = document.getElementById('supporter-message');
    if (messageEl && typeof getSupporterAppreciation === 'function') {
        messageEl.textContent = getSupporterAppreciation();
    }
}

// Return to main menu
function backToMenu() {
    console.log("backToMenu called");
    hideAllScreens();
    document.getElementById('menu').classList.remove('hidden');
    gameActive = false;
}

// Hide all screens
function hideAllScreens() {
    const screens = ['menu', 'player-name-screen', 'info', 'supporters-screen', 'game'];
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('hidden');
    });
}

// ==================== GAME FUNCTIONS ====================

// Set player name and start game
function setPlayerName() {
    const input = document.getElementById('player-name-input');
    if (input && input.value.trim() !== '') {
        playerName = input.value.trim();
        console.log("Player name set to:", playerName);
    }
    
    startGame();
}

// Start the game
function startGame() {
    console.log("startGame called");
    
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    gameActive = true;
    
    // Load questions
    loadQuestions();
    
    // Show game screen
    hideAllScreens();
    document.getElementById('game').classList.remove('hidden');
    
    // Load first question
    loadQuestion();
}

// Load questions from JSON or use fallback
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (response.ok) {
            const data = await response.json();
            // Randomly select 5 questions
            questions = data.sort(() => Math.random() - 0.5).slice(0, 5);
            console.log("Loaded questions from JSON");
        } else {
            throw new Error('Failed to load questions.json');
        }
    } catch (error) {
        console.log("Using fallback questions:", error);
        questions = [...fallbackQuestions]; // Copy fallback questions
    }
}

// Load current question
function loadQuestion() {
    if (!gameActive) return;
    
    // Check if game is over
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update question text
    document.getElementById('question-text').textContent = 
        `Trial ${currentQuestionIndex + 1}: ${question.question}`;
    
    // Clear and create options
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn-ninja';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, question.answer, question.commentator);
        optionsDiv.appendChild(button);
    });
    
    // Show question box
    document.getElementById('question-box').classList.remove('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('supporter-box').classList.add('hidden');
    document.getElementById('result-box').classList.add('hidden');
}

// Check answer
function checkAnswer(selected, correct, commentator) {
    const isCorrect = selected === correct;
    
    if (isCorrect) {
        score++;
        createVFX('correct');
    } else {
        createVFX('incorrect');
    }
    
    // Show feedback
    showFeedback(isCorrect, commentator);
}

// Show feedback with character comment
function showFeedback(isCorrect, commentator) {
    let comment, characterName, portrait;
    
    // Get character comment
    if (typeof getCharacterComment === 'function') {
        comment = getCharacterComment(commentator, isCorrect);
    } else {
        comment = isCorrect ? "Correct. Well done." : "Incorrect. Study the scrolls.";
    }
    
    // Get character name
    if (typeof getCharacterDisplayName === 'function') {
        characterName = getCharacterDisplayName(commentator);
    } else {
        characterName = "Master";
    }
    
    // Get character portrait
    if (typeof getCharacterPortrait === 'function') {
        portrait = getCharacterPortrait(commentator);
    }
    
    // Update feedback display
    document.getElementById('feedback-text').textContent = comment;
    document.getElementById('feedback-name').textContent = characterName + ":";
    
    if (portrait) {
        document.getElementById('feedback-portrait').style.backgroundImage = `url('${portrait}')`;
    }
    
    // Show feedback box
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('feedback-box').classList.remove('hidden');
}

// Next question
function nextQuestion() {
    currentQuestionIndex++;
    
    // Check if we should show a supporter
    if (currentQuestionIndex < questions.length && Math.random() < 0.3) {
        showRandomSupporter();
        return;
    }
    
    loadQuestion();
}

// Show random supporter
function showRandomSupporter() {
    if (typeof supporters !== 'undefined' && supporters.length > 0) {
        const randomIndex = Math.floor(Math.random() * supporters.length);
        const supporter = supporters[randomIndex];
        
        let appreciation = "The Azuma clan honors its allies.";
        if (typeof getSupporterAppreciation === 'function') {
            appreciation = getSupporterAppreciation();
        }
        
        document.getElementById('supporter-name').textContent = supporter.name;
        document.getElementById('supporter-text').textContent = 
            `${appreciation} ${supporter.name} stands with the Azuma.`;
        
        // Set random character portrait
        const characters = ['rikimaru', 'ayame', 'tatsumaru'];
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        if (typeof getCharacterPortrait === 'function') {
            const portrait = getCharacterPortrait(randomChar);
            if (portrait) {
                document.getElementById('supporter-portrait').style.backgroundImage = `url('${portrait}')`;
            }
        }
        
        document.getElementById('feedback-box').classList.add('hidden');
        document.getElementById('supporter-box').classList.remove('hidden');
    } else {
        loadQuestion();
    }
}

// Hide supporter box
function hideSupporterBox() {
    document.getElementById('supporter-box').classList.add('hidden');
    loadQuestion();
}

// Show results
function showResults() {
    const percentage = (score / questions.length) * 100;
    let rank, title, description;
    
    if (percentage >= 90) {
        rank = "GRAND MASTER";
        title = "Shadow of Perfection";
        description = `${playerName}, your mastery is absolute. The Azuma clan honors you.`;
    } else if (percentage >= 70) {
        rank = "MASTER";
        title = "Azure Shadow";
        description = `${playerName}, your skills are exceptional.`;
    } else if (percentage >= 50) {
        rank = "JOURNEYMAN";
        title = "Silent Blade";
        description = `${playerName}, you show promise. Continue your training.`;
    } else if (percentage >= 30) {
        rank = "INITIATE";
        title = "Whispering Leaf";
        description = `${playerName}, you have begun the path. Study more.`;
    } else {
        rank = "FAILED";
        title = "Visible Target";
        description = `${playerName}, your understanding is lacking. Return to training.`;
    }
    
    // Update result display
    document.getElementById('result-rank').textContent = rank;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-text').textContent = description;
    
    // Set character portrait based on rank
    let character;
    if (percentage >= 70) character = 'rikimaru';
    else if (percentage >= 50) character = 'ayame';
    else character = 'tatsumaru';
    
    if (typeof getCharacterPortrait === 'function') {
        const portrait = getCharacterPortrait(character);
        if (portrait) {
            document.getElementById('result-portrait').style.backgroundImage = `url('${portrait}')`;
        }
    }
    
    // Show results
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('supporter-box').classList.add('hidden');
    document.getElementById('result-box').classList.remove('hidden');
}

// Create VFX
function createVFX(type) {
    const canvas = document.getElementById('vfx-canvas');
    if (!canvas) {
        // Create canvas if it doesn't exist
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'vfx-canvas';
        newCanvas.style.position = 'fixed';
        newCanvas.style.top = '0';
        newCanvas.style.left = '0';
        newCanvas.style.zIndex = '1';
        newCanvas.style.pointerEvents = 'none';
        document.body.appendChild(newCanvas);
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (type === 'correct') {
        // Green slash
        drawSlash(ctx, 0, 0, canvas.width, canvas.height, '#00ff00');
    } else if (type === 'incorrect') {
        // Red slash
        drawSlash(ctx, canvas.width, 0, 0, canvas.height, '#ff0000');
    }
    
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 300);
}

// Draw slash effect
function drawSlash(ctx, x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// ==================== INITIALIZATION ====================

// Initialize on page load
window.addEventListener('load', function() {
    console.log("Game initialized");
    
    // Make sure menu is visible
    backToMenu();
    
    // Add VFX canvas
    if (!document.getElementById('vfx-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'vfx-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
    }
});