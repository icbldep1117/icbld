
function WallKicksGameStat(kicks, duration, epoch, id) {
    this.kicks = kicks ? kicks : 0;
    this.duration = duration ? duration : 0;
    this.epoch = epoch ? epoch : (new Date()).getTime();
    this.id = id ? id : null;
}

WallKicksGameStat.prototype.setKicks = function(kicks) {
    this.kicks = kicks;
};
WallKicksGameStat.prototype.getKicks = function() {
    return this.kicks;
};

WallKicksGameStat.prototype.setDuration = function(duration) {
    this.duration = duration;
};
WallKicksGameStat.prototype.getDuration = function() {
    return this.duration;
};

WallKicksGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
WallKicksGameStat.prototype.getEpoch = function() {
    return this.epoch;
};

WallKicksGameStat.prototype.setId = function(id) {
    this.id = id;
};
WallKicksGameStat.prototype.getId = function() {
    return this.id;
};
