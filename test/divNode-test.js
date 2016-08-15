// divNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    dn = require('../divNode.js'),
    cn = require('../constNode.js'),
    Field = require('../field.js');


vows.describe('DivNode').addBatch({
    'when calculating the node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(8);
            field.nodes[1] = new cn.ConstNode(4);

            return {
                'field' : field,
                'divNode' : new dn.DivNode(0,1)
            };
        },
        'we get the quotient of the inputs' : function(topic) {
            assert.equal(topic.divNode.calculate(topic.field), 2);
        }
    },
    'when generating a random node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'divNode' : dn.randomNode(1)
            };
        },
        'calculating still works' : function(topic) {
            assert.isNumber(topic.divNode.calculate(topic.field));
        }
    },
    'when printing the representation' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'divNode' : new dn.DivNode(0,1)
            };
        },
        'we get the algebraic term back' : function(topic) {
            assert.equal(topic.divNode.toString(topic.field), '(3 / 7)');
        }
    },
    'when cloning the node' : {
        topic : function() {
            var divNode1 = new dn.DivNode(0,1);
            var divNode2 = divNode1.clone();

            return {
                'divNode1' : divNode1,
                'divNode2' : divNode2
            };
        },
        'we get a separate object back (deep clone)' : function(topic) {
            assert.notEqual(topic.divNode1, topic.divNode2);
        }
    }
}).export(module);
