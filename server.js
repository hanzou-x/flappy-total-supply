var express = require('express');
require('log-timestamp');

var app = express();

app.get('/chain/FlappyCoin/q/totalbc', function(req, res) {
    var process = require('child_process');
    console.log('GET from ' + req.connection.remoteAddress);
    process.exec('../Flaps/src/flappycoind gettxoutsetinfo', function(err, stdout, stderr) {
        if (err) {
            res.writeHead(403, {'Content-Type': 'text/plain'});
            console.log(typeof(stderr) + ': ' + stderr.trim());
            res.end(stderr);
        } else {
            console.log(stdout.trim());
            var info = JSON.parse(stdout);
            var signed_amount = info.total_amount;
            // Correct for the signed 64-bit integer overflow after Flappy crossed the 92 billion mark
            var corrected_amount = signed_amount + (Math.pow(2, 64) / 100000000.0);
            console.log('total supply: ' + corrected_amount);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(''+corrected_amount);
        }
    });
});

var port = 1337;
app.listen(port);
console.log('Listening at http://localhost:' + port);
