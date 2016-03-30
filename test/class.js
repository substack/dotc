var test = require('tap').test
var path = require('path')
var spawn = require('child_process').spawn
var concat = require('concat-stream')
var mkdirp = require('mkdirp')

var tmp = path.join(require('os').tmpdir(), 'dotc-' + Math.random())
mkdirp.sync(tmp)

var bin = path.join(__dirname, '../bin/dotc')

test('class', function (t) {
  t.plan(3)
  var outfile = path.join(tmp, Math.random() + '.out')
  var ps = spawn(bin, [ path.join(__dirname, 'class/main.c'), '-o', outfile ])

  ps.stderr.pipe(process.stderr)
  ps.stdout.pipe(process.stdout)
  ps.on('exit', function (code) {
    t.equal(code, 0)
    var p = spawn(outfile, [])
    p.stdout.pipe(concat(function (body) {
      t.equal(body + '', '5\n')
    }))
    p.on('exit', function (code) {
      t.equal(code, 0)
    })
  })
})
