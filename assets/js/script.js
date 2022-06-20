var questions = [["question 1 _____", "answer1", "answer2", "answer3", "answer4", "1"],
                 ["question 2 _____", "answer5", "answer6", "answer7", "answer8", "2"],
                 ["question 3 _____", "answer9", "answer9", "answer9", "answer9", "3"]];
var mainMenuDiv = document.getElementById("main-menu");
var startQuizDiv = document.getElementById("start-quiz");
var quizAreaDiv = document.getElementById("quiz-area");
var timerDiv = document.getElementById("timer");
var questionDiv = document.getElementById("question");
var answersDiv = document.getElementById("answers");
var resultDiv = document.getElementById("result");
// Stores the id of the questions that haven't been asked yet. This just makes sure that there will be no duplicate questions
var numUnansweredQuestions = [];
// The current question that is being asked
var currentQuestionId = 0;
// the current score of the player
var score = 0;
var scoreMulti = 10;
// The quiz timer
var currTime = 0;
const MAX_TIME = 90;
var finishedQuiz = false;
// The currently displayed screen
var currentScreen = "main";

function resetQuiz() {
    for (var i = 0; i < questions.length; i++) {
        numUnansweredQuestions.push(i);
    }
    
    score = 0;
}

function startQuizTimer() {
    currTime = MAX_TIME;
    
    var timeInterval = setInterval(function() {
        if (currTime >= 1) {
            timerDiv.textContent = "Time left: " + currTime;
            currTime--;
        }
        else {
            clearInterval(timeInterval);
            finishedQuiz = true;
            // TODO: Call the finish quiz thingy
        }
    });
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
        score += scoreMulti * 50.0;
        resultDiv.textContent = "Correct!";
    }
    else {
        score += -scoreMulti * 25.0;
        resultDiv.textContent = "Incorrect!";
    }
    
    // Get a new question
    if (numUnansweredQuestions.length !== 0) {
        getRandomQuestion();
    }
    else {
        finishedQuiz = true;
    }
}

function displayQuiz(displayQuiz) {
    // displayQuiz: True - Displays the quiz and hides all other components on screen
    // False: Hide the quiz area and display the main menu
    if (displayQuiz) {
        currentScreen = "quiz";
        mainMenuDiv.className = "hidden";
        quizAreaDiv.className = "show";
    }
    else {
        currentScreen = "main";
        mainMenuDiv.className = "show";
        quizAreaDiv.className = "hidden";
    }
}

function startQuiz() {
    resetQuiz();
    getRandomQuestion();
    displayQuiz(true);
}

startQuizDiv.addEventListener("click", startQuiz);

displayQuiz(false);