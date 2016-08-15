var express = require('express'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length;


var Field = require('./field.js'),
    vn = require('./varNode.js'),
    island = require('./island.js');

var insets = [[1.0], [2.0], [3.0], [4.0], [5.0], [6.0]];
var outset = [1, 1, 2, 3, 5, 8];

if (cluster.isMaster) {
    var app = express();
    var expressWs = require('express-ws')(app);

    app.ws('/echo', function(ws, req) {
        ws.on('message', function(msg) {
            var data = JSON.parse(msg);
            var onlineWorkers = 0;
            var results = {};

            for (var i = 0; i < numCPUs; i++) {
                var worker = cluster.fork();

                onlineWorkers++;

                worker.send({
                    'init' : data.init,
                    'generations' : data.generations,
                    'mutations' : data.mutations,
                    'rate' : data.rate,
                    'height': data.height,
                    'width': data.width
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
                    ws.send(JSON.stringify(results));
                }
            });
        });
    });

    app.use(express.static(__dirname + '/public'));

    app.get('/', function(req, res) {
        res.sendfile('./public/index.html');
    });

    app.listen(3000);
    console.log('Listening on port 3000');
} else if (cluster.isWorker) {
    process.on('message', function(config) {
        var fields = new Array(config.init);

        for (var i = 0; i < fields.length; i++) {
            fields[i] = new Field([new vn.VarNode('x')], config.width, config.height);
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
