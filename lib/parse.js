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

module.exports = function parse (exporting, dir) {
    var t = tokenize();
    
    var ns = '_' + Math.floor(Math.pow(16,8) * Math.random()).toString(16);
    t.namespace = ns;
    
    var states = [];
    states.push(makeState('require', function (tokens, next) {
        var p = tokens[2].content.replace(/^"|"$/g, '');
        t.emit('require', p, tokens[6].content);
        
        var file = path.resolve(dir, p);
        var rs = fs.createReadStream(file);
        var sub = rs.pipe(parse(true, path.dirname(file)));
        tr.push(
            '#define ' + tokens[6].content
            + ' ' + sub.namespace + '\n'
        );
        rs.on('data', function (buf) {
            tr.push(buf);
        });
        rs.on('end', function () {
            console.error('DONE');
            next()
        });
console.error('REQUIRE', p, tokens[6].content);
    }));
    
    states.push(makeState('export', function (tokens, next) {
        //tr.emit('export');
console.error('EXPORT', tokens);
        next();
    }));
    
    states.push(makeState('export=', function (tokens, next) {
        //tr.emit('export');
console.error('EXPORT=', tokens);
        next();
    }));
    
    var matching = null;
    
    var tr = new Transform({ objectMode: true });
    tr._transform = function (token, enc, next) {
        var src = token.content;
        if (matching) {
            var m = matching.states[matching.index ++];
            if (m.type !== token.type) {
                return t.emit('error', new Error(
                    'unexpected type: ' + m.type 
                    + '. expected: ' + token.type
                ));
            }
            if (m.content && m.content !== token.content) {
                return t.emit('error', new Error(
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
    tr._flush = function (next) {
        console.error('FLUSH...');
        this.push(null);
    };
    
    var combined = combine(t, tr);
    combined.namespace = ns;
    return combined;
};
