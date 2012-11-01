var Field = require('./field.js');

var generations = function(start, nrOfGenerations, rateOfMutation, nrOfMutations, insets, outset) {
    var best = start;

    for (var i = 0; i < nrOfGenerations; i++) {
        var gen = best;

        for (var j = 0; j < nrOfMutations; j++) {
            var current = gen.clone();
            current.mutate(rateOfMutation);
            current.rateFitness(insets, outset);

            if (current.fitness <= best.fitness) {
                best = current;
            }
        }
    }

    return best;
};

module.exports.generations = generations;
