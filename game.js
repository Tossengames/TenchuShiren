// ============================================
// TENCHU SHIREN - GAME ENGINE
// No preset questions or feedback - All external
// ============================================

// Game state
let playerName = "Nameless Warrior";
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let gameActive = false;
let correctAnswers = 0;
let playerAnswers = [];
let showAppreciation = false;

// Game elements
let currentScreen = 'menu';

// ==================== TENCHU RANKS SYSTEM ====================
const tenchuRanks = [
    {
        name: "GRAND MASTER",
        title: "天誅忍",
        symbol: "👑",
        description: "Perfect execution. Moves like a phantom.",
        minScore: 90
    },
    {
        name: "MASTER NINJA",
        title: "上忍",
        symbol: "⚔️",
        description: "Exceptional skill. A true shadow warrior.",
        minScore: 80
    },
    {
        name: "NINJA",
        title: "中忍",
        symbol: "🗡️",
        description: "Skilled operative. Reliable and precise.",
        minScore: 70
    },
    {
        name: "ASSASSIN",
        title: "殺し屋",
        symbol: "🎯",
        description: "Competent killer. Gets the job done.",
        minScore: 60
    },
    {
        name: "SHINOBI",
        title: "忍び",
        symbol: "🥷",
        description: "Capable infiltrator. Still learning.",
        minScore: 50
    },
    {
        name: "APPRENTICE",
        title: "見習い",
        symbol: "🍃",
        description: "Beginner ninja. Needs more training.",
        minScore: 40
    },
    {
        name: "FAILED",
        title: "失敗",
        symbol: "💀",
        description: "The shadows reject you. Try again.",
        minScore: 0
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
            throw new Error('Failed to load questions.json');
        }
    } catch (error) {
        console.error("Error loading questions:", error);
        // No fallback questions - game will not start
        alert("Failed to load questions. Please check questions.json file.");
        backToMenu();
        return;
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

// ==================== CHARACTER FEEDBACK SYSTEM ====================

function getFinalFeedback(character, percentage, rankName, playerName) {
    // Check if the new random feedback system is available
    if (typeof getCharacterResultFeedback === 'function') {
        // Convert rank name to match feedback keys (e.g., "GRAND MASTER" -> "grandMaster")
        const rankKey = rankName.toLowerCase()
            .split(' ')
            .map((word, index) => 
                index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join('');
        
        // Try to get random feedback
        const randomFeedback = getCharacterResultFeedback(character, rankKey, playerName);
        if (randomFeedback && randomFeedback !== "The trial ends here.") {
            return randomFeedback;
        }
    }
    
    // Fallback to original system if new system fails
    const characterName = typeof getCharacterDisplayName === 'function' 
        ? getCharacterDisplayName(character) 
        : "Master";
    
    if (character === 'rikimaru') {
        if (rankName === "GRAND MASTER") {
            return `${playerName}. Perfect. Your discipline is absolute. You have mastered the way of the shadow.`;
        } else if (rankName === "MASTER NINJA") {
            return `${playerName}. Excellent. Your judgment is sound, your movements precise.`;
        } else if (rankName === "NINJA") {
            return `${playerName}. Competent. You understand the basics, but true mastery requires more discipline.`;
        } else {
            return `${playerName}. You lack the focus required. The way of the ninja demands perfection.`;
        }
    }
    
    if (character === 'ayame') {
        if (rankName === "GRAND MASTER") {
            return `${playerName}! Absolutely brilliant! Your intuition is unmatched!`;
        } else if (rankName === "MASTER NINJA") {
            return `${playerName}! Well done! Your cleverness serves you well.`;
        } else if (rankName === "NINJA") {
            return `${playerName}. You show promise! With more training, you could become a true shadow.`;
        } else {
            return `${playerName}. Too direct, too obvious. The shadows demand elegance.`;
        }
    }
    
    if (character === 'tatsumaru') {
        if (rankName === "GRAND MASTER") {
            return `Hmph. ${playerName}. You understand true power. The weak perish, the strong rule.`;
        } else if (rankName === "MASTER NINJA") {
            return `${playerName}. Not bad. You grasp that strength determines fate.`;
        } else if (rankName === "NINJA") {
            return `${playerName}. Mediocre. You show glimpses of understanding, but still cling to false honor.`;
        } else {
            return `${playerName}. Weak. Pathetic. The shadows have no place for the feeble.`;
        }
    }
    
    return "The trial is complete. Your fate is sealed.";
}

// ==================== RESULTS SCREEN ====================

function showResults() {
    const totalQuestions = questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // Determine rank based on Tenchu system
    let rank = tenchuRanks[tenchuRanks.length - 1]; // Default to FAILED
    
    for (let i = 0; i < tenchuRanks.length; i++) {
        if (percentage >= tenchuRanks[i].minScore) {
            rank = tenchuRanks[i];
            break;
        }
    }
    
    // Update results display with Tenchu rank
    document.getElementById('result-rank').textContent = rank.name;
    document.getElementById('result-title').textContent = rank.title;
    document.getElementById('rank-symbol').textContent = rank.symbol;
    
    // Add rank description
    const rankDescription = document.createElement('div');
    rankDescription.className = 'rank-description';
    rankDescription.textContent = rank.description;
    
    const rankDisplay = document.querySelector('.rank-display');
    // Remove existing description if any
    const existingDesc = rankDisplay.querySelector('.rank-description');
    if (existingDesc) {
        existingDesc.remove();
    }
    rankDisplay.appendChild(rankDescription);
    
    // Get character feedback based on performance
    let feedbackCharacter;
    let feedbackMessage = "";
    
    if (percentage >= 70) {
        feedbackCharacter = 'rikimaru';
        feedbackMessage = getFinalFeedback('rikimaru', percentage, rank.name, playerName);
    } else if (percentage >= 50) {
        feedbackCharacter = 'ayame';
        feedbackMessage = getFinalFeedback('ayame', percentage, rank.name, playerName);
    } else {
        feedbackCharacter = 'tatsumaru';
        feedbackMessage = getFinalFeedback('tatsumaru', percentage, rank.name, playerName);
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
    
    console.log(`Game completed. Score: ${correctAnswers}/${totalQuestions} (${percentage}%). Rank: ${rank.name}`);
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

// ==================== GLOBAL EXPORTS ====================

// Export functions for global access
window.showPlayerNameScreen = showPlayerNameScreen;
window.showInfo = showInfo;
window.showSupporters = showSupporters;
window.backToMenu = backToMenu;
window.setPlayerName = setPlayerName;
window.startGame = startGame;
window.showResults = showResults;