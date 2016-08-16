$(document).ready(function() {
    var connection = new WebSocket('ws://localhost:3000/echo');

    connection.onmessage = function (e) {
        var obj = JSON.parse(e.data);
        var first = obj[Object.keys(obj)[0]];
        var term = first.Term;
        var fitness = first.Fitness;

        $('#term').text(`${term}, Fitness: ${fitness}`);

        functionPlot({
            target: '#graph',
            data: [{
                fn: term, color: 'blue',
                nSamples: 100,
                graphType: 'scatter'
            }]
        });
    };

    $('form').submit(function(event) {
        var data = {};

        data.generations = $("#generations").val();
        data.mutations = $("#mutations").val();
        data.rate = $("#rate").val();
        data.init = $("#init").val();
        data.generations = $("#generations").val();
        data.height = $("#height").val();
        data.width = $("#width").val();
        data.inputs = $("#inputs").val().split(",").map(function (val) {return [+val];});
        data.outputs = $("#outputs").val().split(",").map(function (val) {return +val;});

        connection.send(JSON.stringify(data));

        event.preventDefault();
    });
});
