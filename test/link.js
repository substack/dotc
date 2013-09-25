var test = require('tap').test;
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var mkdirp = require('mkdirp');

var tmp = path.join(require('os').tmpdir(), 'dotc-' + Math.random());
mkdirp.sync(tmp);

var bin = __dirname + '/../bin/dotc';

test('link .a file', function (t) {
    t.plan(5);
    //var outfile = path.join(, Math.random() + '.out');
    var ps = spawn('gcc', [ '-c', __dirname + '/link/calc_mean.cc', '-I', __dirname + '/link', '-o', tmp + '/calc_mean.o'])
    
    ps.stderr.pipe(process.stderr);
    ps.stdout.pipe(process.stdout);
    ps.on('exit', function (code) {
        t.equal(code, 0);
        var p = spawn('ar', [ 'rcs', tmp + '/libmean.a', tmp + '/calc_mean.o']);
        p.stderr.pipe(process.stderr);
        p.stdout.pipe(process.stdout);
        p.on('exit', function(code) {
           t.equal(code, 0);
            var q = spawn(bin, [__dirname + '/link/main.c', tmp + '/libmean.a', '-I', __dirname + '/link', '-o', tmp + '/a.out']);
            q.stderr.pipe(process.stderr);
            q.stdout.pipe(process.stdout);
            q.on('exit', function(code) {
                t.equal(code, 0);
                var r = spawn(tmp + '/a.out', []);
                r.stdout.pipe(concat(function (body) {
                   t.equal(body + '', 'The mean of 5.20 and 7.90 is 6.55\n');
                }));
                r.on('exit', function (code) {
                  t.equal(code, 0);
                }); 
            })
        })

        
    });
});
