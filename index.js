#!/usr/bin/env node

_ = require('lodash');

var argv = require('minimist')(process.argv.slice(2));

defaults = {milliseconds:1000,queue:false};

argv = _.merge(argv,defaults)

process.stdin.resume();
process.stdin.setEncoding('utf8');

var lingeringLine = "";
var lastTime=0;
var lines = [];

var processLine = function(line){
    var currentTime = new Date();
    if (+lastTime+argv.milliseconds<+currentTime) {
        lastTime=new Date();
        console.log(line);
        return true;
    }
    return false;
};

process.stdin.on('data', function(chunk) {
    if(argv.queue===false)
        lines = []
    lines.concat(chunk.split("\n"));
    lines[0] = lingeringLine + lines[0];
    lingeringLine = lines.pop();
    lines.forEach(function(line){
        processLine(line);
    });
});


process.stdin.on('end', function() {
    processLine(lingeringLine);
});
