var dict_list;
var dict_id_list;

var dict_id = null;

var dict_load = function() {
  var loadedDict = db_getDictionary();
  for (var i in loadedDict) {
      var loadedEntry = loadedDict[i];
      dict_list.push(loadedEntry);
      
      var dictFound = false;
      for (var i in dict_id_list) {
        var dictId = dict_id_list[i];
        if (dictId == loadedEntry.dictId) {
          dictFound = true;
          break;
        }
      }
      
      if (!dictFound) {
        var dictName = loadedEntry.dictId.slice(10);
        var newDict = {
          id: loadedEntry.dictId,
          name: dictName,
          language1: "English",
          language2: "Thai",
          data: []
        }
        
        dict_addDictionary(newDict);
      }
  }
  
  console.log("dict_load: found " + loadedDict.length);
  
  var selectDictElement = document.getElementById('dict_select');
  selectDictElement.selectedIndex = 1;
  dict_updateUI();
}

var dict_clear = function() {
  console.log("dict_clear");
  
  dict_list = new Array();
  dict_id_list = new Array();
  
  dict_clearUI();
  
  var selectDictElement = document.getElementById('dict_select');
  while (selectDictElement.children.length > 1) {
      selectDictElement.removeChild(selectDictElement.lastChild);
  }
}

var dict_select = function(event) {
  console.log("dict_select: " + event.target.value);
  
  if (event.target.value == "new") {
    var navigatorElement = document.getElementById('dict_navigator');
    navigatorElement.pushPage('pageAddDictTemplate');
  }
  else {
    dict_id = event.target.value;
    dict_updateUI();
  }
}

var dict_createDictionary = function(event) {
  var dictAddNameElement = document.getElementById('dict_add_name');
  var dictName = dictAddNameElement.value;
  
  var newDict = {
    id: "dict_user_" + dictName,
    name: dictName,
    language1: "English",
    language2: "Thai",
    data: []
  }
  
  dict_addDictionary(newDict);
  
  var navigatorElement = document.getElementById('dict_navigator');
  navigatorElement.popPage();
  
  var selectDictElement = document.getElementById('dict_select');
  var numEntries = selectDictElement.children[0].children.length;
  selectDictElement.selectedIndex = numEntries - 1;
  dict_id = newDict.id;
  dict_updateUI();
}

var dict_cancelDictionary = function(event) {
  var selectDictElement = document.getElementById('dict_select');
  selectDictElement.selectedIndex = 1;
  dict_id = dict_id_list[0];
  dict_updateUI();
}

var dict_addDictionary = function(dictionary) {
  console.log("dict_addDictionary: '" 
    + dictionary.name 
    + "' (id='"
    + dictionary.id
    + "') found " 
    + dictionary.data.length);
  
  // Add dictionary to selection
  var optionElement = document.createElement('option');
  optionElement.innerText = dictionary.name;
  optionElement.value = dictionary.id;
  
  var selectDictElement = document.getElementById('dict_select');
  selectDictElement.children[0].append(optionElement);
  
  dict_id_list.push(dictionary.id);
    
  // Add all words from dictionary to list
  var prevDictId = dict_id;
  dict_id = dictionary.id;
  
  for (var i in dictionary.data) {
    var dataEntry = dictionary.data[i];
    dict_addWordInternal(dataEntry[0], dataEntry[1], false);
  }
  
  if (null != prevDictId) {
    dict_id = prevDictId;
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
    
    dict_updateUI();
  }
};

var dict_addWordInternal = function(word1, word2, user) {
  if (word1 && word2) {
    if (!user || !db_hasDictionaryItem(word1, word2)) {
      var dictEntry = dict_createEntry(word1, word2, dict_id, user);
      
      dict_list.push(dictEntry);
      
      if (user) {
        db_addDictionaryItem(dictEntry);
      }
    }
    
    return true;
  }
  
  return false;
}

var dict_updateUI = function() {
  dict_clearUI();
  
  for (var i in dict_list) {
    var dictEntry = dict_list[i];
    if (dictEntry.dictId == dict_id) {
      dict_addWordUI(dictEntry.id, dictEntry.word1, dictEntry.word2, dictEntry.user);
    }
  }
}

var dict_clearUI = function() {
  var listElement = document.getElementById('dict_list');
  while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
  }
}

var dict_addWordUI = function(id, word1, word2, canDelete) {
  var templateName = 'dict_itemTemplate';
  var itemTemplate = document.getElementById(templateName);

  var itemElement = document.createElement('ons-list-item');
  itemElement.innerHTML = itemTemplate.innerHTML;
  itemElement.id = id;
  
  var wordElement1 = itemElement.children[0].children[0].children[0];
  wordElement1.innerText = word1;
  
  var wordElement2 = itemElement.children[0].children[0].children[1];
  wordElement2.innerText = word2;
  
  if (!canDelete) {
    var deleteElement = itemElement.children[0].children[0].children[2].children[0];
    deleteElement.style.visibility='hidden';
  }
  
  var listElement = document.getElementById('dict_list');
  listElement.append(itemElement);
}

var dict_removeWord = function(itemElement) {
  if (itemElement.id > 0) {
    // Remove from global list
    for (var i in dict_list) {
      var entry = dict_list[i];
      if (entry.id == itemElement.id) {
        dict_list.splice(i, 1);
        break;
      }
    }
    
    // Remove from database
    db_removeDictionaryItem(itemElement.id);
    
    // Remove from UI
    var listElement = document.getElementById('dict_list');
    listElement.removeChild(itemElement);
  }
}

var dict_createEntry = function(word1, word2, dictId, user) {
  var entry = { id: 0, word1: word1, word2: word2, dictId: dictId, user: user };
  return entry;
}