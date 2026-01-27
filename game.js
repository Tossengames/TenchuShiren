/* ============================================================
   TENCHU TEST - SHINOBI LOGIC & VFX
   ============================================================ */

let playerName = "Ninja";
let currentQuestionIndex = 0;
let score = 0;
const questionsPerSession = 5;

// ======================= AMBIENT VFX SYSTEM =======================
const canvas = document.getElementById("vfx-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 0.5 + 0.2,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5
        });
    }
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(139, 0, 0, 0.6)"; // Red ember color
    
    particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
    });
    
    requestAnimationFrame(animateBackground);
}

// Visual feedback when an answer is selected
function triggerSlashEffect() {
    const slash = document.createElement("div");
    slash.className = "slash-vfx";
    // Randomize angle and position
    const angle = Math.random() > 0.5 ? 45 : -45;
    slash.style.top = "50%";
    slash.style.left = "-10%";
    slash.style.width = "120%";
    slash.style.transform = `rotate(${angle}deg) scaleX(0)`;
    slash.style.transition = "transform 0.2s ease-out";
    
    document.body.appendChild(slash);
    
    setTimeout(() => {
        slash.style.transform = `rotate(${angle}deg) scaleX(1)`;
        setTimeout(() => {
            slash.style.opacity = "0";
            setTimeout(() => slash.remove(), 100);
        }, 150);
    }, 10);
}

// ======================= NAVIGATION =======================
function showPlayerNameScreen() {
    hideAllScreens();
    document.getElementById("player-name-screen").classList.remove("hidden");
}

function setPlayerName() {
    const input = document.getElementById("player-name-input").value.trim();
    if (input) playerName = input;
    startGame();
}

function showInfo() {
    hideAllScreens();
    document.getElementById("info").classList.remove("hidden");
}

function showSupporters() {
    hideAllScreens();
    document.getElementById("supporters-screen").classList.remove("hidden");
}

function backToMenu() {
    hideAllScreens();
    document.getElementById("menu").classList.remove("hidden");
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.add('hidden'));
}

// ======================= GAMEPLAY =======================
function startGame() {
    hideAllScreens();
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("question-box").classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    showQuestion(0);
}

function showQuestion(index) {
    const q = questions[index];
    const questionText = document.getElementById("question-text");
    const optionsDiv = document.getElementById("options");

    questionText.style.opacity = 0;
    questionText.textContent = q.question;
    optionsDiv.innerHTML = "";

    // Staggered button animation
    q.options.forEach((opt, i) => {
        let btn = document.createElement("button");
        btn.className = "btn-ninja";
        btn.textContent = opt;
        btn.style.animation = `fadeIn 0.5s ease forwards ${i * 0.1}s`;
        btn.onclick = () => selectAnswer(opt, q.answer);
        optionsDiv.appendChild(btn);
    });
    
    setTimeout(() => questionText.style.opacity = 1, 100);
}

function selectAnswer(selected, correct) {
    if (selected === correct) {
        score++;
        triggerSlashEffect();
    }
    showCharacterFeedback(selected === correct);
}

function showCharacterFeedback(isCorrect) {
    document.getElementById("question-box").classList.add("hidden");
    const feedbackBox = document.getElementById("feedback-box");
    feedbackBox.classList.remove("hidden");

    const char = characters[Math.floor(Math.random() * characters.length)];
    let comment = char.comments[Math.floor(Math.random() * char.comments.length)];

    document.getElementById("feedback-name").textContent = char.name;
    document.getElementById("feedback-text").textContent = 
        (isCorrect ? "Correct. " : "Incompetent! ") + comment;
    
    // Attempt to set portrait if you add images later
    document.getElementById("feedback-portrait").style.backgroundImage = `url('assets/portraits/${char.name.toLowerCase()}.png')`;
}

function nextQuestion() {
    document.getElementById("feedback-box").classList.add("hidden");
    
    // 30% chance for a supporter shoutout
    if (Math.random() < 0.3 && typeof supporters !== 'undefined' && supporters.length > 0) {
        showSupporterShoutout();
        return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex >= questionsPerSession) {
        showResult();
    } else {
        document.getElementById("question-box").classList.remove("hidden");
        showQuestion(currentQuestionIndex);
    }
}

// ======================= SUPPORTERS & RESULTS =======================
function showSupporterShoutout() {
    const supporterBox = document.getElementById("supporter-box");
    supporterBox.classList.remove("hidden");

    const char = characters[Math.floor(Math.random() * characters.length)];
    const supporter = supporters[Math.floor(Math.random() * supporters.length)];

    document.getElementById("supporter-name").textContent = char.name;
    document.getElementById("supporter-text").textContent = 
        `"We honor the shadow ${supporter.name} ${supporter.handle || ''} for their unwavering support of the clan."`;
    
    document.getElementById("supporter-portrait").style.backgroundImage = `url('assets/portraits/${char.name.toLowerCase()}.png')`;
}

function hideSupporterBox() {
    document.getElementById("supporter-box").classList.add("hidden");
    // Resume flow
    currentQuestionIndex++;
    if (currentQuestionIndex >= questionsPerSession) {
        showResult();
    } else {
        document.getElementById("question-box").classList.remove("hidden");
        showQuestion(currentQuestionIndex);
    }
}

function showResult() {
    hideAllScreens();
    document.getElementById("game").classList.remove("hidden");
    const resultBox = document.getElementById("result-box");
    resultBox.classList.remove("hidden");

    let rank = "", title = "", text = "";
    const percent = (score / questionsPerSession) * 100;

    if (percent === 100) { 
        rank = "GRANDMASTER"; title = "Shadow of the Clan"; 
        text = `Perfect, ${playerName}. You are the true successor of the Azuma style.`;
    } else if (percent >= 80) { 
        rank = "ELITE NINJA"; title = "The Silent Blade"; 
        text = `Impressive work, ${playerName}. The Lord Gohda will hear of your prowess.`;
    } else if (percent >= 50) { 
        rank = "NOVICE"; title = "Hidden Footstep"; 
        text = `You survived, ${playerName}. But the shadows require more discipline.`;
    } else { 
        rank = "APPRENTICE"; title = "Rookie Shadow"; 
        text = `Focus, ${playerName}! A ninja who cannot see the truth is already dead.`;
    }

    document.getElementById("result-rank").textContent = rank;
    document.getElementById("result-title").textContent = title;
    document.getElementById("result-text").textContent = text;
    document.getElementById("result-portrait").style.backgroundImage = `url('assets/portraits/result_icon.png')`;
}

// ======================= INITIALIZATION =======================
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
createParticles();
animateBackground();
