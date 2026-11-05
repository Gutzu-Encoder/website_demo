// Placeholder question bank — swap these out for your own questions.
const QUESTIONS = [
  {
    question: "[Placeholder] What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctIndex: 2,
  },
  {
    question: "[Placeholder] Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
  },
  {
    question: "[Placeholder] What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
  },
  {
    question: "[Placeholder] Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correctIndex: 1,
  },
  {
    question: "[Placeholder] What is the chemical symbol for gold?",
    options: ["Gd", "Go", "Au", "Ag"],
    correctIndex: 2,
  },
  {
    question: "[Placeholder] How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    question: "[Placeholder] What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Horse", "Greyhound"],
    correctIndex: 1,
  },
  {
    question: "[Placeholder] In which year did the Titanic sink?",
    options: ["1905", "1912", "1920", "1931"],
    correctIndex: 1,
  },
];

const ADVANCE_DELAY_MS = 500;

const state = {
  playerName: "",
  currentIndex: 0,
  answers: [], // { questionIndex, selectedChoice, correct }
};

const screens = {
  welcome: document.getElementById("welcome-screen"),
  quiz: document.getElementById("quiz-screen"),
  finish: document.getElementById("finish-screen"),
};

const welcomeForm = document.getElementById("welcome-form");
const nameInput = document.getElementById("player-name");
const nameError = document.getElementById("name-error");
const progressEl = document.getElementById("progress");
const questionTextEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const finishHeading = document.getElementById("finish-heading");
const finishScore = document.getElementById("finish-score");
const summaryList = document.getElementById("summary-list");

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

welcomeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameError.classList.remove("hidden");
    return;
  }
  nameError.classList.add("hidden");
  state.playerName = name;
  state.currentIndex = 0;
  state.answers = [];
  showScreen("quiz");
  renderQuestion();
});

function renderQuestion() {
  const q = QUESTIONS[state.currentIndex];
  progressEl.textContent = `Question ${state.currentIndex + 1} of ${QUESTIONS.length}`;
  questionTextEl.textContent = q.question;
  choicesEl.innerHTML = "";

  q.options.forEach((optionText, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => handleChoice(i, btn));
    choicesEl.appendChild(btn);
  });
}

function handleChoice(choiceIndex, button) {
  const buttons = choicesEl.querySelectorAll(".choice-btn");
  buttons.forEach((b) => (b.disabled = true));
  button.classList.add("selected");

  const q = QUESTIONS[state.currentIndex];
  const correct = choiceIndex === q.correctIndex;
  const entry = {
    questionIndex: state.currentIndex,
    selectedChoice: choiceIndex,
    correct,
  };
  state.answers.push(entry);

  setTimeout(() => {
    state.currentIndex += 1;
    if (state.currentIndex < QUESTIONS.length) {
      renderQuestion();
    } else {
      showFinish();
    }
  }, ADVANCE_DELAY_MS);
}

function showFinish() {
  const score = state.answers.filter((a) => a.correct).length;
  finishHeading.textContent = `Thanks ${state.playerName}, you're done!`;
  finishScore.textContent = `You got ${score}/${QUESTIONS.length} correct.`;

  summaryList.innerHTML = "";
  state.answers.forEach((a) => {
    const q = QUESTIONS[a.questionIndex];
    const li = document.createElement("li");

    const questionLine = document.createElement("div");
    questionLine.textContent = q.question;

    const answerLine = document.createElement("div");
    answerLine.className = "your-answer";
    answerLine.textContent = `Your answer: ${q.options[a.selectedChoice]}`;

    const markLine = document.createElement("div");
    markLine.className = `correct-mark ${a.correct ? "correct" : "incorrect"}`;
    markLine.textContent = a.correct
      ? "Correct"
      : `Incorrect (correct answer: ${q.options[q.correctIndex]})`;

    li.appendChild(questionLine);
    li.appendChild(answerLine);
    li.appendChild(markLine);
    summaryList.appendChild(li);
  });

  showScreen("finish");
}

showScreen("welcome");
