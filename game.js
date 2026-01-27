/* ============================================================
   TENCHU TEST - CORE GAME LOGIC
   ============================================================ */

let playerName = "Ninja";
let currentQuestionIndex = 0;
let score = 0;
const questionsPerSession = 5;

// ======================= DATA =======================

const characters = [
  {
    name: "Rikimaru", 
    comments: [
      "Your choice shows the precision of the Azuma clan.",
      "Stealth is not just a skill, it is a way of life.",
      "You lack focus. The shadows do not forgive mistakes."
    ]
  },
  {
    name: "Ayame", 
    comments: [
      "Not bad. You might actually survive the night.",
      "Speed is fine, but observation is better.",
      "You're making too much noise. Try again."
    ]
  },
  {
    name: "Tatsumaru", 
    comments: [
      "Your reflexes are improving, but your mind is clouded.",
      "A true shinobi strikes before the enemy even knows they exist.",
      "Doubt is a sharper blade than any katana."
    ]
  }
];

// ======================= AMBIENT VFX =======================

const canvas = document.getElementById("vfx-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 0.4 + 0.1,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(139, 0, 0, 0.5)"; 
    particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(animate);
}

function triggerSlash() {
    const slash = document.createElement("div");
    slash.className = "slash-vfx";
    slash.style.top = "50%";
    slash.style.left = "-10%";
    slash.style.width = "120%";
    slash.style.height = "3px";
    slash.style.background = "white";
    slash.style.position = "fixed";
    slash.style.boxShadow = "0 0 15px #ff0000";
    slash.style.transform = `rotate(${Math.random() > 0.5 ? 20 : -20}deg)`;
    slash.style.zIndex = "9999";
    document.body.appendChild(slash);
    setTimeout(() => slash.remove(), 150);
}

// ======================= ENGINE =======================

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.add('hidden'));
    // Also hide gameplay sub-boxes
    document.getElementById("feedback-box").classList.add("hidden");
    document.getElementById("result-box").classList.add("hidden");
    document.getElementById("supporter-box").classList.add("hidden");
    document.getElementById("question-box").classList.add("hidden");
}

function showPlayerNameScreen() {
    hideAllScreens();
    document.getElementById("player-name-screen").classList.remove("hidden");
}

function setPlayerName() {
    const nameInput = document.getElementById("player-name-input").value.trim();
    if (nameInput) playerName = nameInput;
    startGame();
}

function startGame() {
    hideAllScreens();
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("question-box").classList.remove("hidden");
    showQuestion(0);
}

function showQuestion(index) {
    const q = questions[index];
    const questionText = document.getElementById("question-text");
    const optionsDiv = document.getElementById("options");

    questionText.textContent = q.question;
    optionsDiv.innerHTML = "";

    q.options.forEach(opt => {
        let btn = document.createElement("button");
        btn.className = "btn-ninja";
        btn.textContent = opt;
        btn.onclick = () => selectAnswer(opt, q.answer);
        optionsDiv.appendChild(btn);
    });
}

function selectAnswer(selected, correct) {
    const isCorrect = selected === correct;
    if (isCorrect) {
        score++;
        triggerSlash();
    }
    showCharacterFeedback(isCorrect);
}

function showCharacterFeedback(isCorrect) {
    document.getElementById("question-box").classList.add("hidden");
    const feedbackBox = document.getElementById("feedback-box");
    
    const char = characters[Math.floor(Math.random() * characters.length)];
    const comment = char.comments[Math.floor(Math.random() * char.comments.length)];

    document.getElementById("feedback-name").textContent = `${char.name} observes:`;
    document.getElementById("feedback-text").innerHTML = `
        <strong style="color: ${isCorrect ? '#4caf50' : '#ff3b3b'}">
            ${isCorrect ? "CLEVER..." : "FOOLISH..."}
        </strong><br><br>
        "${comment}"
    `;
    
    // Set portrait background if you have the images
    const portrait = document.getElementById("feedback-portrait");
    portrait.style.backgroundImage = `url('assets/portraits/${char.name.toLowerCase()}.png')`;
    
    feedbackBox.classList.remove("hidden");
}

function nextQuestion() {
    document.getElementById("feedback-box").classList.add("hidden");
    
    // Supporter Shoutout Chance (20%)
    if (Math.random() < 0.2 && typeof supporters !== 'undefined' && supporters.length > 0) {
        showSupporterShoutout();
        return;
    }

    proceed();
}

function proceed() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questionsPerSession) {
        showResult();
    } else {
        document.getElementById("question-box").classList.remove("hidden");
        showQuestion(currentQuestionIndex);
    }
}

function showSupporterShoutout() {
    const supporterBox = document.getElementById("supporter-box");
    const supporter = supporters[Math.floor(Math.random() * supporters.length)];
    const char = characters[Math.floor(Math.random() * characters.length)];

    document.getElementById("supporter-name").textContent = `${char.name} acknowledges:`;
    document.getElementById("supporter-text").textContent = `Our shadow ally, ${supporter.name}, watches over this trial.`;
    
    supporterBox.classList.remove("hidden");
}

function hideSupporterBox() {
    document.getElementById("supporter-box").classList.add("hidden");
    proceed();
}

function showResult() {
    document.getElementById("question-box").classList.add("hidden");
    const resultBox = document.getElementById("result-box");
    
    let rank = "", title = "", text = "";
    const percent = (score / questionsPerSession) * 100;

    if (percent === 100) { 
        rank = "GRANDMASTER"; title = "Shadow Assassin"; 
        text = `Unbelievable, ${playerName}. You are a true master of the Azuma Clan.`;
    } else if (percent >= 80) { 
        rank = "ELITE NINJA"; title = "Expert Infiltrator"; 
        text = `Well done, ${playerName}. Lord Gohda will be pleased with your progress.`;
    } else if (percent >= 40) { 
        rank = "NOVICE"; title = "Hidden Footstep"; 
        text = `You have passed the trial, ${playerName}, but your blade lacks discipline.`;
    } else { 
        rank = "THUG"; title = "Unseen Failure"; 
        text = `You have much to learn, ${playerName}. Return to the shadows and train harder.`;
    }

    document.getElementById("result-rank").textContent = rank;
    document.getElementById("result-title").textContent = title;
    document.getElementById("result-text").textContent = text;
    
    resultBox.classList.remove("hidden");
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

// ======================= INIT =======================

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initParticles();
animate();
