var quiz_list;

var quiz_started = false;

var quiz_start = function(buttonElement) {
  console.log("quiz_start: entry count " + dict_list.length);
  
  quiz_list = array_copy(dict_list);
  quiz_list = array_shuffle(quiz_list);
  
  for (var index = 0; index < quiz_list.length; ++index) {
    console.log("quiz_start: entry #" + index + ": "
    + quiz_list[index].word1
    + " / " + quiz_list[index].word2);
  }
  
  if (!quiz_started) {
    buttonElement.innerText = "Restart";
    quiz_started = true;
  }
}


