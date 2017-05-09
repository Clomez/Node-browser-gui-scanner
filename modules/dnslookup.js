module.exports = lookups;

var ret = [];

function lookups(url, data) {
    var dns = require('native-dns');
    var util = require('util');

    var question = dns.Question({
        name: url,
        type: 'A',
    });

    var start = Date.now();

    var req = dns.Request({
        question: question,
        server: { address: '8.8.8.8', port: 53, type: 'udp' },
        timeout: 1000,
    });

    req.on('timeout', function () {
        //console.log('Timeout in making request');
        return (new Error("timeout"), null);
    });

    req.on('message', function (err, answer) {
        var items = 0;
        answer.answer.forEach(function (a) {
            //console.log(a.address);
            ret.push(a.address);
            items++;

        });
            if(items === answer.answer.length){
                data (null,ret);
            }

    });

    req.on('end', function () {
        var delta = (Date.now()) - start;
        //console.log('Finished processing request: ' + delta.toString() + 'ms');


    });

    req.send();

}
