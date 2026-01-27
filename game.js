let playerName = "Ninja";
let currentQuestionIndex = 0;
let score = 0;
let questionsPerSession = 5;
let questions = [];

// Characters for feedback
let characters = [
  {name:"Rikimaru", comments:[
    "I see your mind is sharp, like a blade.",
    "Careful movements. The shadows watch you.",
    "Your stealth improves with each step."
  ]},
  {name:"Ayame", comments:[
    "Your choices reflect your training well.",
    "Patience is a ninja’s greatest ally.",
    "You observe the surroundings like a true shadow."
  ]},
  {name:"Tatsumaru", comments:[
    "Your instincts are improving.",
    "Remember, a single mistake can cost dearly.",
    "Your focus is impressive."
  ]},
  {name:"Rin", comments:[
    "Clever thinking!",
    "You are beginning to understand the way of the ninja.",
    "Think of the bigger picture, not just the moment."
  ]}
];

// ======================= FETCH QUESTIONS =======================
fetch("questions.json")
  .then(res => res.json())
  .then(data => { 
    questions = data;
    console.log("Questions loaded:", questions.length);
  })
  .catch(err => console.error("Failed to load questions.json:", err));

// ======================= GAME FLOW =======================
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

function backToMenu(){
  document.getElementById("info").classList.add("hidden");
  document.getElementById("supporters-screen").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function startGame(){
  if(questions.length === 0){
    alert("Questions not loaded yet. Please wait a moment and refresh.");
    return;
  }
  document.getElementById("game").classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  showQuestion(currentQuestionIndex);
}

// ======================= QUESTIONS =======================
function nextQuestion(){
  document.getElementById("feedback-box").classList.add("hidden");
  if(Math.random()<0.3 && supporters.length>0){
    showSupporterShoutout();
    return;
  }
  currentQuestionIndex++;
  if(currentQuestionIndex >= questionsPerSession){
    showResult();
    return;
  }
  showQuestion(currentQuestionIndex);
}

function showQuestion(index){
  const q = questions[Math.floor(Math.random()*questions.length)];
  const questionText = document.getElementById("question-text");
  const optionsDiv = document.getElementById("options");

  questionText.textContent = q.question;
  optionsDiv.innerHTML = "";

  // Image questions
  if(q.image){
    let img = document.createElement("img");
    img.src = q.image;
    img.alt = "Question Image";
    img.style.maxWidth = "200px";
    img.style.margin = "10px auto";
    optionsDiv.appendChild(img);
  }

  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = ()=>selectAnswer(opt,q.answer, btn, optionsDiv);
    optionsDiv.appendChild(btn);
  });
}

function selectAnswer(selected, correct, clickedBtn, container){
  // Disable all buttons after picking
  Array.from(container.querySelectorAll("button")).forEach(b=>b.disabled=true);

  if(selected === correct) score++;
  showCharacterFeedback(selected===correct);
}

// ======================= CHARACTER FEEDBACK =======================
function showCharacterFeedback(correct){
  const feedbackBox = document.getElementById("feedback-box");
  feedbackBox.classList.remove("hidden");

  const char = characters[Math.floor(Math.random()*characters.length)];
  let comment = char.comments[Math.floor(Math.random()*char.comments.length)];

  // Make feedback natural and encouraging
  comment = correct 
    ? `${char.name} nods approvingly: "${comment} Well done, ${playerName}."`
    : `${char.name} observes silently: "${comment} Take note for next time, ${playerName}."`;

  document.getElementById("feedback-name").textContent = char.name;
  document.getElementById("feedback-text").textContent = comment;
  document.getElementById("feedback-portrait").src = ""; // Add portrait later
}

// ======================= SUPPORTER SHOUTOUT =======================
function showSupporterShoutout(){
  const supporterBox = document.getElementById("supporter-box");
  supporterBox.classList.remove("hidden");

  const char = characters[Math.floor(Math.random()*characters.length)];
  const supporter = supporters[Math.floor(Math.random()*supporters.length)];

  document.getElementById("supporter-name").textContent = char.name;
  document.getElementById("supporter-text").textContent = 
    `${char.name} says: "We honor ${supporter.name}${supporter.handle ? " " + supporter.handle : ""} for their support!"`;
  document.getElementById("supporter-portrait").src = "";
}

function hideSupporterBox(){
  document.getElementById("supporter-box").classList.add("hidden");
  nextQuestion();
}

// ======================= RESULTS =======================
function showResult(){
  document.getElementById("question-box").innerHTML = "";
  const resultBox = document.getElementById("result-box");
  resultBox.classList.remove("hidden");

  let rank="", title="", text="";
  const percent = (score/questionsPerSession)*100;

  if(percent===100){ rank="Master Ninja"; title="Shadow of the Clan"; text=`Perfect, ${playerName}! Your mastery of stealth is unmatched.`; }
  else if(percent>=80){ rank="Elite Ninja"; title="Silent Blade"; text=`Great work, ${playerName}. Your skills inspire fear and respect.`; }
  else if(percent>=50){ rank="Novice Ninja"; title="Hidden Footstep"; text=`Not bad, ${playerName}. Continue your training in the shadows.`; }
  else{ rank="Apprentice"; title="Rookie Shadow"; text=`You have much to learn, ${playerName}. Study the shadows carefully.`; }

  document.getElementById("result-rank").textContent = rank;
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-text").textContent = text;
  document.getElementById("result-portrait").src = "";
}