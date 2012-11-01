// varNode.js
// A node that holds a variable that can be changed(mutable).

var VarNode = function(name) {
    this.name = name;
};

VarNode.prototype.calculate = function(field) {
    return this.value;
};

VarNode.prototype.toString = function(field) {
    return this.name;
};

VarNode.prototype.setValue = function(val) {
    this.value = val;
};

module.exports.VarNode = VarNode;
