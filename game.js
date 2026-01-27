// game.js - Fixed flow with character feedback only at results

// Game state
let playerName = "Shadow Warrior";
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let gameActive = false;
let correctAnswers = 0;
let playerAnswers = []; // Store each answer for results feedback
let showAppreciation = false;

// Game elements
let currentScreen = 'menu';

// Fallback questions
const fallbackQuestions = [
    {
        question: "A shadow moves with silver hair under the moonlight. Who is this?",
        options: ["Rikimaru", "Onikage", "Tatsumaru", "Lord Gohda"],
        answer: "Rikimaru",
        commentator: "rikimaru",
        category: "Characters",
        difficulty: "Medium"
    },
    {
        question: "Which tool lets you scale castle walls silently?",
        options: ["Grappling Hook", "Shuriken", "Smoke Bomb", "Poison Dart"],
        answer: "Grappling Hook",
        commentator: "ayame",
        category: "Tools",
        difficulty: "Easy"
    },
    {
        question: "You're trapped in a room with two guards facing each other. What do you do?",
        options: ["Wait for patrol patterns", "Create a distraction", "Attack both", "Use smoke bomb"],
        answer: "Wait for patrol patterns",
        commentator: "rikimaru",
        category: "Stealth",
        difficulty: "Hard"
    },
    {
        question: "Your target sleeps, but his family is nearby. Do you proceed?",
        options: ["Wait for another chance", "Complete the mission", "Take family hostage", "Abandon mission"],
        answer: "Wait for another chance",
        commentator: "ayame",
        category: "Ethics",
        difficulty: "Hard"
    },
    {
        question: "What is the Azuma clan's primary weapon against corruption?",
        options: ["Stealth Assassination", "Open Warfare", "Diplomacy", "Bribery"],
        answer: "Stealth Assassination",
        commentator: "rikimaru",
        category: "Lore",
        difficulty: "Medium"
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
    playerAnswers = [];
    showAppreciation = false;
    
    // Load questions
    await loadQuestions();
    
    // Show game screen
    showScreen('game');
    
    // Show question screen within game
    showGameScreen('question');
    
    // Update player display
    document.getElementById('current-player').textContent = playerName.toUpperCase();
    
    // Create game start VFX
    if (typeof createGameVFX === 'function') {
        createGameVFX('gameStart');
    }
    
    // Load first question
    setTimeout(() => {
        loadQuestion();
    }, 500);
}

// Show specific screen within game
function showGameScreen(screenType) {
    const screens = ['question-screen', 'appreciation-screen', 'result-screen'];
    
    // Hide all game screens
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        }
    });
    
    // Show requested screen
    let screenToShow;
    switch(screenType) {
        case 'question':
            screenToShow = 'question-screen';
            break;
        case 'appreciation':
            screenToShow = 'appreciation-screen';
            break;
        case 'results':
            screenToShow = 'result-screen';
            break;
    }
    
    const screen = document.getElementById(screenToShow);
    if (screen) {
        screen.classList.remove('hidden');
        setTimeout(() => {
            screen.classList.add('active');
        }, 50);
    }
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
    
    // Check if all questions are answered
    if (currentQuestionIndex >= questions.length) {
        // Decide if we should show appreciation (40% chance)
        showAppreciation = Math.random() < 0.4;
        
        if (showAppreciation && typeof supporters !== 'undefined' && supporters.length > 0) {
            showAppreciationScreen();
        } else {
            showResults();
        }
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update UI
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('trial-number').textContent = currentQuestionIndex + 1;
    document.getElementById('current-trial').textContent = currentQuestionIndex + 1;
    document.getElementById('progress-current').textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    
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
        
        // Add click handler
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
            
            // Check answer
            checkAnswer(option, question.answer, question.commentator);
        };
        
        optionsDiv.appendChild(button);
    });
    
    // Show question screen
    showGameScreen('question');
}

function checkAnswer(selected, correct, commentator) {
    const isCorrect = selected === correct;
    
    // Store player's answer for results feedback
    playerAnswers.push({
        selected: selected,
        correct: correct,
        isCorrect: isCorrect,
        commentator: commentator
    });
    
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
    
    // Move to next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 800);
}

// ==================== APPRECIATION SCREEN ====================

function showAppreciationScreen() {
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
        `${characterName} acknowledges your support.`,
        `${characterName} honors those who stand with the Azuma.`,
        `From the shadows, ${characterName} gives thanks.`,
        `${characterName} recognizes true allies of the clan.`
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
    showGameScreen('appreciation');
    
    // Create VFX
    if (typeof createGameVFX === 'function') {
        createGameVFX('appreciation');
    }
    
    console.log(`Showing appreciation for supporter: ${supporter.name}`);
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
        description = `${playerName}, your mastery is absolute.`;
        symbol = "👑";
    } else if (percentage >= 70) {
        rank = "MASTER";
        title = "Azure Shadow";
        description = `${playerName}, you are a true ninja.`;
        symbol = "⚔️";
    } else if (percentage >= 50) {
        rank = "JOURNEYMAN";
        title = "Silent Blade";
        description = `${playerName}, you show great potential.`;
        symbol = "🗡️";
    } else if (percentage >= 30) {
        rank = "INITIATE";
        title = "Whispering Leaf";
        description = `${playerName}, you have taken your first steps.`;
        symbol = "🍃";
    } else {
        rank = "FAILED";
        title = "Visible Target";
        description = `${playerName}, the shadows reject you.`;
        symbol = "💀";
    }
    
    // Update results display
    document.getElementById('result-rank').textContent = rank;
    document.getElementById('result-title').textContent = title;
    document.getElementById('correct-count').textContent = `${correctAnswers}`;
    document.getElementById('total-count').textContent = `${totalQuestions}`;
    document.getElementById('success-rate').textContent = `${Math.round(percentage)}%`;
    document.getElementById('rank-symbol').textContent = symbol;
    
    // Get character feedback based on performance
    let feedbackCharacter;
    let feedbackMessage = "";
    
    if (percentage >= 70) {
        feedbackCharacter = 'rikimaru';
        feedbackMessage = getFinalFeedback('rikimaru', percentage);
    } else if (percentage >= 50) {
        feedbackCharacter = 'ayame';
        feedbackMessage = getFinalFeedback('ayame', percentage);
    } else {
        feedbackCharacter = 'tatsumaru';
        feedbackMessage = getFinalFeedback('tatsumaru', percentage);
    }
    
    // Update feedback
    document.getElementById('feedback-text').textContent = feedbackMessage;
    
    // Set character portrait
    if (typeof getCharacterPortrait === 'function') {
        const portrait = getCharacterPortrait(feedbackCharacter);
        if (portrait) {
            document.getElementById('feedback-portrait').style.backgroundImage = `url('${portrait}')`;
        }
    }
    
    // Show results screen
    showGameScreen('results');
    
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

// Get final character feedback based on performance
function getFinalFeedback(character, percentage) {
    if (!character || !percentage) {
        return "Your journey ends here.";
    }
    
    const characterName = typeof getCharacterDisplayName === 'function' 
        ? getCharacterDisplayName(character) 
        : "Master";
    
    if (character === 'rikimaru') {
        if (percentage >= 90) {
            return `${playerName}. Your discipline is flawless. You move without sound, strike without hesitation. The Azuma clan has found its new shadow.`;
        } else if (percentage >= 70) {
            return `${playerName}. You understand the way of the ninja. Your restraint is commendable, your judgment sound. Continue your training.`;
        } else if (percentage >= 50) {
            return `${playerName}. You show potential, but your mind is not yet sharp enough. Study the scrolls, meditate on your mistakes.`;
        } else {
            return `${playerName}. Your lack of discipline is concerning. The shadows do not welcome the careless. Return to basics or find another path.`;
        }
    }
    
    if (character === 'ayame') {
        if (percentage >= 90) {
            return `${playerName}! Your intuition is extraordinary! You move with the grace of falling cherry blossoms. The clan is honored by your skill!`;
        } else if (percentage >= 70) {
            return `${playerName}! Well done! Your cleverness serves you well. A true kunoichi thinks three steps ahead. Keep this mindset.`;
        } else if (percentage >= 50) {
            return `${playerName}. You have spirit, but need more subtlety. A ninja must be like water - adaptable, flowing, unstoppable.`;
        } else {
            return `${playerName}. Too direct, too obvious. The shadows demand elegance. Perhaps this path is not for you.`;
        }
    }
    
    if (character === 'tatsumaru') {
        if (percentage >= 90) {
            return `Hmph. ${playerName}. You understand true power. The weak perish, the strong rule. You could achieve greatness... if you embrace it fully.`;
        } else if (percentage >= 70) {
            return `${playerName}. You grasp that strength determines fate. Sentiment is a chain that binds the weak. Break yours.`;
        } else if (percentage >= 50) {
            return `${playerName}. You show glimpses of understanding, but still cling to false honor. Power cares not for morality.`;
        } else {
            return `${playerName}. Weak. Pathetic. The shadows have no place for sentimentality. Either grow stronger or be crushed.`;
        }
    }
    
    return "The trial is complete. Your fate is sealed.";
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
    
    // Handle mobile back button
    window.addEventListener('popstate', function() {
        if (currentScreen === 'game' && gameActive) {
            backToMenu();
        }
    });
    
    console.log('Game initialized successfully');
});

// Export functions for global access
window.showPlayerNameScreen = showPlayerNameScreen;
window.showInfo = showInfo;
window.showSupporters = showSupporters;
window.backToMenu = backToMenu;
window.setPlayerName = setPlayerName;
window.startGame = startGame;
window.showResults = showResults; // Make accessible from appreciation screen