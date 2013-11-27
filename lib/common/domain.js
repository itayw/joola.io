/**
 *  joola.io
 *
 *  Copyright Joola Smart Solutions, Ltd. <info@joo.la>
 *
 *  Licensed under GNU General Public License 3.0 or later.
 *  Some rights reserved. See LICENSE, AUTHORS.
 *
 *  @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 */

var
  domain = require('domain');

if (process.env.NODE_ENV == 'test')
  return;

joola.domain = process.domain = domain.create();
joola.domain.on('error', function (domain, err) {
  console.log('ERROR! ' + domain, err);
  console.log(err.stack);

  joola.logger.error('FATAL EXCEPTION! ' + err.message);
  joola.logger.debug(err.stack);
  shutdown(1);
});
process.on('uncaughtException', function (exception) {
  console.log('FATAL EXCEPTION: ' + exception.message);
  console.log(exception.stack);

  joola.logger.error('FATAL EXCEPTION: ' + exception.message + '\n' + exception.stack, null, function () {
    global.shutdown(1);
  });
});
process.on('exit', function () {
  global.shutdown(0);
});
process.on('SIGINT', function () {
  global.shutdown(0);
});