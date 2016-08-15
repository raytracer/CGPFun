// powNode.js
// A node that computes the power of x to the y.

var PowNode = function(in1, in2) {
    this.in1 = in1;
    this.in2 = in2;
};

PowNode.prototype.calculate = function(field) {
    return Math.pow(field.nodes[this.in1].calculate(field),
                    field.nodes[this.in2].calculate(field));
};

PowNode.prototype.toString = function(field) {
    return "pow(" + field.nodes[this.in1].toString(field) + ", " +
           field.nodes[this.in2].toString(field) + ")";
};

PowNode.prototype.clone = function() {
    return new PowNode(this.in1, this.in2);
};

var randomNode = function(newPos) {
    var newIn1 = Math.floor(Math.random() * (newPos + 1));
    var newIn2 = Math.floor(Math.random() * (newPos + 1));

    return new PowNode(newIn1, newIn2);
};

module.exports.PowNode = PowNode;
module.exports.randomNode = randomNode;
