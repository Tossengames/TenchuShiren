// game.js - Enhanced with supporter appreciation system

// Game state
let playerName = "Shadow Warrior";
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let gameActive = false;
let correctAnswers = 0;
let showAppreciationScreen = false;

// Game elements
let currentScreen = 'menu';

// Fallback questions
const fallbackQuestions = [
    {
        question: "A figure stands in the moonlight with silver hair. Identify this shadow.",
        options: ["Rikimaru", "Onikage", "Tatsumaru", "Lord Gohda"],
        answer: "Rikimaru",
        commentator: "rikimaru",
        category: "Characters",
        difficulty: "Medium"
    },
    {
        question: "Which tool is essential for reaching high castle rooftops?",
        options: ["Shuriken", "Grappling Hook", "Caltrops", "Smoke Bomb"],
        answer: "Grappling Hook",
        commentator: "ayame",
        category: "Tools",
        difficulty: "Easy"
    },
    {
        question: "A guard is patrolling alone. He stops to investigate a noise. What is your move?",
        options: ["Stealth Kill", "Wait in shadows", "Distract with stone", "Open Combat"],
        answer: "Wait in shadows",
        commentator: "rikimaru",
        category: "Stealth",
        difficulty: "Medium"
    },
    {
        question: "Is it honorable to kill a sleeping enemy to complete a mission?",
        options: ["Yes", "No", "Depends", "Only if spotted"],
        answer: "Yes",
        commentator: "tatsumaru",
        category: "Ethics",
        difficulty: "Hard"
    },
    {
        question: "What is the primary law of the Azuma Shinobi?",
        options: ["Serve in shadow", "Kill for gold", "Seek glory", "Rule the land"],
        answer: "Serve in shadow",
        commentator: "rikimaru",
        category: "Lore",
        difficulty: "Easy"
    }
];

// ==================== SCREEN MANAGEMENT ====================

// Show screen with animation
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    // Show requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.remove('hidden');
        setTimeout(() => {
            screen.classList.add('active');
        }, 50);
        
        // Update current screen
        currentScreen = screenId;
        
        // Trigger VFX for screen change
        if (typeof createGameVFX === 'function') {
            createGameVFX('screenChange');
        }
        
        console.log(`Showing screen: ${screenId}`);
    }
}

// Menu functions
function showPlayerNameScreen() {
    showScreen('player-name-screen');
    document.getElementById('player-name-input').focus();
}

function showInfo() {
    showScreen('info');
}

function showSupporters() {
    showScreen('supporters-screen');
    
    // Update supporter message
    const messageEl = document.getElementById('supporter-message');
    if (messageEl && typeof getSupporterAppreciation === 'function') {
        messageEl.textContent = getSupporterAppreciation();
    }
}

function backToMenu() {
    showScreen('menu');
    gameActive = false;
    
    // Create menu VFX
    if (typeof createGameVFX === 'function') {
        createGameVFX('menuOpen');
    }
}

// ==================== GAME FUNCTIONS ====================

function setPlayerName() {
    const input = document.getElementById('player-name-input');
    if (input && input.value.trim() !== '') {
        playerName = input.value.trim();
        console.log(`Player name: ${playerName}`);
    }
    
    startGame();
}

async function startGame() {
    console.log("Starting game...");
    
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    gameActive = true;
    showAppreciationScreen = false;
    
    // Load questions
    await loadQuestions();
    
    // Show game screen
    showScreen('game');
    
    // Update player display
    document.getElementById('current-player').textContent = playerName.toUpperCase();
    
    // Create game start VFX
    if (typeof createGameVFX === 'function') {
        createGameVFX('gameStart');
    }
    
    // Load first question
    setTimeout(() => {
        loadQuestion();
    }, 1000);
}

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (response.ok) {
            const data = await response.json();
            questions = data.sort(() => Math.random() - 0.5).slice(0, 5);
            console.log(`Loaded ${questions.length} questions`);
        } else {
            throw new Error('Failed to load questions');
        }
    } catch (error) {
        console.log("Using fallback questions");
        questions = [...fallbackQuestions];
    }
}

function loadQuestion() {
    if (!gameActive) return;
    
    // Check if game should show appreciation screen
    if (showAppreciationScreen) {
        showAppreciation();
        return;
    }
    
    // Check if game is over
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update UI
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('trial-number').textContent = currentQuestionIndex + 1;
    document.getElementById('current-trial').textContent = currentQuestionIndex + 1;
    
    // Update difficulty display
    const diffElement = document.querySelector('.diff-level');
    if (diffElement && question.difficulty) {
        diffElement.textContent = question.difficulty;
    }
    
    // Create options
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn-ninja';
        button.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        
        // Add click handler with animation
        button.onclick = () => {
            // Disable all buttons
            const allButtons = optionsDiv.querySelectorAll('button');
            allButtons.forEach(btn => {
                btn.disabled = true;
                btn.style.pointerEvents = 'none';
            });
            
            // Highlight selected button
            button.style.background = 'linear-gradient(145deg, #2a1a1a, #1a1111)';
            button.style.borderColor = '#8b0000';
            button.style.transform = 'scale(0.98)';
            
            // Check answer with delay for animation
            setTimeout(() => {
                checkAnswer(option, question.answer, question.commentator);
            }, 500);
        };
        
        optionsDiv.appendChild(button);
    });
    
    // Show question screen
    document.getElementById('question-box').classList.remove('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('appreciation-screen').classList.add('hidden');
    document.getElementById('result-box').classList.add('hidden');
}

function checkAnswer(selected, correct, commentator) {
    const isCorrect = selected === correct;
    
    if (isCorrect) {
        score += 100;
        correctAnswers++;
        
        // Create VFX
        if (typeof createGameVFX === 'function') {
            createGameVFX('correct');
        }
    } else {
        // Create VFX
        if (typeof createGameVFX === 'function') {
            createGameVFX('incorrect');
        }
    }
    
    // Show feedback
    showFeedback(isCorrect, commentator);
}

function showFeedback(isCorrect, commentator) {
    let comment, characterName, portrait;
    
    // Get character feedback
    if (typeof getCharacterComment === 'function') {
        comment = getCharacterComment(commentator, isCorrect);
    } else {
        comment = isCorrect ? "Correct. The shadows approve." : "Incorrect. Study harder.";
    }
    
    // Get character info
    if (typeof getCharacterDisplayName === 'function') {
        characterName = getCharacterDisplayName(commentator);
    } else {
        characterName = "Master";
    }
    
    if (typeof getCharacterPortrait === 'function') {
        portrait = getCharacterPortrait(commentator);
    }
    
    // Update feedback display
    document.getElementById('feedback-text').textContent = comment;
    document.getElementById('feedback-name').textContent = characterName.toUpperCase();
    
    if (portrait) {
        document.getElementById('feedback-portrait').style.backgroundImage = `url('${portrait}')`;
    }
    
    // Show feedback screen
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('feedback-box').classList.remove('hidden');
    
    // Check if we should show appreciation screen after this question
    if (currentQuestionIndex === Math.floor(questions.length / 2)) {
        showAppreciationScreen = true;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    
    // Load next question
    setTimeout(() => {
        loadQuestion();
    }, 300);
}

// ==================== APPRECIATION SCREEN ====================

function showAppreciation() {
    if (typeof supporters === 'undefined' || supporters.length === 0) {
        // Skip to results if no supporters
        showResults();
        return;
    }
    
    // Select random supporter
    const randomIndex = Math.floor(Math.random() * supporters.length);
    const supporter = supporters[randomIndex];
    
    // Select random Azuma character for appreciation
    const characters = ['rikimaru', 'ayame', 'tatsumaru'];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    
    // Get character portrait
    let portrait = '';
    if (typeof getCharacterPortrait === 'function') {
        portrait = getCharacterPortrait(randomCharacter);
    }
    
    // Get character name
    let characterName = "Azuma Master";
    if (typeof getCharacterDisplayName === 'function') {
        characterName = getCharacterDisplayName(randomCharacter);
    }
    
    // Create appreciation message
    const messages = [
        `The ${characterName} acknowledges your support.`,
        `${characterName} honors those who stand with the Azuma.`,
        `From the shadows, ${characterName} gives thanks.`,
        `${characterName} recognizes true allies of the clan.`,
        `The way of the ninja values loyal supporters.`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Update appreciation screen
    document.getElementById('appreciation-text').textContent = randomMessage;
    document.getElementById('honored-name').textContent = supporter.name;
    document.getElementById('honored-handle').textContent = supporter.handle || '';
    
    if (portrait) {
        document.getElementById('appreciation-portrait').style.backgroundImage = `url('${portrait}')`;
    }
    
    // Show appreciation screen
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('appreciation-screen').classList.remove('hidden');
    document.getElementById('result-box').classList.add('hidden');
    
    // Create VFX
    if (typeof createGameVFX === 'function') {
        createGameVFX('appreciation');
    }
    
    console.log(`Showing appreciation for supporter: ${supporter.name}`);
}

function continueFromAppreciation() {
    showAppreciationScreen = false;
    
    // Continue to next question or results
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// ==================== RESULTS SCREEN ====================

function showResults() {
    const totalQuestions = questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    let rank, title, description, symbol;
    
    // Determine rank
    if (percentage >= 90) {
        rank = "GRAND MASTER";
        title = "Shadow of Perfection";
        description = `${playerName}, your mastery is absolute. You move like a phantom, strike like lightning. The Azuma clan bows to your skill.`;
        symbol = "👑";
    } else if (percentage >= 70) {
        rank = "MASTER";
        title = "Azure Shadow";
        description = `${playerName}, you are a true ninja. Your skills honor the Azuma clan. Continue your path in darkness.`;
        symbol = "⚔️";
    } else if (percentage >= 50) {
        rank = "JOURNEYMAN";
        title = "Silent Blade";
        description = `${playerName}, you show great potential. Train harder, and the shadows will welcome you fully.`;
        symbol = "🗡️";
    } else if (percentage >= 30) {
        rank = "INITIATE";
        title = "Whispering Leaf";
        description = `${playerName}, you have taken your first steps. Study the scrolls, practice in silence.`;
        symbol = "🍃";
    } else {
        rank = "FAILED";
        title = "Visible Target";
        description = `${playerName}, the shadows reject you. Return to training or find another path.`;
        symbol = "💀";
    }
    
    // Update results display
    document.getElementById('result-rank').textContent = rank;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-text').textContent = description;
    document.getElementById('rank-symbol').textContent = symbol;
    document.getElementById('correct-count').textContent = `${correctAnswers}/${totalQuestions}`;
    document.getElementById('success-rate').textContent = `${Math.round(percentage)}%`;
    
    // Set character portrait based on rank
    let character;
    if (percentage >= 70) {
        character = 'rikimaru';
    } else if (percentage >= 50) {
        character = 'ayame';
    } else {
        character = 'tatsumaru';
    }
    
    if (typeof getCharacterPortrait === 'function') {
        const portrait = getCharacterPortrait(character);
        if (portrait) {
            document.getElementById('result-portrait').style.backgroundImage = `url('${portrait}')`;
        }
    }
    
    // Show results screen
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('appreciation-screen').classList.add('hidden');
    document.getElementById('result-box').classList.remove('hidden');
    
    // Create VFX based on result
    if (typeof createGameVFX === 'function') {
        if (percentage >= 50) {
            createGameVFX('victory');
        } else {
            createGameVFX('defeat');
        }
    }
    
    console.log(`Game completed. Score: ${correctAnswers}/${totalQuestions} (${percentage}%). Rank: ${rank}`);
}

// ==================== INITIALIZATION ====================

// Initialize on page load
window.addEventListener('load', function() {
    console.log('Tenchu Shiren - Enhanced Edition');
    
    // Initialize VFX
    if (typeof initVFX === 'function') {
        initVFX();
    }
    
    // Show main menu
    showScreen('menu');
    
    // Initialize supporters list
    if (typeof updateSupportersList === 'function') {
        updateSupportersList();
    }
    
    // Set up name input
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setPlayerName();
            }
        });
    }
    
    console.log('Game initialized successfully');
});

// Export functions for global access
window.showPlayerNameScreen = showPlayerNameScreen;
window.showInfo = showInfo;
window.showSupporters = showSupporters;
window.backToMenu = backToMenu;
window.setPlayerName = setPlayerName;
window.startGame = startGame;
window.nextQuestion = nextQuestion;
window.continueFromAppreciation = continueFromAppreciation;