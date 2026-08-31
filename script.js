// ======================================
// NAIJA BRAIN RUSH
// ======================================

// GAME SETTINGS

const QUESTIONS_PER_GAME = 10;
const TIME_PER_QUESTION = 15;

let currentCategory = "all";
let currentQuestions = [];
let currentQuestionIndex = 0;

let score = 0;
let correct = 0;
let wrong = 0;
let lives = 3;

let timer;
let timeLeft = TIME_PER_QUESTION;
let answering = false;


// ======================================
// QUESTION DATABASE
// ======================================

const questionBank = [

  // NAIJA
  {
    category: "naija",
    question: "What is the capital of Nigeria?",
    answers: ["Lagos", "Abuja", "Kano", "Ibadan"],
    correct: 1
  },

  {
    category: "naija",
    question: "How many states are in Nigeria?",
    answers: ["30", "36", "37", "40"],
    correct: 1
  },

  {
    category: "naija",
    question: "What is the official language of Nigeria?",
    answers: ["Yoruba", "Hausa", "English", "Igbo"],
    correct: 2
  },

  {
    category: "naija",
    question: "Which city is known as the commercial capital of Nigeria?",
    answers: ["Abuja", "Lagos", "Ilorin", "Jos"],
    correct: 1
  },

  {
    category: "naija",
    question: "What is the currency of Nigeria?",
    answers: ["Dollar", "Cedi", "Naira", "Shilling"],
    correct: 2
  },

  {
    category: "naija",
    question: "Which Nigerian city is popularly called the Centre of Excellence?",
    answers: ["Lagos", "Abuja", "Kano", "Enugu"],
    correct: 0
  },

  {
    category: "naija",
    question: "What are the colours of the Nigerian flag?",
    answers: [
      "Green, White, Green",
      "Green, Yellow, Green",
      "White, Green, White",
      "Blue, White, Green"
    ],
    correct: 0
  },


  // FOOTBALL
  {
    category: "football",
    question: "How many players does one football team normally have on the pitch?",
    answers: ["9", "10", "11", "12"],
    correct: 2
  },

  {
    category: "football",
    question: "How long is a standard football match?",
    answers: ["60 minutes", "90 minutes", "100 minutes", "120 minutes"],
    correct: 1
  },

  {
    category: "football",
    question: "Which country won the 2022 FIFA World Cup?",
    answers: ["France", "Brazil", "Argentina", "Germany"],
    correct: 2
  },

  {
    category: "football",
    question: "Which player is known as CR7?",
    answers: [
      "Lionel Messi",
      "Cristiano Ronaldo",
      "Kylian Mbappé",
      "Neymar"
    ],
    correct: 1
  },

  {
    category: "football",
    question: "How many minutes are in one half of a normal football match?",
    answers: ["30", "40", "45", "50"],
    correct: 2
  },

  {
    category: "football",
    question: "Which card means a player has been sent off?",
    answers: ["Blue", "Green", "Yellow", "Red"],
    correct: 3
  },


  // MATHEMATICS
  {
    category: "math",
    question: "What is 12 × 5?",
    answers: ["50", "55", "60", "65"],
    correct: 2
  },

  {
    category: "math",
    question: "What is 100 ÷ 4?",
    answers: ["20", "25", "30", "40"],
    correct: 1
  },

  {
    category: "math",
    question: "What is 15 + 27?",
    answers: ["40", "41", "42", "43"],
    correct: 2
  },

  {
    category: "math",
    question: "What is 9²?",
    answers: ["18", "72", "81", "90"],
    correct: 2
  },

  {
    category: "math",
    question: "What is 50% of 80?",
    answers: ["20", "30", "40", "50"],
    correct: 2
  },

  {
    category: "math",
    question: "If x + 7 = 15, what is x?",
    answers: ["6", "7", "8", "9"],
    correct: 2
  },


  // BRAIN
  {
    category: "brain",
    question: "What comes next: 2, 4, 6, 8, ?",
    answers: ["9", "10", "11", "12"],
    correct: 1
  },

  {
    category: "brain",
    question: "Which one does NOT belong?",
    answers: ["Apple", "Mango", "Carrot", "Orange"],
    correct: 2
  },

  {
    category: "brain",
    question: "If you have 3 apples and take away 2, how many do you have?",
    answers: ["1", "2", "3", "5"],
    correct: 1
  },

  {
    category: "brain",
    question: "What comes next: 1, 3, 5, 7, ?",
    answers: ["8", "9", "10", "11"],
    correct: 1
  },

  {
    category: "brain",
    question: "Which number is different?",
    answers: ["2", "4", "6", "9"],
    correct: 3
  },

  {
    category: "brain",
    question: "A triangle has how many sides?",
    answers: ["2", "3", "4", "5"],
    correct: 1
  }

];


// ======================================
// SCREEN CONTROL
// ======================================

function showScreen(id) {

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}


function goHome() {

  stopTimer();

  showScreen("homeScreen");

  updateBestScore();
}


function showCategoryScreen() {

  stopTimer();

  showScreen("categoryScreen");
}


function showHowToPlay() {

  document.getElementById("howModal").classList.add("show");
}


function closeHowToPlay() {

  document.getElementById("howModal").classList.remove("show");
}


// ======================================
// START GAME
// ======================================

function startGame(category) {

  currentCategory = category;

  score = 0;
  correct = 0;
  wrong = 0;
  lives = 3;

  currentQuestionIndex = 0;

  let availableQuestions;

  if (category === "all") {

    availableQuestions = [...questionBank];

  } else {

    availableQuestions = questionBank.filter(
      question => question.category === category
    );
  }

  currentQuestions = shuffleArray(availableQuestions)
    .slice(0, QUESTIONS_PER_GAME);

  showScreen("gameScreen");

  updateGameUI();

  loadQuestion();
}


// ======================================
// LOAD QUESTION
// ======================================

function loadQuestion() {

  if (currentQuestionIndex >= currentQuestions.length) {

    endGame();
    return;
  }

  answering = false;

  const question =
    currentQuestions[currentQuestionIndex];

  document.getElementById("question").textContent =
    question.question;

  document.getElementById("questionNumber").textContent =
    currentQuestionIndex + 1;

  document.getElementById("categoryName").textContent =
    getCategoryName(question.category);

  const answersContainer =
    document.getElementById("answers");

  answersContainer.innerHTML = "";

  question.answers.forEach((answer, index) => {

    const button = document.createElement("button");

    button.className = "answer-btn";

    button.textContent =
      `${String.fromCharCode(65 + index)}. ${answer}`;

    button.onclick = () => checkAnswer(index, button);

    answersContainer.appendChild(button);

  });

  updateProgress();

  startTimer();
}


// ======================================
// CHECK ANSWER
// ======================================

function checkAnswer(selectedIndex, selectedButton) {

  if (answering) return;

  answering = true;

  stopTimer();

  const question =
    currentQuestions[currentQuestionIndex];

  const buttons =
    document.querySelectorAll(".answer-btn");

  buttons.forEach(button => {
    button.disabled = true;
  });


  if (selectedIndex === question.correct) {

    selectedButton.classList.add("correct");

    score += 10;

    correct++;

  } else {

    selectedButton.classList.add("wrong");

    buttons[question.correct]
      .classList.add("correct");

    wrong++;

    lives--;

  }

  updateGameUI();


  setTimeout(() => {

    if (lives <= 0) {

      endGame();

      return;
    }

    currentQuestionIndex++;

    loadQuestion();

  }, 800);
}


// ======================================
// TIMER
// ======================================

function startTimer() {

  stopTimer();

  timeLeft = TIME_PER_QUESTION;

  updateTimer();

  timer = setInterval(() => {

    timeLeft--;

    updateTimer();

    if (timeLeft <= 0) {

      stopTimer();

      timeOut();

    }

  }, 1000);
}


function stopTimer() {

  if (timer) {

    clearInterval(timer);

    timer = null;
  }
}


function updateTimer() {

  document.getElementById("timer")
    .textContent = timeLeft;
}


function timeOut() {

  if (answering) return;

  answering = true;

  wrong++;

  lives--;

  const question =
    currentQuestions[currentQuestionIndex];

  const buttons =
    document.querySelectorAll(".answer-btn");

  buttons.forEach(button => {
    button.disabled = true;
  });

  buttons[question.correct]
    .classList.add("correct");

  updateGameUI();

  setTimeout(() => {

    if (lives <= 0) {

      endGame();

      return;
    }

    currentQuestionIndex++;

    loadQuestion();

  }, 900);
}


// ======================================
// UI
// ======================================

function updateGameUI() {

  document.getElementById("score")
    .textContent = score;

  document.getElementById("lives")
    .textContent =
      "❤️".repeat(lives) +
      "🖤".repeat(3 - lives);

}


function updateProgress() {

  const progress =
    (currentQuestionIndex / QUESTIONS_PER_GAME) * 100;

  document.getElementById("progressBar")
    .style.width = `${progress}%`;
}


function getCategoryName(category) {

  const names = {

    naija: "🇳🇬 Naija Knowledge",

    football: "⚽ Football",

    math: "🔢 Mathematics",

    brain: "🧠 Brain & Logic"

  };

  return names[category] || "🔥 Mixed Rush";
}


// ======================================
// END GAME
// ======================================

function endGame() {

  stopTimer();

  saveBestScore();

  document.getElementById("finalScore")
    .textContent = score;

  document.getElementById("correctAnswers")
    .textContent = correct;

  document.getElementById("wrongAnswers")
    .textContent = wrong;

  const totalAnswered = correct + wrong;

  const accuracy =
    totalAnswered === 0
      ? 0
      : Math.round((correct / totalAnswered) * 100);

  document.getElementById("accuracy")
    .textContent = `${accuracy}%`;


  const rankInfo = getRank(score);

  document.getElementById("rank")
    .textContent = rankInfo.rank;

  document.getElementById("resultEmoji")
    .textContent = rankInfo.emoji;

  document.getElementById("resultTitle")
    .textContent = rankInfo.title;

  document.getElementById("resultMessage")
    .textContent = rankInfo.message;


  showScreen("resultScreen");
}


// ======================================
// RANK SYSTEM
// ======================================

function getRank(score) {

  if (score >= 100) {

    return {
      rank: "Naija Brain Legend 👑",
      emoji: "👑",
      title: "YOU ARE A LEGEND!",
      message: "Your brain is on another level! 🔥"
    };

  }

  if (score >= 80) {

    return {
      rank: "Naija Genius 🧠",
      emoji: "🧠",
      title: "VERY IMPRESSIVE!",
      message: "You sabi this thing! 🇳🇬🔥"
    };

  }

  if (score >= 60) {

    return {
      rank: "Brain Master 🔥",
      emoji: "🔥",
      title: "NICE ONE!",
      message: "Your brain dey work well!"
    };

  }

  if (score >= 40) {

    return {
      rank: "Street Scholar 📚",
      emoji: "📚",
      title: "KEEP PUSHING!",
      message: "You are getting there."
    };

  }

  return {

    rank: "Beginner 🥚",
    emoji: "🥚",
    title: "DON'T GIVE UP!",
    message: "Try again and beat your score!"
  };
}


// ======================================
// BEST SCORE
// ======================================

function saveBestScore() {

  const best =
    Number(localStorage.getItem("naijaBestScore")) || 0;

  if (score > best) {

    localStorage.setItem(
      "naijaBestScore",
      score
    );
  }

  updateBestScore();
}


function updateBestScore() {

  const best =
    Number(localStorage.getItem("naijaBestScore")) || 0;

  const element =
    document.getElementById("homeBestScore");

  if (element) {

    element.textContent = best;
  }
}


// ======================================
// QUIT GAME
// ======================================

function quitGame() {

  const confirmQuit =
    confirm("Are you sure you want to quit the game?");

  if (confirmQuit) {

    stopTimer();

    showCategoryScreen();
  }
}


// ======================================
// SHUFFLE QUESTIONS
// ======================================

function shuffleArray(array) {

  const newArray = [...array];

  for (
    let i = newArray.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [
      newArray[i],
      newArray[j]
    ] =
    [
      newArray[j],
      newArray[i]
    ];
  }

  return newArray;
}


// ======================================
// INITIALIZE
// ======================================

updateBestScore();
