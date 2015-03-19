
var p    = require('path');
var fs   = require('fs');
var util = require('util');
var chalk = require('chalk');
var debug = require('debug')('pm2:constants');

/**
 * Handle PM2 root folder relocation
 */
var PM2_ROOT_PATH = '';

if (process.env.PM2_HOME)
  PM2_ROOT_PATH = process.env.PM2_HOME;
else if (process.env.HOME || process.env.HOMEPATH)
  PM2_ROOT_PATH = p.resolve(process.env.HOME || process.env.HOMEPATH, '.pm2');
else
  PM2_ROOT_PATH = p.resolve('/etc', '.pm2');

debug("PM2_ROOT_PATH: " + PM2_ROOT_PATH);

/**
 * Constants variables used by PM2
 */
var csts = {
  PM2_CONF_FILE          : p.join(PM2_ROOT_PATH, 'conf.js'),
  PM2_MODULE_CONF_FILE   : p.join(PM2_ROOT_PATH, 'module_conf.json'),

  CODE_UNCAUGHTEXCEPTION : 100,
  CONCURRENT_ACTIONS     : 1,
  PREFIX_MSG             : chalk.green('[PM2] '),
  PREFIX_MSG_ERR         : chalk.red('[PM2][ERROR] '),
  PREFIX_MSG_MOD         : chalk.green('[PM2][Module] '),
  PREFIX_MSG_MOD_ERR     : chalk.red('[PM2][Module][ERROR] '),
  PREFIX_MSG_WARNING     : chalk.yellow('[PM2][WARN] '),
  PREFIX_MSG_SUCCESS     : chalk.cyan('[PM2] '),

  SAMPLE_FILE_PATH       : '../lib/samples/sample.json5',
  SAMPLE_CONF_FILE       : '../lib/samples/sample-conf.js',

  CENTOS_STARTUP_SCRIPT  : '../lib/scripts/pm2-init-centos.sh',
  UBUNTU_STARTUP_SCRIPT  : '../lib/scripts/pm2-init.sh',
  SYSTEMD_STARTUP_SCRIPT : '../lib/scripts/pm2.service',
  AMAZON_STARTUP_SCRIPT  : '../lib/scripts/pm2-init-amazon.sh',
  GENTOO_STARTUP_SCRIPT  : '../lib/scripts/pm2',
  DARWIN_STARTUP_SCRIPT  : '../lib/scripts/io.keymetrics.PM2.plist',

  SUCCESS_EXIT           : 0,
  ERROR_EXIT             : 1,

  ONLINE_STATUS          : 'online',
  STOPPED_STATUS         : 'stopped',
  STOPPING_STATUS        : 'stopping',
  LAUNCHING_STATUS       : 'launching',
  ERRORED_STATUS         : 'errored',
  ONE_LAUNCH_STATUS      : 'one-launch-status',

  CLUSTER_MODE_ID        : 'cluster_mode',
  FORK_MODE_ID           : 'fork_mode',

  // KEYMETRICS_ROOT_URL    : 'root.keymetrics.io',

  // DEFAULT_MODULE_JSON    : 'package.json',

  // REMOTE_PORT_TCP        : 80,
  // REMOTE_PORT            : 41624,
  // REMOTE_REVERSE_PORT    : 43554,
  // REMOTE_HOST            : 's1.keymetrics.io',
  // SEND_INTERVAL          : 1000

  KEYMETRICS_ROOT_URL : 'root.pm25.io',

  DEFAULT_MODULE_JSON : 'package.json',

  REMOTE_PORT_TCP : 80,
  REMOTE_PORT : 41624,
  REMOTE_REVERSE_PORT : 43554,
  REMOTE_HOST : 's1.pm25.io',
  SEND_INTERVAL : 1000
};

/**
 * Defaults variables
 */
var default_conf = util._extend({
  PM2_ROOT_PATH: PM2_ROOT_PATH,
  WORKER_INTERVAL: process.env.PM2_WORKER_INTERVAL || 30000
}, require('./lib/samples/sample-conf.js')(PM2_ROOT_PATH));

/**
 * Extend with optional configuration file
 */
if (fs.existsSync(csts.PM2_CONF_FILE)) {
  try {
    var extra = require(csts.PM2_CONF_FILE)(PM2_ROOT_PATH);
    default_conf = util._extend(default_conf, extra);
  } catch(e) {
    debug(e.stack || e);
  }
}

var conf = util._extend(default_conf, csts);

/**
 * Windows specific
 */

if (process.platform === 'win32' ||
    process.platform === 'win64') {
  debug('Windows detected');
  conf.DAEMON_RPC_PORT = '\\\\.\\pipe\\rpc.sock';
  conf.DAEMON_PUB_PORT = '\\\\.\\pipe\\pub.sock';
  conf.INTERACTOR_RPC_PORT = '\\\\.\\pipe\\interactor.sock';
}

/**
 * Final Export
 */
module.exports = conf;
