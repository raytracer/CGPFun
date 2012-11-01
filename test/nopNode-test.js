// nopNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    nn = require('../nopNode.js'),
    cn = require('../constNode.js'),
    Field = require('../field.js');


vows.describe('nopNode').addBatch({
    'when calculating the node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);

            return {
                'field' : field,
                'nopNode' : new nn.NopNode(0)
            };
        },
        'we get the value of the input' : function(topic) {
            assert.equal(topic.nopNode.calculate(topic.field), 3);
        }
    },
    'when generating a random node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(3);

            return {
                'field' : field,
                'nopNode' : nn.randomNode(1)
            };
        },
        'calculating still works' : function(topic) {
            assert.isNumber(topic.nopNode.calculate(topic.field));
        }
    },
    'when printing the representation' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);

            return {
                'field' : field,
                'nopNode' : new nn.NopNode(0)
            };
        },
        'we get the representation of the input back' : function(topic) {
            assert.equal(topic.nopNode.toString(topic.field), '3');
        }
    },
    'when cloning the node' : {
        topic : function() {
            var nopNode1 = new nn.NopNode(2,0);
            var nopNode2 = nopNode1.clone();

            return {
                'nopNode1' : nopNode1,
                'nopNode2' : nopNode2
            };
        },
        'we get a separate object back (deep clone)' : function(topic) {
            assert.notEqual(topic.nopNode1, topic.nopNode2);
        }
    }
}).export(module);
