

var BLOCK_SIZE = 30;
var PLAYER_SIZE = BLOCK_SIZE*0.8

class Game {

  constructor(output, map) {
    this.output = output;
    this.map = map;
    popupInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        game.enterPressed(popupInput);
      }
    });
  }

  start() {
    clearOutput();
    this.enterRoom(gameJson["startRoom"]);
  }

  showCharacters() {
    hideDiv(map)
    toggleDiv(toolbar, "characters")
    writeToolbar("Characters will be here")
  }

  showHelp() {
    hideDiv(map)
    toggleDiv(toolbar, "help")
    writeToolbar("Here's some help for ya!")
  }

  showBackpack() {
    hideDiv(map)
    toggleDiv(toolbar, "backpack")
    writeToolbar(this.getBackpackText())
  }

  propertyChanged(objName, propName, value) {
    for(var i=0;i<this.currentRoom.objects.length;i++) {
      this.getObject(this.currentRoom.objects[i]).propertyChanged(objName, propName, value)
    }
  }

  getBackpackText() {
    var txt = "";
    for(var i=0;i<this.backpack.length;i++) {
      txt += this.getObject(this.backpack[i]).getLink()+" &nbsp;";
    }
    if(txt == "") {
      txt = "Nothing in backpack"
    }
    return txt
  }

  showMap() {
    if(map.style.visibility != "visible") {
      hideDiv(toolbar)
      showDiv(map)
      map.style.height = map.style.maxHeight;
    } else {
      hideDiv(map)
    }
  }

  init() {
    var intro = gameJson["intro"];
    document.getElementById("title").innerHTML = formatText(gameJson["title"]);
    var options = intro.options
    var text = intro.text+"<br><br>"
    for(var act in options) {
      text += "[<a href='' onclick='game."+act+"(); return false;'>"+options[act]+"</a>]<br><br>"
    }
    document.getElementById("output").innerHTML = formatText(text)

    text='';
    var menu = gameJson["menu"];
    for(var item in menu) {
      text += " &nbsp; [ <a href='' onclick='game."+menu[item]+"(); return false;'>"+item+"</a> ] &nbsp;"
    }
    document.getElementById("menu").innerHTML = formatText(text)


    this.backpack = []

    this.rooms = [];
    var jrooms = gameJson["rooms"];
    var minX = 10000;
    var minY = 10000;
    var maxX = 0;
    var maxY = 0;
    for(var i=0;i<jrooms.length;i++) {
      var room = new Room(jrooms[i]);
      this.rooms[i] = room;
      room.draw(this.map)
      minX = Math.min(minX, room.minX)
      minY = Math.min(minY, room.minY)
      maxX = Math.max(maxX, room.maxX)
      maxY = Math.max(maxY, room.maxY)
    }
    map.style.width = (BLOCK_SIZE * (maxX+2)) + "px";
    map.style.maxHeight = (BLOCK_SIZE * (maxY+2))  + "px";
    map.style.height = "0px";

    me.style.width = PLAYER_SIZE + "px";
    me.style.height = PLAYER_SIZE + "px";
    me.style["line-height"] = PLAYER_SIZE + "px";
    me.style["border-radius"] = (PLAYER_SIZE/2) + "px";

    this.doors = [];
    var jdoors = gameJson["doors"];
    for(var i=0;i<jdoors.length;i++) {
      var door = new Door(jdoors[i]);
      this.doors[i] = door;
    }

    this.objects = []
    var jobjects = gameJson["objects"];
    for(var i=0;i<jobjects.length;i++) {
      var object = new Object(jobjects[i]);
      this.objects[i] = object;
    }

    this.characters = []
    var jcharacters = gameJson["characters"];
    for(var i=0;i<jcharacters.length;i++) {
      var char = new Character(jcharacters[i]);
      this.characters[i] = char;
    }
  }

  handleAction(action, object) {
    if(action.name == 'useOnDoors') {
      var worked = this.currentRoom.tryKey(object)
      this.currentRoom.writeDoors()
      if(!worked) {
        return
      }
    }
    if(action.result == null) {
      return
    }
    var parts = action.result.split("/")
    if(parts[0] == "char") {
      var char = game.getCharacter(parts[1])
      writeDialog(char.getScriptText(parts[2]))
    }
    if(parts[0] == "text") {
      writeDialog(parts[1])
    }
  }

  exit() {
    clearOutput();
    writeR("OK, bye bye. Have a nice life.");
  }

  addToPack(name) {
    if(this.backpack.indexOf(name) >= 0) {
      return;
    }
    this.currentRoom.removeObject(name)
    this.backpack.push(name);
    this.showBackpack()
    this.currentRoom.writeObjects();
  }

  removeFromPack(name) {
    var ind = this.backpack.indexOf(name)
    if(ind < 0) {
      return;
    }
    this.currentRoom.addObject(name)
    this.backpack.splice(ind, 1)
    this.showBackpack()
    this.currentRoom.writeObjects();
  }

  inPack(name) {
    return this.backpack.indexOf(name) >= 0;
  }

  enterRoom(roomName) {
    showDiv(dialog)
    showDiv(doorsDiv)

    this.currentRoom = this.getRoom(roomName);
    var playerX = this.currentRoom.centerX
    var playerY = this.currentRoom.centerY
    me.style.top=(playerY*BLOCK_SIZE + (BLOCK_SIZE-PLAYER_SIZE)/2)+"px"
    me.style.left=(playerX*BLOCK_SIZE + (BLOCK_SIZE-PLAYER_SIZE)/2)+"px"
    this.currentRoom.describe();
  }

  getCharacter(name) {
    for(var i=0;i<this.characters.length;i++) {
      if(this.characters[i].name === name) {
        return this.characters[i];
      }
    }
  }

  getRoom(roomName) {
    for(var i=0;i<this.rooms.length;i++) {
      if(this.rooms[i].name === roomName) {
        return this.rooms[i];
      }
    }
  }

  getObject(objectName) {
    for(var i=0;i<this.objects.length;i++) {
      if(this.objects[i].name === objectName) {
        return this.objects[i];
      }
    }
  }

  enterPressed(input) {
    clearOutput();
    var tokens = input.value.toLowerCase().replace("  "," ").split(" ");
    input.value = ""

    if(this.handledByDoor(tokens)) {
      return;
    }
    this.enterRoom(this.currentRoom.name)
  }

  tryToEnterRoom(name) {
    var room = game.getRoom(name)
    var door = this.currentRoom.doorTo(room)
    if(!door.isOpen) {
      if(door.opensWithText()) {
        if(popup.style.visibility != "visible") {
          showPopup(true)
        } else {
          hidePopup();
        }
        popupMessage.innerHTML = "What should I say?"
        return;
      } else {
        clearOutput();
        writeR("The door to "+room.name+" is locked!")
      }
    } else {
      clearOutput();
      this.enterRoom(room.name)
      return
    }
    this.enterRoom(this.currentRoom.name)
    return;
  }

  openDoor(door) {
    door.isOpen = true
    var index = 0;
    if(door.roomNames[0] == this.currentRoom.name) {
      index = 1;
    }
    var roomName = door.roomNames[index]
    writeDialog("Creeeeeeakkkk.... the door to the "+roomName+" opens...")
    this.currentRoom.writeDoors()
    // this.enterRoom(roomName)
  }

  handledByDoor(tokens) {
    var doors = this.currentRoom.doors
    for(var i=0;i<doors.length;i++) {
      if(doors[i].opensWithTokens(tokens)) {
        this.openDoor(doors[i])
        return true
      }
    }
    return false
  }

}

var game = new Game(output, map);
game.init();
