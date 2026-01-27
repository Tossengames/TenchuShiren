// ============================================================
// TENCHU SHIREN - GAME LOGIC
// A fan tribute to the Tenchu series
// ============================================================

// Game State Variables
let playerName = "Unknown Shinobi";
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 5;
let questions = [];
let gameStarted = false;
let currentCommentator = 'rikimaru';

// DOM Elements
const menuScreen = document.getElementById('menu');
const playerNameScreen = document.getElementById('player-name-screen');
const infoScreen = document.getElementById('info');
const supportersScreen = document.getElementById('supporters-screen');
const gameScreen = document.getElementById('game');
const questionBox = document.getElementById('question-box');
const feedbackBox = document.getElementById('feedback-box');
const supporterBox = document.getElementById('supporter-box');
const resultBox = document.getElementById('result-box');

// ================== GAME INITIALIZATION ==================

// Initialize game on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tenchu Shiren initialized');
    
    // Ensure menu is visible on load
    showMenu();
    
    // Add keyboard support for player name input
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setPlayerName();
            }
        });
    }
});

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allQuestions = await response.json();
        
        // Select random questions for the game
        questions = allQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, totalQuestions);
            
        console.log(`Loaded ${questions.length} questions`);
        return true;
    } catch (error) {
        console.error('Error loading questions:', error);
        console.log('Using fallback questions from index.html');
        
        // Check if questions are defined in index.html
        if (typeof window.questions !== 'undefined' && window.questions.length > 0) {
            questions = window.questions.slice(0, totalQuestions);
            return true;
        }
        
        // Ultimate fallback - create basic questions
        questions = [
            {
                "question": "A figure stands in the moonlight with silver hair. Identify this shadow.",
                "options": ["Rikimaru", "Onikage", "Tatsumaru", "Lord Gohda"],
                "answer": "Rikimaru",
                "commentator": "rikimaru"
            },
            {
                "question": "Which tool is essential for reaching high castle rooftops?",
                "options": ["Shuriken", "Grappling Hook", "Caltrops", "Smoke Bomb"],
                "answer": "Grappling Hook",
                "commentator": "ayame"
            },
            {
                "question": "A guard is patrolling alone. He stops to investigate a noise. What is your move?",
                "options": ["Stealth Kill", "Wait in shadows", "Distract with stone", "Open Combat"],
                "answer": "Wait in shadows",
                "commentator": "rikimaru"
            },
            {
                "question": "Is it honorable to kill a sleeping enemy to complete a mission?",
                "options": ["Yes", "No", "Depends", "Only if spotted"],
                "answer": "Yes",
                "commentator": "tatsumaru"
            },
            {
                "question": "What is the primary law of the Azuma Shinobi?",
                "options": ["Serve in shadow", "Kill for gold", "Seek glory", "Rule the land"],
                "answer": "Serve in shadow",
                "commentator": "rikimaru"
            }
        ].slice(0, totalQuestions);
        return true;
    }
}

// ================== SCREEN NAVIGATION ==================

// Show main menu
function showMenu() {
    hideAllScreens();
    menuScreen.classList.remove('hidden');
    gameStarted = false;
    
    // Add visual effect
    createMenuVFX();
}

// Show player name screen
function showPlayerNameScreen() {
    hideAllScreens();
    playerNameScreen.classList.remove('hidden');
    
    // Focus on input field
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.value = '';
        nameInput.focus();
    }
    
    // Add visual effect
    createVFX('menu', '#d4af37');
}

// Show info screen
function showInfo() {
    hideAllScreens();
    infoScreen.classList.remove('hidden');
    
    // Add visual effect
    createVFX('info', '#8b0000');
}

// Show supporters screen
function showSupporters() {
    hideAllScreens();
    supportersScreen.classList.remove('hidden');
    
    // Update supporter list if function exists
    if (typeof updateSupportersList !== 'undefined') {
        updateSupportersList();
    }
    
    // Update appreciation message if function exists
    const messageElement = document.getElementById('supporter-message');
    if (messageElement && typeof getSupporterAppreciation !== 'undefined') {
        messageElement.textContent = getSupporterAppreciation();
    }
    
    // Add visual effect
    createVFX('supporters', '#d4af37');
}

// Return to menu from any screen
function backToMenu() {
    showMenu();
}

// Hide all screens
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
}

// ================== GAME LOGIC ==================

// Set player name and start game
function setPlayerName() {
    const input = document.getElementById('player-name-input');
    if (input && input.value.trim() !== '') {
        playerName = input.value.trim();
        console.log(`Player name set to: ${playerName}`);
    } else {
        playerName = "Shadow Warrior";
    }
    
    startGame();
}

// Start the game
async function startGame() {
    console.log('Starting game...');
    
    // Load questions if not already loaded
    if (questions.length === 0) {
        await loadQuestions();
    }
    
    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    gameStarted = true;
    
    // Hide all screens and show game screen
    hideAllScreens();
    gameScreen.classList.remove('hidden');
    
    // Load first question
    loadQuestion();
    
    // Add start game visual effect
    createVFX('start', '#00ff00');
    
    // Play start sound if available
    playSound('start');
}

// Load current question
function loadQuestion() {
    console.log(`Loading question ${currentQuestionIndex + 1} of ${questions.length}`);
    
    // Check if game is over
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    currentCommentator = question.commentator || 'rikimaru';
    
    // Update question text
    const questionText = document.getElementById('question-text');
    if (questionText) {
        questionText.textContent = `Trial ${currentQuestionIndex + 1}: ${question.question}`;
    }
    
    // Clear and create option buttons
    const optionsDiv = document.getElementById('options');
    if (optionsDiv) {
        optionsDiv.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'btn-ninja';
            button.textContent = option;
            button.dataset.answer = option;
            
            // Add click event with animation
            button.onclick = function() {
                // Disable all buttons to prevent multiple clicks
                const allButtons = optionsDiv.querySelectorAll('.btn-ninja');
                allButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                    btn.style.cursor = 'not-allowed';
                });
                
                // Highlight selected button
                this.style.background = 'linear-gradient(to bottom, #333 0%, #222 100%)';
                this.style.borderColor = '#d4af37';
                
                // Check answer after a brief delay for animation
                setTimeout(() => {
                    checkAnswer(option, question.answer, currentCommentator);
                }, 300);
            };
            
            // Add animation delay
            button.style.animationDelay = `${index * 0.1}s`;
            optionsDiv.appendChild(button);
        });
    }
    
    // Show question box, hide others
    questionBox.classList.remove('hidden');
    feedbackBox.classList.add('hidden');
    resultBox.classList.add('hidden');
    supporterBox.classList.add('hidden');
    
    // Update progress (optional - could add a progress bar)
    updateProgress();
}

// Check answer
function checkAnswer(selected, correct, commentator) {
    const isCorrect = selected === correct;
    console.log(`Answer selected: ${selected}, Correct: ${correct}, Result: ${isCorrect ? 'Correct' : 'Incorrect'}`);
    
    // Update score
    if (isCorrect) {
        score++;
        createVFX('correct', '#00ff00');
        playSound('correct');
    } else {
        createVFX('incorrect', '#ff0000');
        playSound('incorrect');
    }
    
    // Show feedback
    showFeedback(isCorrect, commentator);
    
    // Store answer for results review (optional feature)
    if (!questions[currentQuestionIndex].playerAnswer) {
        questions[currentQuestionIndex].playerAnswer = selected;
        questions[currentQuestionIndex].wasCorrect = isCorrect;
    }
}

// Show feedback with character comment
function showFeedback(isCorrect, commentator) {
    let comment, characterName, portrait;
    
    // Get character comment
    if (typeof getCharacterComment !== 'undefined') {
        comment = getCharacterComment(commentator, isCorrect);
    } else {
        comment = isCorrect ? "Correct. Well done." : "Incorrect. Study the scrolls again.";
    }
    
    // Get character name
    if (typeof getCharacterDisplayName !== 'undefined') {
        characterName = getCharacterDisplayName(commentator);
    } else {
        characterName = "Master";
    }
    
    // Get character portrait
    if (typeof getCharacterPortrait !== 'undefined') {
        portrait = getCharacterPortrait(commentator);
    }
    
    // Update feedback elements
    const feedbackText = document.getElementById('feedback-text');
    const feedbackName = document.getElementById('feedback-name');
    const feedbackPortrait = document.getElementById('feedback-portrait');
    
    if (feedbackText) feedbackText.textContent = comment;
    if (feedbackName) feedbackName.textContent = characterName + ":";
    if (feedbackPortrait && portrait) {
        feedbackPortrait.style.backgroundImage = `url('${portrait}')`;
    }
    
    // Show feedback box, hide question box
    questionBox.classList.add('hidden');
    feedbackBox.classList.remove('hidden');
    
    // Add feedback animation
    feedbackBox.style.animation = 'fadeInUp 0.5s ease-out';
    
    // Schedule next question or random supporter
    setTimeout(() => {
        // 25% chance to show supporter between questions (but not after last question)
        if (currentQuestionIndex < questions.length - 1 && Math.random() < 0.25) {
            showRandomSupporter();
        }
    }, 500);
}

// Next question
function nextQuestion() {
    currentQuestionIndex++;
    console.log(`Moving to question ${currentQuestionIndex + 1}`);
    
    // If supporter box is showing, hide it first
    if (!supporterBox.classList.contains('hidden')) {
        hideSupporterBox();
        return;
    }
    
    // Load next question
    loadQuestion();
}

// Show random supporter
function showRandomSupporter() {
    // Check if supporters are available
    if (typeof supporters !== 'undefined' && supporters.length > 0) {
        const randomIndex = Math.floor(Math.random() * supporters.length);
        const supporter = supporters[randomIndex];
        
        // Get appreciation message
        let appreciation = "The Azuma clan honors its allies.";
        if (typeof getSupporterAppreciation !== 'undefined') {
            appreciation = getSupporterAppreciation();
        }
        
        // Update supporter box
        const supporterName = document.getElementById('supporter-name');
        const supporterText = document.getElementById('supporter-text');
        const supporterPortrait = document.getElementById('supporter-portrait');
        
        if (supporterName) supporterName.textContent = supporter.name;
        if (supporterText) supporterText.textContent = `${appreciation} ${supporter.name} stands with the Azuma.`;
        
        // Set random character portrait
        const characters = ['rikimaru', 'ayame', 'tatsumaru'];
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        if (supporterPortrait && typeof getCharacterPortrait !== 'undefined') {
            supporterPortrait.style.backgroundImage = `url('${getCharacterPortrait(randomChar)}')`;
        }
        
        // Show supporter box, hide feedback
        feedbackBox.classList.add('hidden');
        supporterBox.classList.remove('hidden');
        
        // Add visual effect
        createVFX('supporter', '#d4af37');
        
        return true;
    }
    return false;
}

// Hide supporter box
function hideSupporterBox() {
    supporterBox.classList.add('hidden');
    
    // Continue to next question
    setTimeout(() => {
        loadQuestion();
    }, 300);
}

// Show results
function showResults() {
    console.log('Showing results');
    
    const percentage = (score / questions.length) * 100;
    let rank, title, description;
    
    // Determine rank based on score
    if (percentage >= 90) {
        rank = "GRAND MASTER";
        title = "Shadow of Perfection";
        description = `${playerName}, your mastery of ninja arts is absolute. You walk as a true shadow, unseen and lethal. The Azuma clan honors you as our Grand Master.`;
    } else if (percentage >= 70) {
        rank = "MASTER";
        title = "Azure Shadow";
        description = `${playerName}, your skills are exceptional. You understand the balance of stealth and strike. The Azuma clan recognizes you as a Master.`;
    } else if (percentage >= 50) {
        rank = "JOURNEYMAN";
        title = "Silent Blade";
        description = `${playerName}, you show promise in the ninja arts. Continue your training to master the shadows.`;
    } else if (percentage >= 30) {
        rank = "INITIATE";
        title = "Whispering Leaf";
        description = `${playerName}, you have begun the path. Study the scrolls and learn from your mistakes.`;
    } else {
        rank = "FAILED";
        title = "Visible Target";
        description = `${playerName}, your understanding of ninja ways is lacking. Return to training or find another path.`;
    }
    
    // Update result elements
    const resultRank = document.getElementById('result-rank');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    const resultPortrait = document.getElementById('result-portrait');
    
    if (resultRank) resultRank.textContent = rank;
    if (resultTitle) resultTitle.textContent = title;
    if (resultText) resultText.textContent = description;
    
    // Set character portrait based on rank
    let resultCharacter;
    if (percentage >= 70) {
        resultCharacter = 'rikimaru';
    } else if (percentage >= 50) {
        resultCharacter = 'ayame';
    } else {
        resultCharacter = 'tatsumaru';
    }
    
    if (resultPortrait && typeof getCharacterPortrait !== 'undefined') {
        resultPortrait.style.backgroundImage = `url('${getCharacterPortrait(resultCharacter)}')`;
    }
    
    // Show result box, hide others
    questionBox.classList.add('hidden');
    feedbackBox.classList.add('hidden');
    supporterBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    
    // Add result visual effect
    createVFX('result', '#d4af37');
    playSound(percentage >= 50 ? 'victory' : 'defeat');
    
    // Log results
    console.log(`Game completed. Score: ${score}/${questions.length} (${percentage}%). Rank: ${rank}`);
}

// Update progress (optional - could be used for a progress bar)
function updateProgress() {
    // This is a placeholder for future progress bar implementation
    // console.log(`Progress: ${currentQuestionIndex + 1}/${questions.length}`);
}

// ================== VISUAL EFFECTS ==================

// Create VFX based on action type
function createVFX(type, color = '#ffffff') {
    const canvas = document.getElementById('vfx-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch(type) {
        case 'correct':
            drawSlash(ctx, 0, 0, canvas.width, canvas.height, '#00ff00');
            break;
        case 'incorrect':
            drawSlash(ctx, canvas.width, 0, 0, canvas.height, '#ff0000');
            break;
        case 'menu':
            drawParticles(ctx, 10, color);
            break;
        case 'start':
            drawCirclePulse(ctx, canvas.width/2, canvas.height/2, color);
            break;
        case 'result':
            drawMultipleSlashes(ctx, 3, color);
            break;
        case 'info':
        case 'supporters':
            drawShuriken(ctx, canvas.width/2, canvas.height/2, color);
            break;
        case 'supporter':
            drawSparkle(ctx, canvas.width/2, canvas.height/2, color);
            break;
    }
    
    // Clear canvas after effect
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 1000);
}

// Create menu VFX
function createMenuVFX() {
    const canvas = document.getElementById('vfx-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Clear and add subtle background effect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw some subtle floating particles
    for(let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        const alpha = Math.random() * 0.3;
        
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        ctx.fillRect(x, y, size, size);
    }
}

// Draw slash effect
function drawSlash(ctx, x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Add glow effect
    ctx.lineWidth = 1;
    ctx.shadowBlur = 30;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

// Draw multiple slashes
function drawMultipleSlashes(ctx, count, color) {
    for(let i = 0; i < count; i++) {
        setTimeout(() => {
            const x1 = Math.random() * ctx.canvas.width;
            const y1 = Math.random() * ctx.canvas.height;
            const x2 = Math.random() * ctx.canvas.width;
            const y2 = Math.random() * ctx.canvas.height;
            drawSlash(ctx, x1, y1, x2, y2, color);
        }, i * 100);
    }
}

// Draw particles
function drawParticles(ctx, count, color) {
    for(let i = 0; i < count; i++) {
        const x = Math.random() * ctx.canvas.width;
        const y = Math.random() * ctx.canvas.height;
        const size = Math.random() * 3 + 1;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw circle pulse
function drawCirclePulse(ctx, x, y, color) {
    let radius = 5;
    const pulse = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        radius += 10;
        if (radius < 100) {
            requestAnimationFrame(pulse);
        }
    };
    pulse();
}

// Draw shuriken
function drawShuriken(ctx, x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Date.now() / 1000);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    
    for(let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(30, 0);
        ctx.lineTo(40, -10);
        ctx.lineTo(50, 0);
        ctx.lineTo(60, 0);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Draw sparkle effect
function drawSparkle(ctx, x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    
    // Draw central dot
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw radiating lines
    for(let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(20, 0);
        ctx.stroke();
    }
    
    ctx.restore();
}

// ================== AUDIO FUNCTIONS ==================

// Play sound effect
function playSound(type) {
    // This is a placeholder for future audio implementation
    // You can add actual audio files here
    console.log(`Playing sound: ${type}`);
    
    // For now, we'll just use console logging
    const sounds = {
        'correct': '🎯',
        'incorrect': '💥',
        'start': '⚔️',
        'victory': '🏆',
        'defeat': '💀'
    };
    
    if (sounds[type]) {
        console.log(sounds[type]);
    }
}

// ================== UTILITY FUNCTIONS ==================

// Get current game state (for debugging)
function getGameState() {
    return {
        playerName,
        currentQuestionIndex,
        score,
        totalQuestions,
        questions: questions.map(q => ({
            question: q.question,
            playerAnswer: q.playerAnswer,
            correctAnswer: q.answer,
            wasCorrect: q.wasCorrect,
            commentator: q.commentator
        })),
        percentage: (score / questions.length) * 100
    };
}

// Export functions for debugging
if (typeof window !== 'undefined') {
    window.getGameState = getGameState;
    window.forceNextQuestion = nextQuestion;
    window.forceShowResults = showResults;
    window.reloadQuestions = loadQuestions;
}

// ================== ERROR HANDLING ==================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Game error:', e.error);
    
    // Try to recover by showing menu
    try {
        showMenu();
    } catch (recoveryError) {
        console.error('Recovery failed:', recoveryError);
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ================== WINDOW RESIZE HANDLER ==================

// Handle window resize for canvas
window.addEventListener('resize', function() {
    const canvas = document.getElementById('vfx-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Redraw background effects if on menu
        if (!menuScreen.classList.contains('hidden')) {
            createMenuVFX();
        }
    }
});

// Initialize canvas on load
window.addEventListener('load', function() {
    const existingCanvas = document.getElementById('vfx-canvas');
    if (!existingCanvas) {
        const canvas = document.createElement('canvas');
        canvas.id = 'vfx-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
    }
    
    // Initial menu VFX
    createMenuVFX();
});

// ================== EXPORT FOR TESTING ==================
// These functions will be available in the browser console for testing
if (typeof window !== 'undefined') {
    window.gameDebug = {
        resetGame: function() {
            currentQuestionIndex = 0;
            score = 0;
            playerName = "Test Shinobi";
            console.log("Game reset");
        },
        setScore: function(newScore) {
            score = newScore;
            console.log(`Score set to: ${score}`);
        },
        skipToQuestion: function(index) {
            if (index >= 0 && index < questions.length) {
                currentQuestionIndex = index;
                loadQuestion();
                console.log(`Skipped to question ${index + 1}`);
            }
        },
        showAllQuestions: function() {
            console.log("All questions:", questions);
        }
    };
}

console.log("Tenchu Shiren game.js loaded successfully!");