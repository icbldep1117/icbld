
function PenaltyKicksGameStat(distance, height, speed, spin, epoch, id) {
    this.distance = distance ? distance : 0;
    this.height = height ? height : 0;
    this.speed = speed ? speed : 0;
    this.spin = spin ? spin : 0;

    this.epoch = epoch ? epoch : (new Date()).getTime();

    this.id = id ? id : null;
}

PenaltyKicksGameStat.prototype.setDistance = function(distance) {
    this.distance = distance;
};
PenaltyKicksGameStat.prototype.getDistance = function() {
    return this.distance;
};

PenaltyKicksGameStat.prototype.setHeight = function(height) {
    this.height = height;
};
PenaltyKicksGameStat.prototype.getHeight = function() {
    return this.height;
};

PenaltyKicksGameStat.prototype.setSpeed = function(speed) {
    this.speed = speed;
};
PenaltyKicksGameStat.prototype.getSpeed = function() {
    return this.speed;
};

PenaltyKicksGameStat.prototype.setSpin = function(spin) {
    this.spin = spin;
};
PenaltyKicksGameStat.prototype.getSpin = function() {
    return this.spin;
};


PenaltyKicksGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
PenaltyKicksGameStat.prototype.getEpoch = function() {
    return this.epoch;
};

PenaltyKicksGameStat.prototype.setId = function(id) {
    this.id = id;
};
PenaltyKicksGameStat.prototype.getId = function() {
    return this.id;
};
