function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i];});
    });
}

$(document).ready(function() {
    var connection = new WebSocket('ws://localhost:3000/echo');

    connection.onmessage = function (e) {
        var obj = JSON.parse(e.data);
        var best = Object.keys(obj).map(function(key) {return obj[key];}).sort(function(funcA, funcB) {return funcA.Fitness - funcB.Fitness;})[0];
        var term = best.Term;
        var fitness = best.Fitness;
        var inputs = $("#inputs").val().split(",").map(function (val) {return +val;});
        var outputs = $("#outputs").val().split(",").map(function (val) {return +val;});

        $('#term').text(`${term}, Fitness: ${fitness}`);

        functionPlot({
            target: '#graph',
            width: 1000,
            height: 500,
            data: [{
                fn: term, color: 'blue',
                nSamples: 500,
                graphType: 'polyline'
            },
            {
                points: zip([inputs, outputs]),
                fnType: 'points',
                color: 'red',
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
