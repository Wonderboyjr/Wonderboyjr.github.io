
class Door {
  constructor(def) {
    this.opensWith = def["opensWith"];
    this.comment = def["comment"];
    this.type = def["type"];
    this.direction = def["direction"];
    this.isOpen = this.opensWith == null
    this.roomNames = def["between"].split(",");
    game.getRoom(this.roomNames[0]).doors.push(this)
    game.getRoom(this.roomNames[1]).doors.push(this)
  }

  opensWithText() {
    return this.opensWith != null && this.opensWith.indexOf("<text>") >= 0
  }

  opensWithTokens(tokens) {
    if(this.isOpen) return false;
    if(this.opensWith.indexOf("<text>") == 0) {
      var openText = this.opensWith.substring(6).split(" ")
      var pass = false;
      for(var i=0;i<openText.length;i++) {
        pass = false;
        var opts = openText[i].split("|");
        for(var j=0;j<opts.length;j++) {
          if(tokens.indexOf(opts[j]) >= 0) {
            pass = true;
          }
        }
        if(!pass) {
          return false;
        }
      }
      return pass;
    } else {
      if(game.backpack.indexOf(this.opensWith) >= 0) {
        return true;
      }
    }
    return false;
  }

  opposite(dirn) {
    if(dirn == "up") return "down"
    if(dirn == "down") return "up"
    if(dirn == "left") return "right"
    if(dirn == "right") return "left"
    if(dirn == "east") return "west"
    if(dirn == "west") return "east"
    if(dirn == "north") return "south"
    if(dirn == "south") return "north"
  }

  getDescription(fromRoom) {
    var roomIndex = 1;
    var dirn = this.direction
    if(fromRoom.name == this.roomNames[1]) {
      roomIndex = 0;
      dirn = this.opposite(dirn)
    }
    var desc = "";
    if(this.type == "stairs") {
      desc = "stairs leading "+dirn+" to ";
    } else {
      if(this.isOpen) {
        desc = "an OPEN door to ";
      } else {
        desc = "a LOCKED door to ";
      }
    }
    var toRoom = game.getRoom(this.roomNames[roomIndex]);
    desc += toRoom.description
    if(this.comment != null) {
      desc += "</a>]<br>"+this.comment
    } else {
      desc += "</a>]"
    }
    return "[<a href=\"\" class=\"advLink\" onclick=\"return enterRoom('"+toRoom.name+"')\">"+desc
  }
}
