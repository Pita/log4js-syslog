var seconds = 20;
var charsPerMessage = 500;

var log4js = require('log4js');
var lsyslog = require('./index');

//install the syslog logger
log4js.restoreConsole();
log4js.clearAppenders();
log4js.addAppender(lsyslog.appender(), 'syslog');

//create the message
var message = "";
for(var i=0;i<charsPerMessage;i++)
{
  message+="0";
}

var logger = log4js.getLogger('syslog');
var start = new Date().getTime();
var end = start + (seconds * 1000);
var counter = 0;

function log()
{
  //end reached
  if(new Date().getTime()>=end)
  {
    var msgPerSec = Math.round(counter/seconds);
    var megabytePerSec = Math.round(msgPerSec*charsPerMessage / 1024);
    
    console.error("Finished");
    console.error(msgPerSec + " messages/s");
    console.error(megabytePerSec + " KB/s");
  }
  else
  {
    //set up the counter
    counter++;
    
    //log next message
    logger.info(message);
  }
}

//dirty hack to ensure we don't benchmark the console
console.log = function(){};

//fire the next log on callback. We have to do this in nextTick to ensure we don't get a stack error
lsyslog.on("sended", function(){
  process.nextTick(function(){
    log();
  });
});

log();
