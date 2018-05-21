
function PassKickGameStat(distance, epoch, id) {
    this.distance = distance ? distance : 0;

    this.epoch = epoch ? epoch : (new Date()).getTime();

    this.id = id ? id : null;
}

PassKickGameStat.prototype.setDistance = function(distance) {
    this.distance = distance;
};
PassKickGameStat.prototype.getDistance = function() {
    return this.distance;
};

PassKickGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
PassKickGameStat.prototype.getEpoch = function() {
    return this.epoch;
};

PassKickGameStat.prototype.setId = function(id) {
    this.id = id;
};
PassKickGameStat.prototype.getId = function() {
    return this.id;
};
