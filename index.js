#!/usr/bin/env node

_ = require('lodash');

var argv = require('minimist')(process.argv.slice(2));

defaults = {milliseconds:1000,queue:false};

argv = _.merge(defaults,argv)

process.stdin.resume();
process.stdin.setEncoding('utf8');

var lingeringLine = "";

var Throttler = function(options){
    var lastTime=0;
    var self=this;
    this.lines=[];
    this.finished=false;
    this.finish=function(){
        this.finished=true;
        checkFinished();
    }
    this.pushLine=function(line){
        this.lines.push(line);
    }
    var checkFinished=function(){
        if (self.lines.length==0 && self.finished) {
            process.exit(0);
        }
    }
    var processLine=function(){
        if (self.lines.length==0) {
            checkFinished();
            return false;
        }
        var currentTime = new Date();
        if (+lastTime+argv.milliseconds<+currentTime) {
            lastTime=new Date();
            console.log(self.lines[0]);
            self.lines.shift();
            if(options.queue==false)
                self.lines=[];
            return true;
        }
        return false;
    }
    setInterval(processLine,options.milliseconds);
}

throttler = new Throttler(argv);

process.stdin.on('data', function(chunk) {
    var lines=chunk.split("\n");
    lines[0] = lingeringLine + lines[0];
    lingeringLine = lines.pop();
    lines.forEach(function(line){
        throttler.pushLine(line);
    });
});

process.stdin.on('end', function() {
    if(lingeringLine.length>0)
        throttler.pushLine(lingeringLine);
    throttler.finish();
});
