#!/usr/bin/env node

var through = require('through');
var split = require('split');

process.stdin
    .pipe(split())
    .pipe(through(function (line) {
        if (/^#require\b/.test(line)) {
            this.queue('int foo (int n) { return n * 100; }\n');
        }
        else this.queue(line + '\n');
    }))
    .pipe(process.stdout)
;
