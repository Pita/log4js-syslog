var log4js = require('log4js');
var syslog = require('node-syslog');
var events = require('events');

//maps the log4js loglevels to syslog loglevels
var levels = {}
levels[log4js.levels.DEBUG] = syslog.LOG_DEBUG;
levels[log4js.levels.INFO]  = syslog.LOG_INFO;
levels[log4js.levels.WARN]  = syslog.LOG_WARNING;
levels[log4js.levels.ERROR] = syslog.LOG_ERROR;
levels[log4js.levels.FATAL] = syslog.LOG_CRIT;
levels[log4js.levels.TRACE] = syslog.LOG_NOTICE;

//create eventEmitter and export it
var eventEmitter = new events.EventEmitter();
exports.on = function(){
  eventEmitter.on.apply(eventEmitter, arguments);
}

//set the name
exports.name = "syslog";

//function that does the actual loglevel mapping from log4js to syslog
function getSyslogLevel(level) 
{
	return level && levels[level] ? levels[level] : 'info';
}

function getOptions(flags) {
	var opts = 0;
	if(Array.isArray(flags)) {
		for(var i = 0, len = flags.length; i < len; i++) {
			opts = opts | flags[i];
		}
	}
	return opts;
}

//appender
exports.appender = function(config)
{
  config = config || {};
  
  var name = (config.ident || config.name || 'node-syslog') + ''
		, optsVal = config.flags ? getOptions(config.flags) : (syslog.LOG_PID | syslog.LOG_CONS | syslog.LOG_ODELAY)
		, facility = config.facility || syslog.LOG_USER;

	// no need to check if it's already open, the lib does that
	syslog.init(name, optsVal, facility);
  
  //return the logging function
  return function(loggingEvent)
  {
    var data = loggingEvent.data;
    var level = getSyslogLevel(loggingEvent.level);
    
    syslog.log(level, data);
    eventEmitter.emit("sended");
  }
}
