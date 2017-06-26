function array_copy(array) {
  var arrayCopy = new Array();
  
  for (var index = 0; index < array.length; ++index) {
    arrayCopy.push(array[index]);
  }
  
  return arrayCopy;
}

function array_shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}