let playerName = "Ninja";
let score = 0;
let currentIdx = 0;
let questions = [];

// Load Questions from JSON with Fallback
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
    } catch (e) {
        console.warn("JSON load failed, using local fallback");
        questions = [
            { "question": "A guard patrolls the gate. Your move?", "options": ["Kill", "Wait", "Distract"], "answer": "Wait" }
        ];
    }
}

// Particle System
const canvas = document.getElementById('vfx-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function initVFX() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    particles = Array.from({length: 50}, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        s: Math.random() * 2, v: Math.random() * 0.5 + 0.2
    }));
}
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(139, 0, 0, 0.4)";
    particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
        p.y -= p.v; if(p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(animate);
}

// Navigation & Logic
function hideAll() { document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden')); }

function startGame() {
    hideAll();
    currentIdx = 0; score = 0;
    document.getElementById('game').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = questions[currentIdx];
    const box = document.getElementById('question-box');
    const optDiv = document.getElementById('options');
    
    box.classList.remove('hidden');
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('question-text').textContent = q.question;
    
    optDiv.innerHTML = "";
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(opt, q.answer);
        optDiv.appendChild(btn);
    });
}

function handleAnswer(sel, ans) {
    const isCorrect = sel === ans;
    if(isCorrect) { score++; triggerSlash(); }

    document.getElementById('question-box').classList.add('hidden');
    const fbBox = document.getElementById('feedback-box');
    const char = ["Rikimaru", "Ayame"][Math.floor(Math.random()*2)];
    const comments = isCorrect ? ["Impressive.", "A true shinobi."] : ["Foolish.", "You lack discipline."];
    
    // Format: "Name: Feedback"
    document.getElementById('feedback-name').textContent = `${char}:`;
    document.getElementById('feedback-text').textContent = comments[Math.floor(Math.random()*comments.length)];
    
    fbBox.classList.remove('hidden');
}

function nextQuestion() {
    currentIdx++;
    // Smooth wait transition
    setTimeout(() => {
        if(currentIdx < questions.length) showQuestion();
        else showResults();
    }, 400); 
}

function showResults() {
    hideAll();
    const res = document.getElementById('result-box');
    const p = (score/questions.length)*100;
    
    document.getElementById('result-rank').textContent = p === 100 ? "MASTER NINJA" : "APPRENTICE";
    document.getElementById('result-text').textContent = `Trials completed. Accuracy: ${p}%`;
    
    document.getElementById('game').classList.remove('hidden');
    res.classList.remove('hidden');
}

function triggerSlash() {
    const div = document.createElement('div');
    div.className = "slash";
    div.style.top = Math.random() * 80 + 10 + "%";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 300);
}

window.onload = () => { loadQuestions(); initVFX(); animate(); };
