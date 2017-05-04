module.exports = lookup;

var dns = require('native-dns');
var util = require('util');
var ret;

function lookup(url, callback) {

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
        console.log('Timeout in making request');
        // RETURN ERROR OBJECT; SEND RESPONSE AS EMPTY
        return (new Error('Timeout!'),null);
    });

    req.on('message', function (err, answer) {
        answer.answer.forEach(function (a) {
            console.log(a.address);
            if (a.address != undefined) {
                ret = a.address;
                // RETURN ERROR AS NULL AND RESPONSE AS RET
                return (null,ret);
            }

        });
    });

}
