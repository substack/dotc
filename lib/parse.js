var fs = require('fs');
var path = require('path');

var tokenize = require('c-tokenizer');
var split = require('split');
var combine = require('stream-combiner');
var Transform = require('stream').Transform;

var sequences = {
    require: [
        { type: 'directive', content: '#require' },
        { type: 'whitespace' },
        { type: 'quote' },
        { type: 'whitespace' },
        { type: 'identifier', content: 'as' },
        { type: 'whitespace' },
        { type: 'identifier' },
    ],
    'export': [
        { type: 'directive', content: '#export' },
        { type: 'whitespace' },
        { type: 'identifier' }
    ],
    'export=': [
        { type: 'directive', content: '#export=' },
        { type: 'whitespace' },
        { type: 'identifier' }
    ]
};

function makeState (name, cb) {
    return {
        states: sequences[name].concat(cb),
        tokens: [],
        index: 0
    };
}

module.exports = function parse (dir) {
    var t = tokenize();
    
    var ns = '_' + Math.floor(Math.pow(16,8) * Math.random()).toString(16);
    t.namespace = ns;
    
    var required = {};
    var exported = {};
    var states = [];
    
    states.push(makeState('require', function (tokens, next) {
        var p = tokens[2].content.replace(/^"|"$/g, '');
        
        var file = path.resolve(dir, p);
        var rs = fs.createReadStream(file);
        var sub = rs.pipe(parse(path.dirname(file)));
        
        sub.on('export', function (nsp, ex) {
            exported[ex] = true;
        });
        
        sub.on('export=', function (nsp, ex) {
            if (exported[nsp]) {
                emit('error', 'single export attempted with '
                    + 'existing multi exports'
                );
            }
            else {
                exported[nsp] = { '=': ex };
            }
        });
        
        emit('require', p, tokens[6].content);
        required[tokens[6].content] = sub.namespace;
        
        tr.push('namespace ' + sub.namespace + ' {');
        
        sub.on('data', function (buf) { tr.push(buf) });
        sub.on('end', function () {
            tr.push('};');
            next();
        });
    }));
    
    states.push(makeState('export', function (tokens, next) {
        emit('export', ns, tokens[2].content);
        next();
    }));
    
    states.push(makeState('export=', function (tokens, next) {
        emit('export=', ns, tokens[2].content);
        next();
    }));
    
    var matching = null;
    
    var tr = new Transform({ objectMode: true });
    tr._transform = function (token, enc, next) {
        var src = token.content;
        if (matching) {
            var m = matching.states[matching.index ++];
            if (m.type !== token.type) {
                return emit('error', new Error(
                    'unexpected type: ' + m.type 
                    + '. expected: ' + token.type
                ));
            }
            if (m.content && m.content !== token.content) {
                return emit('error', new Error(
                    'unexpected content: ' + JSON.stringify(m.content)
                    + '. expected: ' + JSON.stringify(token.content)
                ));
            }
            matching.tokens.push(token);
            var f = matching.states[matching.index];
            if (typeof f === 'function') {
                f(matching.tokens, next);
                matching.index = 0;
                matching.tokens = [];
                matching = null;
                return;
            }
            else next();
        }
        else if (token.type === 'identifier' && required[token.content]) {
            var nsp = required[token.content];
            var ex = exported[nsp];
            if (!ex) return emit('error', 'unknown export ' + ex);
            if (ex['=']) {
                this.push('(' + nsp + '::' + ex['='] + ')');
            }
            else {
                // TODO for multi-export
            }
            next();
        }
        else {
            for (var i = 0; i < states.length; i++) {
                var s = states[i].states[0];
                if (token.type === s.type
                && (!s.content || s.content === token.content)) {
                    matching = states[i];
                    matching.tokens.push(token);
                    matching.index ++;
                    return next();
                }
            }
            this.push(src);
            next();
        }
    };
    
    t.on('error', function (err) { emit('error', err) });
    
    var combined = combine(t, tr);
    combined.namespace = ns;
    return combined;
    
    function emit () {
        combined.emit.apply(combined, arguments);
    }
};
