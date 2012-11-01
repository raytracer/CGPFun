// mulNode.js
// A node that multiplies the result of two input nodes.

var MulNode = function(in1, in2) {
    this.in1 = in1;
    this.in2 = in2;
};

MulNode.prototype.calculate = function(field) {
    return field.nodes[this.in1].calculate(field) *
           field.nodes[this.in2].calculate(field);
};

MulNode.prototype.toString = function(field) {
    return '(' + field.nodes[this.in1].toString(field) +  ' * ' +
           field.nodes[this.in2].toString(field) + ')';
};

MulNode.prototype.clone = function() {
    return new MulNode(this.in1, this.in2);
};

var randomNode = function(newPos) {
    var newIn1 = Math.floor(Math.random() * (newPos + 1));
    var newIn2 = Math.floor(Math.random() * (newPos + 1));

    return new MulNode(newIn1, newIn2);
};

module.exports.MulNode = MulNode;
module.exports.randomNode = randomNode;
