// subNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    sn = require('../subNode.js'),
    cn = require('../constNode.js'),
    Field = require('../field.js');


vows.describe('SubNode').addBatch({
    'when calculating the node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'subNode' : new sn.SubNode(0,1)
            };
        },
        'we get the sum of the inputs' : function(topic) {
            assert.equal(topic.subNode.calculate(topic.field), -4);
        }
    },
    'when generating a random node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'subNode' : sn.randomNode(1)
            };
        },
        'calculating still works' : function(topic) {
            assert.isNumber(topic.subNode.calculate(topic.field));
        }
    },
    'when printing the representation' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'subNode' : new sn.SubNode(0,1)
            };
        },
        'we get the algebraic term back' : function(topic) {
            assert.equal(topic.subNode.toString(topic.field), '(3 - 7)');
        }
    },
    'when cloning the node' : {
        topic : function() {
            var subNode1 = new sn.SubNode(0,1);
            var subNode2 = subNode1.clone();

            return {
                'subNode1' : subNode1,
                'subNode2' : subNode2
            };
        },
        'we get a separate object back (deep clone)' : function(topic) {
            assert.notEqual(topic.subNode1, topic.subNode2);
        }
    }
}).export(module);
