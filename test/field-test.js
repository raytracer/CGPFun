// field-test.js

var vows = require('vows'),
    assert = require('assert'),
    cn = require('../constNode.js'),
    vn = require('../varNode.js'),
    Field = require('../field.js');


vows.describe('field').addBatch({
    'when getting the maximum position for a new node' : {
        topic : function() {
            var field = new Field(new Array(2), 3, 4);

            return field.getMaxIndex(7);
        },
        'we get a value back that is <= than the given position' : function(topic) {
            assert.equal(topic, 5);
        }
    },
    'when creating a new field' : {
        topic : new Field(new Array(4), 4, 5),
        'we get the correct number of nodes back' : function(topic) {
            assert.equal(topic.nodes.length, 24);
        }
    },
    'when initializing a new field' : {
        topic : function() {
            var field = new Field([new cn.ConstNode(1)], 3, 3);
            field.initialize();

            return field;
        },
        'all nodes are != to undefined' : function(topic) {
            for (var i = 0; i < topic.nodes.length; i++) {
                assert.notEqual(topic.nodes[i], undefined);
            }
        }
    },
    'when mutating a field' : {
        topic : function() {
            var field = new Field([new cn.ConstNode(1)], 3, 3);
            field.initialize();
            field.mutate(0.2);

            return field;
        },
        'all nodes are != to undefined' : function(topic) {
            for (var i = 0; i < topic.nodes.length; i++) {
                assert.notEqual(topic.nodes[i], undefined);
            }
        }
    },
    'when rating the fitness of a field' : {
        topic : function() {
            var field = new Field([new vn.VarNode('x')], 3, 3);

            field.initialize();
            field.rateFitness([[0.0], [1.0], [2.0]], [0.0, 1.0, 2.0]);

            return field;
        },
        'we get a number >= 0 back' : function(topic) {
            assert.isTrue(topic.fitness >= 0.0);
        }
    }
}).export(module);
