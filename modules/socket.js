/**
 * Created by clomez on 9.5.2017.
 */
module.exports = sockettool;
var net = require('net');

function sockettool(ip, socketport, string, timeout, callback){


    try {
        var client = new net.Socket();
    }catch(err) {
        callback(null, "- Connection refused -");
    }
    try {
        client.connect(socketport, ip, function() {
            console.log('Connected');
            client.write(string);
            console.log('Send');
        });
    }catch(err) {
        callback(new Error("timeout"), null);
    }

    client.on('data', function(data) {

        //TIMEOUTTI
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
        setTimeout(callback(null, data.toString()), timeout);
    });

    client.on('close', function()
    {
        //console.log('Connection closed');
        setTimeout(callback(null, "No response"), timeout);
    });

}