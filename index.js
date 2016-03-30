var fs = require('fs')
var path = require('path')
var through = require('through')
var parse = require('./lib/parse.js')

module.exports = function (files) {
  if (!Array.isArray(files)) files = [ files ]

  var output = through()
  files = files.slice()

  ;(function next () {
    if (files.length === 0) return output.queue(null)
    var file = files.shift()
    var rs = isStream(file) ? file : fs.createReadStream(file)
    var p = rs.pipe(parse(path.dirname(file)))

    p.on('data', function (buf) { output.queue(buf) })
    p.on('end', next)
  })()

  return output
}

function isStream (s) {
  return s && typeof s.pipe === 'function'
}
