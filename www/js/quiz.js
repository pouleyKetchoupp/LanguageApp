var quiz_list;

var quiz_started = false;
var quiz_validated = false;
var quiz_swapped = false;

var quiz_index = 0;

var quiz_score = 0;

var quiz_init = function() {
  console.log("quiz_init");
  
  var quizElement = document.getElementById('quiz_main');
  quizElement.style.visibility='hidden';
  
  var quizResultElement = document.getElementById('quiz_result');
  quizResultElement.style.visibility='hidden';
  
  var quizScoreElement = document.getElementById('quiz_score');
  quizScoreElement.style.visibility='hidden';
}

var quiz_swap = function() {
  console.log("quiz_swap: " + (quiz_swapped ? "regular" : "swapped"));
  quiz_swapped = !quiz_swapped;
  
  if (quiz_started) {
    // Restart
    quiz_start();
  }
}

var quiz_start = function() {
  console.log("quiz_start: entry count " + dict_list.length);
  
  quiz_list = array_copy(dict_list);
  quiz_list = array_shuffle(quiz_list);
  
  if (!quiz_started) {
    var startElement = document.getElementById('quiz_start');
    startElement.innerText = "Restart";
    
    var quizElement = document.getElementById('quiz_main');
    quizElement.style.visibility='visible';
    
    quiz_started = true;
  }
    
  quiz_index = -1;
  
  quiz_score = 0;
  quiz_updateScore();
  
  var quizResultElement = document.getElementById('quiz_result');
  quizResultElement.style.visibility='hidden';
  
  var quizScoreElement = document.getElementById('quiz_score');
  quizScoreElement.style.visibility='visible';
  
  quiz_next();
}

var quiz_validate = function() {
  console.log("quiz_validate");
  
  var quizResultElement = document.getElementById('quiz_result');
  
  if (quiz_validated) {
    // Hide result and go next
    quizResultElement.style.visibility='hidden';
  
    quiz_next();
  }
  else {
    // Check and show result
    var answerElement = document.getElementById('quiz_answer');
    var answer = answerElement.value;
    
    var quizEntry = quiz_list[quiz_index];
    var correctAnswer = quiz_swapped ? quizEntry.word1 : quizEntry.word2;
    
    quizResultElement.style.visibility='visible';
    
    var quizResultText = document.getElementById('quiz_result_text');
    if (answer == correctAnswer) {
      quizResultText.innerText = "Correct!";
      ++quiz_score;
    }
    else if (answer) {
      quizResultText.innerText = "Wrong. The answer was: \n" + correctAnswer;
    }
    else {
      quizResultText.innerText = "The answer was: \n" + correctAnswer;
    }
    
    quiz_validated = true;
    
    var validateElement = document.getElementById('quiz_validate');
    if (quiz_index == quiz_list.length - 1) {
      validateElement.innerText = "Finish";
    }
    else {
      validateElement.innerText = "Next";
    }
    
    quiz_updateScore();
  }
}

var quiz_next = function() {
  if (++quiz_index < quiz_list.length) {
    var quizEntry = quiz_list[quiz_index];
    
    var questionElement = document.getElementById('quiz_question');
    questionElement.value = quiz_swapped ? quizEntry.word2 : quizEntry.word1;
    
    var titleElement = document.getElementById('quiz_title');
    titleElement.innerText = "Word " + (quiz_index + 1) + " / " + quiz_list.length + " :";
  }
  else {
    // End of quiz
    var startElement = document.getElementById('quiz_start');
    startElement.innerText = "Start";
    
    var quizElement = document.getElementById('quiz_main');
    quizElement.style.visibility='hidden';
    
    quiz_started = false;
  }
    
  var validateElement = document.getElementById('quiz_validate');
  validateElement.innerText = "Validate";
  
  quiz_validated = false;
  
  var answerElement = document.getElementById('quiz_answer');
  answerElement.value = null;
}

var quiz_updateScore = function() {
  var quizScoreText = document.getElementById('quiz_score_text');
  quizScoreText.innerText = "Score: " + quiz_score + " / " + (quiz_index + 1);
}


