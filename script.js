var quizIntroEl = document.querySelector("#quiz-intro");
var quizContainerEl = document.querySelector("#quiz-container");
var questionTitleEl = document.querySelector("#question");
var optionsEl = document.querySelector("#options");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");
var option3El = document.querySelector("#option3");
var option4El = document.querySelector("#option4");
var allDoneEl = document.querySelector("#all-done");
var highScoresEl = document.querySelector("#high-scores");
var finalScoreEl = document.querySelector("#final-score");
var highScoresContainerEl = document.querySelector("#highscores-container");
var highScores = [];
var highscoresBtnEl = document.querySelector("#highscores-btn");
var submitBtnEl = document.querySelector("#submitBtn");
var myFormEl = document.queryCommandEnabled("#myForm");
var inputInitialsText;
var goBackBtnEl = document.querySelector("#goBackBtn");
var clearScoresBtnEl = document.querySelector("#clearScoresBtn");
var responseFeedbackEl = document.querySelector("#response-feedback");
var questionIndex = 0;
var timerInterval;
var timeLeftEl = document.querySelector("#timeLeft");
var startEl = document.querySelector("#start-btn");
var timeLeft = 60; // starts with 60 secs
var timerRunning = false;
var timerPenalty = 10; // seconds to subtract from time left due to wrong answer

// Load questions - added manually, apis can used.
var questions = [
  {
    questionTitle: "Inside which HTML element do we put the JavaScript?",
    option1: "1. <js>",
    option2: "2. <scripting>",
    option3: "3. <javascript",
    option4: "4. <script>",
    answer: "option4"
  },

  {
    questionTitle: "Where is the correct place to insert a JavaScript?",
    option1: "1. Head",
    option2: "2. Head and body",
    option3: "3. Body",
    option4: "4. Header",
    answer: "option2"
  },

  {
    questionTitle: "How to write an IF statement in JavaScript?",
    option1: "1. if i == 5 then",
    option2: "2. if i = 5 then",
    option3: "3. if i = 5",
    option4: "4. if ( i == 5)",
    answer: "option1"
  },

  {
    questionTitle: "How do I write a comment in JavaScript?",
    option1: "'This is a comment",
    option2: "<!--This is a comment-->",
    option3: "//This is a comment",
    option4: "**This is a comment**",
    answer: "option3"
  }
];
var currentQuestion = questions[questionIndex]; // must be initialised after questions array otherwise error

function startQuiz() {
  if (timerRunning === false) {
    highscoresBtnEl.removeEventListener("click", viewhighScores); // disable button while quiz has started
    timerRunning = true;
    timerInterval = setInterval(function() {
      timeLeft--; // decrease timer

      timeLeftEl.textContent = timeLeft;

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        finish();
      }
    }, 1000);
  }
  displayQuestion();
}

function displayQuestion() {
  quizIntroEl.classList.remove("d-flex"); // hide intro
  quizIntroEl.classList.add("d-none"); // hide intro
  highScoresContainerEl.classList.add("d-none"); // hide scores
  quizContainerEl.classList.remove("d-none");

  currentQuestion = questions[questionIndex];
  questionTitleEl.textContent = currentQuestion.questionTitle;
  option1El.textContent = currentQuestion.option1;
  option2El.textContent = currentQuestion.option2;
  option3El.textContent = currentQuestion.option3;
  option4El.textContent = currentQuestion.option4;
}

optionsEl.addEventListener("click", function(e) {
  selectedOption(e, currentQuestion);
}); //pass both event and current question object into selectedOption function

function selectedOption(e, currentQuestion) {
  e.preventDefault;
  var selectedBtn = e.target;
  questionIndex++; //set index for next question
  console.log(selectedBtn);
  console.log(currentQuestion);

  if (selectedBtn.getAttribute("id") === currentQuestion.answer) {
    //Check if answer is correct
    console.log("correct answer selected");
    responseFeedbackEl.textContent = "Correct!";
    responseFeedbackEl.classList.add("bg-success");
    setTimeout(function() {
      responseFeedbackEl.textContent = "";
      responseFeedbackEl.classList.remove("bg-success");
    }, 1000); //delay before removing feedback
  } else {
    responseFeedbackEl.classList.add("bg-danger");
    responseFeedbackEl.textContent = "Wrong!";

    setTimeout(function() {
      responseFeedbackEl.textContent = "";
      responseFeedbackEl.classList.remove("bg-danger");
    }, 1000); //delay before removing feedback
    timeLeft = timeLeft - timerPenalty; // deduct time if answer is wrong
    console.log(timeLeft + "after wrong answer deduction");
  }

  if (questionIndex === questions.length) {
    //check if on last questions
    console.log("No more questions");
    console.log(questionIndex);
    console.log(questions.length);
    timeLeftEl.textContent = timeLeft; //display time left on DOM seconds display
    clearInterval(timerInterval);
    console.log(timeLeft + " after no more questions");
    //questionIndex = 0; // reset index for next quiz
    finish();
  } else {
    displayQuestion();
  }
}

function getInputValue() {
  var inputInitialsText = document.getElementById("inputInitials").value.trim(); //remove spaces from value
  return inputInitialsText; // return input for value
}

function finish() {
  finalScoreEl.textContent = timeLeft;
  setTimeout(function() {
    allDoneEl.classList.remove("d-none");
    quizContainerEl.classList.add("d-none");
  }, 1500); //delay required before clearing feedback for last answer
}

submitBtnEl.addEventListener("click", function() {
  var enteredInitials = getInputValue();
  highScores.push({ initials: enteredInitials, score: timeLeft }); // save player initials and final score

  localStorage.setItem("score", JSON.stringify(highScores));
  console.log(JSON.stringify(highScores));
  timeLeft = 60; //reset index for next quiz
  questionIndex = 0; //reset index for next quiz
  viewhighScores();
  highscoresBtnEl.addEventListener("click", viewhighScores); // re-enable view scores
});
//finish

function viewhighScores() {
  highScoresContainerEl.classList.remove("d-none");
  allDoneEl.classList.add("d-none");
  quizIntroEl.classList.add("d-none");
  quizContainerEl.classList.add("d-none");
  highScoresEl.innerHTML = ""; // clear screen, but not scores
  var storedScores = JSON.parse(localStorage.getItem("score")) || [];
  console.log(storedScores);
  storedScores.forEach(element => {
    //display array elements
    var newInitialsEl = document.createElement("h4");
    newInitialsEl.textContent = element.initials + " - " + element.score;
    highScoresEl.appendChild(newInitialsEl);
  });
} //viewhighscores

function reStart() {
  highScoresContainerEl.classList.add("d-none");
  quizIntroEl.classList.remove("d-none");
  inputInitialsText = "";
  timerRunning = false;
  //startQuiz();
}
highscoresBtnEl.addEventListener("click", viewhighScores);
startEl.addEventListener("click", startQuiz);
goBackBtnEl.addEventListener("click", reStart);
clearScoresBtnEl.addEventListener("click", function() {
  highScores = [];
  localStorage.setItem("score", JSON.stringify(highScores)); // clear array of high scores
  console.log(highScores);
  viewhighScores();
});
