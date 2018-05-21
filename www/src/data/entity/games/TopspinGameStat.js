
function TopspinGameStat(topspin, rightspin, epoch, id) {
    this.topspin = topspin ? topspin : 0;
    this.rightspin = rightspin ? rightspin : 0;
    this.epoch = epoch ? epoch : (new Date()).getTime();
    this.id = id ? id : null;
}

TopspinGameStat.prototype.setTopspin = function(topspin) {
    this.topspin = topspin;
};
TopspinGameStat.prototype.getTopspin = function() {
    return this.topspin;
};

TopspinGameStat.prototype.setRightspin = function(rightspin) {
    this.rightspin = rightspin;
};
TopspinGameStat.prototype.getRightspin = function() {
    return this.rightspin;
};

TopspinGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
TopspinGameStat.prototype.getEpoch = function() {
    return this.epoch;
};

TopspinGameStat.prototype.setId = function(id) {
    this.id = id;
};
TopspinGameStat.prototype.getId = function() {
    return this.id;
};
