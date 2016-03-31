var test = require('tap').test
var path = require('path')
var spawn = require('child_process').spawn
var concat = require('concat-stream')
var mkdirp = require('mkdirp')

var tmp = path.join(require('os').tmpdir(), 'dotc-' + Math.random())
mkdirp.sync(tmp)

var bin = path.join(__dirname, '../bin/dotc')

test('double inclusion', function (t) {
  t.plan(4)
  var outfile = path.join(tmp, Math.random() + '.out')
  var ps = spawn(bin, [ path.join(__dirname, 'double/main.c'), '-o', outfile ])

  ps.stderr.pipe(process.stderr)
  ps.stdout.pipe(process.stdout)
  ps.on('exit', function (code) {
    t.equal(code, 0)
    var p = spawn(outfile, [ '3', '5' ])
    p.stdout.pipe(concat(function (body) {
      t.equal(body + '', '3663\n')
    }))
    p.on('exit', function (code) {
      t.equal(code, 15)
    })
  })

  var pre = spawn(bin, [ 'pre', path.join(__dirname, 'double/main.c') ])
  pre.stdout.pipe(concat(function (body) {
    var m = body.toString('utf8').match(/\/\/ X FILE/g)
    t.equal(m.length, 1, 'include the X FILE only once')
  }))
})
