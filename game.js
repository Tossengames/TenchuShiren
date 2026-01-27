// game.js - Updated for Tenchu Shiren

let playerName = "Unknown Shinobi";
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 5;
let questions = [];

// DOM Elements
const gameScreen = document.getElementById('game');
const menuScreen = document.getElementById('menu');
const playerNameScreen = document.getElementById('player-name-screen');
const infoScreen = document.getElementById('info');
const supportersScreen = document.getElementById('supporters-screen');

// Initialize game
async function initGame() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        questions = questions.sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    } catch (error) {
        console.log("Using fallback questions");
        // Use the hardcoded questions from index.html
    }
}

// Show player name screen
function showPlayerNameScreen() {
    menuScreen.classList.add('hidden');
    playerNameScreen.classList.remove('hidden');
    document.getElementById('player-name-input').focus();
}

// Set player name
function setPlayerName() {
    const input = document.getElementById('player-name-input');
    if (input.value.trim() !== '') {
        playerName = input.value.trim();
    }
    startGame();
}

// Start the game
async function startGame() {
    await initGame();
    
    playerNameScreen.classList.add('hidden');
    infoScreen.classList.add('hidden');
    supportersScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

// Load question
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = `Trial ${currentQuestionIndex + 1}: ${question.question}`;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn-ninja';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, question.answer, question.commentator || 'rikimaru');
        optionsDiv.appendChild(button);
    });
    
    document.getElementById('question-box').classList.remove('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('supporter-box').classList.add('hidden');
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
    
    // Show character feedback
    showFeedback(isCorrect, commentator);
}

// Show feedback
function showFeedback(isCorrect, commentator) {
    const comment = getCharacterComment(commentator, isCorrect);
    const portrait = getCharacterPortrait(commentator);
    const name = getCharacterDisplayName(commentator);
    
    document.getElementById('feedback-text').textContent = comment;
    document.getElementById('feedback-name').textContent = name + ":";
    document.getElementById('feedback-portrait').style.backgroundImage = `url('${portrait}')`;
    
    // Hide question, show feedback
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('feedback-box').classList.remove('hidden');
}

// Next question
function nextQuestion() {
    currentQuestionIndex++;
    
    // Occasionally show supporter appreciation
    if (currentQuestionIndex > 0 && currentQuestionIndex < questions.length) {
        if (Math.random() < 0.25) { // 25% chance to show supporter
            setTimeout(() => {
                if (showRandomSupporter()) {
                    setTimeout(() => {
                        hideSupporterBox();
                        loadQuestion();
                    }, 3000);
                    return;
                }
            }, 100);
        }
    }
    
    loadQuestion();
}

// Hide supporter box
function hideSupporterBox() {
    document.getElementById('supporter-box').classList.add('hidden');
}

// Show results
function showResults() {
    const percentage = (score / questions.length) * 100;
    let rank, title, description;
    
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
    
    document.getElementById('result-rank').textContent = rank;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-text').textContent = description;
    
    // Set random character portrait for results
    const characters = ['rikimaru', 'ayame', 'tatsumaru'];
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    document.getElementById('result-portrait').style.backgroundImage = `url('${getCharacterPortrait(randomChar)}')`;
    
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('result-box').classList.remove('hidden');
}

// Visual Effects
function createVFX(type) {
    const canvas = document.getElementById('vfx-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (type === 'correct') {
        // Green slash for correct
        drawSlash(ctx, 0, 0, canvas.width, canvas.height, '#00ff00');
    } else {
        // Red slash for incorrect
        drawSlash(ctx, canvas.width, 0, 0, canvas.height, '#ff0000');
    }
    
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 200);
}

function drawSlash(ctx, x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Navigation functions
function showInfo() {
    menuScreen.classList.add('hidden');
    infoScreen.classList.remove('hidden');
}

function showSupporters() {
    menuScreen.classList.add('hidden');
    supportersScreen.classList.remove('hidden');
}

function backToMenu() {
    playerNameScreen.classList.add('hidden');
    infoScreen.classList.add('hidden');
    supportersScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
}

// Initialize on load
window.addEventListener('load', () => {
    // Add canvas for VFX
    const canvas = document.createElement('canvas');
    canvas.id = 'vfx-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);
});