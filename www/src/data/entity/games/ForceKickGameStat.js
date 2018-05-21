
function ForceKickGameStat(force, epoch, id) {
    this.force = force ? force : 0;

    this.epoch = epoch ? epoch : (new Date()).getTime();

    this.id = id ? id : null;
}

ForceKickGameStat.prototype.setForce = function(force) {
    this.force = force;
};
ForceKickGameStat.prototype.getForce = function() {
    return this.force;
};


ForceKickGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
ForceKickGameStat.prototype.getEpoch = function() {
    return this.epoch;
};


ForceKickGameStat.prototype.setId = function(id) {
    this.id = id;
};
ForceKickGameStat.prototype.getId = function() {
    return this.id;
};
