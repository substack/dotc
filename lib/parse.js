var fs = require('fs');
var path = require('path');

var Transform = require('stream').Transform;
var split = require('split');

module.exports = function parse (exporting, dir) {
    var tf = new Transform;
    if (exporting) {
        var ns = '_' + Math.floor(Math.pow(16,8) * Math.random()).toString(16);
        tf.namespace = ns;
        tf.push('\nnamespace ' + ns + ' {\n');
    }
    
    var defined = [];
    
    tf._transform = function (buf, enc, next) {
        var line = buf.toString('utf8');
        var m = /#require\s+(?:'([^']+)'|"([^"]+)")\s+as\s*(\w+)/.exec(line);
        if (!m) {
            m = /^#export\s+(\w+)/.exec(line);
            if (m && ns) this.emit('export', ns + '::' + m[1]);
            else this.push(line + '\n');
            return next();
        }
        
        var file = path.resolve(dir, m[1] || m[2]);
        var id = m[3];
        
        var s = fs.createReadStream(file)
            .pipe(split())
            .pipe(parse(true, path.dirname(file)))
        ;
        var cexports = [];
        s.on('export', function (ex) { cexports.push(ex) });
        s.on('data', function (buf) { tf.push(buf) });
        s.on('end', function () {
            cexports.forEach(function (ex) {
                tf.push('\n#define ' + id + ' ' + ex + '\n');
                defined.push(id);
            });
            next();
        });
    };
    
    tf._flush = function (next) {
        if (exporting) tf.push('\n}\n');
        defined.forEach(function (def) {
            tf.push('#undef ' + def + '\n');
        });
        next();
    };
    
    return tf;
};
