// subNode.js
// A node that subtracts the result of two input nodes.

var SubNode = function(in1, in2) {
    this.in1 = in1;
    this.in2 = in2;
};

SubNode.prototype.calculate = function(field) {
    return field.nodes[this.in1].calculate(field) -
           field.nodes[this.in2].calculate(field);
};

SubNode.prototype.toString = function(field) {
    return '(' + field.nodes[this.in1].toString(field) +  ' - ' +
           field.nodes[this.in2].toString(field) + ')';
};

SubNode.prototype.clone = function() {
    return new SubNode(this.in1, this.in2);
};

var randomNode = function(newPos) {
    var newIn1 = Math.floor(Math.random() * (newPos + 1));
    var newIn2 = Math.floor(Math.random() * (newPos + 1));

    return new SubNode(newIn1, newIn2);
};

module.exports.SubNode = SubNode;
module.exports.randomNode = randomNode;
