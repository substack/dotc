var test = require('tap').test;
var fs = require('fs');
var tokenize = require('../');
var expected = require('./comments.json');

test('comments', function (t) {
    t.plan(1);
    
    var seen = [];
    var tk = tokenize(function (src, target) {
        seen.push({ type: target.type, source: src });
    });
    fs.createReadStream(__dirname + '/comments.c').pipe(tk);
    tk.on('data', function () {});
    tk.on('end', function () {
        t.deepEqual(seen, expected);
    });
});
