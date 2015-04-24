#!/usr/bin/env node

_ = require('lodash');

var argv = require('minimist')(process.argv.slice(2));

defaults = {milliseconds:1000};

argv = _.merge(argv,defaults)

process.stdin.resume();
process.stdin.setEncoding('utf8');

var lingeringLine = "";
var lastTime=0;

var processLine = function(line){
    var currentTime = new Date();
    if (+lastTime+argv.milliseconds<+currentTime)
    {
        lastTime=new Date();
        return console.log(line);
    }
};

process.stdin.on('data', function(chunk) {
    var lines = chunk.split("\n");
    lines[0] = lingeringLine + lines[0];
    lingeringLine = lines.pop();
    lines.forEach(processLine);
});


process.stdin.on('end', function() {
    processLine(lingeringLine);
});
