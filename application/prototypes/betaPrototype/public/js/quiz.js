
var quizQuestions = [
    {question: "Q1. Which outfit are you most likely to wear on a day off?", answers: ["A. A white T-shirt and jeans", "B. A vintage dress", "C. A high-fashion runway ensemble", "D. Comfortable activewear"]},
    {question: "Q2. How would you describe your style?", answers: ["A. Minimalistic and comfortable", "B. Vintage with a touch of glamor", "C. Unique and avant-garde", "D. Sporty and casual"]},
    {question: "Q3. What type of metal do you prefer in your jewelry?", answers: ["A. Silver", "B. Gold", "C. White Gold/Platinum", "D. No preference"]},
    {question: "Q4. When it comes to jewelry, you", answers: ["A. Prefer simple and subtle pieces", "B. Like items with a story or historical feel", "C.  Love bold, statement pieces", "D. Opt for functional or symbolic pieces"]},
    {question: "Q5. Your favorite gemstone is:", answers: ["A. Diamond", "B. Ruby/Sapphire", "C. Other gems", "D. No Preference"]},
    {question: "Q6. Your preferred jewelry piece is", answers: ["A. A delicate necklace", "B. A cocktail ring", "C. A statement cuff", "D. A charm bracelet"]},
    {question: "Q7. How do you usually wear your jewelry", answers: ["A. I wear the same pieces every day", "B. I carefully select pieces to match my outfit", "C. I mix and match for a unique look", "D. I rarely wear jewelry"]}
 

];//?s for quiz

var questionCount = 0;

var userChoices = [];

//^keeps track of choices made

var answerRoutes = {
    "A": 1,
    "B": 2,
    "C": 3,
    "D": 4
};

// quiz
document.getElementById("quiz-button").onclick = function() {
    //open the popip based on click
    document.getElementById("quiz-popup").style.display = "block";
    displayCurrentQuestion();
}

function nextQuestion() {
    var pickedChoice = document.querySelector('input[name="option"]:checked').value ;
    // Map the selected option to its route and add to userChoices
    userChoices.push(answerRoutes[pickedChoice]); 
    //add route akachoice to userpath to where they will eventually be redirected
    //will chnage this code later to allow for check of path to redirect instead of printing results out as 
    //the alert does below
    if(questionCount < quizQuestions.length-1) {
        questionCount++;
        displayCurrentQuestion();
    } else { //quiz done
        document.getElementById("quiz-popup").style.display ="none";
        // this code will be changed to redirect the user based on their choices.
        // alert("Your path is "+userChoices.join(", "));
    }
}

function displayCurrentQuestion() {
    var currentQuestion = quizQuestions[questionCount];
    document.getElementById("question").textContent = currentQuestion.question;
    var choice = '';
    for(var counter=0; counter <currentQuestion.answers.length ; counter++) {
        choice 
        += '<input type="radio" name="option" value="'+
        ["A","B","C","D"][counter]+
        '"> '+
        currentQuestion.answers[counter]+'<br>';
    }
    document.getElementById("quiz-options").innerHTML = choice;
    if(questionCount === quizQuestions.length-1) {
        document.getElementById("next").textContent = "Submit";
        
    }
}//questions and options ^^^

function closeQuiz() {
    // Reset variables
    questionCount = 0;
    userChoices = [];
    document.getElementById("quiz-popup").style.display = "none";
}