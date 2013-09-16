#!/usr/bin/env node
var spawn = require('child_process').spawn;
var path = require('path');
var argv = require('optimist').argv;

var prefix = [
    //'-x', 'c++', // for now while there are namespaces
    '-no-integrated-cpp',
    '-B', path.join(__dirname, 'bin')
];
if (argv.cmd) {
    console.log(prefix.join(' '));
}
else {
    var args = prefix.concat(process.argv.slice(2));
    spawn('gcc', args, { stdio: 'inherit' });
}
