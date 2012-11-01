// constNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    cn = require('../constNode.js');

vows.describe('ConstNode').addBatch({
    'when calculating the node' : {
        topic : new cn.ConstNode(12),
        'we get the constant back' : function(topic) {
            assert.equal(topic.calculate(null), 12);
        }
    },
    'when generating a random node' : {
        topic : cn.randomNode(null),
        'we get a random constant back' : function(topic) {
            assert.isNumber(topic.calculate(null));
        }
    },
    'when printing the representation' : {
        topic : new cn.ConstNode(12),
        'we get the algebraic term back' : function(topic) {
            assert.equal(topic.toString(null), '12');
        }
    },
    'when cloning the node' : {
        topic : function() {
            var constNode1 = new cn.ConstNode(2,0,1);
            var constNode2 = constNode1.clone();

            return {
                'constNode1' : constNode1,
                'constNode2' : constNode2
            };
        },
        'we get a separate object back (deep clone)' : function(topic) {
            assert.notEqual(topic.constNode1, topic.constNode2);
        }
    }
}).export(module);
