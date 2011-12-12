var log4js = require('log4js');
var lsyslog = require('./index');

//install the syslog logger
log4js.addAppender(lsyslog.appender(), 'syslog');

var logger = log4js.getLogger('syslog');

logger.info('info log', 'info log 2');
logger.debug('debug log', 'debug log 2');
logger.error('error log', 'error log 2');
