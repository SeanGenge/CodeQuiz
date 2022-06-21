var questions = [["Commonly used data types DO NOT include", "strings", "booleans", "alerts", "numbers", "3"],
                 ["the condition in an if / else statement is enclosed within _____", "quotes", "curly braces", "parentheses", "square brackets", "3"],
                 ["Arrays in Javascript can be used to store ______", "numbers and strings", "other arrays", "booleans", "all of the above", "4"],
                 ["To create a timer, you would use ______", "document.setInterval()", "setInterval()", "createTimer()", "document.createTimer()", "2"],
                 ["To remove the third item from an array called fruit, you would use ______", "fruit.splice(2, 1)", "fruit.remove(3)", "fruit.pop(3)", "fruit.slice(3)", "1"],
                 ["Which is not a way to get an element with id=main", "document.getElementById(\"main\")", "document.querySelector(\"#main\")", "document.querySelector(\".main\")", "document.querySelectorAll(\"#main-menu\")[0]", "3"],
                 ["How would you store something on the browser indefinitely", "localStorage.setItem(\"item\", \"value\")", "localStorage.createItem(\"item\", \"value\")", "sessionStorage.setItem(\"item\", \"value\")", "sessionStorage.createItem(\"item\", \"value\")", "1"],
                 ["Which is NOT a way to create a variable", "int score = 5", "var fruit = [\"apple\", 3]", "var func = function hello() { }", "const FINISHED = false", "1"]];
var mainMenuDiv = document.getElementById("main-menu");
var startQuizDiv = document.getElementById("start-quiz");
var quizAreaDiv = document.getElementById("quiz-area");
var timerDiv = document.getElementById("timer");
var questionDiv = document.getElementById("question");
var answersDiv = document.getElementById("answers");
var resultDiv = document.getElementById("result");
var highscoreFormDiv = document.getElementById("highscore-form");
var formScore = document.getElementById("form-score");
var saveHighscoreBtn = document.getElementById("save-score");
var highscoresDiv = document.getElementById("highscores");
var highscoresList = document.getElementById("highscores-list");
var highscoreBtn = document.getElementById("display-highscores");
var backBtn = document.getElementById("back");
var clearHighscoresBtn = document.getElementById("clear-highscores");
// Stores the id of the questions that haven't been asked yet. This just makes sure that there will be no duplicate questions
var numUnansweredQuestions = [];
// The current question that is being asked
var currentQuestionId = 0;
// the current score of the player
var score = 0;
var scoreMulti = 25.0;
// The quiz timer
var currTime = 0;
const MAX_TIME = 50;
// Keep track of the timerInterval outside so if you finish the quiz before the timer runs out, can clear it
var timeInterval;

function resetQuiz() {
    for (var i = 0; i < questions.length; i++) {
        numUnansweredQuestions.push(i);
    }
    
    score = 0;
}

function startQuizTimer() {
    currTime = MAX_TIME;
    timerDiv.textContent = "Time left: " + currTime;
    
    timeInterval = setInterval(function() {
        if (currTime >= 1) {
            updateTime(-1);
        }
        else {
            clearInterval(timeInterval);
            updateTime(0);
            quizFinished();
        }
    }, 1000);
}

function getRandomQuestion() {
    // Get a random question out of the unanswered questions
    var unansweredQuestionId = Math.floor(Math.random() * numUnansweredQuestions.length);
    currentQuestionId = numUnansweredQuestions[unansweredQuestionId];
    // Remove the question from the unanswered list
    numUnansweredQuestions.splice(unansweredQuestionId, 1);
    var questionAnswerPair = questions[currentQuestionId];
    
    questionDiv.textContent = questionAnswerPair[0];
    
    // Clear the answers ol
    answersDiv.replaceChildren();
    
    // Fill out all the potential answers
    for (var i = 1; i < questionAnswerPair.length - 1; i++) {
        var answer = questionAnswerPair[i];
        var answerli = document.createElement("li");
        // Give each answer an Id. That way we know which is the right answer
        answerli.id = i;
        answerli.className = "button";
        answerli.textContent = answer;
        answersDiv.appendChild(answerli);
        
        // Add an event listener for each of the answers
        answerli.addEventListener("click", checkAnswer);
    }
}

function checkAnswer(event) {
    // Checks the id of the answer clicked with the id in the questions list
    var answerli = event.target;
    var answerId = answerli.id;
    var correctAnswerId = questions[currentQuestionId][questions[currentQuestionId].length - 1];
    
    if (answerId === correctAnswerId) {
        score += scoreMulti * currTime;
        resultDiv.textContent = "Correct!";
    }
    else {
        score += -scoreMulti * 15.0;
        updateTime(-15);
        resultDiv.textContent = "Incorrect! -10 seconds";
    }
    
    // Get a new question
    if (numUnansweredQuestions.length !== 0) {
        getRandomQuestion();
    }
    else {
        quizFinished();
    }
}

function updateTime(diff) {
    if (currTime + diff >= 0) {
        currTime += diff;
        timerDiv.textContent = "Time left: " + currTime;
    }
    else {
        currTime = 0;
        timerDiv.textContent = "";
    }
}

function displayItem(item) {
    // displays a particular element on screen and hides the rest
    mainMenuDiv.className = "hidden";
    quizAreaDiv.className = "hidden";
    highscoreFormDiv.className = "hidden";
    highscoresDiv.className = "hidden";
        
    if (item === "quiz") {
        quizAreaDiv.className = "show";
        
    }
    else if (item === "main") {
        mainMenuDiv.className = "show";
    }
    else if (item === "highscore-form") {
        highscoreFormDiv.className = "show";
    }
    else if (item === "highscores") {
        highscoresDiv.className = "show";
    }
}

function sortHighscore(x, y) {
    if (x[1] < y[1]) {
        return 1;
    }
    else if (x[1] > y[1]) {
        return -1;
    }
    else {
        return 0;
    }
}

function saveHighscore(event) {
    event.preventDefault();
    var highscores = JSON.parse(localStorage.getItem("quiz-highscores"));
    var name = document.getElementById("highscore-name");
    
    if (highscores === null) {
        highscores = [];
    }
    
    highscores.push([name.value, score]);
    highscores.sort(sortHighscore);
    
    localStorage.setItem("quiz-highscores", JSON.stringify(highscores));
    
    displayItem("main");
}

function displayHighscores(event) {
    displayItem("highscores");
    var highscores = JSON.parse(localStorage.getItem("quiz-highscores"));
    
    highscoresList.replaceChildren();
    
    // Clear the timer if you clicked on the button while doing the quiz
    clearInterval(timeInterval);
    
    for (var i = 0; i < highscores.length; i++) {
        var highscoreli = document.createElement("li");
        var highscore = highscores[i];
        
        highscoreli.textContent = highscore[0] + ": " + highscore[1];
        highscoresList.appendChild(highscoreli);
    }
}

function quizFinished() {
    // The timer reached 0 or all the questions have been answered
    clearInterval(timeInterval);
    updateTime(-MAX_TIME);
    displayItem("highscore-form");
    formScore.textContent = "Your Final Score is " + score;
}

function startQuiz() {
    resetQuiz();
    startQuizTimer();
    getRandomQuestion();
    displayItem("quiz");
}

function goBack(event) {
    displayItem("main");
}

function clearHighscores(event) {
    localStorage.removeItem("quiz-highscores");
    
    highscoresList.replaceChildren();
}

startQuizDiv.addEventListener("click", startQuiz);
saveHighscoreBtn.addEventListener("click", saveHighscore);
highscoreBtn.addEventListener("click", displayHighscores);
backBtn.addEventListener("click", goBack);
clearHighscoresBtn.addEventListener("click", clearHighscores);

displayItem("main");