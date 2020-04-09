
class Character {

  constructor(def) {
    this.name = def["name"];
    this.description = def["description"];
    this.backstory = def["backstory"];
    this.location = def["location"];

    this.scripts = def["scripts"];
  }

  handleAction(script, action) {
    var sc = this.getScript(script)
    for(var a=0;a<sc.actions.length;a++) {
      var ac = sc.actions[a]
      if(ac.name == action) {
        game.handleAction(ac, this)
        return
      }
    }
  }

  getScript(name) {
    for(var i=0;i<this.scripts.length;i++) {
      var sc = this.scripts[i]
      if(sc.name == name) {
        return sc;
      }
    }
  }

  getScriptText(scriptName) {
    var sc = this.getScript(scriptName)
    var txt = sc.text+"<br>";
    for(var a=0;a<sc.actions.length;a++) {
      var ac = sc.actions[a]
      txt += "<br>[<a href='' onclick='return doActionOnChar(\""+this.name+"\",\""+sc.name+"\",\""+ac.name+"\")'>"+ac.desc+"</a>]<br>"
    }
    return txt;
  }
}
