// addNode.js
// A node that adds the result of two input nodes together.

var AddNode = function(in1, in2) {
    this.in1 = in1;
    this.in2 = in2;
};

AddNode.prototype.calculate = function(field) {
    return field.nodes[this.in1].calculate(field) +
           field.nodes[this.in2].calculate(field);
};

AddNode.prototype.toString = function(field) {
    return '(' + field.nodes[this.in1].toString(field) +  ' + ' +
           field.nodes[this.in2].toString(field) + ')';
};

AddNode.prototype.clone = function() {
    return new AddNode(this.in1, this.in2);
};

var randomNode = function(newPos) {
    var newIn1 = Math.floor(Math.random() * (newPos + 1));
    var newIn2 = Math.floor(Math.random() * (newPos + 1));

    return new AddNode(newIn1, newIn2);
};

module.exports.AddNode = AddNode;
module.exports.randomNode = randomNode;
