// divNode.js
// A node that divides the result of two input nodes.

var DivNode = function(in1, in2) {
    this.in1 = in1;
    this.in2 = in2;
};

DivNode.prototype.calculate = function(field) {
    return field.nodes[this.in1].calculate(field) /
           field.nodes[this.in2].calculate(field);
};

DivNode.prototype.toString = function(field) {
    return '(' + field.nodes[this.in1].toString(field) +  ' / ' +
           field.nodes[this.in2].toString(field) + ')';
};

DivNode.prototype.clone = function() {
    return new DivNode(this.in1, this.in2);
};

var randomNode = function(newPos) {
    var newIn1 = Math.floor(Math.random() * (newPos + 1));
    var newIn2 = Math.floor(Math.random() * (newPos + 1));

    return new DivNode(newIn1, newIn2);
};

module.exports.DivNode = DivNode;
module.exports.randomNode = randomNode;
