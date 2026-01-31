// ============================================
// TENCHU SHIREN - COMPLETE GAME ENGINE (FIXED)
// Uses character-comments.js for all character functions
// ============================================

// Game state
let playerName = "Nameless Warrior";
let currentQuestionIndex = 0;
let questions = [];
let gameActive = false;
let correctAnswers = 0;
let playerAnswers = [];
let showAppreciation = false;

// Player progression system
let playerStats = {
    totalScore: 0,
    trialsCompleted: 0,
    totalCorrectAnswers: 0,
    totalQuestionsAnswered: 0,
    currentRank: "failed",
    rankStars: 0,
    coins: 0,
    lastPlayed: null,
    highestRank: "failed"
};

// TENCHU-STYLE RANKING SYSTEM (Higher scores like real Tenchu)
const tenchuRankRequirements = {
    "failed": { 
        minScore: 0, 
        stars: 0, 
        nextRank: "apprentice", 
        displayName: "FAILED",
        title: "失敗",
        symbol: "💀"
    },
    "apprentice": { 
        minScore: 500, 
        stars: 1, 
        nextRank: "shinobi", 
        displayName: "APPRENTICE",
        title: "見習い",
        symbol: "🍃"
    },
    "shinobi": { 
        minScore: 1000, 
        stars: 2, 
        nextRank: "assassin", 
        displayName: "SHINOBI",
        title: "忍び",
        symbol: "🥷"
    },
    "assassin": { 
        minScore: 2000, 
        stars: 3, 
        nextRank: "ninja", 
        displayName: "ASSASSIN",
        title: "殺し屋",
        symbol: "🎯"
    },
    "ninja": { 
        minScore: 3000, 
        stars: 3, 
        nextRank: "masterNinja", 
        displayName: "NINJA",
        title: "中忍",
        symbol: "🗡️"
    },
    "masterNinja": { 
        minScore: 4000, 
        stars: 3, 
        nextRank: "grandMaster", 
        displayName: "MASTER NINJA",
        title: "上忍",
        symbol: "⚔️"
    },
    "grandMaster": { 
        minScore: 5000, 
        stars: 3, 
        nextRank: null, 
        displayName: "GRAND MASTER",
        title: "天誅忍",
        symbol: "👑"
    }
};

// Game constants
const POINTS_PER_CORRECT = 100; // Increased for higher rank progression
const POINTS_PER_GAME_COMPLETION = 500; // Bonus for perfect game
const COINS_PER_CORRECT = 5;
const COINS_PER_GAME = 50;
let currentScreen = 'menu';

// ==================== CHARACTER FUNCTIONS ====================
// These functions now use character-comments.js

function getCharacterPortrait(character) {
    // Use the function from character-comments.js if available
    if (typeof window.getCharacterPortrait === 'function') {
        return window.getCharacterPortrait(character);
    }
    // Fallback
    const portraits = {
        'rikimaru': './assets/characters/rikimaru.png',
        'ayame': './assets/characters/ayame.png',
        'tatsumaru': './assets/characters/tatsumaru.png'
    };
    return portraits[character] || '';
}

function getCharacterDisplayName(character) {
    // Use the function from character-comments.js if available
    if (typeof window.getCharacterDisplayName === 'function') {
        return window.getCharacterDisplayName(character);
    }
    // Fallback
    const names = {
        'rikimaru': 'RIKIMARU',
        'ayame': 'AYAME',
        'tatsumaru': 'TATSAMARU'
    };
    return names[character] || 'MASTER';
}

function getCharacterResultFeedback(character, rank, playerName) {
    // Use the function from character-comments.js if available
    if (typeof window.getCharacterResultFeedback === 'function') {
        return window.getCharacterResultFeedback(character, rank, playerName);
    }
    // Fallback feedback
    const fallback = {
        'rikimaru': `${playerName}. Your performance has been noted.`,
        'ayame': `${playerName}! You did your best!`,
        'tatsumaru': `Hmph. ${playerName}.`
    };
    return fallback[character] || "The trial is complete.";
}

// ==================== INITIALIZATION & PERSISTENCE ====================

function loadPlayerStats() {
    try {
        const saved = localStorage.getItem('tenchuShirenStats');
        if (saved) {
            const parsed = JSON.parse(saved);
            playerStats = { ...playerStats, ...parsed };
        }
        
        const savedName = localStorage.getItem('tenchuShirenPlayerName');
        if (savedName) {
            playerName = savedName;
            const input = document.getElementById('player-name-input');
            if (input) input.value = playerName;
        }
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

function savePlayerStats() {
    try {
        playerStats.lastPlayed = new Date().toISOString();
        localStorage.setItem('tenchuShirenStats', JSON.stringify(playerStats));
        localStorage.setItem('tenchuShirenPlayerName', playerName);
    } catch (error) {
        console.error("Error saving stats:", error);
    }
}

// Update player rank based on total score (using Tenchu ranks)
function updatePlayerRank() {
    const ranks = Object.keys(tenchuRankRequirements);
    let newRank = "failed";
    let newStars = 0;
    let rankChanged = false;
    const oldRank = playerStats.currentRank;
    
    // Find current rank based on score
    for (let i = ranks.length - 1; i >= 0; i--) {
        const rank = ranks[i];
        if (playerStats.totalScore >= tenchuRankRequirements[rank].minScore) {
            newRank = rank;
            newStars = tenchuRankRequirements[rank].stars;
            break;
        }
    }
    
    // Check if rank changed
    rankChanged = (oldRank !== newRank);
    
    playerStats.currentRank = newRank;
    playerStats.rankStars = newStars;
    
    // Update highest rank
    const rankOrder = ["failed", "apprentice", "shinobi", "assassin", "ninja", "masterNinja", "grandMaster"];
    const currentIndex = rankOrder.indexOf(newRank);
    const highestIndex = rankOrder.indexOf(playerStats.highestRank);
    if (currentIndex > highestIndex) {
        playerStats.highestRank = newRank;
    }
    
    return rankChanged;
}

// Add score from current game
function addGameScore(gameScore, correctCount, totalQuestions) {
    const oldRank = playerStats.currentRank;
    
    playerStats.totalScore += gameScore;
    playerStats.trialsCompleted++;
    playerStats.totalCorrectAnswers += correctCount;
    playerStats.totalQuestionsAnswered += totalQuestions;
    
    // Add coins
    const coinsEarned = (correctCount * COINS_PER_CORRECT) + (correctCount === totalQuestions ? COINS_PER_GAME : 0);
    playerStats.coins += coinsEarned;
    
    // Update rank
    const rankChanged = updatePlayerRank();
    
    // Save stats
    savePlayerStats();
    
    return { 
        score: gameScore, 
        coins: coinsEarned, 
        rankChanged: rankChanged, 
        oldRank: oldRank, 
        newRank: playerStats.currentRank,
        rankInfo: tenchuRankRequirements[playerStats.currentRank]
    };
}

// Get stars display for stats screen
function getStarsDisplay(stars) {
    if (stars === 0) return "☆☆☆";
    if (stars === 1) return "★☆☆";
    if (stars === 2) return "★★☆";
    if (stars === 3) return "★★★";
    return "☆☆☆";
}

// Get progress to next rank
function getRankProgress() {
    const currentRank = playerStats.currentRank;
    const rankInfo = tenchuRankRequirements[currentRank];
    const nextRank = rankInfo.nextRank;
    
    if (!nextRank) {
        return { 
            current: playerStats.totalScore, 
            required: rankInfo.minScore, 
            percent: 100,
            currentMin: rankInfo.minScore
        };
    }
    
    const nextRankInfo = tenchuRankRequirements[nextRank];
    const currentMin = rankInfo.minScore;
    const nextMin = nextRankInfo.minScore;
    const progress = playerStats.totalScore - currentMin;
    const totalNeeded = nextMin - currentMin;
    const percent = Math.min(100, Math.floor((progress / totalNeeded) * 100));
    
    return {
        current: playerStats.totalScore,
        required: nextMin,
        percent: percent,
        currentMin: currentMin,
        nextMin: nextMin
    };
}

// ==================== SCREEN NAVIGATION ====================

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        setTimeout(() => target.classList.add('active'), 50);
        currentScreen = screenId;
    }
    
    if (typeof createGameVFX === 'function') createGameVFX('screenChange');
}

function backToMenu() {
    gameActive = false;
    showScreen('menu');
    if (typeof createGameVFX === 'function') createGameVFX('menuOpen');
}

function showInfo() { showScreen('info'); }
function showSupporters() { showScreen('supporters-screen'); }
function showPlayerNameScreen() { 
    showScreen('player-name-screen'); 
    const input = document.getElementById('player-name-input');
    if (input) {
        setTimeout(() => input.focus(), 300);
    }
}

// ==================== GAME LOGIC ====================

function setPlayerName() {
    const input = document.getElementById('player-name-input');
    if (input && input.value.trim() !== '') {
        playerName = input.value.trim();
        savePlayerStats();
    }
    startGame();
}

async function startGame() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    gameActive = true;
    playerAnswers = [];
    showAppreciation = false;
    
    await loadQuestions();
    
    showScreen('game');
    showGameSubScreen('question');
    
    const playerDisp = document.getElementById('current-player');
    if (playerDisp) playerDisp.textContent = playerName.toUpperCase();
    
    if (typeof createGameVFX === 'function') createGameVFX('gameStart');
    
    setTimeout(() => {
        loadQuestion();
    }, 300);
}

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error("JSON missing");
        const data = await response.json();
        questions = data.sort(() => Math.random() - 0.5).slice(0, 5);
        console.log(`Loaded ${questions.length} questions`);
    } catch (e) {
        console.error("Error loading questions:", e);
        // Fallback questions
        questions = [{
            question: "A true shinobi moves like...",
            options: ["A storm", "A shadow", "A flame", "A river"],
            answer: "A shadow",
            difficulty: "Easy",
            commentator: "rikimaru"
        }, {
            question: "The Azuma clan's sacred blade is called...",
            options: ["Kusanagi", "Izayoi", "Muramasa", "Masamune"],
            answer: "Izayoi",
            difficulty: "Medium",
            commentator: "rikimaru"
        }, {
            question: "What does 'Tenchu' mean?",
            options: ["Heaven's Punishment", "Shadow Blade", "Silent Death", "Night Warrior"],
            answer: "Heaven's Punishment",
            difficulty: "Medium",
            commentator: "ayame"
        }, {
            question: "Which tool is used for blinding enemies?",
            options: ["Shuriken", "Kunai", "Metsubishi", "Shuko"],
            answer: "Metsubishi",
            difficulty: "Hard",
            commentator: "tatsumaru"
        }, {
            question: "Rikimaru's signature technique is...",
            options: ["Hiryu", "Tobikomi", "Shikoro", "Kazekiri"],
            answer: "Hiryu",
            difficulty: "Hard",
            commentator: "rikimaru"
        }];
    }
}

function loadQuestion() {
    if (!gameActive) return;
    
    if (currentQuestionIndex >= questions.length) {
        showAppreciation = Math.random() < 0.4;
        
        if (showAppreciation && typeof supporters !== 'undefined' && supporters.length > 0) {
            showAppreciationScreen();
        } else {
            showResults();
        }
        return;
    }

    const q = questions[currentQuestionIndex];
    const qText = document.getElementById('question-text');
    if (qText) {
        qText.style.opacity = '0';
        setTimeout(() => {
            qText.textContent = q.question;
            qText.style.opacity = '1';
        }, 200);
    }
    
    ['current-trial', 'trial-number', 'progress-current'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentQuestionIndex + 1;
    });

    const diff = document.querySelector('.diff-level');
    if (diff) diff.textContent = q.difficulty || "NORMAL";

    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

    const optionsDiv = document.getElementById('options');
    if (optionsDiv) {
        optionsDiv.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-ninja';
            btn.innerHTML = `<span class="option-letter">${letters[index]}</span><span class="option-text">${opt}</span>`;
            btn.onclick = () => checkAnswer(opt, q.answer, q.commentator || 'rikimaru');
            optionsDiv.appendChild(btn);
        });
    }
    showGameSubScreen('question');
}

function checkAnswer(selected, correct, commentator) {
    const isCorrect = (selected === correct);
    playerAnswers.push({ selected, correct, isCorrect, commentator });

    const btns = document.querySelectorAll('#options .btn-ninja');
    btns.forEach(btn => {
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
        
        const optionText = btn.querySelector('.option-text').textContent;
        if (optionText === correct) {
            btn.style.background = 'linear-gradient(145deg, #1a2a1a, #111a11)';
            btn.style.borderColor = '#00aa00';
        }
        if (optionText === selected && !isCorrect) {
            btn.style.background = 'linear-gradient(145deg, #2a1a1a, #1a1111)';
            btn.style.borderColor = '#ff0000';
        }
    });

    if (isCorrect) {
        correctAnswers++;
        if (typeof createGameVFX === 'function') createGameVFX('correct');
    } else {
        if (typeof createGameVFX === 'function') createGameVFX('incorrect');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

// ==================== RESULTS SCREEN ====================

function showResults() {
    console.log('DEBUG: showResults() called.');
    
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Calculate points earned
    const pointsEarned = (correctAnswers * POINTS_PER_CORRECT) + 
                        (correctAnswers === totalQuestions ? POINTS_PER_GAME_COMPLETION : 0);
    
    // Add to player progression
    const gameResult = addGameScore(pointsEarned, correctAnswers, totalQuestions);
    
    // Update results screen
    updateResultsDisplay(pointsEarned, gameResult.coins, totalQuestions, correctAnswers, percentage, gameResult);
    
    // Show results screen
    showGameSubScreen('result');
    
    // Create VFX based on performance
    if (typeof createGameVFX === 'function') {
        if (percentage >= 50) {
            createGameVFX('victory');
        } else {
            createGameVFX('defeat');
        }
    }
}

function updateResultsDisplay(pointsEarned, coinsEarned, totalQuestions, correctAnswers, percentage, gameResult) {
    // Update score breakdown
    document.getElementById('result-correct').textContent = `${correctAnswers}/${totalQuestions}`;
    document.getElementById('result-points').textContent = `+${pointsEarned}`;
    document.getElementById('result-coins').textContent = `+${coinsEarned}`;
    document.getElementById('result-total').textContent = playerStats.totalScore;
    
    // Show rank notification if rank changed
    const rankNotification = document.getElementById('rank-notification');
    if (gameResult.rankChanged) {
        const oldRankInfo = tenchuRankRequirements[gameResult.oldRank];
        const newRankInfo = tenchuRankRequirements[gameResult.newRank];
        rankNotification.style.display = 'flex';
        rankNotification.innerHTML = `
            <i class="fas fa-arrow-up"></i>
            <span>Rank Up! ${oldRankInfo.displayName} → ${newRankInfo.displayName}</span>
        `;
        
        if (typeof createGameVFX === 'function') {
            setTimeout(() => {
                createGameVFX('victory');
            }, 500);
        }
    } else {
        rankNotification.style.display = 'none';
    }
    
    // Determine which character gives feedback based on performance
    let feedbackCharacter;
    if (percentage >= 70) {
        feedbackCharacter = 'rikimaru';
    } else if (percentage >= 50) {
        feedbackCharacter = 'ayame';
    } else {
        feedbackCharacter = 'tatsumaru';
    }
    
    // Get character feedback using character-comments.js
    const feedbackMessage = getCharacterResultFeedback(
        feedbackCharacter, 
        playerStats.currentRank, 
        playerName
    );
    
    // Update feedback
    const feedbackText = document.getElementById('feedback-text');
    if (feedbackText) feedbackText.textContent = feedbackMessage;
    
    // Set character portrait using character-comments.js function
    const portrait = getCharacterPortrait(feedbackCharacter);
    const feedbackPortrait = document.getElementById('feedback-portrait');
    if (portrait && feedbackPortrait) {
        feedbackPortrait.style.backgroundImage = `url('${portrait}')`;
        console.log(`Set feedback portrait to: ${portrait}`);
    }
}

// ==================== RANKING & STATS ====================

function updateStatsDisplay() {
    // Update player name
    const playerNameEl = document.getElementById('stats-player-name');
    if (playerNameEl) playerNameEl.textContent = playerName.toUpperCase();
    
    // Update stats values
    const set = (id, val) => { 
        const el = document.getElementById(id); 
        if (el) el.textContent = val; 
    };
    
    set('stat-total-score', playerStats.totalScore);
    set('stat-trials-completed', playerStats.trialsCompleted);
    set('stat-coins', playerStats.coins);
    
    // Calculate success rate
    const successRate = playerStats.totalQuestionsAnswered > 0 
        ? Math.round((playerStats.totalCorrectAnswers / playerStats.totalQuestionsAnswered) * 100)
        : 0;
    set('stat-success-rate', `${successRate}%`);
    
    // Update rank display
    const rankInfo = tenchuRankRequirements[playerStats.currentRank];
    set('stat-rank-name', rankInfo.displayName);
    
    // Update stars
    const starsDisplay = getStarsDisplay(playerStats.rankStars);
    set('stat-rank-stars', starsDisplay);
    
    // Update progress bar
    const progress = getRankProgress();
    set('stat-rank-progress-text', `${playerStats.totalScore}/${progress.required}`);
    
    const progressBar = document.getElementById('stat-rank-progress');
    if (progressBar) {
        progressBar.style.width = `${progress.percent}%`;
    }
    
    // Set rank color
    const rankNameEl = document.getElementById('stat-rank-name');
    if (rankNameEl) {
        const rankColors = {
            "failed": "#5a0000",
            "apprentice": "#808080",
            "shinobi": "#9370db",
            "assassin": "#dc143c",
            "ninja": "#4169e1",
            "masterNinja": "#c0c0c0",
            "grandMaster": "#d4af37"
        };
        rankNameEl.style.color = rankColors[playerStats.currentRank] || "#808080";
    }
}

// ==================== APPRECIATION SCREEN ====================

function showAppreciationScreen() {
    if (typeof supporters === 'undefined' || supporters.length === 0) {
        showResults();
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * supporters.length);
    const supporter = supporters[randomIndex];
    
    const characters = ['rikimaru', 'ayame', 'tatsumaru'];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    
    // Use character-comments.js function
    let portrait = getCharacterPortrait(randomCharacter);
    let characterName = getCharacterDisplayName(randomCharacter);
    
    const messages = [
        `${characterName} acknowledges your support.`,
        `${characterName} honors those who stand with the Azuma.`,
        `From the shadows, ${characterName} gives thanks.`,
        `${characterName} recognizes true allies of the clan.`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    document.getElementById('appreciation-text').textContent = randomMessage;
    document.getElementById('honored-name').textContent = supporter.name;
    document.getElementById('honored-handle').textContent = supporter.handle || '';
    
    // Set supporter character portrait
    const appreciationPortrait = document.getElementById('appreciation-portrait');
    if (portrait && appreciationPortrait) {
        appreciationPortrait.style.backgroundImage = `url('${portrait}')`;
    }
    
    // Set supporter rank badge
    const supporterRank = document.querySelector('.supporter-rank');
    if (supporterRank && supporter.rank) {
        supporterRank.innerHTML = `
            <i class="fas fa-shield-alt"></i>
            <span>${supporter.rank.toUpperCase()}</span>
        `;
    }
    
    showGameSubScreen('appreciation');
    
    if (typeof createGameVFX === 'function') {
        createGameVFX('appreciation');
    }
}

// ==================== UTILITY FUNCTIONS ====================

function showGameSubScreen(type) {
    const screens = ['question-screen', 'appreciation-screen', 'result-screen'];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) { 
            el.classList.add('hidden'); 
            el.classList.remove('active'); 
        }
    });
    const target = document.getElementById(type + '-screen');
    if (target) { 
        target.classList.remove('hidden'); 
        setTimeout(() => target.classList.add('active'), 50);
    }
}

function showStatsScreen() {
    showScreen('stats-screen');
    updateStatsDisplay();
}

function showMissionsScreen() {
    showScreen('missions-screen');
}

function showStatsScreenFromResults() {
    showScreen('stats-screen');
    updateStatsDisplay();
}

function shareStats() {
    const rank = document.getElementById('stat-rank-name')?.textContent || 'FAILED';
    const stars = document.getElementById('stat-rank-stars')?.textContent || '☆☆☆';
    const score = document.getElementById('stat-total-score')?.textContent || '0';
    const text = `I achieved ${rank} ${stars} with ${score} points in Tenchu Shiren! 天誅試練`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Tenchu Shiren Stats',
            text: text,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(text);
        });
    } else {
        fallbackShare(text);
    }
}

function fallbackShare(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Stats copied to clipboard! Share it with your fellow shinobi.');
        });
    } else {
        alert('Share this text:\n\n' + text);
    }
}

// ==================== INITIALIZATION ====================

function initializeGame() {
    console.log('Tenchu Shiren - Initializing...');
    
    // Lock body scrolling
    document.body.style.overflow = 'hidden';
    
    // Initialize VFX if available
    if (typeof initVFX === 'function') {
        initVFX();
    }
    
    // Load player stats
    loadPlayerStats();
    
    // Initialize supporters list if available
    if (typeof updateSupportersList === 'function') {
        updateSupportersList();
    }
    
    // Setup name input
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                setPlayerName();
            }
        });
    }
    
    // Show menu after a short delay to ensure DOM is ready
    setTimeout(() => {
        showScreen('menu');
    }, 100);
    
    console.log('Game initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

// ==================== GLOBAL EXPORTS ====================

window.showPlayerNameScreen = showPlayerNameScreen;
window.showInfo = showInfo;
window.showSupporters = showSupporters;
window.showStatsScreen = showStatsScreen;
window.showMissionsScreen = showMissionsScreen;
window.showStatsScreenFromResults = showStatsScreenFromResults;
window.backToMenu = backToMenu;
window.setPlayerName = setPlayerName;
window.startGame = startGame;
window.showResults = showResults;
window.shareStats = shareStats;
window.updateStatsDisplay = updateStatsDisplay;
window.loadPlayerStats = loadPlayerStats;
window.savePlayerStats = savePlayerStats;

// Export character functions (these will use character-comments.js if available)
window.getCharacterPortrait = getCharacterPortrait;
window.getCharacterDisplayName = getCharacterDisplayName;
window.getCharacterResultFeedback = getCharacterResultFeedback;