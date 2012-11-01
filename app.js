var express = require('express'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

var Field = require('./field.js'),
    vn = require('./varNode.js'),
    island = require('./island.js');

var insets = [[0.0], [1.0], [2.0], [3.0]];
    outset = [7.0, 9.0, 11.0, 13.0];

if (cluster.isMaster) {
    var app = express();

    app.get('/', function(req, res){
        var onlineWorkers = 0;
        var results = {};

        for (var i = 0; i < numCPUs; i++) {
            var worker = cluster.fork();

            onlineWorkers++;

            worker.send({
                'init' : 100,
                'generations' : 1000,
                'mutations' : 1000,
                'rate' : 0.2
            });
        }

        function messageHandler(msg) {
            results[msg.id] = {'Term' : msg.term, 'Fitness' : msg.fitness};
        }

        Object.keys(cluster.workers).forEach(function(id) {
            cluster.workers[id].on('message', messageHandler);
        });

        cluster.on('exit', function(worker, code, signal) {
            onlineWorkers--;
            if (onlineWorkers === 0) {
                res.send(results);
            }
        });

    });

    app.listen(3000);
    console.log('Listening on port 3000');
} else if (cluster.isWorker) {
    process.on('message', function(config) {
        var fields = new Array(config.init);

        for (var i = 0; i < fields.length; i++) {
            fields[i] = new Field([new vn.VarNode('x')], 3, 3);
            fields[i].initialize();
            fields[i].rateFitness(insets, outset);
        }

        fields = fields.sort(function(a, b) {
            return a.fitness - b.fitness;
        });

        var best = island.generations(fields[0], config.generations,
                                                 config.mutations,
                                                 config.rate,
                                                 insets, outset);

        process.send({'fitness' : best.fitness,
                      'term' : best.output.toString(best),
                      'id' : cluster.worker.id});

        cluster.worker.destroy();
    });

}
