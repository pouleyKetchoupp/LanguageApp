var quiz_list;

var quiz_started = false;

var quiz_index = 0;

var quiz_init = function() {
  console.log("quiz_init");
  
  var quizElement = document.getElementById('quiz_main');
  quizElement.style.visibility='hidden';
}

var quiz_start = function() {
  console.log("quiz_start: entry count " + dict_list.length);
  
  quiz_list = array_copy(dict_list);
  quiz_list = array_shuffle(quiz_list);
  
  for (var index = 0; index < quiz_list.length; ++index) {
    console.log("quiz_start: entry #" + index + ": "
    + quiz_list[index].word1
    + " / " + quiz_list[index].word2);
  }
  
  if (!quiz_started) {
    var startElement = document.getElementById('quiz_start');
    startElement.innerText = "Restart";
    
    var quizElement = document.getElementById('quiz_main');
    quizElement.style.visibility='visible';
    
    quiz_started = true;
  }
  
  quiz_index = -1;
  quiz_next();
}

var quiz_validate = function() {
  console.log("quiz_validate");
  
  quiz_next();
}

var quiz_next = function() {
  console.log("quiz_next");
  
  if (++quiz_index < quiz_list.length) {
    var quizEntry = quiz_list[quiz_index];
    
    var questionElement = document.getElementById('quiz_question');
    questionElement.value = quizEntry.word1;
    
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
}


