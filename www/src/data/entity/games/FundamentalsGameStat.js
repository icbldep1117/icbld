
function FundamentalsGameStat(kicks, duration, epoch, id) {
    this.kicks = kicks ? kicks : 0;
    this.duration = duration ? duration : 0;
    this.epoch = epoch ? epoch : (new Date()).getTime();
    this.id = id ? id : null;
}

FundamentalsGameStat.prototype.setKicks = function(kicks) {
    this.kicks = kicks;
};
FundamentalsGameStat.prototype.getKicks = function() {
    return this.kicks;
};

FundamentalsGameStat.prototype.setDuration = function(duration) {
    this.duration = duration;
};
FundamentalsGameStat.prototype.getDuration = function() {
    return this.duration;
};

FundamentalsGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
FundamentalsGameStat.prototype.getEpoch = function() {
    return this.epoch;
};


FundamentalsGameStat.prototype.setId = function(id) {
    this.id = id;
};
FundamentalsGameStat.prototype.getId = function() {
    return this.id;
};
