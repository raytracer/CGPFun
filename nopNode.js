// nopNode.js
// A node that just passes the input through.

var NopNode = function(in1) {
    this.in1 = in1;
};

NopNode.prototype.calculate = function(field) {
    return field.nodes[this.in1].calculate(field);
};

NopNode.prototype.toString = function(field) {
    return field.nodes[this.in1].toString(field);
};

NopNode.prototype.clone = function() {
    return new NopNode(this.in1);
};

var randomNode = function(newPos) {
    var newIn1 = Math.floor(Math.random() * (newPos + 1));

    return new NopNode(newIn1);
};

module.exports.NopNode = NopNode;
module.exports.randomNode = randomNode;
