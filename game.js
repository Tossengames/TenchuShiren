// Game Content
const questions = [
    {
        question: "A guard is patrolling a narrow corridor. You have no tools. How do you proceed?",
        options: ["Leap from the rafters", "Wait for him to pass", "Engage in open combat", "Extinguish the torches"],
        answer: "Wait for him to pass"
    },
    {
        question: "Which item is most vital for reaching high rooftops undetected?",
        options: ["Shuriken", "Smoke Bomb", "Grappling Hook", "Caltrops"],
        answer: "Grappling Hook"
    },
    {
        question: "Your target is sleeping, but a maid is in the next room. What is the shinobi way?",
        options: ["Kill both quickly", "Wait for a distraction", "Eliminate only the target", "Abandon mission"],
        answer: "Eliminate only the target"
    },
    {
        question: "You have been spotted by a guard dog. What is your distraction?",
        options: ["Colored Rice", "Poisonous Meat", "Throw a stone", "Run away"],
        answer: "Poisonous Meat"
    },
    {
        question: "What is the core philosophy of the Azuma Shinobi?",
        options: ["Greed", "Justice in Shadow", "Public Glory", "Merciless Chaos"],
        answer: "Justice in Shadow"
    }
];

const characters = [
    { name: "Rikimaru", comments: ["Your focus is sharp.", "Shadows are your only kin.", "One strike, one soul."] },
    { name: "Ayame", comments: ["Not bad for a rookie.", "Speed over strength, always.", "Keep your breath quiet."] }
];

// Game State
let playerName = "Ninja";
let score = 0;
let currentIdx = 0;

// Ambient VFX
const canvas = document.getElementById('vfx-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initVFX() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({length: 40}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        v: Math.random() * 0.5 + 0.2,
        s: Math.random() * 2
    }));
}

function drawVFX() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(139, 0, 0, 0.4)";
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.v;
        if (p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(drawVFX);
}

// Navigation Logic
function hideAll() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
}

function showPlayerNameScreen() {
    hideAll();
    document.getElementById('player-name-screen').classList.remove('hidden');
}

function setPlayerName() {
    const val = document.getElementById('player-name-input').value.trim();
    if(val) playerName = val;
    startGame();
}

function startGame() {
    hideAll();
    score = 0;
    currentIdx = 0;
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('result-box').classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('question-box').classList.remove('hidden');
    
    const q = questions[currentIdx];
    document.getElementById('question-text').textContent = q.question;
    const optDiv = document.getElementById('options');
    optDiv.innerHTML = "";
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "btn-ninja";
        btn.textContent = opt;
        btn.onclick = () => selectAnswer(opt, q.answer);
        optDiv.appendChild(btn);
    });
}

function selectAnswer(sel, ans) {
    const isCorrect = sel === ans;
    if(isCorrect) score++;
    
    document.getElementById('question-box').classList.add('hidden');
    const fbBox = document.getElementById('feedback-box');
    const char = characters[Math.floor(Math.random() * characters.length)];
    
    document.getElementById('feedback-name').textContent = `${char.name} observes:`;
    document.getElementById('feedback-text').innerHTML = `
        <span style="color:${isCorrect?'#4caf50':'#ff3b3b'}">${isCorrect?'[TRUE PATH]':'[STRAYED]'}</span><br>
        "${char.comments[Math.floor(Math.random()*char.comments.length)]}"
    `;
    fbBox.classList.remove('hidden');
}

function nextQuestion() {
    currentIdx++;
    if(currentIdx < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    hideAll();
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    const resBox = document.getElementById('result-box');
    resBox.classList.remove('hidden');
    
    const p = (score / questions.length) * 100;
    document.getElementById('result-rank').textContent = p === 100 ? "GRANDMASTER" : p >= 60 ? "NINJA" : "RENEGADE";
    document.getElementById('result-title').textContent = `${playerName}'s Fate`;
    document.getElementById('result-text').textContent = p === 100 ? "The Azuma clan honors your perfection." : "You survived, but your blade needs sharpening.";
}

function showInfo() { hideAll(); document.getElementById('info').classList.remove('hidden'); }
function backToMenu() { hideAll(); document.getElementById('menu').classList.remove('hidden'); }

function showSupporters() {
    hideAll();
    const list = document.getElementById('supporters-list');
    list.innerHTML = "";
    if(typeof supporters !== 'undefined') {
        supporters.forEach(s => {
            const li = document.createElement('li');
            li.textContent = `${s.name} ${s.handle || ''}`;
            list.appendChild(li);
        });
    }
    document.getElementById('supporters-screen').classList.remove('hidden');
}

window.onload = () => { initVFX(); drawVFX(); };
