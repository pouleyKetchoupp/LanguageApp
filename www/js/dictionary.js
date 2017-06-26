var dict_list;

var dict_load = function() {
  var loadedDict = db_getDictionary();
  for (var i in loadedDict) {
      var loadedEntry = loadedDict[i];
      dict_list.push(loadedEntry);
      dict_addWordUI(loadedEntry.word1, loadedEntry.word2, true);
  }
  
  console.log("dict_load: found " + loadedDict.length);
}

var dict_clear = function() {
  dict_list = new Array();
  
  var listElement = document.getElementById('dict_list');
  while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
  }
  
  console.log("dict_clear");
}

var dict_addDictionary = function(dictionary) {
  console.log("dict_addDictionary: '" + dictionary.name + "' found " + dictionary.data.length);
  
  for (var i in dictionary.data) {
    var dataEntry = dictionary.data[i];
    dict_addWordInternal(dataEntry[0], dataEntry[1], false);
  }
}

var dict_addWord = function() {
  var wordField1 = document.getElementById('dict_word1');
  var wordField2 = document.getElementById('dict_word2');
  
  var word1 = wordField1.value;
  var word2 = wordField2.value;
  
  if (dict_addWordInternal(word1, word2, true)) {
    wordField1.value = null;
    wordField2.value = null;
  }
};

var dict_addWordInternal = function(word1, word2, saved) {
  if (word1 && word2) {
    if (!saved || !db_hasDictionaryItem(word1, word2)) {
      var entry = dict_createEntry(word1, word2, true);
      
      dict_list.push(entry);
      
      if (saved) {
        db_addDictionaryItem(entry);
      }
      
      dict_addWordUI(word1, word2, saved);
    }
    
    return true;
  }
  
  return false;
}

var dict_addWordUI = function(word1, word2, canDelete) {
    var templateName = canDelete ? 'dict_itemTemplate' : 'dict_itemTemplate_nodelete';
    var itemTemplate = document.getElementById(templateName);
  
    var itemElement = document.createElement('ons-list-item');
    itemElement.innerHTML = itemTemplate.innerHTML;
    
    var wordElement1 = itemElement.children[0];
    wordElement1.innerText = word1;
    
    var wordElement2 = itemElement.children[1];
    wordElement2.innerText = word2;
    
    var listElement = document.getElementById('dict_list');
    listElement.append(itemElement);
}

var dict_removeWord = function(itemElement) {
  var elementIndex = 0;
  var elementSearch = itemElement;
  while((elementSearch = elementSearch.previousSibling) != null) {
    ++elementIndex;
  }
  
  var dictEntry = dict_list[elementIndex];
  db_removeDictionaryItem(dictEntry.id);
  
  var listElement = document.getElementById('dict_list');
  listElement.removeChild(itemElement);
  
  dict_list.splice(elementIndex, 1);
}

var dict_createEntry = function(word1, word2) {
  var entry = { id: 0, word1: word1, word2: word2 };
  return entry;
}