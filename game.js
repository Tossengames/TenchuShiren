let playerName = "Ninja";
let currentQuestionIndex = 0;
let score = 0;
let questionsPerSession = 5;

// Example supporters
let supporters = [
  {name: "ShadowTiger", handle: "@shadytiger"},
  {name: "SilentBlade", handle: "@silentblade"},
  {name: "CrimsonLotus", handle: "@crimsonlotus"}
];

// Characters for feedback
let characters = [
  {name:"Rikimaru", comments:["Stay silent, stay deadly.","Excellent choice, ninja."]},
  {name:"Ayame", comments:["Hmm, interesting move.","Don't get careless!"]},
  {name:"Tatsumaru", comments:["You’re learning fast.","Watch your steps!"]},
  {name:"Rin", comments:["Impressive!","Not bad for a beginner."]}
];

// ======================= FUNCTIONS =======================

function showPlayerNameScreen(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("player-name-screen").classList.remove("hidden");
}

function setPlayerName(){
  const input = document.getElementById("player-name-input").value.trim();
  if(input) playerName = input;
  document.getElementById("player-name-screen").classList.add("hidden");
  startGame();
}

function startGame(){
  document.getElementById("game").classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  nextQuestion();
}

function showInfo(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("info").classList.remove("hidden");
}

function backToMenu(){
  document.getElementById("info").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function nextQuestion(){
  const commentBox = document.getElementById("comment-box");
  commentBox.classList.add("hidden");
  currentQuestionIndex++;
  if(currentQuestionIndex >= questionsPerSession){
    showResult();
    return;
  }
  showQuestion(currentQuestionIndex);
}

function showQuestion(index){
  const q = questions[index];
  const questionText = document.getElementById("question-text");
  const optionsDiv = document.getElementById("options");

  questionText.textContent = q.question;
  optionsDiv.innerHTML = "";
  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = ()=>selectAnswer(opt,q.answer);
    optionsDiv.appendChild(btn);
  });
}

function selectAnswer(selected, correct){
  if(selected === correct) score++;
  showCharacterComment();
  triggerVFX();
}

function showCharacterComment(){
  const commentBox = document.getElementById("comment-box");
  commentBox.classList.remove("hidden");

  const char = characters[Math.floor(Math.random()*characters.length)];
  let comment = char.comments[Math.floor(Math.random()*char.comments.length)];

  if(Math.random() < 0.3 && supporters.length>0){
    const supporter = supporters[Math.floor(Math.random()*supporters.length)];
    comment += ` Special thanks to ${supporter.name}${supporter.handle ? " " + supporter.handle : ""}!`;
  }

  document.getElementById("comment-name").textContent = char.name;
  document.getElementById("comment-text").textContent = comment;
  document.getElementById("comment-portrait").src = "";
}

// ===================== RESULTS =====================
function showResult(){
  document.getElementById("question-box").innerHTML = "";
  const resultBox = document.getElementById("result-box");
  resultBox.classList.remove("hidden");

  let rank="", title="", text="";
  const percent = (score/questionsPerSession)*100;

  if(percent===100){ rank="Master Ninja"; title="Shadow of the Clan"; text="Perfect, "+playerName+"! Azuma honors your stealth and skill.";}
  else if(percent>=80){ rank="Elite Ninja"; title="Silent Blade"; text="Great work, "+playerName+". Feared in the shadows.";}
  else if(percent>=50){ rank="Novice Ninja"; title="Hidden Footstep"; text="Not bad, "+playerName+". Keep training.";}
  else{ rank="Apprentice"; title="Rookie Shadow"; text="You have much to learn, "+playerName+". Study the shadows carefully.";}

  document.getElementById("result-rank").textContent = rank;
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-text").textContent = text;
  document.getElementById("result-portrait").src = "";
}

// ===================== SIMPLE VFX =====================
const canvas = document.getElementById("vfx-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function triggerVFX(){
  // Simple red slash animation
  let x = Math.random()*canvas.width;
  let y = Math.random()*canvas.height;
  let length = 100 + Math.random()*100;
  ctx.strokeStyle = "rgba(255,0,0,0.7)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x+length, y+length*Math.random());
  ctx.stroke();
  setTimeout(()=>ctx.clearRect(0,0,canvas.width,canvas.height),200);
}