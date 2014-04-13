var DataSource = function(){
    this.backing = [];
}

DataSource.prototype.add = function(obj){
    this.backing.push(obj);
};
DataSource.prototype.get = function(){
    var toret = [].concat(this.backing);
    this.backing = [];
    return toret;
}

module.exports = DataSource;