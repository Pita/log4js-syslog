var messages = 100000;
var charsPerMessage = 500;

var log4js = require('log4js');
var lsyslog = require('./index');

//install the syslog logger
log4js.restoreConsole();
log4js.clearAppenders();
log4js.addAppender(lsyslog.appender(), 'syslog');

//create two messages with numbers only
//we need at least two different messages. If we sent the same message all the time, syslog marks them as repeated messages
var message1 = "";
var message2 = "";
for(var i=0;i<charsPerMessage;i++)
{
  message1+="1";
  message2+="2";
}

var logger = log4js.getLogger('syslog');
var start = new Date().getTime();
var counter = 0;

function log()
{
  //end reached
  if(counter >= messages)
  {
    var seconds = (new Date().getTime()-start)/1000;
    var msgPerSec = Math.round(counter/seconds);
    var megabytePerSec = Math.round(msgPerSec*charsPerMessage / 1024);
    
    console.error("Finished " + messages + " messages with " + charsPerMessage + " characters in " + seconds + "s");
    console.error(msgPerSec + " messages/s");
    console.error(megabytePerSec + " KB/s");
  }
  else
  {
    //increment the counter
    counter++;
    
    //log next message in nextTick
    process.nextTick(function(){
      logger.info(counter % 2 == 0 ? message1 : message2);
      log();
    });
  }
}

log();
