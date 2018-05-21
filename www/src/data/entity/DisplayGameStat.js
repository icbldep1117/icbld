
function DisplayGameStat(values, epoch) {
    this.values = values ? values : [];
    this.epoch = epoch ? epoch : (new Date()).getTime();
}

DisplayGameStat.prototype.setValues = function(values) {
    this.values = values;
};
DisplayGameStat.prototype.getValues = function() {
    return this.values;
};

DisplayGameStat.prototype.setEpoch = function(epoch) {
    this.epoch = epoch;
};
DisplayGameStat.prototype.getEpoch = function() {
    return this.epoch;
};
