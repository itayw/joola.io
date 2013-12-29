/**
 *  @title joola.io
 *  @overview the open-source data analytics framework
 *  @copyright Joola Smart Solutions, Ltd. <info@joo.la>
 *  @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 *
 *  Licensed under GNU General Public License 3.0 or later.
 *  Some rights reserved. See LICENSE, AUTHORS.
 **/



var
  router = require('../webserver/routes/index');


//joola.dispatch.system.listnodes(function(err,nodes){console.log(err,nodes)})

exports.listnodes = {
  name: "/api/system/listnodes",
  description: "I list all registered nodes",
  inputs: [],
  _outputExample: {},
  _permission: ['manage_system'],
  dispatch: function () {
    var self = this;
    joola.dispatch.on('system:listnodes-request', function () {
      joola.logger.debug('Listing nodes.');
      self.run(function (err, value) {
        joola.dispatch.emit('system:listnodes-done', {err: err, message: value});
      });
    });
  },
  route: function (req, res) {
    var response = {};
    joola.dispatch.emitWait('system:listnodes-request', {}, function (err, log) {
      if (err)
        return router.responseError(new router.ErrorTemplate('Failed to list nodes: ' + (typeof(err) === 'object' ? err.message : err)), req, res);
      response = log;
      return router.responseSuccess(response, req, res);
    });
  },
  run: function (callback) {
    callback = callback || emptyfunc;

    var nodes = [];

    joola.redis.keys('nodes:*', function (err, nodeKeys) {
      if (err)
        return callback(err);

      var expected = nodeKeys.length;
      var counter = 0;
      nodeKeys.forEach(function (node) {
        joola.redis.hgetall(node, function (err, node) {
          nodes.push(node);
          counter++;
          if (counter == expected)
            return callback(err, nodes);
        })
      });
    });
  }
};