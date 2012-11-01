// addNode-test.js

var vows = require('vows'),
    assert = require('assert'),
    an = require('../addNode.js'),
    cn = require('../constNode.js'),
    Field = require('../field.js');


vows.describe('AddNode').addBatch({
    'when calculating the node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'addNode' : new an.AddNode(0,1)
            };
        },
        'we get the sum of the inputs' : function(topic) {
            assert.equal(topic.addNode.calculate(topic.field), 10);
        }
    },
    'when generating a random node' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'addNode' : an.randomNode(1)
            };
        },
        'calculating still works' : function(topic) {
            assert.isNumber(topic.addNode.calculate(topic.field));
        }
    },
    'when printing the representation' : {
        topic : function() {
            var field = new Field([], 2,2);
            field.nodes[0] = new cn.ConstNode(3);
            field.nodes[1] = new cn.ConstNode(7);

            return {
                'field' : field,
                'addNode' : new an.AddNode(0,1)
            };
        },
        'we get the algebraic term back' : function(topic) {
            assert.equal(topic.addNode.toString(topic.field), '(3 + 7)');
        }
    },
    'when cloning the node' : {
        topic : function() {
            var addNode1 = new an.AddNode(0,1);
            var addNode2 = addNode1.clone();

            return {
                'addNode1' : addNode1,
                'addNode2' : addNode2
            };
        },
        'we get a separate object back (deep clone)' : function(topic) {
            assert.notEqual(topic.addNode1, topic.addNode2);
        }
    }
}).export(module);
