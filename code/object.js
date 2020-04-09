
class Object {

  constructor(def) {
    this.name = def["name"];
    this.description = def["description"];
    this.weight = def["weight"];
    this.location = def["location"];
    this.visibleWith = def["visibleWith"];
    this.visible = "false" != def["visible"];
    this.activateWith = def["activateWith"];
    this.active = def["active"];
    this.actions = def["actions"];
    this.when = def["when"];
    this.linkedProperties = def["linkedProperties"];
    if(this.linkedProperties != null) {
      this.linkedProperties = this.linkedProperties.split(":")
    }
    var props = def["properties"];
    this.properties = []
    if(props != null) {
      props = props.split(":")
      for(var i=0;i<props.length;i++) {
        var ps = props[i].split("/")
        this.properties[ps[0]] = ps[1]
      }
    }
    game.getRoom(this.location).objects.push(this.name)
  }

  handleTokens(tokens) {
    if(tokens.indexOf(this.activateWith)) {
      this.active = true;
      return true;
    }
    if(tokens.indexOf(this.visibleWith)) {
      if(game.backpack.indexOf(this.visibleWith)) {
        this.visible = true;
        return true;
      }
    }
  }

  propertyChanged(objName, propName, value) {
    if(this.linkedProperties == null) {
      return
    }
    for(var i=0;i<this.linkedProperties.length;i++) {
      var prop = this.linkedProperties[i].split("=")
      var val = prop[1].split("/")
      if(val[0] == objName && propName == val[1]) {
        this.properties[prop[0]] = value
        if(prop[0] == 'visible') {
          this.visible = value == 'true'
          if(this.visible) {
            writeDialog(this.getLink()+" is now visible")
          }
        }
      }
    }
  }

  handleAction(actionName) {
    for(var i=0;i<this.actions.length;i++) {
      var ac = this.actions[i];
      if(ac.name == actionName) {
        game.handleAction(ac, this)
        if(ac["property"] != null) {
          var prop = ac["property"].split("/")
          this.properties[prop[0]] = prop[1]
          game.propertyChanged(this.name, prop[0], prop[1])
        }
        return
      }
    }
  }

  getLink() {
    return "[<a href=\"\" class=\"advLink\" onclick=\"return objectClicked('"+this.name+"')\" >"+this.description+"</a>]"
  }

  getPopupText() {
    var txt = "";
    if(this.weight > 0) {
      if(!game.inPack(this.name)) {
        txt = "<br>[<a href='' onclick='return doActionOn(\""+this.name+"\",\"pack\")'>put it in backpack</a>]<br>"
      } else {
        txt = "<br>[<a href='' onclick='return doActionOn(\""+this.name+"\",\"drop\")'>drop it</a>]<br>"
      }
    }
    if(this.actions == null) {
      return txt;
    }
    for(var i=0;i<this.actions.length;i++) {
      var ac = this.actions[i];
      if(ac.when != null) {
        var when = ac.when.split("/")
        // alert(this.name+", "+when[0]+", "+when[1]+", "+this.properties[when[0]])
        if(this.properties[when[0]] != when[1]) {
          continue;
        }
      }
      txt += "<br>[<a href='' onclick='return doActionOn(\""+this.name+"\",\""+ac.name+"\")'>"+ac.desc+"</a>]<br>"
    }
    return txt;
  }
}
