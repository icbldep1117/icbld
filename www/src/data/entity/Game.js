
function Game(name, type, sessionId) {
    this.name = name ? name : "";
    this.type = type ? type : "";
    this.sessionId = sessionId ? sessionId : 0;
}

Game.prototype.setName = function(name) {
    this.name = name;
};
Game.prototype.getName = function() {
    return this.name;
};

Game.prototype.setType = function(type) {
    this.type = type;
};
Game.prototype.getType = function() {
    return this.type;
};

Game.prototype.setSessionId = function(sessionId) {
    this.sessionId = sessionId;
};
Game.prototype.getSessionId = function() {
    return this.sessionId;
};
