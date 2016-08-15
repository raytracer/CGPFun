// powNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    pn = require('../powNode.js'),
    cn = require('../constNode.js'),
    Field = require('../field.js');


vows.describe('PowNode').addBatch({
    'when calculating the node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(4);

            return {
                'field' : field,
                'powNode' : new pn.PowNode(0,1)
            };
        },
        'we get the sum of the inputs' : function(topic) {
            assert.equal(topic.powNode.calculate(topic.field), 81);
        }
    },
    'when generating a random node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'powNode' : pn.randomNode(1)
            };
        },
        'calculating still works' : function(topic) {
            assert.isNumber(topic.powNode.calculate(topic.field));
        }
    },
    'when printing the representation' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'powNode' : new pn.PowNode(0,1)
            };
        },
        'we get the algebraic term back' : function(topic) {
            assert.equal(topic.powNode.toString(topic.field), 'pow(3, 7)');
        }
    },
    'when cloning the node' : {
        topic : function() {
            var powNode1 = new pn.PowNode(0,1);
            var powNode2 = powNode1.clone();

            return {
                'powNode1' : powNode1,
                'powNode2' : powNode2
            };
        },
        'we get a separate object back (deep clone)' : function(topic) {
            assert.notEqual(topic.powNode1, topic.powNode2);
        }
    }
}).export(module);
