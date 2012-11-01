// constNode.js
// A node that holds a constant value.

var ConstNode = function(val) {
    this.value = val;
};

ConstNode.prototype.calculate = function(field) {
    return this.value;
};

ConstNode.prototype.toString = function(field) {
    return this.value.toString();
};

ConstNode.prototype.clone = function() {
    return new ConstNode(this.value);
};

var randomNode = function(newPos) {
    return new ConstNode(Math.floor(Math.random() * 10) + 1);
};

module.exports.ConstNode = ConstNode;
module.exports.randomNode = randomNode;
