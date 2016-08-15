// sqrtNode.js
// A node that computes the sqrt of x.

var SqrtNode = function(inNode) {
    this.inNode = inNode;
};

SqrtNode.prototype.calculate = function(field) {
    return Math.sqrt(field.nodes[this.inNode].calculate(field));
};

SqrtNode.prototype.toString = function(field) {
    return "sqrt(" + field.nodes[this.inNode].toString(field) + ")";
};

SqrtNode.prototype.clone = function() {
    return new SqrtNode(this.inNode);
};

var randomNode = function(newPos) {
    var newIn = Math.floor(Math.random() * (newPos + 1));

    return new SqrtNode(newIn);
};

module.exports.SqrtNode = SqrtNode;
module.exports.randomNode = randomNode;
