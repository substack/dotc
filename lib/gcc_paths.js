var exec = require('child_process').exec;

module.exports = function (cb) {
    exec('gcc -print-search-dirs', function (err, stdout) {
        if (err) return cb(err);
        var lines = stdout.split('\n');
        for (var i = 0; i < lines.length; i++) {
            if (/^programs: =/.test(lines[i])) {
                return cb(null, lines[i].replace(/^programs: =/, ''));
            }
        }
        return cb('`gcc -print-search-dirs` had no "programs:" listing');
    });
};
