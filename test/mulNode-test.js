// mulNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    mn = require('../mulNode.js'),
    cn = require('../constNode.js'),
    Field = require('../field.js');


vows.describe('MulNode').addBatch({
    'when calculating the node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'mulNode' : new mn.MulNode(0,1)
            };
        },
        'we get the product of the inputs' : function(topic) {
            assert.equal(topic.mulNode.calculate(topic.field), 21);
        }
    },
    'when generating a random node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'mulNode' : mn.randomNode(1)
            };
        },
        'calculating still works' : function(topic) {
            assert.isNumber(topic.mulNode.calculate(topic.field));
        }
    },
    'when printing the representation' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'mulNode' : new mn.MulNode(0,1)
            };
        },
        'we get the algebraic term back' : function(topic) {
            assert.equal(topic.mulNode.toString(topic.field), '(3 * 7)');
        }
    },
    'when cloning the node' : {
        topic : function() {
            var mulNode1 = new mn.MulNode(0,1);
            var mulNode2 = mulNode1.clone();

            return {
                'mulNode1' : mulNode1,
                'mulNode2' : mulNode2
            };
        },
        'we get a separate object back (deep clone)' : function(topic) {
            assert.notEqual(topic.mulNode1, topic.mulNode2);
        }
    }
}).export(module);
