var output = document.getElementById("output")
var doorsDiv = document.getElementById("doorsDiv")
var dialog = document.getElementById("dialog")
var toolbar = document.getElementById("toolbar")
var map = document.getElementById("map")
var me = document.getElementById("me")
var popup = document.getElementById("popup")
var popupInput = document.getElementById("popupInput")
var popupInputDiv = document.getElementById("popupInputDiv")
var popupMessage = document.getElementById("popupMessage")

var toolbarType = ""

doActionOn = function(object, action) {
  try {
    dialog.innerHTML = "";
    popup.style.visibility = "hidden";
    if(action == "pack") {
      game.addToPack(object)
    } else if(action == "drop") {
      game.removeFromPack(object)
    } else {
      game.getObject(object).handleAction(action)
      game.currentRoom.writeObjects()
      game.currentRoom.writeDoors()
    }
    return false;
  } catch(e) {
    alert(e.stack)
  }
}

doActionOnChar = function(char, script, action) {
  try {
    dialog.innerHTML = "";
    popup.style.visibility = "hidden";
    game.getCharacter(char).handleAction(script, action)
    return false;
  } catch(e) {
    alert(e.stack)
  }
}

objectClicked = function(name) {
  showPopupForObject(name)
  return false;
}

enterRoom = function(name) {
  game.tryToEnterRoom(name)
  return false;
}

formatText = function(text) {
  return text.replace(/\n/g,"<br><br>").replace(/{}/g,"</span>").replace(/{([^}]*)}/g,"<span class=\"$1\">");
}

clearOutput = function() {
  output.innerHTML = "";
  dialog.innerHTML = "";
  hidePopup();
}

writeW = function(str) {
  output.innerHTML += "<div class='blackText'>" + str + "</div><BR>";
}

writeR = function(str) {
  output.innerHTML += "<div class='redText'>" + str.replace("  ", "<BR>&nbsp;&nbsp;&nbsp;&nbsp;") + "<BR><BR></div>";
}

writeY = function(str) {
  output.innerHTML += "<div class='yellowText'>" + str + "</div><BR>";
}

writeB = function(str) {
  output.innerHTML += "<div class='blueText'>" + str + "</div><BR>";
}

writeDialog = function(str) {
  dialog.innerHTML += "<div class='redText'>" + str + "</div><BR>";
}

writeToolbar = function(str) {
  toolbar.innerHTML = "<div class='redText'>" + str + "</div><BR>";
}

writeDoorsDiv = function(str) {
  doorsDiv.innerHTML += "<div class='blackText'>" + str + "</div><BR>";
}

showPopup = function(forInput) {
  popup.style.visibility = "visible";
  popup.style.top = (event.pageY+15)+"px";
  popup.style.left = "30px";
  if(forInput) {
    popupInputDiv.style.visibility = "visible";
    popupInputDiv.style.height = "20px";
    popupInput.focus();
  }
}

showPopupForObject = function(name) {
  var object = game.getObject(name)
  if(popup.style.visibility != "visible") {
    showPopup();
  } else {
    hidePopup();
  }
  popupMessage.innerHTML = object.getPopupText()
}

hidePopup = function() {
  popupInputDiv.style.visibility = "hidden";
  popupInputDiv.style.height = "0px";
  popup.style.visibility = "hidden";
}

showDiv = function(div) {
  div.style.visibility="visible"
  div.style["border-width"]="0.5px"
  div.style["padding"]="10px"
  div.style["height"]=null
}

hideDiv = function(div) {
  div.style.visibility="hidden"
  div.style["border-width"]="0px"
  div.style["padding"]="0px"
  div.style["height"]="0px"
}

toggleDiv = function(div, type) {
  if(type != toolbarType || div.style.visibility != 'visible') {
    showDiv(div)
  } else {
    hideDiv(div)
  }
  toolbarType = type
}
