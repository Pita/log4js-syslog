var log4js = require('log4js');
var syslog = require("ain2");

//set the name
exports.name = "syslog";

//maps the log4js loglevels to syslog loglevels
var levels = {}
levels[log4js.levels.DEBUG] = 'debug';
levels[log4js.levels.INFO]  = 'info';
levels[log4js.levels.WARN]  = 'warn';
levels[log4js.levels.ERROR] = 'err';
levels[log4js.levels.FATAL] = 'crit';
levels[log4js.levels.TRACE] = 'notice';

//function that does the actual loglevel mapping from log4js to syslog
function getSyslogLevel(level) 
{
	return level && levels[level] ? levels[level] : 'info';
}

//appender
exports.appender = function(config)
{
  config = config || {};
  
  //default transport should be file
  config.transport = config.transport || "file";
  
  //create a new logger and apply the config
  var logger = syslog.get();
  logger.set(config);
  
  //return the logging function
  return function(loggingEvent)
  {
    var data = loggingEvent.data;
    var level = getSyslogLevel(loggingEvent.level);
    
    logger.send(data, level);
  }
}
