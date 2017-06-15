var dict_list;

var dict_init = function() {
  dict_clear();
  
  dict_list = db_getDictionary();
  for (var i in dict_list) {
      var dictEntry = dict_list[i];
      dict_addWordInternal(dictEntry.word1, dictEntry.word2);
  }
  
  console.log("dict_init: found " + dict_list.length);
}

var dict_clear = function() {
  var listElement = document.getElementById('dict_list');
  while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
  }
}

var dict_addWord = function() {
  var wordField1 = document.getElementById('dict_word1');
  var wordField2 = document.getElementById('dict_word2');
  
  var word1 = wordField1.value;
  var word2 = wordField2.value;
  if (word1 && word2)
  {
    dict_addWordInternal(word1, word2);
    
    db_addDictionaryItem(word1, word2);
    dict_list = db_getDictionary();
    
    wordField1.value = null;
    wordField2.value = null;
  }
};

var dict_addWordInternal = function(word1, word2) {
    var itemTemplate = document.getElementById('dict_itemTemplate');
  
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
  
  db_removeDictionaryItem(dict_list[elementIndex].id);
  
  var listElement = document.getElementById('dict_list');
  listElement.removeChild(itemElement);
}