
function TwoPersonPassesGameStat(passes, duration, epoch, id) {
    this.passes = passes ? passes : 0;
    this.duration = duration ? duration : 0;
    this.epoch = epoch ? epoch : (new Date()).getTime();
    this.id = id ? id : null;
}

TwoPersonPassesGameStat.prototype.setPasses = function(passes) {
    this.passes = passes;
};
TwoPersonPassesGameStat.prototype.getPasses = function() {
    return this.passes;
};

TwoPersonPassesGameStat.prototype.setDuration = function(duration) {
    this.duration = duration;
};
TwoPersonPassesGameStat.prototype.getDuration = function() {
    return this.duration;
};

TwoPersonPassesGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
TwoPersonPassesGameStat.prototype.getEpoch = function() {
    return this.epoch;
};

TwoPersonPassesGameStat.prototype.setId = function(id) {
    this.id = id;
};
TwoPersonPassesGameStat.prototype.getId = function() {
    return this.id;
};
