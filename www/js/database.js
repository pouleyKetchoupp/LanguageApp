function db_getDictionary() {
  var list = localStorage.getItem("language_dictionary");
  if (list == null) {
      return new Array();
  } else {
      return JSON.parse(list);
  }
}

function db_saveDictionary(list) {
  try {
      localStorage.setItem("language_dictionary", JSON.stringify(list));
  } catch (e) {
      alert('Error saving to storage.');
      throw e;
  }
}

function db_hasDictionaryItem(word1, word2) {
  var list = db_getDictionary();
  for (var i in list) {
    var entry = list[i];
    if (entry.word1 == word1 && entry.word2 == word2) {
      return true;
    }
  }
  
  return false;
}

function db_addDictionaryItem(word1, word2) {
  var list = db_getDictionary();
  var id = 1;
  if (list.length > 0)
  {
    id = list[list.length - 1].id + 1;
  }
  list.push({ id: id, word1: word1, word2: word2 });
  db_saveDictionary(list);
}

function db_removeDictionaryItem(id) {
  var list = db_getDictionary();
  for (var i in list) {
      if (list[i].id == id) {
          list.splice(i, 1);
          break;
      }
  }
  db_saveDictionary(list);
}