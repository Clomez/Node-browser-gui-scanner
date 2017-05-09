/**
 * Created by clomez on 9.5.2017.
 */
module.exports = sockettool;
var net = require('net');

function sockettool(ip, socketport, string, timeout, callback){



    var client = new net.Socket();
    try {
        client.connect(socketport, ip, function() {


            console.log('Connected');
            client.write('Hello, server! Love, Client.');

        });
    }catch(err) {
        callback(new Error("timeout"), null);
    }

    client.on('data', function(data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
        callback(null, data);
    });

    client.on('close', function() {
        console.log('Connection closed');
        callback(new Error("Connection closed"), null);
    });

}