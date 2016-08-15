// field.js
// A representation of the whole node grid.
var async = require('async'),
    an = require('./addNode.js'),
    sn = require('./subNode.js'),
    mn = require('./mulNode.js'),
    dn = require('./divNode.js'),
    pn = require('./powNode.js'),
    cn = require('./constNode.js'),
    nn = require('./nopNode.js');

var nodeTypes = [cn, an, sn, nn, mn, dn, pn];

var Field = function(inputs, width, height) {
    this.width = width;
    this.height = height;
    this.inputs = inputs;

    this.nodes = inputs.concat(new Array(width * height));
};

// Creates a random start field.
Field.prototype.initialize = function() {
    var len = this.nodes.length;
    var inputLen = this.inputs.length;

    for (var i = this.inputs.length; i < this.nodes.length; i++) {
        var nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        this.nodes[i] = nodeType.randomNode(this.getMaxIndex(i));
    }

    var pos = Math.floor(Math.random() * len);
    this.output = new nn.NopNode(pos);
};

// Get the maximal source index for a given position.
Field.prototype.getMaxIndex = function(pos) {
    return Math.floor((pos - this.inputs.length) / this.height) *
           this.height + this.inputs.length - 1;
};

Field.prototype.clone = function() {
    var field = new Field(this.inputs, this.width, this.height);

    for (var i = this.inputs.length; i < this.nodes.length; i++) {
        field.nodes[i] = this.nodes[i].clone();
    }

    return field;
};

Field.prototype.mutate = function(factor) {
    var len = this.nodes.length;
    var inputLen = this.inputs.length;

    for (var i = 0; i < (factor * len); i++) {
        var pos = Math.floor(Math.random() * (len - inputLen + 1)) + inputLen;

        if (pos === len) {
            var outPos = Math.floor(Math.random() * len);
            this.output = new nn.NopNode(outPos);
        } else {
            var nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
            this.nodes[pos] = nodeType.randomNode(this.getMaxIndex(pos));
        }
    }
};

Field.prototype.rateFitness = function(insets, outset) {
    // assume that len(insets[i]) === len(outset)

    var fitness = 0.0;

    for (var i = 0; i < insets.length; i++) {
        for (var j = 0; j < insets[i].length; j++) {
            this.nodes[j].setValue(insets[i][j]);
        }

        var val = this.output.calculate(this);
        fitness += Math.abs((isNaN(val) ? Infinity : val) - outset[i]);
    }

    this.fitness = fitness;
};
module.exports = Field;
