var quiz_list;
var quiz_dict_ignore_list;

var quiz_started = false;
var quiz_validated = false;
var quiz_swapped = false;

var quiz_index = 0;

var quiz_score = 0;

var quiz_init = function() {
  console.log("quiz_init");
  
  quiz_dict_ignore_list = new Array();
  
  quiz_updateLanguages();
  
  quiz_updateNumSelected();
}

var quiz_show = function() {
  console.log("quiz_show");
  
  quiz_updateNumSelected();
}

var quiz_swap = function() {
  console.log("quiz_swap: " + (quiz_swapped ? "regular" : "swapped"));
  quiz_swapped = !quiz_swapped;
  
  quiz_updateLanguages();
  
  if (quiz_started) {
    // Restart
    quiz_start();
  }
}

var quiz_updateLanguages = function() {
  var languageElement1 = document.getElementById('quiz_language1');
  var languageElement2 = document.getElementById('quiz_language2');
  
  var dictionary = dict_list[0];
  
  if (quiz_swapped) {
    languageElement1.innerText = dictionary.language2;
    languageElement2.innerText = dictionary.language1;
  }
  else {
    languageElement1.innerText = dictionary.language1;
    languageElement2.innerText = dictionary.language2;
  }
}

var quiz_select = function() {
  console.log("quiz_select");
  
  var quizStartMessageElement = document.getElementById('quiz_start_message');
  quizStartMessageElement.innerText = null;
    
  var navigatorElement = document.getElementById('quiz_navigator');
  navigatorElement.pushPage('pageQuizSelectTemplate');
}

var quiz_postSelect = function() {
  console.log("quiz_postSelect");
  
  // Initialize UI list
  quiz_updateSelectUI();
}

var quiz_showSelect = function() {
  console.log("quiz_showSelect");
  
  // Update UI list
  quiz_updateSelectUI();
}

var quiz_selectNone = function() {
  console.log("quiz_selectNone");
  
  quiz_dict_ignore_list = new Array();
  
  for (var i in dict_list) {
    var dictEntry = dict_list[i];
    quiz_dict_ignore_list.push(dictEntry.id);
  }
  
  // Update UI list
  quiz_updateSelectUI();
}

var quiz_selectAll = function() {
  console.log("quiz_selectAll");
  
  quiz_dict_ignore_list = new Array();
  
  // Update UI list
  quiz_updateSelectUI();
}

var quiz_selectEntry = function(itemElement) {
  console.log("quiz_selectEntry: " + itemElement.id);
  
  for (var i in quiz_dict_ignore_list) {
    if (quiz_dict_ignore_list[i] == itemElement.id) {
      // Ignored dictionary, remove from list
      quiz_dict_ignore_list.splice(i, 1);
      quiz_updateNumSelected();
      return;
    }
  }
  
  // Not ignored, add to list
  quiz_dict_ignore_list.push(itemElement.id);
  quiz_updateNumSelected();
}

var quiz_clearSelectUI = function() {
  var listElement = document.getElementById('quiz_selectList');
  while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
  }
}

var quiz_updateSelectUI = function() {
  quiz_clearSelectUI();
  
  // Sort all dictionaries alphabetically
  var sortedList = new Array();
  
  for (var i in dict_list) {
    var dictionary = dict_list[i];
    sortedList.push(dictionary);
  }
  
  sortedList.sort(function(entry1, entry2) {
    return entry1.name.localeCompare(entry2.name);
  });
  
  for (var i in sortedList) {
    var dictEntry = sortedList[i];
      
    var templateName = 'quiz_dictItemTemplate';
    var itemTemplate = document.getElementById(templateName);
  
    var itemElement = document.createElement('ons-list-item');
    itemElement.innerHTML = itemTemplate.innerHTML;
    itemElement.id = dictEntry.id;
    
    var dictNameElement = itemElement.children[1];
    dictNameElement.innerText = dictEntry.name;
    
    var ignoredDict = false;
    for (var j in quiz_dict_ignore_list) {
      if (quiz_dict_ignore_list[j] == dictEntry.id) {
        ignoredDict = true;
        break;
      }
    }
    
    if (!ignoredDict) {
      var checkBoxElement = itemElement.children[0].children[0];
      checkBoxElement.checked = true;
    }
    
    var listElement = document.getElementById('quiz_selectList');
    listElement.append(itemElement);
    
    quiz_updateNumSelected();
  }
}

var quiz_updateNumSelected = function() {
  var numDictionaries = dict_list.length;
  var numSelected = numDictionaries - quiz_dict_ignore_list.length;
  
  var numWords = 0;
  for (var i in dict_word_list) {
    var wordEntry = dict_word_list[i];
    
    var ignoredDict = false;
    for (var j in quiz_dict_ignore_list) {
      if (quiz_dict_ignore_list[j] == wordEntry.dictId) {
        ignoredDict = true;
        break;
      }
    }
    
    if (!ignoredDict) {
      ++numWords;
    }
  }
  
  var selectTextElement = document.getElementById('quiz_selectText');
  selectTextElement.innerText = "Selected: " + numSelected + " / " + numDictionaries
                                + " (" + numWords + " words)";
                                
  var selectTextElement2 = document.getElementById('quiz_selectText2');
  if (selectTextElement2) {
    selectTextElement2.innerText = selectTextElement.innerText;
  }
}

var quiz_start = function() {
  console.log("quiz_start: total entry count " + dict_word_list.length);
  
  var filteredWordList = new Array();
  
  for (var i in dict_word_list) {
    var wordEntry = dict_word_list[i];
    
    var ignoredDict = false;
    for (var j in quiz_dict_ignore_list) {
      if (quiz_dict_ignore_list[j] == wordEntry.dictId) {
        ignoredDict = true;
        break;
      }
    }
    
    if (!ignoredDict) {
      filteredWordList.push(wordEntry);
    }
  }
  
  console.log("quiz_start: filtered entry count " + filteredWordList.length);
  
  if (filteredWordList.length > 0) {
  
    // Sort alphabetically to find duplicates
    filteredWordList.sort(function(entry1, entry2) {
      if (quiz_swapped) {
        return entry1.word2.localeCompare(entry2.word2);
      }
      else {
        return entry1.word1.localeCompare(entry2.word1);
      }
    });
    
    // Make quiz list with unique words
    quiz_list = new Array();
    
    for (var i in filteredWordList) {
      var quizWordEntry = filteredWordList[i];
      var quizQuestion = quiz_swapped ? quizWordEntry.word2 : quizWordEntry.word1;
      var quizAnswer = quiz_swapped ? quizWordEntry.word1 : quizWordEntry.word2;
      
      if (quiz_list.length > 0) {
        var prevQuizEntry = quiz_list[quiz_list.length - 1];
        var prevQuizQuestion = prevQuizEntry.question;
        
        if (quizQuestion.toLowerCase() == prevQuizQuestion.toLowerCase()) {
          
          // Check for same answer, ignore entry in this case
          var foundQuizAnswer = false;
          for (var j in prevQuizEntry.answers) {
            var prevQuizAnswer = prevQuizEntry.answers[j];
            if (quizAnswer.toLowerCase() == prevQuizAnswer.toLowerCase()) {
              foundQuizAnswer = true;
              break;
            }
          }
          
          if (!foundQuizAnswer) {
            // Add new possible answer to list
            prevQuizEntry.answers.push(quizAnswer);
          }
          
          continue;
        }
      }
      
      // Add new entry
      var quizEntry = { question: quizQuestion, answers: [quizAnswer]};
      quiz_list.push(quizEntry);
    }
  
    console.log("quiz_start: unique entry count " + quiz_list.length);
  
    // Randomize remaining words
    quiz_list = array_shuffle(quiz_list);
    
    if (quiz_started) {
      quiz_postStart();
    }
    else {
      var navigatorElement = document.getElementById('quiz_navigator');
      navigatorElement.pushPage('pageQuizStartTemplate');
      
      quiz_started = true;
    }
  }
  else {
    var quizStartMessageElement = document.getElementById('quiz_start_message');
    quizStartMessageElement.innerText = "You need to select at least one dictionary which is not empty.";
  }
}

var quiz_postStart = function() {
  console.log("quiz_postStart");
  quiz_index = -1;
  
  quiz_score = 0;
  quiz_updateScore();
  
  var quizResultElement = document.getElementById('quiz_result');
  quizResultElement.style.visibility='hidden';
  
  quiz_next();
}

var quiz_stop = function() {
  console.log("quiz_stop");
  quiz_started = false;
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
    var answer = answerElement.value.toLowerCase();
    
    var quizEntry = quiz_list[quiz_index];
    var correctAnswers = quizEntry.answers;
    
    quizResultElement.style.visibility='visible';
    
    var quizResultText = document.getElementById('quiz_result_text');
    
    var isAnswerCorrect = false;
    for (var i in correctAnswers) {
      var possibleAnswer = correctAnswers[i];
      if (answer == possibleAnswer.toLowerCase()) {
        isAnswerCorrect = true;
      }
    }
    
    var resultText;
    
    if (isAnswerCorrect) {
      resultText = "<span style=\"color: #00ff00\">Correct!</span>";
      ++quiz_score;
      
      if (correctAnswers.length > 1) {
        resultText += " Possible answers:<p>" + correctAnswers[0];
        for (var i = 1; i < correctAnswers.length; ++i) {
         resultText += ", " + correctAnswers[i];
        }
        resultText += "</p>";
      }
    }
    else {
      if (correctAnswers.length > 1) {
        resultText = " Possible answers:<p>" + correctAnswers[0];
        for (var i = 1; i < correctAnswers.length; ++i) {
         resultText += ", " + correctAnswers[i];
        }
        resultText += "</p>";
      }
      else {
        resultText = " The answer was:<p>" + correctAnswers[0] + "</p>";
      }
    
      if (answer) {
        resultText = "<span style=\"color: #ff0000\">Wrong.</span>" + resultText;
      }
    }
    
    quizResultText.innerHTML = resultText;
    
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
    questionElement.value = quizEntry.question;
    
    var titleElement = document.getElementById('quiz_title');
    titleElement.innerText = "Word " + (quiz_index + 1) + " / " + quiz_list.length + " :";
  }
  else {
    // End of quiz
    quiz_stop();
    
    var navigatorElement = document.getElementById('quiz_navigator');
    navigatorElement.popPage();
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


