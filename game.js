// ============================================
// TENCHU SHIREN - COMPLETE GAME ENGINE
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
    currentRank: "apprentice",
    rankStars: 0,
    coins: 0,
    lastPlayed: null,
    highestRank: "apprentice"
};

// Rank requirements matching your HTML/Stats
const rankRequirements = {
    "apprentice": { minScore: 0, stars: 3, nextRank: "shinobi", displayName: "APPRENTICE" },
    "shinobi": { minScore: 100, stars: 3, nextRank: "assassin", displayName: "SHINOBI" },
    "assassin": { minScore: 300, stars: 3, nextRank: "ninja", displayName: "ASSASSIN" },
    "ninja": { minScore: 600, stars: 3, nextRank: "masterNinja", displayName: "NINJA" },
    "masterNinja": { minScore: 1000, stars: 3, nextRank: "grandMaster", displayName: "MASTER NINJA" },
    "grandMaster": { minScore: 2000, stars: 3, nextRank: null, displayName: "GRAND MASTER" }
};

const POINTS_PER_CORRECT = 20;
const POINTS_PER_GAME_COMPLETION = 50;
const COINS_PER_CORRECT = 2;
const COINS_PER_GAME = 10;
let currentScreen = 'menu';

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
    }, 500);
}

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error("JSON missing");
        const data = await response.json();
        questions = data.sort(() => Math.random() - 0.5).slice(0, 5);
    } catch (e) {
        console.error("Error loading questions:", e);
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

    const question = questions[currentQuestionIndex];
    
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('trial-number').textContent = currentQuestionIndex + 1;
    document.getElementById('current-trial').textContent = currentQuestionIndex + 1;
    document.getElementById('progress-current').textContent = currentQuestionIndex + 1;
    
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    
    const diffElement = document.querySelector('.diff-level');
    if (diffElement && question.difficulty) {
        diffElement.textContent = question.difficulty;
    }
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn-ninja';
        button.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        
        button.onclick = () => {
            const allButtons = optionsDiv.querySelectorAll('button');
            allButtons.forEach(btn => {
                btn.disabled = true;
                btn.style.pointerEvents = 'none';
            });
            
            button.style.background = 'linear-gradient(145deg, #2a1a1a, #1a1111)';
            button.style.borderColor = '#8b0000';
            button.style.transform = 'scale(0.98)';
            
            checkAnswer(option, question.answer, question.commentator);
        };
        
        optionsDiv.appendChild(button);
    });
    
    showGameSubScreen('question');
}

function checkAnswer(selected, correct, commentator) {
    const isCorrect = selected === correct;
    playerAnswers.push({ selected, correct, isCorrect, commentator });

    if (isCorrect) {
        correctAnswers++;
        if (typeof createGameVFX === 'function') createGameVFX('correct');
    } else {
        if (typeof createGameVFX === 'function') createGameVFX('incorrect');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 800);
}

function showResults() {
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    const pointsEarned = (correctAnswers * POINTS_PER_CORRECT) + 
                        (correctAnswers === totalQuestions ? POINTS_PER_GAME_COMPLETION : 0);
    
    const gameResult = addGameScore(pointsEarned, correctAnswers, totalQuestions);
    
    updateResultsDisplay(pointsEarned, gameResult.coins, totalQuestions, correctAnswers, percentage, gameResult);
    
    showGameSubScreen('result');
    
    if (typeof createGameVFX === 'function') {
        if (percentage >= 50) {
            createGameVFX('victory');
        } else {
            createGameVFX('defeat');
        }
    }
}

function updateResultsDisplay(pointsEarned, coinsEarned, totalQuestions, correctAnswers, percentage, gameResult) {
    document.getElementById('result-correct').textContent = `${correctAnswers}/${totalQuestions}`;
    document.getElementById('result-points').textContent = `+${pointsEarned}`;
    document.getElementById('result-coins').textContent = `+${coinsEarned}`;
    document.getElementById('result-total').textContent = playerStats.totalScore;
    
    const rankNotification = document.getElementById('rank-notification');
    if (gameResult.rankChanged) {
        rankNotification.style.display = 'flex';
        rankNotification.innerHTML = `
            <i class="fas fa-arrow-up"></i>
            <span>Rank Up! ${rankRequirements[gameResult.oldRank]?.displayName} → ${rankRequirements[gameResult.newRank]?.displayName}</span>
        `;
        
        if (typeof createGameVFX === 'function') {
            setTimeout(() => createGameVFX('victory'), 500);
        }
    } else {
        rankNotification.style.display = 'none';
    }
    
    // Determine which character gives feedback
    let feedbackCharacter;
    if (percentage >= 70) {
        feedbackCharacter = 'rikimaru';
    } else if (percentage >= 50) {
        feedbackCharacter = 'ayame';
    } else {
        feedbackCharacter = 'tatsumaru';
    }
    
    // Get feedback from character-comments.js if available
    let feedbackMessage = "";
    if (typeof getCharacterResultFeedback === 'function') {
        // Convert our rank to character-comments.js format
        const rankKey = playerStats.currentRank;
        feedbackMessage = getCharacterResultFeedback(feedbackCharacter, rankKey, playerName);
    } else {
        // Fallback to simple feedback
        if (feedbackCharacter === 'rikimaru') {
            if (percentage >= 80) {
                feedbackMessage = "Your precision is commendable. Continue to hone your skills in the shadows.";
            } else if (percentage >= 60) {
                feedbackMessage = "Acceptable performance. Focus on improving your judgment.";
            } else {
                feedbackMessage = "Your technique needs refinement. Study the ancient scrolls.";
            }
        } else if (feedbackCharacter === 'ayame') {
            if (percentage >= 80) {
                feedbackMessage = "Well done! Your intuition serves you well in the shadows!";
            } else if (percentage >= 60) {
                feedbackMessage = "Good effort! Remember, a true kunoichi relies on both skill and wit!";
            } else {
                feedbackMessage = "You need more practice! Don't lose heart - every master was once a beginner!";
            }
        } else if (feedbackCharacter === 'tatsumaru') {
            if (percentage >= 80) {
                feedbackMessage = "Hmph. Not bad. You understand that strength comes from knowledge.";
            } else if (percentage >= 60) {
                feedbackMessage = "Adequate. But true power requires perfection.";
            } else {
                feedbackMessage = "Weak. The shadows have no mercy for the unprepared.";
            }
        } else {
            feedbackMessage = "The trial is complete. Your performance has been recorded.";
        }
    }
    
    const feedbackText = document.getElementById('feedback-text');
    if (feedbackText) feedbackText.textContent = feedbackMessage;
    
    // Set character portrait
    if (typeof getCharacterPortrait === 'function') {
        const portrait = getCharacterPortrait(feedbackCharacter);
        const feedbackPortrait = document.getElementById('feedback-portrait');
        if (portrait && feedbackPortrait) {
            feedbackPortrait.style.backgroundImage = `url('${portrait}')`;
        }
    }
}

// ==================== PERSISTENCE ====================

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

function updatePlayerRank() {
    const ranks = Object.keys(rankRequirements);
    let newRank = "apprentice";
    let newStars = 0;
    let rankChanged = false;
    const oldRank = playerStats.currentRank;
    
    for (let i = ranks.length - 1; i >= 0; i--) {
        const rank = ranks[i];
        if (playerStats.totalScore >= rankRequirements[rank].minScore) {
            newRank = rank;
            
            const nextRank = rankRequirements[rank].nextRank;
            if (nextRank) {
                const currentMin = rankRequirements[rank].minScore;
                const nextMin = rankRequirements[nextRank].minScore;
                const progress = playerStats.totalScore - currentMin;
                const totalRange = nextMin - currentMin;
                const starProgress = (progress / totalRange) * 3;
                newStars = Math.min(2, Math.floor(starProgress));
            } else {
                newStars = 2;
            }
            break;
        }
    }
    
    rankChanged = (oldRank !== newRank);
    playerStats.currentRank = newRank;
    playerStats.rankStars = newStars;
    
    const rankOrder = ["apprentice", "shinobi", "assassin", "ninja", "masterNinja", "grandMaster"];
    const currentIndex = rankOrder.indexOf(newRank);
    const highestIndex = rankOrder.indexOf(playerStats.highestRank);
    if (currentIndex > highestIndex) {
        playerStats.highestRank = newRank;
    }
    
    return rankChanged;
}

function addGameScore(gameScore, correctCount, totalQuestions) {
    const oldRank = playerStats.currentRank;
    
    playerStats.totalScore += gameScore;
    playerStats.trialsCompleted++;
    playerStats.totalCorrectAnswers += correctCount;
    playerStats.totalQuestionsAnswered += totalQuestions;
    
    const coinsEarned = (correctCount * COINS_PER_CORRECT) + (correctCount === totalQuestions ? COINS_PER_GAME : 0);
    playerStats.coins += coinsEarned;
    
    const rankChanged = updatePlayerRank();
    savePlayerStats();
    
    return { score: gameScore, coins: coinsEarned, rankChanged: rankChanged, oldRank: oldRank, newRank: playerStats.currentRank };
}

function getStarsDisplay(stars) {
    switch(stars) {
        case 0: return "☆☆☆";
        case 1: return "★☆☆";
        case 2: return "★★☆";
        case 3: return "★★★";
        default: return "☆☆☆";
    }
}

function getRankProgress() {
    const currentRank = playerStats.currentRank;
    const nextRank = rankRequirements[currentRank].nextRank;
    
    if (!nextRank) {
        return { current: playerStats.totalScore, required: playerStats.totalScore, percent: 100 };
    }
    
    const currentMin = rankRequirements[currentRank].minScore;
    const nextMin = rankRequirements[nextRank].minScore;
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

// ==================== UTILS ====================

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

function showAppreciationScreen() {
    if (typeof supporters === 'undefined' || supporters.length === 0) {
        showResults();
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * supporters.length);
    const supporter = supporters[randomIndex];
    
    const characters = ['rikimaru', 'ayame', 'tatsumaru'];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    
    let portrait = '';
    if (typeof getCharacterPortrait === 'function') {
        portrait = getCharacterPortrait(randomCharacter);
    }
    
    let characterName = "Azuma Master";
    if (typeof getCharacterDisplayName === 'function') {
        characterName = getCharacterDisplayName(randomCharacter);
    }
    
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
    
    const appreciationPortrait = document.getElementById('appreciation-portrait');
    if (portrait && appreciationPortrait) {
        appreciationPortrait.style.backgroundImage = `url('${portrait}')`;
    }
    
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

function updateStatsDisplay() {
    const playerNameEl = document.getElementById('stats-player-name');
    if (playerNameEl) playerNameEl.textContent = playerName.toUpperCase();
    
    const set = (id, val) => { 
        const el = document.getElementById(id); 
        if (el) el.textContent = val; 
    };
    
    set('stat-total-score', playerStats.totalScore);
    set('stat-trials-completed', playerStats.trialsCompleted);
    set('stat-coins', playerStats.coins);
    
    const successRate = playerStats.totalQuestionsAnswered > 0 
        ? Math.round((playerStats.totalCorrectAnswers / playerStats.totalQuestionsAnswered) * 100)
        : 0;
    set('stat-success-rate', `${successRate}%`);
    
    const rankName = rankRequirements[playerStats.currentRank]?.displayName || "APPRENTICE";
    set('stat-rank-name', rankName);
    
    const starsDisplay = getStarsDisplay(playerStats.rankStars);
    set('stat-rank-stars', starsDisplay);
    
    const progress = getRankProgress();
    set('stat-rank-progress-text', `${playerStats.totalScore}/${progress.required}`);
    
    const progressBar = document.getElementById('stat-rank-progress');
    if (progressBar) {
        progressBar.style.width = `${progress.percent}%`;
    }
    
    const rankNameEl = document.getElementById('stat-rank-name');
    if (rankNameEl) {
        const rankColors = {
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
    const rank = document.getElementById('stat-rank-name')?.textContent || 'APPRENTICE';
    const stars = document.getElementById('stat-rank-stars')?.textContent || '☆☆☆';
    const score = document.getElementById('stat-total-score')?.textContent || '0';
    const text = `I achieved ${rank} ${stars} with ${score} points in Tenchu Shiren! 天誅試練`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Tenchu Shiren Stats',
            text: text,
            url: window.location.href
        }).catch(err => {
            fallbackShare(text);
        });
    } else {
        fallbackShare(text);
    }
}

function fallbackShare(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Stats copied to clipboard!');
        });
    } else {
        alert('Share this text:\n\n' + text);
    }
}

// ==================== INITIALIZATION ====================

function initializeGame() {
    console.log('Tenchu Shiren - Initializing...');
    document.body.style.overflow = 'hidden';
    
    if (typeof initVFX === 'function') initVFX();
    loadPlayerStats();
    if (typeof updateSupportersList === 'function') updateSupportersList();
    
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') setPlayerName();
        });
    }
    
    setTimeout(() => showScreen('menu'), 100);
}

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