// varNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    vn = require('../varNode.js');

vows.describe('VarNode').addBatch({
    'when creating a node' : {
        topic : new vn.VarNode('x'),
        'there is only the name' : function(topic) {
            assert.equal(topic.name, 'x');
            assert.isUndefined(topic.value);
        }
    },
    'when setting a value' : {
        topic : function() {
            var node = new vn.VarNode('x');
            node.setValue(12);

            return node;
        },
        'we can calculate the node' : function(topic) {
            assert.equal(topic.calculate(null), 12);
        }
    },
    'when printing the representation' : {
        topic : new vn.VarNode('x'),
        'we get the variable name back' : function(topic) {
            assert.equal(topic.toString(null), 'x');
        }
    }
}).export(module);
