$(document).ready(function() {
    var connection = new WebSocket('ws://localhost:3000/echo');

    connection.onmessage = function (e) {
        console.log('Server: ' + e.data);
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

        connection.send(JSON.stringify(data));

        event.preventDefault();
    });
});
