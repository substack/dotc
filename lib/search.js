var spawn = require('child_process').spawn
var split = require('split')
var through = require('through')

module.exports = function (terms, opts) {
  if (!opts) opts = {}
  var cols = opts.cols || process.stdout.columns || Infinity

  var args = [ 'search', '-s', '/\\.(c|cc|cpp|cxx|h)\\b/' ]

  var ps = spawn('npm', args.concat(terms), { stdio: [ 0, 'pipe', 2 ] })
  var lineNum = 0

  var output = ps.stdout.pipe(split()).pipe(through(write))

  ps.on('exit', function (code) {
    if (code !== 0) {
      output.emit('error', new Error('non-zero exit code running `npm`'))
    }
  })
  return output

  function write (buf) {
    var line = buf.toString('utf8')
    if (lineNum++ === 0 || /^\S+\.(c|cc|cpp|cxx|h)\s/.test(line)) {
      output.queue(line.substr(0, cols) + '\n')
    }
  }
}
